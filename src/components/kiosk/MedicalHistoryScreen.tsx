import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Check, 
  Plus, 
  Pill, 
  Heart, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';

export const MedicalHistoryScreen: React.FC = () => {
  const { 
    setScreen, 
    history, 
    updateHistory, 
    assessmentTrack,
    language, 
    t 
  } = useKiosk();

  const [allergies, setAllergies] = useState<string[]>(history.allergies || []);
  const [hasNoAllergies, setHasNoAllergies] = useState<boolean>(history.hasNoKnownAllergies);
  const [conditions, setConditions] = useState<string[]>(history.chronicConditions || []);
  const [medsText, setMedsText] = useState<string>(history.currentMedications?.join(', ') || '');

  const commonAllergies = [
    { key: 'penicillin', labelEn: 'Penicillin', labelHi: 'पेनिसिलिन (Penicillin)' },
    { key: 'sulfa', labelEn: 'Sulfa Drugs', labelHi: 'सल्फा दवाएं (Sulfa)' },
    { key: 'aspirin', labelEn: 'Aspirin / NSAIDs', labelHi: 'एस्पिरिन / दर्द निवारक' },
    { key: 'iodine', labelEn: 'Iodine / Contrast Dye', labelHi: 'आयोडीन / सीटी डाई' },
    { key: 'peanuts', labelEn: 'Peanuts / Food', labelHi: 'मूंगफली / खाद्य एलर्जी' },
  ];

  const commonConditions = [
    { key: 'diabetes', labelEn: 'Type 2 Diabetes', labelHi: 'मधुमेह (शुगर / Diabetes)' },
    { key: 'hypertension', labelEn: 'Hypertension (High BP)', labelHi: 'उच्च रक्तचाप (High BP)' },
    { key: 'asthma', labelEn: 'Asthma / Respiratory', labelHi: 'अस्थमा / सांस की बीमारी' },
    { key: 'heart', labelEn: 'Heart Disease / CAD', labelHi: 'हृदय रोग' },
    { key: 'thyroid', labelEn: 'Thyroid Disorder', labelHi: 'थायराइड रोग' },
    { key: 'kidney', labelEn: 'Kidney Disease', labelHi: 'गुर्दे की बीमारी' },
  ];

  const handleToggleNoAllergy = () => {
    const nextVal = !hasNoAllergies;
    setHasNoAllergies(nextVal);
    if (nextVal) {
      setAllergies([]);
      updateHistory({ hasNoKnownAllergies: true, allergies: [] });
    }
  };

  const handleToggleAllergy = (label: string) => {
    let next: string[];
    if (allergies.includes(label)) {
      next = allergies.filter(a => a !== label);
    } else {
      next = [...allergies, label];
      setHasNoAllergies(false);
    }
    setAllergies(next);
    updateHistory({ allergies: next, hasNoKnownAllergies: next.length === 0 });
  };

  const handleToggleCondition = (label: string) => {
    let next: string[];
    if (conditions.includes(label)) {
      next = conditions.filter(c => c !== label);
    } else {
      next = [...conditions, label];
    }
    setConditions(next);
    updateHistory({ chronicConditions: next });
  };

  const handleNext = () => {
    const medsArray = medsText.split(',').map(m => m.trim()).filter(Boolean);
    updateHistory({
      allergies,
      hasNoKnownAllergies: hasNoAllergies && allergies.length === 0,
      chronicConditions: conditions,
      currentMedications: medsArray,
    });
    setScreen('DOCUMENTS');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('historyTitle')}
        </h2>
        <p className="text-lg text-slate-600 font-semibold mt-1">
          {t('historySubtitle')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: ALLERGIES (Critically Prominent) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-7 h-7 text-red-600 stroke-[2.5]" />
              <h3 className="text-2xl font-black text-slate-900">
                {t('allergiesTitle')}
              </h3>
            </div>
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-red-100 text-red-800 rounded-full border border-red-200">
              {language === 'hi' ? 'चिकित्सकीय सुरक्षा' : 'Patient Safety Critical'}
            </span>
          </div>

          {/* Big "No Known Allergies" Button */}
          <button
            type="button"
            onClick={handleToggleNoAllergy}
            className={`w-full min-h-[60px] p-4 rounded-2xl border-2 font-black text-lg flex items-center justify-between transition-all cursor-pointer mb-4 ${
              hasNoAllergies
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <span>{t('noKnownAllergiesBtn')}</span>
            {hasNoAllergies && <Check className="w-6 h-6 stroke-[3]" />}
          </button>

          {/* Specific Allergy Chips */}
          <p className="text-sm font-bold text-slate-600 mb-2">
            {language === 'hi' ? 'या नीचे दी गई दवाओं/चीजों में से चुनें:' : 'Or tap known specific allergies:'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {commonAllergies.map(item => {
              const label = language === 'hi' ? item.labelHi : item.labelEn;
              const isSelected = allergies.includes(label);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleToggleAllergy(label)}
                  className={`p-3.5 rounded-xl border-2 font-bold text-sm text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-700 shadow-sm'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-red-50 hover:border-red-200'
                  }`}
                >
                  <span className="truncate">{label}</span>
                  {isSelected && <Check className="w-4 h-4 flex-shrink-0 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: EXISTING MEDICAL CONDITIONS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 mb-4">
            <Heart className="w-6 h-6 text-teal-700" />
            <h3 className="text-2xl font-black text-slate-900">
              {t('conditionsTitle')}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {commonConditions.map(item => {
              const label = language === 'hi' ? item.labelHi : item.labelEn;
              const isSelected = conditions.includes(label);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleToggleCondition(label)}
                  className={`p-3.5 rounded-xl border-2 font-bold text-sm text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-teal-50'
                  }`}
                >
                  <span className="truncate">{label}</span>
                  {isSelected && <Check className="w-4 h-4 flex-shrink-0 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: CURRENT MEDICATIONS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 mb-3">
            <Pill className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-black text-slate-900">
              {t('medicationsTitle')}
            </h3>
          </div>
          <input
            type="text"
            value={medsText}
            onChange={(e) => setMedsText(e.target.value)}
            placeholder={t('medicationPlaceholder')}
            className="w-full p-4 text-lg font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl focus:outline-none focus:border-teal-600"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setScreen(assessmentTrack === 'ayurveda' ? 'AYURVEDA' : 'VITALS')}
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
