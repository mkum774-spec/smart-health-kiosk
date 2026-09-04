import React, { useState } from 'react';
import { 
  Volume2, 
  Eye, 
  HelpCircle, 
  WifiOff, 
  Activity, 
  AlertTriangle,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { AccessibilityModal } from './AccessibilityModal';

const STEP_MAP: Record<string, { current: number; total: number }> = {
  HOME: { current: 0, total: 8 },
  EMERGENCY: { current: 1, total: 1 },
  ABHA: { current: 1, total: 8 },
  ASSESSMENT_TYPE: { current: 2, total: 8 },
  PAST_RECORDS: { current: 2, total: 8 },
  CONSENT: { current: 2, total: 8 },
  SYMPTOMS: { current: 3, total: 8 },
  VITALS: { current: 4, total: 8 },
  AYURVEDA: { current: 5, total: 8 },
  HISTORY: { current: 5, total: 8 },
  DOCUMENTS: { current: 6, total: 8 },
  REVIEW: { current: 7, total: 8 },
  TOKEN: { current: 8, total: 8 },
  QUEUE: { current: 8, total: 8 },
};

export const KioskHeader: React.FC = () => {
  const { 
    currentScreen, 
    language, 
    setLanguage, 
    t, 
    repeatCurrentAudio, 
    isOffline, 
    resetKioskSession,
    accessibility,
    darkMode,
    toggleDarkMode
  } = useKiosk();

  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const stepInfo = STEP_MAP[currentScreen] || { current: 0, total: 8 };
  const showSteps = currentScreen !== 'HOME' && currentScreen !== 'EMERGENCY' && currentScreen !== 'QUEUE';

  return (
    <>
      <header className="w-full bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-30 px-4 sm:px-6 py-3 select-none transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* LEFT: Generic Hospital Brand */}
          <div className="flex items-center gap-3 min-w-[200px] sm:min-w-[240px]">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-md border-2 border-teal-800 flex-shrink-0">
              <Activity className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {t('kioskTitle')}
                </span>
                {isOffline && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                    <WifiOff className="w-3 h-3" />
                    {t('offlineLimited')}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-teal-800 dark:text-teal-400">
                {t('kioskSubtitle')}
              </p>
            </div>
          </div>

          {/* CENTER: Step Indicator (Hidden on Home screen) */}
          <div className="flex-1 flex justify-center items-center">
            {showSteps && (
              <div className="bg-slate-100 dark:bg-slate-800 px-4 sm:px-5 py-1.5 sm:py-2 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-inner">
                <span className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300">
                  {t('step')} <span className="text-teal-800 dark:text-teal-400 text-lg sm:text-xl font-black">{stepInfo.current}</span> {t('of')} {stepInfo.total}
                </span>
                <div className="w-20 sm:w-28 h-2 sm:h-2.5 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-700 dark:bg-teal-500 transition-all duration-300 rounded-full"
                    style={{ width: `${(stepInfo.current / stepInfo.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {currentScreen === 'EMERGENCY' && (
              <div className="bg-red-50 dark:bg-red-950/60 border-2 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 font-black text-sm animate-pulse">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>{language === 'hi' ? 'आपातकालीन मोड' : 'Emergency Mode'}</span>
              </div>
            )}
          </div>

          {/* RIGHT: Language, Audio Repeat, Accessibility, Dark Mode, Help, Exit */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 sm:py-2 rounded-xl text-sm sm:text-base font-black transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-teal-700 text-white shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 sm:py-2 rounded-xl text-sm sm:text-base font-black transition-all cursor-pointer ${
                  language === 'hi' 
                    ? 'bg-teal-700 text-white shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Repeat Audio Button */}
            <button
              type="button"
              onClick={repeatCurrentAudio}
              className="flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-900 dark:text-sky-200 border-2 border-sky-300 dark:border-sky-800 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-sm cursor-pointer"
              title={t('repeatAudio')}
              aria-label={t('repeatAudio')}
            >
              <Volume2 className="w-5 h-5 text-sky-700 dark:text-sky-300 stroke-[2.5]" />
              <span className="hidden md:inline">{t('repeatAudio')}</span>
            </button>

            {/* Accessibility Button */}
            <button
              type="button"
              onClick={() => setShowAccessibilityModal(true)}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 border-2 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-sm cursor-pointer ${
                accessibility.highContrast || accessibility.largeText
                  ? 'bg-amber-100 border-amber-500 text-amber-950 dark:bg-amber-950 dark:border-amber-500 dark:text-amber-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200'
              }`}
              title={t('accessibility')}
              aria-label={t('accessibility')}
            >
              <Eye className="w-5 h-5 stroke-[2.5]" />
              <span className="hidden lg:inline">{t('accessibility')}</span>
            </button>

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`flex items-center gap-1.5 p-2 sm:p-2.5 sm:px-3 border-2 rounded-2xl font-bold text-sm sm:text-base transition-all cursor-pointer shadow-sm ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 border-amber-400 text-amber-300 shadow-amber-950/20'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
              title={darkMode ? t('switchToLight') : t('switchToDark')}
              aria-label={darkMode ? t('switchToLight') : t('switchToDark')}
            >
              {darkMode ? (
                <>
                  <Sun className="w-5 h-5 text-amber-300 stroke-[2.5]" />
                  <span className="hidden xl:inline text-xs font-black uppercase tracking-wider text-amber-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-slate-700 stroke-[2.5]" />
                  <span className="hidden xl:inline text-xs font-black uppercase tracking-wider text-slate-700">Dark</span>
                </>
              )}
            </button>

            {/* Help Button */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl transition-all cursor-pointer"
              title={t('help')}
              aria-label={t('help')}
            >
              <HelpCircle className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Exit Button (when in registration flow) */}
            {currentScreen !== 'HOME' && (
              <button
                type="button"
                onClick={() => resetKioskSession(false)}
                className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 border-2 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl font-bold text-sm sm:text-base transition-all cursor-pointer"
                title={t('exit')}
              >
                <LogOut className="w-4 h-4 text-rose-700 dark:text-rose-300" />
                <span className="hidden sm:inline">{t('exit')}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Accessibility Modal */}
      {showAccessibilityModal && (
        <AccessibilityModal onClose={() => setShowAccessibilityModal(false)} />
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-slate-300 dark:border-slate-700 shadow-2xl">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <HelpCircle className="w-7 h-7 text-teal-700 dark:text-teal-400" />
              <span>{language === 'hi' ? 'कियोस्क सहायता केंद्र' : 'Kiosk Assistant & Support'}</span>
            </h3>
            <p className="text-base text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
              {language === 'hi'
                ? "यदि आपको किसी चरण में कठिनाई हो रही है, तो आप 'निर्देश सुनें' दबा सकते हैं। यदि आप स्वयं फॉर्म नहीं भर सकते, तो ओपीडी स्वागत काउंटर #1 पर उपस्थित स्वास्थ्य मित्र आपकी सहायता करेंगे।"
                : "If you need assistance at any step, tap 'Listen / Repeat' to hear instructions aloud. Hospital Swasthya Mitras are also stationed at OPD Desk #1 to assist you in person."}
            </p>
            <div className="bg-teal-50 dark:bg-teal-950/50 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-4 mb-6">
              <p className="text-sm font-bold text-teal-950 dark:text-teal-200">
                {language === 'hi'
                  ? "🚨 आपातकाल के लिए मुख्य पृष्ठ पर स्थित लाल 'आपातकालीन सहायता' बटन को किसी भी समय दबा सकते हैं।"
                  : "🚨 For acute emergencies, tap the RED Emergency button on the home screen immediately."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-lg rounded-2xl border-2 border-teal-800 shadow-md cursor-pointer"
            >
              {language === 'hi' ? 'समझ गया / बंद करें' : 'Got it — Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
