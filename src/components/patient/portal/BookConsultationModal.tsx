import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Building, 
  Sparkles, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  Download, 
  FileText,
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { Language, PatientAppointment } from '../../../types';
import { voiceEngine } from '../../../services/voiceEngine';

export interface ClinicalQuestionItem {
  encounterId?: string;
  questionId: string;
  questionText: string;
  questionTextHi?: string;
  questionType: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'FREE_TEXT' | 'DURATION';
  options?: { value: string; label: string; labelHi?: string }[];
  required?: boolean;
}

export interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  doctor: {
    id?: string;
    name: string;
    specialty: string;
    department: string;
    hospitalName: string;
    phone?: string;
    room?: string;
  } | null;
  onAppointmentBooked: (newApt: PatientAppointment) => void;
  customQuestions?: ClinicalQuestionItem[];
}

export const BookConsultationModal: React.FC<BookConsultationModalProps> = ({
  isOpen,
  onClose,
  language,
  doctor,
  onAppointmentBooked,
  customQuestions
}) => {
  if (!isOpen || !doctor) return null;

  // Step 1: Intake | Step 2: ROS Questionnaire | Step 3: Confirmed
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 State: Concern Details
  const [chiefConcern, setChiefConcern] = useState('');
  const [concernDuration, setConcernDuration] = useState('1 - 3 days');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 10:00 AM');

  // Step 2 State: ROS Answers & Voice
  // Clean integration point: default structured question flow that can be replaced by backend/ROS service
  const rosQuestions: ClinicalQuestionItem[] = customQuestions && customQuestions.length > 0
    ? customQuestions
    : [
        {
          questionId: 'ros_fever',
          questionText: 'Have you had fever, chills, or night sweats in the past 48 hours?',
          questionTextHi: 'क्या पिछले 48 घंटों में आपको बुखार, कंपकंपी या रात में पसीना आया है?',
          questionType: 'SINGLE_CHOICE',
          options: [
            { value: 'No', label: 'No fever', labelHi: 'बुखार नहीं है' },
            { value: 'Mild', label: 'Mild (99°F - 100°F)', labelHi: 'हल्का बुखार' },
            { value: 'High', label: 'High (>101°F)', labelHi: 'तेज बुखार (>101°F)' }
          ],
          required: true
        },
        {
          questionId: 'ros_resp',
          questionText: 'Are you experiencing cough, shortness of breath, or throat pain?',
          questionTextHi: 'क्या आपको खांसी, सांस फूलना या गले में खराश/दर्द है?',
          questionType: 'MULTI_CHOICE',
          options: [
            { value: 'None', label: 'None', labelHi: 'कुछ नहीं' },
            { value: 'Dry Cough', label: 'Dry Cough', labelHi: 'सूखी खांसी' },
            { value: 'Productive Cough', label: 'Cough with Phlegm', labelHi: 'बलगम वाली खांसी' },
            { value: 'Shortness of Breath', label: 'Shortness of Breath', labelHi: 'सांस फूलना' },
            { value: 'Sore Throat', label: 'Sore Throat', labelHi: 'गले में खराश' }
          ]
        },
        {
          questionId: 'ros_energy',
          questionText: 'How is your general appetite and daily energy level?',
          questionTextHi: 'आपकी भूख और दैनिक ऊर्जा का स्तर कैसा है?',
          questionType: 'SINGLE_CHOICE',
          options: [
            { value: 'Normal', label: 'Normal & active', labelHi: 'सामान्य और सक्रिय' },
            { value: 'Reduced Appetite', label: 'Reduced appetite', labelHi: 'भूख कम लग रही है' },
            { value: 'Fatigued', label: 'Weak & fatigued', labelHi: 'कमजोरी और थकान' }
          ]
        }
      ];

  const [rosAnswers, setRosAnswers] = useState<Record<string, any>>({
    ros_fever: 'No',
    ros_resp: ['None'],
    ros_energy: 'Normal'
  });

  const [isListening, setIsListening] = useState(false);
  const [activeVoiceQuestionId, setActiveVoiceQuestionId] = useState<string | null>(null);

  // Step 3 State: Generated Token
  const [generatedAppointment, setGeneratedAppointment] = useState<PatientAppointment | null>(null);

  const durationOptions = [
    { value: 'Less than 24 hours', labelEn: 'Less than 24 hours', labelHi: '24 घंटे से कम' },
    { value: '1 - 3 days', labelEn: '1 - 3 days', labelHi: '1 - 3 दिन' },
    { value: '1 - 2 weeks', labelEn: '1 - 2 weeks', labelHi: '1 - 2 सप्ताह' },
    { value: 'More than a month', labelEn: 'More than a month', labelHi: '1 महीने से अधिक' }
  ];

  const slotOptions = [
    'Today, 04:30 PM (Evening OPD)',
    'Tomorrow, 10:00 AM (Morning OPD)',
    'Tomorrow, 11:30 AM (Morning OPD)',
    'Day after tomorrow, 09:30 AM'
  ];

  const stopListeningRef = React.useRef<(() => void) | null>(null);

  // Voice handler for answering questions
  const handleVoiceToggle = (questionId: string) => {
    if (isListening) {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsListening(false);
      setActiveVoiceQuestionId(null);
    } else {
      setActiveVoiceQuestionId(questionId);
      setIsListening(true);
      voiceEngine.playChime('tap');
      stopListeningRef.current = voiceEngine.startListening(
        language === 'hi' ? 'hi' : 'en',
        (transcript: string, isFinal: boolean) => {
          if (isFinal || transcript.length > 5) {
            setRosAnswers(prev => ({
              ...prev,
              [questionId]: transcript
            }));
            voiceEngine.playChime('success');
            setIsListening(false);
            setActiveVoiceQuestionId(null);
          }
        },
        () => {
          setIsListening(false);
          setActiveVoiceQuestionId(null);
        }
      );
    }
  };

  const handleSelectSingleChoice = (questionId: string, val: string) => {
    setRosAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const handleToggleMultiChoice = (questionId: string, val: string) => {
    const existing = (rosAnswers[questionId] as string[]) || [];
    let updated: string[];
    if (val === 'None') {
      updated = ['None'];
    } else {
      const filtered = existing.filter(x => x !== 'None');
      if (filtered.includes(val)) {
        updated = filtered.filter(x => x !== val);
        if (updated.length === 0) updated = ['None'];
      } else {
        updated = [...filtered, val];
      }
    }
    setRosAnswers(prev => ({ ...prev, [questionId]: updated }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCompleteBooking = () => {
    const tokenNum = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApt: PatientAppointment = {
      id: `apt-${Date.now()}`,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      department: doctor.department,
      hospitalName: doctor.hospitalName,
      date: selectedDate.split(',')[0],
      time: selectedDate.split(',')[1]?.trim() || '10:00 AM',
      room: doctor.room || 'OPD Room 204',
      status: 'UPCOMING',
      consultationType: 'OPD_VISIT',
      preparationNotes: chiefConcern 
        ? `Chief concern: ${chiefConcern} (${concernDuration}). Please arrive 15 minutes before slot.` 
        : 'Please arrive 15 minutes before your scheduled slot with your ABHA ID and recent reports.',
      tokenNumber: tokenNum
    };

    setGeneratedAppointment(newApt);
    onAppointmentBooked(newApt);
    setStep(3);
  };

  const handleDownloadSlip = () => {
    if (!generatedAppointment) return;
    const slipText = `
GOVT. DISTRICT CIVIL HOSPITAL — OPD APPOINTMENT SLIP
===================================================
Token Number: ${generatedAppointment.tokenNumber}
Patient: Priya Sharma (ABHA: 14-9842-1209-7741)
Doctor: ${generatedAppointment.doctorName} (${generatedAppointment.doctorSpecialty})
Department: ${generatedAppointment.department}
Room Assigned: ${generatedAppointment.room}
Scheduled Date: ${generatedAppointment.date} at ${generatedAppointment.time}
Hospital: ${generatedAppointment.hospitalName}
Status: Confirmed Visit
Chief Concern: ${chiefConcern || 'General Consultation'} (${concernDuration})
===================================================
Generated via MediKiosk Patient Portal
    `.trim();

    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Appointment_Slip_${generatedAppointment.tokenNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in select-none overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-teal-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                {language === 'hi' ? 'चिकित्सकीय परामर्श बुक करें' : 'Book Consultation'}
              </h2>
              <p className="text-xs text-teal-100 font-semibold">
                {doctor.name} • {doctor.specialty}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Step 1 -> Step 2 -> Step 3) */}
        <div className="bg-slate-100 dark:bg-slate-800 px-6 py-2.5 flex items-center justify-between text-xs font-bold border-b border-slate-200 dark:border-slate-700">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-300 text-slate-700'
            }`}>1</span>
            <span>{language === 'hi' ? 'स्वास्थ्य चिंता' : 'Concern & Details'}</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-300 text-slate-700'
            }`}>2</span>
            <span>{language === 'hi' ? 'ROS प्रश्नावली' : 'ROS Questions'}</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-300 text-slate-700'
            }`}>3</span>
            <span>{language === 'hi' ? 'टोकन पुष्टि' : 'Token Slip'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">

          {/* STEP 1: Concern & Time Details */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-5">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {language === 'hi'
                    ? 'परामर्श से पहले, कृपया अपनी मुख्य समस्या बताएं ताकि डॉक्टर आपकी पूर्व तैयारी कर सकें।'
                    : 'Before continuing, tell us a little about your concern so your doctor can prepare.'}
                </p>
              </div>

              {/* Chief Concern */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  {language === 'hi' ? 'आप किस विषय में परामर्श लेना चाहते हैं? *' : 'What would you like to consult about? *'}
                </label>
                <input
                  type="text"
                  required
                  value={chiefConcern}
                  onChange={(e) => setChiefConcern(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. सिरदर्द, छाती में भारीपन, या सामान्य जांच...' : 'e.g. Headache, chest tightness, or routine follow-up...'}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:border-teal-600 transition-colors"
                />
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  {language === 'hi' ? 'आप इसे कब से महसूस कर रहे हैं? *' : 'How long have you been experiencing it? *'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {durationOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setConcernDuration(opt.value)}
                      className={`p-3 rounded-xl text-xs font-bold border-2 text-left transition-all cursor-pointer ${
                        concernDuration === opt.value
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {language === 'hi' ? opt.labelHi : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  {language === 'hi' ? 'क्या कोई अन्य बात है जो डॉक्टर को जाननी चाहिए?' : "Anything else you'd like the doctor to know?"}
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={language === 'hi' ? 'अतिरिक्त लक्षण या पूर्व दवाओं की जानकारी...' : 'Any associated symptoms, current medicines, or specific questions...'}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-teal-600 transition-colors"
                />
              </div>

              {/* Slot Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  {language === 'hi' ? 'उपलब्ध ओपीडी समय स्लॉट चुनें *' : 'Select Available OPD Slot *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {slotOptions.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedDate(slot)}
                      className={`p-2.5 rounded-xl text-xs font-bold border-2 flex items-center gap-2 cursor-pointer transition-all ${
                        selectedDate === slot
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <span className="truncate">{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>{language === 'hi' ? 'आगे बढ़ें (ROS प्रश्नावली)' : 'Continue to ROS Questions'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: ROS Questionnaire Integration Point */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    {language === 'hi' ? 'पूर्व-परामर्श क्लिनिकल प्रश्नावली (ROS)' : 'Clinical Review of Systems (ROS)'}
                  </p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
                    {language === 'hi'
                      ? 'आप बटन दबाकर या माइक आइकन 🎙️ से बोलकर उत्तर दे सकते हैं।'
                      : 'Answer via quick touch chips or tap the microphone 🎙️ to answer by voice.'}
                  </p>
                </div>
              </div>

              {/* Dynamic ROS Questions */}
              <div className="space-y-5">
                {rosQuestions.map((q, idx) => (
                  <div
                    key={q.questionId}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">
                          Question {idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-0.5">
                          {language === 'hi' && q.questionTextHi ? q.questionTextHi : q.questionText}
                        </h4>
                      </div>

                      {/* Voice answer trigger */}
                      <button
                        type="button"
                        onClick={() => handleVoiceToggle(q.questionId)}
                        className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all ${
                          isListening && activeVoiceQuestionId === q.questionId
                            ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-teal-500'
                        }`}
                        title="Answer with voice"
                      >
                        {isListening && activeVoiceQuestionId === q.questionId ? (
                          <>
                            <Mic className="w-3.5 h-3.5 animate-bounce" />
                            <span className="text-[10px]">Listening...</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5 text-teal-600" />
                            <span className="text-[10px]">Voice</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Options rendering */}
                    {q.options && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {q.options.map(opt => {
                          const isSelected = q.questionType === 'SINGLE_CHOICE'
                            ? rosAnswers[q.questionId] === opt.value
                            : ((rosAnswers[q.questionId] as string[]) || []).includes(opt.value);

                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                if (q.questionType === 'SINGLE_CHOICE') {
                                  handleSelectSingleChoice(q.questionId, opt.value);
                                } else {
                                  handleToggleMultiChoice(q.questionId, opt.value);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {language === 'hi' && opt.labelHi ? opt.labelHi : opt.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Display recorded voice response if different */}
                    {typeof rosAnswers[q.questionId] === 'string' &&
                      !q.options?.some(o => o.value === rosAnswers[q.questionId]) && (
                        <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 text-xs text-teal-900 dark:text-teal-200 font-medium">
                          🎙️ Voice note recorded: <strong>{rosAnswers[q.questionId]}</strong>
                        </div>
                      )}
                  </div>
                ))}
              </div>

              {/* Step 2 Actions */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पीछे जाएं' : 'Back'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteBooking}
                  className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'hi' ? 'पुष्टि करें और अपॉइंटमेंट बुक करें' : 'Confirm & Book Appointment'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmed Token Slip */}
          {step === 3 && generatedAppointment && (
            <div className="space-y-6 text-center animate-fade-in py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {language === 'hi' ? 'परामर्श सफलतापूर्वक निर्धारित हुआ!' : 'Consultation Confirmed!'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {language === 'hi'
                    ? 'आपका डिजिटल ओपीडी टोकन आवंटित कर दिया गया है।'
                    : 'Your OPD appointment token has been officially allocated.'}
                </p>
              </div>

              {/* Official Token Box */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-teal-500 max-w-sm mx-auto space-y-3">
                <span className="text-[11px] font-black uppercase text-teal-600 tracking-wider block">
                  OPD Queue Token Number
                </span>
                <p className="text-4xl font-mono font-black text-teal-700 dark:text-teal-300">
                  {generatedAppointment.tokenNumber}
                </p>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p><strong>{doctor.name}</strong> ({doctor.specialty})</p>
                  <p>{doctor.hospitalName} • {generatedAppointment.room}</p>
                  <p className="text-teal-600 dark:text-teal-400 font-bold">{selectedDate}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadSlip}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'hi' ? 'पर्ची डाउनलोड करें' : 'Download OPD Slip'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span>{language === 'hi' ? 'अपॉइंटमेंट सूची देखें' : 'View in Upcoming Appointments'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
