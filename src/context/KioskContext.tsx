import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  ABHAPatient, 
  AccessibilitySettings, 
  AppView, 
  AyurvedaData,
  BackendConsultation,
  BackendPatient,
  ConsentPayload,
  Department, 
  EmergencyRequest, 
  HistoricalDocument, 
  KioskScreen, 
  Language, 
  MedicalHistoryData, 
  PatientRegistration, 
  ScannedDocument, 
  TimeFilter, 
  TriageLevel, 
  VitalsData,
  AssessmentTrack
} from '../types';
import { apiService, submitAyurvedaIfApplicable } from '../services/apiService';
import { translations } from '../services/translations';
import { voiceEngine } from '../services/voiceEngine';
import { realtimeChannel } from '../services/realtimeChannel';
import { 
  INITIAL_DEPARTMENTS, 
  INITIAL_EMERGENCY_REQUESTS, 
  INITIAL_QUEUE, 
  MOCK_HISTORICAL_RECORDS, 
  PRESET_PATIENTS 
} from '../services/mockData';

interface KioskContextType {
  // Screen & UI
  currentScreen: KioskScreen;
  setScreen: (screen: KioskScreen) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isOffline: boolean;
  toggleOffline: () => void;
  isOfflineDemoData: boolean;
  retryBackendConnection: () => Promise<boolean>;
  appView: AppView;
  setAppView: (view: AppView) => void;

  // Session & Inactivity
  inactivityWarning: boolean;
  inactivitySecondsLeft: number;
  extendSession: () => void;
  resetKioskSession: (withToast?: boolean) => void;
  sessionResetToast: string | null;
  clearSessionResetToast: () => void;
  repeatCurrentAudio: () => void;

  // Patient Wizard Data
  activePatient: ABHAPatient | null;
  setActivePatient: (patient: ABHAPatient | null) => void;
  isConsentGiven: boolean;
  setConsentGiven: (given: boolean) => void;
  consentPayload: ConsentPayload | null;
  updateConsentPayload: (p: ConsentPayload) => void;
  ayurvedaData: AyurvedaData | null;
  updateAyurvedaData: (a: Partial<AyurvedaData>) => void;
  assessmentTrack: AssessmentTrack;
  setAssessmentTrack: (track: AssessmentTrack) => void;

  // Patient Portal & Consultation Records (Live Backend)
  portalPatient: BackendPatient | null;
  setPortalPatient: (patient: BackendPatient | null) => void;
  portalConsultations: BackendConsultation[];
  setPortalConsultations: (consultations: BackendConsultation[]) => void;
  isLiveBackendSync: boolean;
  setIsLiveBackendSync: (val: boolean) => void;
  startVisitFromPortal: () => void;

  // Past Records Selection (New Feature)
  historicalRecords: HistoricalDocument[];
  selectedPastRecords: HistoricalDocument[];
  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
  togglePastRecord: (id: string) => void;
  selectAllPastRecords: () => void;
  clearPastRecordsSelection: () => void;
  shareAllForFilter: (filter: TimeFilter) => void;

  // Symptoms & Vitals
  symptomsText: string;
  symptomsVoiceTranscript: string;
  symptomsDuration: string;
  updateSymptoms: (text: string, duration?: string, transcript?: string) => void;
  vitals: VitalsData;
  updateVitals: (v: Partial<VitalsData>) => void;

  // History & Documents
  history: MedicalHistoryData;
  updateHistory: (h: Partial<MedicalHistoryData>) => void;
  documents: ScannedDocument[];
  addDocument: (doc: ScannedDocument) => void;
  removeDocument: (id: string) => void;
  checkDuplicateDocument: (doc: ScannedDocument) => HistoricalDocument | null;
  currentTriageLevel: TriageLevel;
  generatedToken: PatientRegistration | null;

  // Emergency Flow
  activeEmergencyRequest: EmergencyRequest | null;
  triggerEmergencyRequest: () => void;
  staffAcceptCasualty: (requestId: string, room?: string) => void;
  staffRedirectPriority: (requestId: string, room?: string) => void;

  // Staff / Hospital Management
  queue: PatientRegistration[];
  emergencyRequests: EmergencyRequest[];
  departments: Department[];
  staffCallNext: (registrationId: string) => void;
  staffCompletePatient: (registrationId: string) => void;
  staffUpdateNotes: (registrationId: string, notes: string) => void;

  // Actions
  verifyAbha: (abhaNumber: string) => Promise<ABHAPatient | null>;
  loadPresetPatient: (index: number) => void;
  generateTokenAndRegister: () => PatientRegistration;
}

const KioskContext = createContext<KioskContextType | null>(null);

const STORAGE_QUEUE_KEY = "smart_health_kiosk_queue_data";
const STORAGE_EMG_KEY = "smart_health_kiosk_emg_data";

