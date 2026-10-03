import React, { useState } from 'react';
import { 
  Mic, 
  Keyboard, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertTriangle,
  HeartPulse,
  Activity,
  HelpCircle,
  Sparkles,
  FileText
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { VoiceRecorder } from '../common/VoiceRecorder';
import { AudioQuestionButton } from '../common/AudioQuestionButton';
import { VoiceAnswerButton } from '../common/VoiceAnswerButton';
import { AnswerConfirmation } from '../common/AnswerConfirmation';

export const SymptomScreen: React.FC = () => {
  const { 
    setScreen, 
    symptomsText, 
    symptomsDuration, 
    updateSymptoms,
    hasCurrentIllness,
    setHasCurrentIllness,
    socratesHpi,
    updateSocratesHpi,
    documents,
    selectedPastRecords,
    language, 
    t 
  } = useKiosk();

  // Personal History I: "Do you currently have any illness?" (Section 16)
  const [currentIllnessChoice, setCurrentIllnessChoice] = useState<string>(
    hasCurrentIllness === true ? 'Yes' : hasCurrentIllness === false ? 'No' : 'Yes'
  );

  // Input Mode: Voice vs Chips
  const [inputMode, setInputMode] = useState<'chips' | 'voice'>('chips');
  const [selectedChips, setSelectedChips] = useState<string[]>(
    symptomsText ? symptomsText.split(', ').map(s => s.trim()) : []
  );
  const [duration, setDuration] = useState<string>(symptomsDuration || '1 - 3 days');
  const [customText, setCustomText] = useState<string>(symptomsText);

  // SOCRATES details (Section 17)
  const [site, setSite] = useState<string>(socratesHpi.site || 'Chest & Throat');
  const [severity, setSeverity] = useState<number>(socratesHpi.severity || 4);

  // Voice confirmation state
  const [voicePending, setVoicePending] = useState<{
    text: string;
    optionId?: string;
    confidence: number;
  } | null>(null);

  // Common quick symptom options (ROS chips)
  const commonSymptoms = [
    { key: 'chest', labelEn: 'Chest Discomfort / Heaviness', labelHi: 'छाती में भारीपन या दर्द', urgent: true },
    { key: 'breathing', labelEn: 'Difficulty Breathing / Shortness', labelHi: 'सांस लेने में कठिनाई', urgent: true },
    { key: 'cough', labelEn: 'Persistent Cough / Phlegm', labelHi: 'लगातार खांसी या बलगम', urgent: false },
    { key: 'fever', labelEn: 'Fever & Chills', labelHi: 'तेज बुखार और कंपकंपी', urgent: false },
    { key: 'fatigue', labelEn: 'Fatigue / Low Energy', labelHi: 'थकान या सुस्ती', urgent: false },
    { key: 'stomach', labelEn: 'Abdominal / Stomach Pain', labelHi: 'पेट में दर्द या मरोड़', urgent: false },
    { key: 'dizziness', labelEn: 'Dizziness / Vertigo', labelHi: 'चक्कर आना या कमजोरी', urgent: false },
    { key: 'headache', labelEn: 'Severe Headache', labelHi: 'सिर में तेज दर्द', urgent: false }
  ];

  const durationOptions = [
    { value: 'A few hours', labelEn: 'A few hours', labelHi: 'कुछ घंटों से' },
    { value: '1 - 3 days', labelEn: '1 - 3 days', labelHi: '1 - 3 दिनों से' },
    { value: 'Over a week', labelEn: 'Over a week', labelHi: 'एक सप्ताह से अधिक' },
    { value: 'Chronic (Over a month)', labelEn: 'Over a month', labelHi: 'एक महीने से अधिक (पुरानी)' },
  ];

  const toggleChip = (label: string) => {
    let updated: string[];
    if (selectedChips.includes(label)) {
      updated = selectedChips.filter(c => c !== label);
    } else {
      updated = [...selectedChips, label];
    }
    setSelectedChips(updated);
    const combined = updated.join(', ');
    setCustomText(combined);
    updateSymptoms(combined, duration);
  };

  const handleVoiceConfirm = () => {
    if (!voicePending) return;
    const txt = voicePending.text;
    setCustomText(txt);
    updateSymptoms(txt, duration, txt);
    setVoicePending(null);
  };

  const handleNext = () => {
    const isYes = currentIllnessChoice === 'Yes';
    setHasCurrentIllness(isYes);

    const finalTxt = isYes
      ? (customText.trim() || selectedChips.join(', ') || "General Consultation")
      : "General Health Checkup & Prescription Review";

    updateSymptoms(finalTxt, duration);
    updateSocratesHpi({
      site,
      onset: duration,
      severity
    });

    setScreen('VITALS');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <HeartPulse className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          <span>{language === 'hi' ? 'चिकित्सीय इतिहास एवं लक्षण' : 'Clinical Intake & Symptoms'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
          {t('symptomTitle')}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-semibold mt-1">
          {t('symptomSubtitle')}
        </p>
      </div>

      {/* Consultation Shared Documents Context Banner (Section 33) */}
      {(selectedPastRecords.length > 0 || documents.length > 0) && (
        <div className="mb-6 p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span className="text-teal-900 dark:text-teal-200 font-bold">
              {language === 'hi'
                ? `📄 ${selectedPastRecords.length + documents.length} मेडिकल दस्तावेज़ इस परामर्श के लिए साझा किए गए हैं। सहायक इन जांच परिणामों को संदर्भित करेगा।`
                : `📄 ${selectedPastRecords.length + documents.length} medical documents shared for this encounter. Assistant can reference these findings.`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setScreen('DOCUMENTS')}
            className="text-teal-700 dark:text-teal-300 font-black hover:underline cursor-pointer flex-shrink-0"
          >
            {language === 'hi' ? 'दस्तावेज़ बदलें' : 'Edit Sharing'}
          </button>
        </div>
      )}

      {/* Voice Confirmation Banner */}
      {voicePending && (
        <AnswerConfirmation
          interpretedText={voicePending.text}
          confidence={voicePending.confidence}
          language={language}
          onConfirm={handleVoiceConfirm}
          onRetry={() => setVoicePending(null)}
        />
      )}

      {/* STEP 1: PERSONAL HISTORY I (Section 16) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'hi' ? 'क्या आप वर्तमान में किसी बीमारी या अस्वस्थता से पीड़ित हैं?' : 'Do you currently have any illness or discomfort?'}
            </h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
              {language === 'hi' ? 'व्यक्तिगत स्वास्थ्य जांच (Personal History I)' : 'Initial Assessment (Personal History I)'}
            </span>
          </div>
          <AudioQuestionButton
            textToSpeak={language === 'hi' ? 'क्या आप वर्तमान में किसी बीमारी या अस्वस्थता से पीड़ित हैं?' : 'Do you currently have any illness or discomfort?'}
            language={language}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            { id: 'Yes', labelEn: 'Yes (हाँ)', labelHi: 'हाँ' },
            { id: 'No', labelEn: 'No (नहीं)', labelHi: 'नहीं' },
            { id: 'Not sure', labelEn: 'Not sure', labelHi: 'पता नहीं' },
            { id: 'Prefer not to say', labelEn: 'Prefer not to say', labelHi: 'बताना नहीं चाहते' }
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setCurrentIllnessChoice(opt.id);
                setHasCurrentIllness(opt.id === 'Yes');
              }}
              className={`p-4 rounded-2xl border-2 font-bold text-base cursor-pointer transition-all ${
                currentIllnessChoice === opt.id
                  ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              {language === 'hi' ? opt.labelHi : opt.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: PERSONAL HISTORY II / SOCRATES / ROS (Section 17 & 18) */}
      {currentIllnessChoice === 'Yes' && (
        <div className="space-y-6 animate-fade-in">
          {/* Chief Complaint / ROS Chips */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'आज आपको सबसे अधिक क्या परेशानी है?' : 'What is bothering you most today?'}
                </h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                  {language === 'hi' ? 'मुख्य समस्या एवं लक्षण (Chief Complaint & ROS)' : 'Chief Complaint & Adaptive Review of Systems'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <AudioQuestionButton
                  textToSpeak={language === 'hi' ? 'आज आपको सबसे अधिक क्या परेशानी है?' : 'What is bothering you most today?'}
                  language={language}
                />
                <VoiceAnswerButton
                  questionId="symptomInput"
                  language={language}
                  availableOptions={commonSymptoms.map(s => ({
                    id: s.key,
                    label: language === 'hi' ? s.labelHi : s.labelEn
                  }))}
                  onInterpreted={(res, raw) => setVoicePending({ text: res.interpretedText || raw, optionId: res.selectedOption, confidence: res.confidence })}
                />
              </div>
            </div>

            {/* Quick Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {commonSymptoms.map(sym => {
                const label = language === 'hi' ? sym.labelHi : sym.labelEn;
                const isSelected = selectedChips.includes(label) || customText.includes(label);

                return (
                  <button
                    key={sym.key}
                    type="button"
                    onClick={() => toggleChip(label)}
                    className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <span className="font-bold text-sm sm:text-base">{label}</span>
                    {isSelected && <Check className="w-5 h-5 stroke-[3] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Text / Spoken Text Display */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                {language === 'hi' ? 'विस्तृत लक्षण विवरण' : 'Detailed Description'}
              </label>
              <textarea
                rows={2}
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  updateSymptoms(e.target.value, duration);
                }}
                placeholder={language === 'hi' ? 'अन्य कोई लक्षण या विवरण यहाँ लिखें...' : 'Type or speak any other symptoms...'}
                className="w-full p-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* SOCRATES: Timing & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Timing / Duration */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
              <h4 className="text-base font-black text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>{language === 'hi' ? 'यह समस्या कब से है?' : 'How long have you had this?'}</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {durationOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setDuration(opt.value);
                      updateSymptoms(customText, opt.value);
                    }}
                    className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                      duration === opt.value
                        ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {language === 'hi' ? opt.labelHi : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity 1 to 10 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'तकलीफ की तीव्रता (1 से 10)' : 'Severity of Discomfort (1 to 10)'}
                </h4>
                <span className="font-mono font-black text-lg text-teal-700 dark:text-teal-400">
                  {severity} / 10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-bold mt-2">
                <span>{language === 'hi' ? '1 (हल्का)' : '1 (Mild)'}</span>
                <span>{language === 'hi' ? '5 (मध्यम)' : '5 (Moderate)'}</span>
                <span>{language === 'hi' ? '10 (अत्यधिक)' : '10 (Severe)'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setScreen('DOCUMENTS')}
          className="px-6 py-3.5 rounded-2xl border-2 border-slate-300 hover:bg-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-base flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-base shadow-lg cursor-pointer flex items-center gap-2 transition-all"
        >
          <span>{t('continue')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
