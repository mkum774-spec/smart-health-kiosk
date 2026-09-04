import React from 'react';
import { X, Type, Contrast, Mic, Sparkles, Moon } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';

interface AccessibilityModalProps {
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ onClose }) => {
  const { accessibility, updateAccessibility, darkMode, toggleDarkMode, language, t } = useKiosk();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full border-2 border-slate-300 dark:border-slate-700 shadow-2xl animate-fade-in transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {t('accModalTitle')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3.5 py-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-300 rounded-2xl flex items-center justify-center border border-indigo-300 dark:border-indigo-700">
                <Moon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{t('darkMode')}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('darkModeDesc')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`w-16 h-9 rounded-full transition-colors relative cursor-pointer ${
                darkMode ? 'bg-teal-700' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={t('darkMode')}
            >
              <div 
                className={`w-7 h-7 bg-white rounded-full absolute top-1 transition-transform shadow-md ${
                  darkMode ? 'right-1' : 'left-1'
                }`} 
              />
            </button>
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 rounded-2xl flex items-center justify-center border border-sky-300 dark:border-sky-700">
                <Type className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{t('accLargeText')}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('accLargeTextDesc')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateAccessibility({ largeText: !accessibility.largeText })}
              className={`w-16 h-9 rounded-full transition-colors relative cursor-pointer ${
                accessibility.largeText ? 'bg-teal-700' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={t('accLargeText')}
            >
              <div 
                className={`w-7 h-7 bg-white rounded-full absolute top-1 transition-transform shadow-md ${
                  accessibility.largeText ? 'right-1' : 'left-1'
                }`} 
              />
            </button>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 rounded-2xl flex items-center justify-center border border-amber-300 dark:border-amber-700">
                <Contrast className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{t('accHighContrast')}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('accHighContrastDesc')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
              className={`w-16 h-9 rounded-full transition-colors relative cursor-pointer ${
                accessibility.highContrast ? 'bg-teal-700' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={t('accHighContrast')}
            >
              <div 
                className={`w-7 h-7 bg-white rounded-full absolute top-1 transition-transform shadow-md ${
                  accessibility.highContrast ? 'right-1' : 'left-1'
                }`} 
              />
            </button>
          </div>

          {/* Voice Guidance */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 rounded-2xl flex items-center justify-center border border-emerald-300 dark:border-emerald-700">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{t('accVoiceGuidance')}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('accVoiceGuidanceDesc')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateAccessibility({ voiceGuidance: !accessibility.voiceGuidance })}
              className={`w-16 h-9 rounded-full transition-colors relative cursor-pointer ${
                accessibility.voiceGuidance ? 'bg-teal-700' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={t('accVoiceGuidance')}
            >
              <div 
                className={`w-7 h-7 bg-white rounded-full absolute top-1 transition-transform shadow-md ${
                  accessibility.voiceGuidance ? 'right-1' : 'left-1'
                }`} 
              />
            </button>
          </div>

          {/* Simplified Mode */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 rounded-2xl flex items-center justify-center border border-purple-300 dark:border-purple-700">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{t('accSimplified')}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('accSimplifiedDesc')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateAccessibility({ simplifiedMode: !accessibility.simplifiedMode })}
              className={`w-16 h-9 rounded-full transition-colors relative cursor-pointer ${
                accessibility.simplifiedMode ? 'bg-teal-700' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={t('accSimplified')}
            >
              <div 
                className={`w-7 h-7 bg-white rounded-full absolute top-1 transition-transform shadow-md ${
                  accessibility.simplifiedMode ? 'right-1' : 'left-1'
                }`} 
              />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold text-xl rounded-2xl border-2 border-teal-800 shadow-md cursor-pointer transition-all"
        >
          {language === 'hi' ? 'सेटिंग्स लागू करें' : 'Apply Settings'}
        </button>
      </div>
    </div>
  );
};
