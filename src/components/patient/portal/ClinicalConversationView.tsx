import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  AlertTriangle, 
  Paperclip, 
  Camera, 
  Check, 
  X, 
  RefreshCw,
  Phone,
  ShieldAlert,
  Loader2,
  HelpCircle,
  Clock,
  HeartPulse,
  Edit3,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Volume2
} from 'lucide-react';
import { Language, VoiceInterpretationResponse } from '../../../types';
import { voiceEngine } from '../../../services/voiceEngine';
import { voiceInterpretationService } from '../../../services/voiceInterpretationService';

interface ClinicalConversationViewProps {
  language: Language;
}

interface Message {
  id: string;
  sender: 'ASSISTANT' | 'PATIENT' | 'SYSTEM_ALERT';
  text: string;
  sourceTag?: 'AI_SPEECH' | 'PATIENT_TYPED' | 'CLINICAL_INTAKE';
  timestamp: string;
  attachmentUrl?: string;
  isUrgent?: boolean;
}

interface StructuredRosField {
  system: string;
  systemHi: string;
  symptom: string;
  symptomHi: string;
  status: 'Present' | 'Absent' | 'Unknown';
  duration?: string;
  source: string;
  rawTranscript?: string;
}

export const ClinicalConversationView: React.FC<ClinicalConversationViewProps> = ({ language }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'ASSISTANT',
      text: language === 'hi'
        ? 'नमस्ते! मैं आपका मेडीकियोस्क क्लिनिकल सहायक हूँ। आप अपनी समस्याओं, दवाओं या आगामी डॉक्टर परामर्श के बारे में बात कर सकते हैं। आप आज कैसा महसूस कर रहे हैं?'
        : "Hello! I'm your MediKiosk clinical assistant. You can share your symptoms, discuss medication instructions, or prepare for your consultation. What brings you here today?",
      sourceTag: 'CLINICAL_INTAKE',
      timestamp: '10:00 AM'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  
  // Conversation & Speech Pipeline States (Idle -> Listening -> Processing -> Transcript -> ROS Autofill -> Confirmation)
  const [speechState, setSpeechState] = useState<'IDLE' | 'LISTENING' | 'PROCESSING' | 'TRANSCRIPT' | 'CONFIRMATION'>('IDLE');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');

  const [speechConfirmation, setSpeechConfirmation] = useState<{
    rawSpeech: string;
    interpretedMeaning: string;
    confidence: number;
    optionId?: string;
  } | null>(null);

  const [emergencyAlertActive, setEmergencyAlertActive] = useState(false);
  const [showRosDrawer, setShowRosDrawer] = useState(true);

  // Live Structured ROS Extracted Information
  const [rosData, setRosData] = useState<StructuredRosField[]>([
    {
      system: 'Respiratory',
      systemHi: 'श्वसन तंत्र',
      symptom: 'Persistent Cough',
      symptomHi: 'लगातार खांसी',
      status: 'Present',
      duration: '3 days',
      source: 'AI detected from patient speech',
      rawTranscript: "I've had a dry cough for three days and feel tired."
    },
    {
      system: 'General',
      systemHi: 'सामान्य लक्षण',
      symptom: 'Fatigue / Low Energy',
      symptomHi: 'थकान / कमजोरी',
      status: 'Present',
      duration: '3 days',
      source: 'Clinical conversation intake',
      rawTranscript: 'Feeling weak since Thursday.'
    },
    {
      system: 'Cardiovascular',
      systemHi: 'हृदय व रक्त संचार',
      symptom: 'Chest Pain / Heaviness',
      symptomHi: 'सीने में दर्द या भारीपन',
      status: 'Absent',
      source: 'Verified by patient response'
    },
    {
      system: 'Gastrointestinal',
      systemHi: 'पाचन तंत्र',
      symptom: 'Abdominal Discomfort',
      symptomHi: 'पेट दर्द / अपच',
      status: 'Unknown',
      source: 'Not reported'
    }
  ]);

  const [editingRosIndex, setEditingRosIndex] = useState<number | null>(null);
  const [editRosStatus, setEditRosStatus] = useState<'Present' | 'Absent' | 'Unknown'>('Present');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, speechState, speechConfirmation]);

  // Speech Recognition Pipeline
  const handleStartSpeech = () => {
    setSpeechError(null);
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechError(
        language === 'hi' 
          ? 'आपका ब्राउज़र वाक् पहचान का समर्थन नहीं करता।' 
          : 'Speech recognition is not supported in this browser.'
      );
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setSpeechState('LISTENING');
        voiceEngine.playChime('tap');
      };

      rec.onerror = (e: any) => {
        setSpeechState('IDLE');
        if (e.error === 'not-allowed') {
          setSpeechError(
            language === 'hi'
              ? 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।'
              : 'Microphone permission denied. Please allow microphone access in browser settings.'
          );
        } else if (e.error === 'no-speech') {
          setSpeechError(
            language === 'hi'
              ? 'कोई आवाज़ सुनाई नहीं दी। कृपया पुनः बोलें।'
              : 'No speech detected. Please speak closer to your microphone.'
          );
        } else {
          setSpeechError(language === 'hi' ? 'वाक् पहचान विफल रही।' : 'Speech recognition encountered an issue.');
        }
      };

      rec.onresult = async (e: any) => {
        const spoken = e.results[0][0].transcript;
        setSpeechTranscript(spoken);
        setSpeechState('PROCESSING');
        
        // Pass to interpretation service
        const res: VoiceInterpretationResponse = await voiceInterpretationService.interpretSpeech({
          questionId: 'clinical_intake_free',
          spokenInput: spoken,
          language,
          availableOptions: [
            { id: 'low_energy', label: language === 'hi' ? 'कम ऊर्जा / थकान' : 'Low energy / Fatigue' },
            { id: 'chest_discomfort', label: language === 'hi' ? 'सीने में भारीपन / दर्द' : 'Chest discomfort' },
            { id: 'headache', label: language === 'hi' ? 'सिरदर्द' : 'Headache' },
            { id: 'fever', label: language === 'hi' ? 'बुखार' : 'Fever' },
            { id: 'cough', label: language === 'hi' ? 'खांसी' : 'Cough' },
            { id: 'breathlessness', label: language === 'hi' ? 'सांस फूलना' : 'Breathlessness' }
          ]
        });

        // Trigger confirmation loop
        setSpeechState('CONFIRMATION');
        setSpeechConfirmation({
          rawSpeech: spoken,
          interpretedMeaning: res.interpretedText || spoken,
          confidence: res.confidence,
          optionId: res.selectedOption
        });
      };

      rec.start();
    } catch {
      setSpeechState('IDLE');
      setSpeechError(language === 'hi' ? 'माइक्रोफ़ोन शुरू नहीं किया जा सका।' : 'Could not initialize microphone.');
    }
  };

  const handleConfirmSpeech = () => {
    if (!speechConfirmation) return;
    const finalMeaning = speechConfirmation.interpretedMeaning;
    const raw = speechConfirmation.rawSpeech;
    
    // Check if new structured ROS symptom should be added or updated
    if (finalMeaning.toLowerCase().includes('breath') || raw.toLowerCase().includes('breath')) {
      setRosData(prev => [
        {
          system: 'Respiratory',
          systemHi: 'श्वसन तंत्र',
          symptom: 'Breathlessness',
          symptomHi: 'सांस फूलना',
          status: 'Present',
          duration: 'Reported now',
          source: 'AI detected from patient speech',
          rawTranscript: raw
        },
        ...prev.filter(r => r.symptom !== 'Breathlessness')
      ]);
    }

    // Add to messages thread
    handleSendPatientMessage(finalMeaning, raw, 'AI_SPEECH');
    setSpeechConfirmation(null);
    setSpeechState('IDLE');
    setSpeechTranscript('');
  };

  const handleRejectSpeech = () => {
    setSpeechConfirmation(null);
    setSpeechState('IDLE');
    setSpeechTranscript('');
    setInputVal('');
  };

  const handleSendPatientMessage = (
    text: string, 
    rawSpoken?: string, 
    sourceTag: Message['sourceTag'] = 'PATIENT_TYPED',
    attachUrl?: string
  ) => {
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'PATIENT',
      text,
      sourceTag,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentUrl: attachUrl
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    // Check emergency red-flag symptoms
    const lower = (text + ' ' + (rawSpoken || '')).toLowerCase();
    const isEmergency = 
      lower.includes('chest pain') || 
      lower.includes('heart attack') || 
      lower.includes('severe breath') ||
      lower.includes('छाती में दर्द') ||
      lower.includes('सीने में दर्द') ||
      lower.includes('सांस नहीं आ रही');

    if (isEmergency) {
      setEmergencyAlertActive(true);
      voiceEngine.playChime('alert');
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now()}-alert`,
            sender: 'SYSTEM_ALERT',
            text: language === 'hi'
              ? '🚨 महत्वपूर्ण चेतावनी: आपके द्वारा बताए गए लक्षण (सीने में दर्द / गंभीर सांस फूलना) आपातकालीन हो सकते हैं। कृपया तुरंत नजदीकी अस्पताल आकस्मिक वार्ड (Casualty) जाएं या 112 पर कॉल करें।'
              : '🚨 Urgent Warning: The symptoms you described indicate acute cardiovascular or respiratory distress. Please proceed to the nearest emergency ward or call 112 immediately.',
            isUrgent: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
      return;
    }

    // AI Clinical Intake response
    setTimeout(() => {
      let reply = '';
      if (lower.includes('cough') || lower.includes('खांसी')) {
        reply = language === 'hi'
          ? 'मैंने आपकी खांसी की समस्या दर्ज कर ली है। क्या इसके साथ बलगम, बुखार या रात में पसीना आने के लक्षण भी हैं?'
          : 'I have noted your cough. Are you experiencing phlegm, fever, or chest heaviness along with it?';
      } else if (lower.includes('fever') || lower.includes('बुखार')) {
        reply = language === 'hi'
          ? 'क्या आपने थर्मामीटर से तापमान मापा है? क्या कंपकंपी या सिरदर्द भी महसूस हो रहा है?'
          : 'Have you measured your body temperature? Are you experiencing chills or headache as well?';
      } else {
        reply = language === 'hi'
          ? 'धन्यवाद, यह जानकारी आपके डॉक्टर के परामर्श सारांश में जोड़ दी गई है। क्या आप कोई अन्य लक्षण या दवाओं से संबंधित बात बताना चाहते हैं?'
          : 'Thank you. This has been structured for your doctor’s pre-consultation summary. Is there any other symptom or current medication you would like to note?';
      }

      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-assistant`,
          sender: 'ASSISTANT',
          text: reply,
          sourceTag: 'CLINICAL_INTAKE',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 700);
  };

  const handleEditRosSave = (idx: number) => {
    setRosData(prev => prev.map((item, i) => {
      if (i === idx) {
        return {
          ...item,
          status: editRosStatus,
          source: 'Manually verified by patient'
        };
      }
      return item;
    }));
    setEditingRosIndex(null);
  };

  return (
    <div className="w-full h-full min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white select-none">
      
      {/* 1. Clinical Assistant Header Workspace Bar */}
      <div className="p-3 sm:p-4 bg-teal-800 text-white flex items-center justify-between border-b border-teal-700 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600/80 border border-teal-400/40 flex items-center justify-center text-teal-100 shadow-md">
            <Bot className="w-5 h-5 text-teal-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                {language === 'hi' ? 'मेडीकियोस्क क्लिनिकल सहायक' : 'MediKiosk Clinical Assistant'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-900/80 text-teal-200 border border-teal-600/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-[11px] text-teal-100/90 font-medium">
              {language === 'hi' 
                ? 'परामर्श पूर्व क्लिनिकल इंटेक एवं लक्षण अन्वेषण' 
                : 'Pre-consultation clinical intake & symptom exploration'}
            </p>
          </div>
        </div>

        {/* Right Header Controls (ROS Toggle & Safety Tag) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRosDrawer(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              showRosDrawer 
                ? 'bg-teal-700 border-teal-400 text-white' 
                : 'bg-teal-900/60 border-teal-600/60 text-teal-200 hover:text-white'
            }`}
            title="Toggle Structured ROS Findings"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'संरचित लक्षण (ROS)' : 'Structured ROS'}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold bg-teal-900/60 px-3 py-1.5 rounded-xl border border-teal-600/40 text-teal-200">
            <HeartPulse className="w-3.5 h-3.5 text-teal-300" />
            <span>ABDM Encrypted</span>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900 text-[11px] font-semibold text-amber-900 dark:text-amber-200 px-4 flex items-center gap-2 flex-shrink-0">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>
          {language === 'hi'
            ? 'क्लिनिकल सहायक केवल डॉक्टर परामर्श की तैयारी में मदद करता है। यह स्वायत्त निदान प्रदान नहीं करता।'
            : 'The clinical assistant helps record symptoms and organize context for your physician. It does not replace medical diagnosis.'}
        </span>
      </div>

      {/* Emergency Red-Flag Banner */}
      {emergencyAlertActive && (
        <div className="p-4 bg-red-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in border-b-2 border-red-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 flex-shrink-0 text-red-200" />
            <div>
              <strong className="block text-sm font-black uppercase tracking-wider">
                {language === 'hi' ? '🚨 तत्काल आपातकालीन ध्यान आवश्यक' : '🚨 Urgent Medical Evaluation Advised'}
              </strong>
              <span className="text-xs text-red-100 font-medium">
                {language === 'hi'
                  ? 'कृपया बिना किसी देरी के अस्पताल आकस्मिक वार्ड (Casualty Room C-01) जाएं।'
                  : 'Please proceed immediately to Hospital Casualty (Room C-01) or dial emergency transport.'}
              </span>
            </div>
          </div>
          <a
            href="tel:112"
            className="px-4 py-2 rounded-xl bg-white text-red-700 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Call 112 / 108</span>
          </a>
        </div>
      )}

      {/* 2. Workspace Body: Messages Thread + Structured ROS Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Messages Stream (Occupies main workspace) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
          
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'PATIENT';
              const isAlert = msg.sender === 'SYSTEM_ALERT';

              if (isAlert) {
                return (
                  <div key={msg.id} className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-800 dark:text-red-200 text-xs sm:text-sm font-semibold flex items-start gap-3 max-w-2xl mx-auto shadow-sm">
                    <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{msg.text}</p>
                      <span className="text-[10px] text-red-500 font-mono block mt-1">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                    isUser ? 'bg-slate-800 dark:bg-teal-700' : 'bg-teal-600'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1 max-w-[85%] sm:max-w-[75%]">
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-teal-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                    }`}>
                      <p>{msg.text}</p>
                    </div>

                    <div className={`flex items-center gap-2 text-[10px] text-slate-400 font-medium ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {msg.sourceTag === 'AI_SPEECH' && (
                        <span className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                          <Mic className="w-3 h-3" />
                          AI Voice Detected
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Listening Waveform State */}
            {speechState === 'LISTENING' && (
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-700 max-w-md mx-auto text-center space-y-2.5 animate-fade-in shadow-md">
                <div className="flex items-center justify-center gap-1.5 py-1">
                  {[4, 12, 20, 16, 24, 14, 8, 18, 10].map((h, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-teal-600 rounded-full animate-pulse"
                      style={{ height: `${h}px`, animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 text-teal-800 dark:text-teal-200 text-xs font-black">
                  <Mic className="w-4 h-4 text-teal-600 animate-bounce" />
                  <span>{language === 'hi' ? '🎙 सुन रहा हूँ... बोलिए' : '🎙 Listening... Speak naturally'}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {language === 'hi' ? 'हिंदी या अंग्रेजी में अपनी समस्या साझा करें' : 'You can speak in English or हिन्दी'}
                </p>
              </div>
            )}

            {/* Processing State */}
            {speechState === 'PROCESSING' && (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 max-w-md mx-auto text-center space-y-2 animate-fade-in border border-slate-200 dark:border-slate-700">
                <Loader2 className="w-5 h-5 text-teal-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'hi' ? 'आपकी बात समझी जा रही है...' : 'Understanding your response...'}
                </p>
                {speechTranscript && (
                  <p className="text-[11px] font-mono text-slate-400 italic">"{speechTranscript}"</p>
                )}
              </div>
            )}

            {/* Speech Confirmation Loop Dialog (Section 17) */}
            {speechState === 'CONFIRMATION' && speechConfirmation && (
              <div className="p-4 sm:p-5 rounded-3xl bg-teal-50 dark:bg-teal-950/80 border-2 border-teal-500 max-w-lg mx-auto space-y-3.5 shadow-xl animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 block">
                      {language === 'hi' ? 'वाक् पुष्टि (Voice Confirmation)' : 'Verify Spoken Intake'}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                      {language === 'hi' ? 'क्या आपका यही मतलब था?' : 'Did you mean:'}
                    </h4>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-xs sm:text-sm font-bold text-teal-900 dark:text-teal-100">
                  "{speechConfirmation.interpretedMeaning}"
                </div>

                {speechConfirmation.rawSpeech !== speechConfirmation.interpretedMeaning && (
                  <div className="text-[11px] text-slate-500 font-mono">
                    <span className="font-semibold">{language === 'hi' ? 'मूल आवाज:' : 'Raw audio:'}</span> "{speechConfirmation.rawSpeech}"
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleConfirmSpeech}
                    className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'हाँ, सही है' : "Yes, that's right"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRejectSpeech}
                    className="flex-1 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'नहीं, बदलें' : 'Change answer'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Speech Error Banner */}
            {speechError && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center justify-between gap-2 max-w-lg mx-auto">
                <span>{speechError}</span>
                <button
                  type="button"
                  onClick={() => setSpeechError(null)}
                  className="text-amber-700 font-bold text-xs hover:underline cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!inputVal.trim()) return;
                handleSendPatientMessage(inputVal.trim());
              }}
              className="flex items-center gap-2 max-w-4xl mx-auto"
            >
              {/* Mic Speech Button */}
              <button
                type="button"
                onClick={handleStartSpeech}
                disabled={speechState === 'LISTENING'}
                className={`p-3 rounded-2xl font-bold transition-all cursor-pointer flex-shrink-0 shadow-sm ${
                  speechState === 'LISTENING'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
                title="Speak in Hindi or English"
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  language === 'hi' 
                    ? 'अपनी समस्या या लक्षण टाइप करें (उदा. मुझे 3 दिन से खांसी है)...' 
                    : 'Type symptoms or ask questions (e.g. Cough for 3 days)...'
                }
                className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white placeholder-slate-400"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-3 rounded-2xl bg-slate-800 dark:bg-teal-600 hover:bg-slate-900 text-white disabled:opacity-40 cursor-pointer transition-colors flex-shrink-0 shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>

        {/* 3. Right-Side Collapsible Structured ROS Findings Panel */}
        {showRosDrawer && (
          <aside className="w-80 xl:w-96 bg-slate-50 dark:bg-slate-850 border-l border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between overflow-y-auto flex-shrink-0 animate-fade-in select-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-teal-600" />
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {language === 'hi' ? 'संरचित क्लिनिकल सारांश (ROS)' : 'Structured ROS Findings'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRosDrawer(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {language === 'hi'
                  ? 'बातचीत के दौरान एआई द्वारा निकाले गए संरचित निष्कर्ष। आप किसी भी मान को संपादित कर सकते हैं।'
                  : 'Clinical findings derived from your conversation. All fields remain manually verifiable.'}
              </p>

              {/* Structured ROS List */}
              <div className="space-y-3">
                {rosData.map((item, idx) => (
                  <div
                    key={item.symptom}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {language === 'hi' ? item.symptomHi : item.symptom}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        item.status === 'Present'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : item.status === 'Absent'
                          ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          : 'bg-slate-50 text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{language === 'hi' ? item.systemHi : item.system}</span>
                      {item.duration && <span className="font-medium text-teal-600">{item.duration}</span>}
                    </div>

                    {/* AI Source Metadata */}
                    <div className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <Sparkles className="w-3 h-3 text-teal-600 flex-shrink-0" />
                      <span className="truncate">{item.source}</span>
                    </div>

                    {/* Raw Transcript inspection */}
                    {item.rawTranscript && (
                      <p className="text-[10px] text-slate-400 font-mono italic">
                        "{item.rawTranscript}"
                      </p>
                    )}

                    {/* Edit mode trigger */}
                    {editingRosIndex === idx ? (
                      <div className="pt-2 flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800">
                        <select
                          value={editRosStatus}
                          onChange={(e) => setEditRosStatus(e.target.value as any)}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-bold border border-slate-300 dark:border-slate-700"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Unknown">Unknown</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleEditRosSave(idx)}
                          className="px-2.5 py-1 rounded bg-teal-600 text-white text-[11px] font-bold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingRosIndex(null)}
                          className="px-2 py-1 text-slate-400 text-[11px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRosIndex(idx);
                          setEditRosStatus(item.status);
                        }}
                        className="text-[10px] text-teal-600 font-bold hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{language === 'hi' ? 'संपादित करें' : 'Edit value'}</span>
                      </button>
                    )}

                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Panel Metadata */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-400 space-y-1">
              <span className="block font-bold text-slate-600 dark:text-slate-300">
                {language === 'hi' ? 'डॉक्टर परामर्श सारांश में शामिल' : 'Pre-Consultation Summary Ready'}
              </span>
              <p>Will be provided to consulting physician along with confirmed documents.</p>
            </div>
          </aside>
        )}

      </div>

    </div>
  );
};
