export type Language = 'en' | 'hi';

export type TriageLevel = 'EMERGENCY' | 'URGENT' | 'MODERATE' | 'ROUTINE';

export type EmergencyStatus = 
  | 'AWAITING_ASSESSMENT' 
  | 'ACCEPTED_CASUALTY' 
  | 'REDIRECTED_PRIORITY' 
  | 'RESOLVED';

export type QueueStatus = 
  | 'WAITING' 
  | 'CALLED' 
  | 'IN_CONSULTATION' 
  | 'COMPLETED';

export interface ABHAPatient {
  abhaNumber: string; // 14 digits, e.g. "14-1234-5678-9012"
  abhaAddress: string; // e.g. "p001@abdm"
  name: string;
  nameHi?: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  district: string;
  state: string;
  photoUrl?: string;
}

export interface VitalsData {
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  // Note: Clinical vitals like BP, pulse, etc. are reserved for future medical device IoT integration
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  spo2?: number;
  temperatureF?: number;
  bloodGlucoseMgDl?: number;
}

export interface MedicalHistoryData {
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  hasNoKnownAllergies: boolean;
  notes?: string;
}

export interface ScannedDocument {
  id: string;
  type: 'Prescription' | 'Lab Report' | 'Medical Report' | 'Diagnostic Report' | 'Other';
  date: string;
  doctorName?: string;
  medicinesExtracted?: { name: string; dosage: string; frequency?: string }[];
  summary?: string;
  imageUrl?: string;
}

export type TimeFilter = '1M' | '3M' | '6M' | '1Y' | 'ALL';

export interface HistoricalDocument {
  id: string;
  title: string;
  titleHi?: string;
  category: 'Blood Test Reports' | 'Prescriptions' | 'Diagnostic Reports' | 'Lab Reports';
  categoryHi?: string;
  monthYear: string; // e.g., "June 2026", "July 2026"
  dateFormatted: string; // e.g., "12 June 2026"
  doctorOrLab: string;
  summary?: string;
  selected?: boolean;
}

export interface HistoricalFolder {
  monthYear: string;
  category: string;
  categoryHi?: string;
  documents: HistoricalDocument[];
}

export interface PatientRegistration {
  id: string;
  tokenNumber: string; // e.g., "TK-1001"
  patient: ABHAPatient;
  symptomsText: string;
  symptomsVoiceTranscript?: string;
  symptomsDuration?: string;
  vitals: VitalsData;
  history: MedicalHistoryData;
  documents: ScannedDocument[];
  selectedPastRecords?: HistoricalDocument[];
  triageLevel: TriageLevel;
  departmentId: string;
  departmentName: string;
  assignedRoom: string; // e.g., "Room 204"
  queuePosition: number;
  timestamp: string;
  status: QueueStatus;
  staffNotes?: string;
  assessmentTrack?: AssessmentTrack;
  ayurveda?: AyurvedaData | null;
}

export interface EmergencyRequest {
  id: string;
  tokenNumber: string; // e.g., "E-104"
  kioskId: string; // e.g., "Kiosk 03"
  timestamp: string;
  timeFormatted: string;
  status: EmergencyStatus;
  patientName?: string;
  reportedSymptoms?: string;
  assignedRoom?: string; // e.g., "Casualty Room C-02" or "Priority OPD Room 105"
  clinicalNote?: string;
  respondedBy?: string;
  responseTime?: string;
}

export interface Department {
  id: string;
  name: string;
  nameHi: string;
  code: string;
  totalCapacity: number;
  currentActive: number;
  rooms: {
    roomNumber: string;
    doctorName: string;
    status: 'ACTIVE' | 'BUSY' | 'ON_BREAK';
    currentQueueCount: number;
  }[];
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  voiceGuidance: boolean;
  simplifiedMode: boolean;
  darkMode?: boolean;
}

export type AssessmentTrack = "ayurveda" | "general";

export interface AyurvedaAnswers {
  prakriti?: Record<string, unknown> | string;
  satmya?: string;
  sattva?: string;
  ahara_shakti?: string;
  vyayama_shakti?: string;
  vaya?: number;
  pramana_height_cm?: number;
  pramana_weight_kg?: number;
  ahara?: string;
  vihara?: string;
  agni?: string;
  koshtha?: string;
  nidana?: string;
}

export type KioskScreen = 
  | 'HOME' 
  | 'EMERGENCY' 
  | 'ABHA' 
  | 'ASSESSMENT_TYPE'
  | 'PAST_RECORDS'
  | 'CONSENT' 
  | 'PATIENT_LOGIN'
  | 'MY_RECORDS'
  | 'SYMPTOMS' 
  | 'VITALS' 
  | 'AYURVEDA'
  | 'HISTORY' 
  | 'DOCUMENTS' 
  | 'REVIEW' 
  | 'TOKEN' 
  | 'QUEUE';

export type HistoryScope = 'SIX_MONTHS' | 'ONE_YEAR' | 'THREE_YEARS' | 'NONE' | 'PREFER_NOT_TO_SAY';

export interface ConsentPayload {
  share_history: boolean;
  history_scope: HistoryScope;
  share_old_documents: boolean;
}

export interface AyurvedaData {
  prakriti: string;
  agni: 'SAMA' | 'TIKSHNA' | 'MANDA' | 'VISHAMA' | string;
  koshtha: 'MRIDU' | 'MADHYAMA' | 'KRURA' | string;
  ahara_shakti: 'PRAVARA' | 'MADHYAMA' | 'AVARA' | string;
  vyayama_shakti: 'PRAVARA' | 'MADHYAMA' | 'AVARA' | string;
  sattva: 'PRAVARA' | 'MADHYAMA' | 'AVARA' | string;
  satmya: 'SARVA_RASA' | 'MADHYAMA' | 'EKA_RASA' | string;
  ahara_habits: string;
  vihara_lifestyle: string;
  nidana_factors: string[];
  vaya_age: number;
  height_cm: number;
  weight_kg: number;
}

export type AppView = 'KIOSK' | 'STAFF' | 'SPLIT';

export interface BackendPatient {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  abha_id: string;
  phone?: string;
  created_at?: string;
}

export interface BackendConsultation {
  id: string;
  patient_id: string;
  status: string;
  language: string;
  token_number?: string;
  priority: string;
  priority_override?: string;
  created_at: string;
  updated_at: string;
  chief_complaint?: string;
  department?: string;
  assigned_room?: string;
}