export const KioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & View
  const [currentScreen, setCurrentScreen] = useState<KioskScreen>('HOME');
  const [language, setLanguageState] = useState<Language>('en');
  const [appView, setAppView] = useState<AppView>('KIOSK');
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Accessibility & Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kiosk_dark_mode');
        if (saved !== null) return saved === 'true';
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch (e) {}
    }
    return false;
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    largeText: false,
    highContrast: false,
    voiceGuidance: false,
    simplifiedMode: false,
    darkMode: false,
  });

  // Sync dark class on documentElement
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    try {
      localStorage.setItem('kiosk_dark_mode', String(darkMode));
    } catch (e) {}
  }, [darkMode]);

  // Active Patient Demographics
  const [activePatient, setActivePatient] = useState<ABHAPatient | null>(null);
  const [isConsentGiven, setConsentGiven] = useState<boolean>(false);
  const [consentPayload, setConsentPayload] = useState<ConsentPayload | null>(null);
  const [ayurvedaData, setAyurvedaData] = useState<AyurvedaData | null>(null);

  // Offline fallback state (True by default if tunnel is down, automatically tracked)
  const [isOfflineDemoData, setIsOfflineDemoData] = useState<boolean>(true);

  // Subscribe to apiService fallback events and initial backend health check
  useEffect(() => {
    const unsubscribe = apiService.registerFallbackListener((offline) => {
      setIsOfflineDemoData(offline);
    });
    // Check backend health on mount
    apiService.checkBackendHealth().then((isOnline) => {
      setIsOfflineDemoData(!isOnline);
    });
    return () => unsubscribe();
  }, []);

  const retryBackendConnection = useCallback(async () => {
    const isOnline = await apiService.checkBackendHealth();
    setIsOfflineDemoData(!isOnline);
    return isOnline;
  }, []);

  const updateConsentPayload = useCallback((p: ConsentPayload) => {
    setConsentPayload(p);
  }, []);

  const updateAyurvedaData = useCallback((a: Partial<AyurvedaData>) => {
    setAyurvedaData(prev => prev ? { ...prev, ...a } : {
      prakriti: 'Pitta-Vata',
      agni: 'VISHAMA',
      koshtha: 'MADHYAMA',
      ahara_shakti: 'MADHYAMA',
      vyayama_shakti: 'MADHYAMA',
      sattva: 'MADHYAMA',
      satmya: 'MADHYAMA',
      ahara_habits: 'Vegetarian, Moderately Regular',
      vihara_lifestyle: 'Disturbed Sleep (5-6h)',
      nidana_factors: ['Chinta / Stress'],
      vaya_age: 52,
      height_cm: 162,
      weight_kg: 62,
      ...a
    });
  }, []);

  // Assessment track: 'ayurveda' vs 'general' (SIH26047)
  const [assessmentTrack, setAssessmentTrack] = useState<AssessmentTrack>('general');

  // Patient Portal State (Live backend authentication & records)
  const [portalPatient, setPortalPatient] = useState<BackendPatient | null>(null);
  const [portalConsultations, setPortalConsultations] = useState<BackendConsultation[]>([]);
  const [isLiveBackendSync, setIsLiveBackendSync] = useState<boolean>(false);

  // Past ABHA Medical Records state
  const [historicalRecords] = useState<HistoricalDocument[]>(MOCK_HISTORICAL_RECORDS);
  const [selectedPastRecords, setSelectedPastRecords] = useState<HistoricalDocument[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('6M');

  // Symptoms
  const [symptomsText, setSymptomsText] = useState<string>('');
  const [symptomsVoiceTranscript, setSymptomsVoiceTranscript] = useState<string>('');
  const [symptomsDuration, setSymptomsDuration] = useState<string>('1 - 3 days');

  // Vitals: Height & Weight only
  const [vitals, setVitals] = useState<VitalsData>({
    heightCm: 170,
    weightKg: 68,
    bmi: 23.5,
  });

  // Medical History & Allergies
  const [history, setHistory] = useState<MedicalHistoryData>({
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    hasNoKnownAllergies: true,
  });

  // Documents
  const [documents, setDocuments] = useState<ScannedDocument[]>([]);
  const [currentTriageLevel, setCurrentTriageLevel] = useState<TriageLevel>('ROUTINE');
  const [generatedToken, setGeneratedToken] = useState<PatientRegistration | null>(null);

  // Emergency & Hospital Queue State
  const [activeEmergencyRequest, setActiveEmergencyRequest] = useState<EmergencyRequest | null>(null);

  // Queue and Emergencies
  const [queue, setQueue] = useState<PatientRegistration[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_QUEUE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_QUEUE;
  });

  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_EMG_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_EMERGENCY_REQUESTS;
  });

  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);

  // Inactivity timeout state: 2 mins 30 secs (150 seconds) + 30 seconds countdown modal
  const [inactivityWarning, setInactivityWarning] = useState<boolean>(false);
  const [inactivitySecondsLeft, setInactivitySecondsLeft] = useState<number>(30);
  const [sessionResetToast, setSessionResetToast] = useState<string | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Helper translation function
  const t = useCallback((key: keyof typeof translations.en): string => {
    const langDict = translations[language] || translations.en;
    return (langDict as any)[key] || translations.en[key] || String(key);
  }, [language]);

  // Set language with feedback
  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    voiceEngine.playChime('tap');
    if (accessibility.voiceGuidance) {
      const msg = newLang === 'hi' 
        ? "भाषा हिन्दी चुनी गई है।" 
        : "Language switched to English.";
      voiceEngine.speak(msg, newLang);
    }
  }, [accessibility.voiceGuidance]);

  const updateAccessibility = useCallback((settings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...settings }));
    if (settings.darkMode !== undefined) {
      setDarkMode(settings.darkMode);
    }
    voiceEngine.playChime('tap');
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
    voiceEngine.playChime('tap');
  }, []);

  const toggleOffline = useCallback(() => {
    setIsOffline(prev => !prev);
    voiceEngine.playChime('alert');
  }, []);

  // Update symptoms
  const updateSymptoms = useCallback((text: string, duration?: string, transcript?: string) => {
    setSymptomsText(text);
    if (duration) setSymptomsDuration(duration);
    if (transcript) setSymptomsVoiceTranscript(transcript);
  }, []);

  // Update vitals: Height & Weight only with automatic BMI
  const updateVitals = useCallback((newV: Partial<VitalsData>) => {
    setVitals(prev => {
      const updated = { ...prev, ...newV };
      if (updated.heightCm && updated.weightKg && updated.heightCm > 0) {
        const hMeters = updated.heightCm / 100;
        updated.bmi = Number((updated.weightKg / (hMeters * hMeters)).toFixed(1));
      }
      return updated;
    });
  }, []);

  // Update history
  const updateHistory = useCallback((newH: Partial<MedicalHistoryData>) => {
    setHistory(prev => ({ ...prev, ...newH }));
  }, []);

  // Past Records management
  const togglePastRecord = useCallback((id: string) => {
    setSelectedPastRecords(prev => {
      const exists = prev.some(r => r.id === id);
      if (exists) {
        return prev.filter(r => r.id !== id);
      } else {
        const record = historicalRecords.find(r => r.id === id);
        return record ? [...prev, record] : prev;
      }
    });
    voiceEngine.playChime('tap');
  }, [historicalRecords]);

  const selectAllPastRecords = useCallback(() => {
    setSelectedPastRecords([...historicalRecords]);
    voiceEngine.playChime('tap');
  }, [historicalRecords]);

  const clearPastRecordsSelection = useCallback(() => {
    setSelectedPastRecords([]);
    voiceEngine.playChime('tap');
  }, []);

  const shareAllForFilter = useCallback((_filter: TimeFilter) => {
    // In prototype, select all available records
    setSelectedPastRecords([...historicalRecords]);
    voiceEngine.playChime('success');
  }, [historicalRecords]);

  // Documents
  const addDocument = useCallback((doc: ScannedDocument) => {
    setDocuments(prev => [...prev, doc]);
    voiceEngine.playChime('success');
  }, []);

  const removeDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  // Duplicate Document Detection Helper
  const checkDuplicateDocument = useCallback((doc: ScannedDocument): HistoricalDocument | null => {
    // Check against historical records for matching keywords or dates
    const docSummaryLower = (doc.summary || doc.type || '').toLowerCase();
    const docDateLower = (doc.date || '').toLowerCase();

    for (const hist of historicalRecords) {
      const histTitleLower = hist.title.toLowerCase();
      const histDateLower = hist.dateFormatted.toLowerCase();
      
      // Match by date and similar category
      if (docDateLower.includes('12 june') && (histDateLower.includes('12 june') || histTitleLower.includes('blood') || histTitleLower.includes('cbc'))) {
        return hist;
      }
      // Or matching title keywords
      if (docSummaryLower.includes('cbc') && histTitleLower.includes('cbc')) {
        return hist;
      }
    }
    return null;
  }, [historicalRecords]);

  // Preliminary Triage Calculation
  useEffect(() => {
    const textLower = (symptomsText + " " + symptomsVoiceTranscript).toLowerCase();
    
    // Emergency indicators
    const isSevereChestPain = textLower.includes('chest') || textLower.includes('छाती') || textLower.includes('heart');
    const isSevereBreathing = textLower.includes('breath') || textLower.includes('सांस');
    if (isSevereChestPain || isSevereBreathing) {
      setCurrentTriageLevel('EMERGENCY');
      return;
    }

    // Urgent indicators
    const isUrgentSymptom = textLower.includes('severe') || textLower.includes('चोट') || textLower.includes('तेज') || textLower.includes('vomit') || textLower.includes('fever') || textLower.includes('बुखार');
    if (isUrgentSymptom) {
      setCurrentTriageLevel('URGENT');
      return;
    }

    // Moderate indicators
    if (textLower.includes('pain') || textLower.includes('दर्द')) {
      setCurrentTriageLevel('MODERATE');
      return;
    }

    setCurrentTriageLevel('ROUTINE');
  }, [symptomsText, symptomsVoiceTranscript]);

  // Persist queue and emergencies
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {}
  }, [queue]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EMG_KEY, JSON.stringify(emergencyRequests));
    } catch (e) {}
  }, [emergencyRequests]);

  // Real-time broadcast channel listeners
  useEffect(() => {
    const unsubEmergencyNew = realtimeChannel.subscribe('EMERGENCY_REQUEST_NEW', (emg: EmergencyRequest) => {
      setEmergencyRequests(prev => [emg, ...prev.filter(r => r.id !== emg.id)]);
      voiceEngine.playChime('emergency');
    });

    const unsubEmergencyUpdate = realtimeChannel.subscribe('EMERGENCY_REQUEST_UPDATE', (updatedEmg: EmergencyRequest) => {
      setEmergencyRequests(prev => prev.map(r => r.id === updatedEmg.id ? updatedEmg : r));
      setActiveEmergencyRequest(prev => (prev && prev.id === updatedEmg.id ? updatedEmg : prev));
      voiceEngine.playChime('alert');
    });

    const unsubQueueNew = realtimeChannel.subscribe('QUEUE_PATIENT_NEW', (patientReg: PatientRegistration) => {
      setQueue(prev => [...prev.filter(p => p.id !== patientReg.id), patientReg]);
    });

    const unsubQueueUpdate = realtimeChannel.subscribe('QUEUE_PATIENT_UPDATE', (patientReg: PatientRegistration) => {
      setQueue(prev => prev.map(p => p.id === patientReg.id ? patientReg : p));
    });

    return () => {
      unsubEmergencyNew();
      unsubEmergencyUpdate();
      unsubQueueNew();
      unsubQueueUpdate();
    };
  }, []);

  // Listen / Repeat Audio for the current screen
  const repeatCurrentAudio = useCallback(() => {
    voiceEngine.playChime('tap');
    let speechMsg = "";

    switch (currentScreen) {
      case 'HOME':
        speechMsg = language === 'hi' 
          ? "नमस्ते। स्मार्ट स्वास्थ्य कियोस्क में आपका स्वागत है। नया पंजीकरण शुरू करने के लिए पहला बटन दबाएं, या आपातकालीन सहायता के लिए लाल बटन दबाएं।"
          : "Namaste. Welcome to Smart Health Kiosk. Tap Start New Registration to begin, or tap Emergency Assistance for immediate help.";
        break;
      case 'EMERGENCY':
        if (activeEmergencyRequest?.status === 'ACCEPTED_CASUALTY') {
          speechMsg = language === 'hi'
            ? "आपातकालीन अनुरोध स्वीकृत। कृपया कैजुअल्टी कक्ष 02 में जाएं।"
            : "Emergency request accepted. Please proceed to Casualty Room 02.";
        } else if (activeEmergencyRequest?.status === 'REDIRECTED_PRIORITY') {
          speechMsg = language === 'hi'
            ? "चिकित्सा दल ने समीक्षा की है। कृपया प्राथमिकता ओपीडी कक्ष 105 में जाएं।"
            : "Medical staff has reviewed your request. Please proceed to Priority OPD Room 105.";
        } else {
          speechMsg = language === 'hi'
            ? "आपातकालीन सहायता अनुरोध दर्ज हो चुका है। चिकित्सा दल को सूचित कर दिया गया है। कृपया इसी कियोस्क के पास बैठें।"
            : "Emergency assistance requested. Medical staff has been notified. Please remain at the kiosk.";
        }
        break;
      case 'ABHA':
        speechMsg = language === 'hi'
          ? "अपना 14 अंकों का आभा नंबर दर्ज करें और सत्यापित करें।"
          : "Please enter your 14-digit ABHA health number and verify.";
        break;
      case 'ASSESSMENT_TYPE':
        speechMsg = language === 'hi'
          ? "कृपया चुनें कि आप किस प्रकार चेक-इन करना चाहेंगे। आयुर्वेदिक मूल्यांकन या सामान्य त्वरित चेक-इन।"
          : "Please choose how you would like to check in today. Ayurvedic assessment or general check-in.";
        break;
      case 'PAST_RECORDS':
        speechMsg = language === 'hi'
          ? "डॉक्टर को दिखाने के लिए अपने पुराने स्वास्थ्य रिकॉर्ड और पर्चे चुनें, या अभी के लिए छोड़ें।"
          : "You can choose relevant reports from your previous health records to share with the doctor, or tap Skip.";
        break;
      case 'CONSENT':
        speechMsg = language === 'hi'
          ? "चुने गए पुराने स्वास्थ्य रिकॉर्ड साझा करने हेतु अपनी सहमति दें।"
          : "Please review permission to access the selected health records and tap Give Consent.";
        break;
      case 'PATIENT_LOGIN':
        speechMsg = language === 'hi'
          ? "अपने पिछले परामर्श और मेडिकल रिकॉर्ड देखने के लिए अपनी आभा आईडी और पासवर्ड से लॉगिन करें।"
          : "Sign in with your ABHA ID and password to access your past consultations and medical records.";
        break;
      case 'MY_RECORDS':
        speechMsg = language === 'hi'
          ? "आपके पिछले अस्पताल परामर्श और मेडिकल रिकॉर्ड। आज का परामर्श शुरू करने के लिए चेक-इन बटन दबाएं।"
          : "Your past hospital consultations and records. Tap Check-In to begin today's visit.";
        break;
      case 'SYMPTOMS':
        speechMsg = language === 'hi'
          ? "माइक का बटन दबाकर अपनी तकलीफ बोलकर बताएं, या सामान्य लक्षणों को चुनें।"
          : "Tap the microphone to speak your symptoms, or choose from common symptoms below.";
        break;
      case 'VITALS':
        speechMsg = language === 'hi'
          ? "कृपया अपनी ऊंचाई और वजन दर्ज करें।"
          : "Please record your height and weight measurements.";
        break;
      case 'AYURVEDA':
        speechMsg = language === 'hi'
          ? "कृपया अपनी प्रकृति, पाचन और जीवनशैली से जुड़े सरल आयुर्वेदिक प्रश्नों के उत्तर दें, या आगे बढ़ें।"
          : "Please answer the Ayurvedic Prashna Pariksha questions on constitution, digestion, and lifestyle.";
        break;
      case 'HISTORY':
        speechMsg = language === 'hi'
          ? "अपनी एलर्जी और पुरानी बीमारियों की जानकारी दें ताकि डॉक्टर सुरक्षित दवाइयां लिख सकें।"
          : "Please report any known drug allergies and existing medical conditions for safe treatment.";
        break;
      case 'DOCUMENTS':
        speechMsg = language === 'hi'
          ? "अपना पर्चा या रिपोर्ट कैमरे के सामने रखकर स्कैन करें।"
          : "Scan your physical prescription or lab report in front of the kiosk camera.";
        break;
      case 'REVIEW':
        speechMsg = language === 'hi'
          ? "अपने स्वास्थ्य विवरण की पुष्टि करें और अपना टोकन प्राप्त करें।"
          : "Review your intake summary and confirm to generate your token.";
        break;
      case 'TOKEN':
        if (generatedToken) {
          speechMsg = language === 'hi'
            ? `आपका टोकन नंबर ${generatedToken.tokenNumber} है। कृपया ${generatedToken.assignedRoom} में जाएं।`
            : `Your token number is ${generatedToken.tokenNumber}. Please proceed to ${generatedToken.assignedRoom}.`;
        }
        break;
      case 'QUEUE':
        speechMsg = language === 'hi'
          ? "लाइव ओपीडी कतार। अपनी बारी आने तक कृपया प्रतीक्षा करें।"
          : "Live department queue. Please wait until your token is called.";
        break;
      default:
        speechMsg = t('welcomeTitle');
    }

    voiceEngine.cancel();
    voiceEngine.speak(speechMsg, language);
  }, [currentScreen, language, activeEmergencyRequest, generatedToken, t]);

  // Set screen with feedback
  const setScreen = useCallback((screen: KioskScreen) => {
    voiceEngine.playChime('tap');
    setCurrentScreen(screen);
    lastActivityRef.current = Date.now();
  }, []);

  // Emergency Trigger (Instant, frictionless)
  const triggerEmergencyRequest = useCallback(() => {
    voiceEngine.playChime('emergency');
    
    const randomNum = Math.floor(100 + Math.random() * 900);
    const tokenNum = `E-${randomNum}`;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEmergency: EmergencyRequest = {
      id: `emg-${Date.now()}`,
      tokenNumber: tokenNum,
      kioskId: "Kiosk 03 (Ground Floor OPD)",
      timestamp: now.toISOString(),
      timeFormatted,
      status: 'AWAITING_ASSESSMENT',
      patientName: activePatient ? activePatient.name : "Unregistered Emergency Patient",
      reportedSymptoms: symptomsText || "Immediate Walk-up Emergency at Kiosk"
    };

    setActiveEmergencyRequest(newEmergency);
    setEmergencyRequests(prev => [newEmergency, ...prev]);
    setCurrentScreen('EMERGENCY');

    realtimeChannel.broadcast('EMERGENCY_REQUEST_NEW', newEmergency);

    const spokenMsg = language === 'hi'
      ? "आपातकालीन सहायता अनुरोध दर्ज हो गया है। चिकित्सा दल को सूचित कर दिया गया है। कृपया इसी कियोस्क के पास बैठें।"
      : "Emergency assistance requested. Medical staff has been notified. Please remain at the kiosk.";
    voiceEngine.speak(spokenMsg, language);
  }, [activePatient, symptomsText, language]);

  // Staff accepts emergency -> Casualty
  const staffAcceptCasualty = useCallback((requestId: string, room: string = "Casualty Room 02") => {
    setEmergencyRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updated: EmergencyRequest = {
          ...req,
          status: 'ACCEPTED_CASUALTY',
          assignedRoom: room,
          respondedBy: "Attending Emergency Team",
          responseTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        realtimeChannel.broadcast('EMERGENCY_REQUEST_UPDATE', updated);
        return updated;
      }
      return req;
    }));
  }, []);

  // Staff redirects emergency -> Priority OPD
  const staffRedirectPriority = useCallback((requestId: string, room: string = "Priority OPD Room 105") => {
    setEmergencyRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updated: EmergencyRequest = {
          ...req,
          status: 'REDIRECTED_PRIORITY',
          assignedRoom: room,
          respondedBy: "Triage Team",
          responseTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        realtimeChannel.broadcast('EMERGENCY_REQUEST_UPDATE', updated);
        return updated;
      }
      return req;
    }));
  }, []);

  // Staff Queue Actions
  const staffCallNext = useCallback((registrationId: string) => {
    setQueue(prev => prev.map(item => {
      if (item.id === registrationId) {
        const updated: PatientRegistration = { ...item, status: 'CALLED' };
        realtimeChannel.broadcast('QUEUE_PATIENT_UPDATE', updated);
        return updated;
      }
      return item;
    }));
    voiceEngine.playChime('alert');
  }, []);

  const staffCompletePatient = useCallback((registrationId: string) => {
    setQueue(prev => prev.map(item => {
      if (item.id === registrationId) {
        const updated: PatientRegistration = { ...item, status: 'COMPLETED' };
        realtimeChannel.broadcast('QUEUE_PATIENT_UPDATE', updated);
        return updated;
      }
      return item;
    }));
    voiceEngine.playChime('success');
  }, []);

  const staffUpdateNotes = useCallback((registrationId: string, notes: string) => {
    setQueue(prev => prev.map(item => {
      if (item.id === registrationId) {
        const updated: PatientRegistration = { ...item, staffNotes: notes };
        realtimeChannel.broadcast('QUEUE_PATIENT_UPDATE', updated);
        return updated;
      }
      return item;
    }));
  }, []);

  // ABHA Verification Mock
  const verifyAbha = useCallback(async (input: string): Promise<ABHAPatient | null> => {
    const cleanNum = input.replace(/\D/g, '');
    await new Promise(r => setTimeout(r, 500));

    const matched = PRESET_PATIENTS.find(p => p.abhaNumber.replace(/\D/g, '') === cleanNum);
    if (matched) {
      setActivePatient(matched);
      return matched;
    }

    if (cleanNum.length === 14) {
      const generated: ABHAPatient = {
        abhaNumber: `${cleanNum.slice(0, 2)}-${cleanNum.slice(2, 6)}-${cleanNum.slice(6, 10)}-${cleanNum.slice(10, 14)}`,
        abhaAddress: `patient.${cleanNum.slice(10)}@abdm`,
        name: "Ramesh Chand",
        nameHi: "रमेश चंद",
        age: 48,
        gender: "MALE",
        phone: "+91 98100 12345",
        district: "Central Delhi",
        state: "Delhi"
      };
      setActivePatient(generated);
      return generated;
    }

    return null;
  }, []);

  // Quick preset loader for presentation
  const loadPresetPatient = useCallback((index: number) => {
    const p = PRESET_PATIENTS[index % PRESET_PATIENTS.length];
    setActivePatient(p);
    voiceEngine.playChime('success');
  }, []);

  // Seamless Check-In directly from Patient Portal
  const startVisitFromPortal = useCallback(() => {
    if (portalPatient) {
      const p: ABHAPatient = {
        abhaNumber: portalPatient.abha_id.startsWith("14-") ? portalPatient.abha_id : "14-2394-8192-3041",
        abhaAddress: `${portalPatient.abha_id.toLowerCase().replace(/[^a-z0-9]/g, '.')}@abdm`,
        name: portalPatient.name || "Demo Patient P001",
        nameHi: "डेमो पेशेंट P001",
        age: portalPatient.age || 52,
        gender: (portalPatient.gender as any) || 'FEMALE',
        phone: portalPatient.phone || "+91 98765 43210",
        district: "South Delhi",
        state: "Delhi"
      };
      setActivePatient(p);
      setCurrentScreen('ASSESSMENT_TYPE');
    } else {
      setCurrentScreen('ABHA');
    }
  }, [portalPatient]);

  // Generate Token and Register (WITHOUT ESTIMATED WAIT TIME, TK-100x format matching backend)
  const generateTokenAndRegister = useCallback((): PatientRegistration => {
    // Format TK-1001, TK-1002, matching backend GET /api/doctor/consultations
    const tokenNumber = `TK-${1000 + queue.length + 1}`;

    let deptId = 'dep-medicine';
    let deptName = 'General Medicine';
    let room = 'Room 204';

    const lowerSymptom = (symptomsText + " " + symptomsVoiceTranscript).toLowerCase();

    if (currentTriageLevel === 'EMERGENCY') {
      deptId = 'dep-casualty';
      deptName = 'Casualty / Emergency';
      room = 'Room C-02';
    } else if (currentTriageLevel === 'URGENT') {
      deptId = 'dep-priority-opd';
      deptName = 'Priority OPD';
      room = 'Room 105';
    } else if (lowerSymptom.includes('ear') || lowerSymptom.includes('throat') || lowerSymptom.includes('nose') || lowerSymptom.includes('कान') || lowerSymptom.includes('गला')) {
      deptId = 'dep-ent';
      deptName = 'ENT & Head-Neck';
      room = 'Room 108';
    } else if (lowerSymptom.includes('bone') || lowerSymptom.includes('knee') || lowerSymptom.includes('fracture') || lowerSymptom.includes('हड्डी') || lowerSymptom.includes('जोड़ों')) {
      deptId = 'dep-ortho';
      deptName = 'Orthopedics';
      room = 'Room 302';
    }

    const patientRecord: PatientRegistration = {
      id: `reg-${Date.now()}`,
      tokenNumber,
      patient: activePatient || {
        abhaNumber: "14-2394-8192-3041",
        abhaAddress: "demo.patient.p001@abdm",
        name: "Demo Patient P001",
        nameHi: "डेमो पेशेंट P001",
        age: 52,
        gender: "FEMALE",
        phone: "+91 98765 43210",
        district: "South Delhi",
        state: "Delhi"
      },
      symptomsText: symptomsText || "Routine General Health Consultation",
      symptomsVoiceTranscript,
      symptomsDuration,
      vitals,
      history,
      documents,
      selectedPastRecords,
      triageLevel: currentTriageLevel,
      departmentId: deptId,
      departmentName: deptName,
      assignedRoom: room,
      queuePosition: queue.filter(q => q.status === 'WAITING' || q.status === 'CALLED').length + 1,
      timestamp: new Date().toISOString(),
      status: 'WAITING',
      assessmentTrack,
      ayurveda: assessmentTrack === 'ayurveda' ? ayurvedaData : null
    };

    setGeneratedToken(patientRecord);
    setQueue(prev => [...prev, patientRecord]);
    realtimeChannel.broadcast('QUEUE_PATIENT_NEW', patientRecord);

    // SIH26047: Submit Ayurveda to backend ONLY if track === 'ayurveda' and answers exist
    if (assessmentTrack === 'ayurveda' && ayurvedaData) {
      submitAyurvedaIfApplicable(patientRecord.id, assessmentTrack, {
        prakriti: ayurvedaData.prakriti,
        satmya: ayurvedaData.satmya,
        sattva: ayurvedaData.sattva,
        ahara_shakti: ayurvedaData.ahara_shakti,
        vyayama_shakti: ayurvedaData.vyayama_shakti,
        vaya: ayurvedaData.vaya_age,
        pramana_height_cm: ayurvedaData.height_cm,
        pramana_weight_kg: ayurvedaData.weight_kg,
        ahara: ayurvedaData.ahara_habits,
        vihara: ayurvedaData.vihara_lifestyle,
        agni: ayurvedaData.agni,
        koshtha: ayurvedaData.koshtha,
        nidana: ayurvedaData.nidana_factors?.join(', ')
      }).catch(err => console.warn("submitAyurvedaIfApplicable caught:", err));
    }

    voiceEngine.playChime('success');
    return patientRecord;
  }, [currentTriageLevel, symptomsText, symptomsVoiceTranscript, symptomsDuration, vitals, history, documents, selectedPastRecords, activePatient, queue, assessmentTrack, ayurvedaData]);

  // Privacy-first reset: wipes all sensitive data
  const resetKioskSession = useCallback((withToast: boolean = false) => {
    setActivePatient(null);
    setAssessmentTrack('general');
    setConsentGiven(false);
    setConsentPayload(null);
    setAyurvedaData(null);
    setSelectedPastRecords([]);
    setSymptomsText('');
    setSymptomsVoiceTranscript('');
    setSymptomsDuration('1 - 3 days');
    setVitals({
      heightCm: 162,
      weightKg: 62,
      bmi: 23.6,
    });
    setHistory({
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      hasNoKnownAllergies: true,
    });
    setDocuments([]);
    setCurrentTriageLevel('ROUTINE');
    setGeneratedToken(null);
    setActiveEmergencyRequest(null);
    setPortalPatient(null);
    setPortalConsultations([]);
    setIsLiveBackendSync(false);
    setInactivityWarning(false);
    setCurrentScreen('HOME');
    voiceEngine.cancel();
    voiceEngine.playChime('tap');

    if (withToast) {
      setSessionResetToast(language === 'hi' ? "आपकी गोपनीयता की सुरक्षा हेतु सत्र रीसेट कर दिया गया है।" : "Your session has been reset for your privacy.");
      setTimeout(() => {
        setSessionResetToast(null);
      }, 4000);
    }
  }, [language]);

  const clearSessionResetToast = useCallback(() => {
    setSessionResetToast(null);
  }, []);

  const extendSession = useCallback(() => {
    lastActivityRef.current = Date.now();
    setInactivityWarning(false);
    voiceEngine.playChime('tap');
  }, []);

  // Inactivity detection: 2 minutes 30 seconds (150,000 ms) idle -> 30-second countdown modal
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (inactivityWarning) {
        setInactivityWarning(false);
      }
    };

    window.addEventListener('touchstart', handleActivity, { passive: true });
    window.addEventListener('mousedown', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('pointerdown', handleActivity, { passive: true });

    const interval = setInterval(() => {
      // Don't timeout on HOME or EMERGENCY screens
      if (currentScreen === 'HOME' || currentScreen === 'EMERGENCY') {
        return;
      }

      const idleDuration = Date.now() - lastActivityRef.current;
      const IDLE_LIMIT = 150 * 1000; // 2 minutes 30 seconds
      const COUNTDOWN_LIMIT = 30; // 30 seconds countdown modal

      if (idleDuration >= IDLE_LIMIT) {
        const remaining = Math.max(0, COUNTDOWN_LIMIT - Math.floor((idleDuration - IDLE_LIMIT) / 1000));
        setInactivitySecondsLeft(remaining);
        setInactivityWarning(true);

        if (remaining <= 0) {
          resetKioskSession(true);
        }
      } else {
        setInactivityWarning(false);
      }
    }, 1000);

    return () => {
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('pointerdown', handleActivity);
      clearInterval(interval);
    };
  }, [currentScreen, inactivityWarning, resetKioskSession]);

  return (
    <KioskContext.Provider
      value={{
        currentScreen,
        setScreen,
        language,
        setLanguage,
        t,
        accessibility: {
          ...accessibility,
          darkMode,
        },
        updateAccessibility,
        darkMode,
        toggleDarkMode,
        isOffline,
        toggleOffline,
        isOfflineDemoData,
        retryBackendConnection,
        appView,
        setAppView,

        inactivityWarning,
        inactivitySecondsLeft,
        extendSession,
        resetKioskSession,
        sessionResetToast,
        clearSessionResetToast,
        repeatCurrentAudio,

        activePatient,
        setActivePatient,
        isConsentGiven,
        setConsentGiven,
        consentPayload,
        updateConsentPayload,
        ayurvedaData,
        updateAyurvedaData,
        assessmentTrack,
        setAssessmentTrack,

        portalPatient,
        setPortalPatient,
        portalConsultations,
        setPortalConsultations,
        isLiveBackendSync,
        setIsLiveBackendSync,
        startVisitFromPortal,

        historicalRecords,
        selectedPastRecords,
        timeFilter,
        setTimeFilter,
        togglePastRecord,
        selectAllPastRecords,
        clearPastRecordsSelection,
        shareAllForFilter,

        symptomsText,
        symptomsVoiceTranscript,
        symptomsDuration,
        updateSymptoms,
        vitals,
        updateVitals,
        history,
        updateHistory,
        documents,
        addDocument,
        removeDocument,
        checkDuplicateDocument,
        currentTriageLevel,
        generatedToken,

        activeEmergencyRequest,
        triggerEmergencyRequest,
        staffAcceptCasualty,
        staffRedirectPriority,

        queue,
        emergencyRequests,
        departments,
        staffCallNext,
        staffCompletePatient,
        staffUpdateNotes,

        verifyAbha,
        loadPresetPatient,
        generateTokenAndRegister,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const ctx = useContext(KioskContext);
  if (!ctx) {
    throw new Error("useKiosk must be used within a KioskProvider");
  }
  return ctx;
};
