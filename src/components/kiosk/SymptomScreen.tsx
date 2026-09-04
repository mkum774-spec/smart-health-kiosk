import React, { useState } from 'react';
import { 
  Mic, 
  Keyboard, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { VoiceRecorder } from '../common/VoiceRecorder';

export const SymptomScreen: React.FC = () => {
  const { 
    setScreen, 
    symptomsText, 
    symptomsDuration, 
    updateSymptoms, 
    selectedPastRecords,
    language, 
    t 
  } = useKiosk();

  const [inputMode, setInputMode] = useState<'voice' | 'chips'>(symptomsText ? 'chips' : 'voice');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>(symptomsDuration || '1 - 3 days');
  const [customText, setCustomText] = useState<string>(symptomsText);

  // Common quick symptom options
  const commonSymptoms = [
    { key: 'chest', labelEn: 'Chest Pain / Heavy Discomfort', labelHi: 'छाती में दर्द या भारीपन', urgent: true },
    { key: 'breathing', labelEn: 'Difficulty Breathing / Shortness of Breath', labelHi: 'सांस लेने में अत्यधिक कठिनाई', urgent: true },
    { key: 'fever', labelEn: 'High Fever & Chills', labelHi: 'तेज बुखार और कंपकंपी', urgent: false },
    { key: 'cough', labelEn: 'Persistent Cough / Phlegm', labelHi: 'लगातार खांसी या बलगम', urgent: false },
    { key: 'stomach', labelEn: 'Severe Abdominal / Stomach Pain', labelHi: 'पेट में तेज दर्द', urgent: false },
    { key: 'injury', labelEn: 'Accidental Fall / Physical Injury', labelHi: 'गिरना या शारीरिक चोट', urgent: false },
    { key: 'dizziness', labelEn: 'Extreme Dizziness / Weakness', labelHi: 'चक्कर आना या कमजोरी', urgent: false },
    { key: 'vomiting', labelEn: 'Frequent Vomiting & Diarrhea', labelHi: 'उल्टी और दस्त', urgent: false },
  ];

  const durationOptions = [
    { value: 'A few hours', labelEn: 'A few hours', labelHi: 'कुछ घंटों से' },
    { value: '1 - 3 days', labelEn: '1 - 3 days', labelHi: '1 - 3 दिनों से' },
    { value: 'More than a week', labelEn: 'Over a week', labelHi: 'एक सप्ताह से अधिक' },
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

  const handleVoiceConfirm = (transcript: string) => {
    setCustomText(transcript);
    updateSymptoms(transcript, duration, transcript);
    // Proceed to Vitals
    setScreen('VITALS');
  };

  const handleNext = () => {
    const finalTxt = customText.trim() || selectedChips.join(', ') || "General Health Checkup";
    updateSymptoms(finalTxt, duration);
    setScreen('VITALS');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('symptomTitle')}
        </h2>
        <p className="text-lg text-slate-600 font-semibold mt-1">
          {t('symptomSubtitle')}
        </p>

        {/* Input Mode Toggle */}
        <div className="inline-flex bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300 mt-4">
          <button
            type="button"
            onClick={() => setInputMode('voice')}
            className={`px-5 py-2 rounded-xl font-black text-base flex items-center gap-2 transition-all cursor-pointer ${
              inputMode === 'voice' 
                ? 'bg-teal-700 text-white shadow-sm' 
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span>{t('speakOption')}</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('chips')}
            className={`px-5 py-2 rounded-xl font-black text-base flex items-center gap-2 transition-all cursor-pointer ${
              inputMode === 'chips' 
                ? 'bg-teal-700 text-white shadow-sm' 
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Keyboard className="w-5 h-5" />
            <span>{t('typeOption')}</span>
          </button>
        </div>
      </div>

      {inputMode === 'voice' ? (
        /* Voice Recorder Mode with AI Confirmation Loop */
        <VoiceRecorder
          initialText={customText}
          onConfirm={handleVoiceConfirm}
        />
      ) : (
        /* Touch Chips Mode */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
          <div>
            <h4 className="text-lg font-black text-slate-900 mb-3">
              {t('commonSymptomsTitle')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commonSymptoms.map(item => {
                const textLabel = language === 'hi' ? item.labelHi : item.labelEn;
                const isSelected = selectedChips.includes(textLabel);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleChip(textLabel)}
                    className={`min-h-[64px] p-4 rounded-2xl border-2 font-bold text-left text-base flex items-center justify-between transition-all cursor-pointer active:scale-98 ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-800 shadow-md'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{textLabel}</span>
                    {isSelected && <Check className="w-6 h-6 flex-shrink-0 stroke-[3]" />}
                    {!isSelected && item.urgent && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 font-bold uppercase">
                        Priority
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Selector */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-700" />
              <span>{t('symptomDurationLabel')}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {durationOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setDuration(opt.value);
                    updateSymptoms(customText, opt.value);
                  }}
                  className={`py-3 px-3 rounded-xl border-2 font-bold text-sm text-center transition-all cursor-pointer ${
                    duration === opt.value
                      ? 'bg-teal-800 text-white border-teal-900 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {language === 'hi' ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input / Selected Summary */}
          <div>
            <label className="text-sm font-bold text-slate-600 block mb-1">
              {language === 'hi' ? 'लक्षण सारांश / अतिरिक्त विवरण:' : 'Symptom Summary / Additional details:'}
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                updateSymptoms(e.target.value, duration);
              }}
              placeholder={language === 'hi' ? 'जैसे: सिरदर्द और हल्का बुखार...' : 'e.g., headache and mild fever...'}
              className="w-full p-4 text-lg font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setScreen(selectedPastRecords.length > 0 ? 'CONSENT' : 'PAST_RECORDS')}
          className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-lg rounded-2xl border-2 border-slate-300 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="min-w-[200px] px-8 py-5 bg-teal-700 hover:bg-teal-800 text-white font-black text-xl rounded-2xl border-2 border-teal-800 shadow-lg flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>{t('continue')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
