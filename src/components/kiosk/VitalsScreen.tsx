import React, { useState } from 'react';
import { 
  Scale, 
  Ruler, 
  ArrowRight, 
  ArrowLeft, 
  Info, 
  Sparkles,
  Minus,
  Plus
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { NumericKeypad } from '../common/NumericKeypad';

export const VitalsScreen: React.FC = () => {
  const { 
    setScreen, 
    vitals, 
    updateVitals, 
    assessmentTrack,
    language, 
    t 
  } = useKiosk();

  const [activeField, setActiveField] = useState<'heightCm' | 'weightKg' | null>(null);
  const [tempInput, setTempInput] = useState<string>('');

  const openKeypad = (field: 'heightCm' | 'weightKg') => {
    setActiveField(field);
    const curr = vitals[field];
    setTempInput(curr !== undefined ? String(curr) : '');
  };

  const handleKeypadDigit = (digit: string) => {
    if (tempInput.length < 4) {
      setTempInput(prev => prev + digit);
    }
  };

  const handleKeypadBackspace = () => {
    setTempInput(prev => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setTempInput('');
  };

  const handleKeypadSubmit = () => {
    if (activeField && tempInput) {
      const num = parseFloat(tempInput);
      if (!isNaN(num) && num > 0) {
        updateVitals({ [activeField]: num });
      }
    }
    setActiveField(null);
  };

  const adjustValue = (field: 'heightCm' | 'weightKg', delta: number) => {
    const curr = vitals[field] || (field === 'heightCm' ? 170 : 68);
    const updated = Math.max(field === 'heightCm' ? 50 : 10, curr + delta);
    updateVitals({ [field]: updated });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 select-none">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('vitalsTitle')}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-semibold mt-1">
          {t('vitalsSubtitle')}
        </p>
      </div>

      {/* Main Measurements Grid: Height & Weight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Height Card */}
        <div 
          onClick={() => openKeypad('heightCm')}
          className="bg-white p-6 sm:p-8 rounded-3xl border-3 border-slate-300 hover:border-teal-600 shadow-md cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-black text-slate-700 uppercase tracking-wider">
              {t('heightLabel')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
          </div>

          <div className="my-6 text-center">
            <span className="text-6xl sm:text-7xl font-black font-mono text-slate-900">
              {vitals.heightCm || 170}
            </span>
            <span className="text-xl font-bold text-slate-500 ml-2">cm</span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => adjustValue('heightCm', -1)}
              className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-black text-xl flex items-center justify-center cursor-pointer border border-slate-300"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => openKeypad('heightCm')}
              className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl border border-teal-200 cursor-pointer"
            >
              {language === 'hi' ? 'संख्या बदलें' : 'Edit Number'}
            </button>
            <button
              type="button"
              onClick={() => adjustValue('heightCm', 1)}
              className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-black text-xl flex items-center justify-center cursor-pointer border border-slate-300"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weight Card */}
        <div 
          onClick={() => openKeypad('weightKg')}
          className="bg-white p-6 sm:p-8 rounded-3xl border-3 border-slate-300 hover:border-teal-600 shadow-md cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-black text-slate-700 uppercase tracking-wider">
              {t('weightLabel')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
          </div>

          <div className="my-6 text-center">
            <span className="text-6xl sm:text-7xl font-black font-mono text-slate-900">
              {vitals.weightKg || 68}
            </span>
            <span className="text-xl font-bold text-slate-500 ml-2">kg</span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => adjustValue('weightKg', -1)}
              className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-black text-xl flex items-center justify-center cursor-pointer border border-slate-300"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => openKeypad('weightKg')}
              className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl border border-teal-200 cursor-pointer"
            >
              {language === 'hi' ? 'संख्या बदलें' : 'Edit Number'}
            </button>
            <button
              type="button"
              onClick={() => adjustValue('weightKg', 1)}
              className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-black text-xl flex items-center justify-center cursor-pointer border border-slate-300"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calculated BMI Display (Non-Diagnostic) */}
      {vitals.bmi && (
        <div className="mt-8 max-w-md mx-auto p-5 bg-teal-50 border-2 border-teal-200 rounded-3xl text-center space-y-1 shadow-sm">
          <span className="text-xs font-black uppercase tracking-wider text-teal-800">
            {t('bmiLabel')}
          </span>
          <div className="text-4xl font-black font-mono text-teal-900">
            {vitals.bmi}
          </div>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            {t('bmiReferenceNotice')}
          </p>
        </div>
      )}

      {/* Keypad Modal when a value is edited directly */}
      {activeField && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-slate-300 shadow-2xl space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-900 uppercase">
                {activeField === 'heightCm' ? t('heightLabel') : t('weightLabel')}
              </h3>
              <div className="mt-2 text-5xl font-black font-mono text-teal-800 py-3 bg-slate-50 rounded-2xl border-2 border-teal-500">
                {tempInput || '0'}
              </div>
            </div>

            <NumericKeypad
              onKeyPress={handleKeypadDigit}
              onBackspace={handleKeypadBackspace}
              onClear={handleKeypadClear}
              onSubmit={handleKeypadSubmit}
              submitLabel={t('confirm')}
            />

            <button
              type="button"
              onClick={() => setActiveField(null)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 cursor-pointer"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => setScreen('SYMPTOMS')}
          className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-lg rounded-2xl border-2 border-slate-300 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={() => setScreen(assessmentTrack === 'ayurveda' ? 'AYURVEDA' : 'HISTORY')}
          className="min-w-[200px] px-8 py-5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-black text-xl rounded-2xl border-2 border-teal-800 shadow-xl flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>{t('continue')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
