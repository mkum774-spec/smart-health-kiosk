import React from 'react';
import { UserPlus, UserCheck, AlertOctagon, ShieldCheck, ChevronRight, FolderOpen } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';

export const HomeScreen: React.FC = () => {
  const { 
    setScreen, 
    triggerEmergencyRequest, 
    language, 
    t, 
    loadPresetPatient 
  } = useKiosk();

  const handleStartNew = () => {
    setScreen('ABHA');
  };

  const handleExistingPatient = () => {
    loadPresetPatient(0);
    setScreen('ABHA');
  };

  const handleOpenPatientPortal = () => {
    setScreen('PATIENT_LOGIN');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col justify-between min-h-[calc(100vh-140px)] select-none">
      {/* Top Welcoming Section */}
      <div className="text-center space-y-3">
        <p className="text-lg sm:text-xl font-bold text-teal-800 tracking-wide uppercase">
          {t('kioskTitle')}
        </p>

        {/* Big Warm Hindi Greeting */}
        <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight py-1 font-serif">
          {t('hindiGreeting')}
        </div>

        {/* Clean Welcome Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-700">
          {t('welcomeTitle')}
        </h1>
      </div>

      {/* Primary Action Buttons (Touch First, Large targets) */}
      <div className="my-8 space-y-4 max-w-2xl mx-auto w-full">
        {/* 1. Start New Registration */}
        <button
          type="button"
          onClick={handleStartNew}
          className="w-full min-h-[96px] p-6 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-3xl border-2 border-teal-800 shadow-xl flex items-center justify-between gap-4 cursor-pointer transition-all active:scale-[0.99] group"
        >
          <div className="flex items-center gap-5 text-left">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center flex-shrink-0 text-white shadow-inner">
              <UserPlus className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight">
                {t('startNewReg')}
              </div>
              <div className="text-sm sm:text-base text-teal-100 font-semibold mt-0.5">
                {t('startNewRegSub')}
              </div>
            </div>
          </div>
          <ChevronRight className="w-8 h-8 text-teal-200 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </button>

        {/* 2. Existing Patient / ABHA Check-in */}
        <button
          type="button"
          onClick={handleExistingPatient}
          className="w-full min-h-[92px] p-6 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 rounded-3xl border-2 border-slate-300 shadow-md flex items-center justify-between gap-4 cursor-pointer transition-all active:scale-[0.99] group"
        >
          <div className="flex items-center gap-5 text-left">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center flex-shrink-0 text-sky-800 border border-sky-200">
              <UserCheck className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight">
                {t('existingPatient')}
              </div>
              <div className="text-sm sm:text-base text-slate-600 font-semibold mt-0.5">
                {t('existingPatientSub')}
              </div>
            </div>
          </div>
          <ChevronRight className="w-8 h-8 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </button>

        {/* 3. View My Records / Patient Portal */}
        <button
          type="button"
          onClick={handleOpenPatientPortal}
          className="w-full min-h-[88px] p-5 bg-teal-50/70 hover:bg-teal-100 active:bg-teal-200/80 text-teal-950 rounded-3xl border-2 border-teal-300 shadow-md flex items-center justify-between gap-4 cursor-pointer transition-all active:scale-[0.99] group"
        >
          <div className="flex items-center gap-5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-800 border border-teal-300 shadow-sm">
              <FolderOpen className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'hi' ? '📁 पुराने रिकॉर्ड / पिछले परामर्श' : '📁 Existing Records / View Past Visits'}
              </div>
              <div className="text-xs sm:text-sm text-teal-800 font-semibold mt-0.5">
                {language === 'hi' ? 'पूर्व ओपीडी पर्चे, जांच रिपोर्ट व टोकन देखें' : 'View previous OPD visits, prescriptions & tokens'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-7 h-7 text-teal-700 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </button>

        {/* 3. EMERGENCY ASSISTANCE (Frictionless, High-Contrast Red) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={triggerEmergencyRequest}
            className="w-full min-h-[96px] p-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-3xl border-4 border-red-700 shadow-xl shadow-red-200 flex items-center justify-between gap-4 cursor-pointer transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-5 text-left">
              <div className="w-16 h-16 rounded-2xl bg-red-700 flex items-center justify-center flex-shrink-0 text-white shadow-inner animate-pulse">
                <AlertOctagon className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black tracking-wider uppercase">
                  {t('emergencyBtn')}
                </div>
                <div className="text-sm sm:text-base text-red-100 font-bold mt-0.5">
                  {t('emergencyBtnSub')}
                </div>
              </div>
            </div>
            <div className="bg-red-700 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider text-white border border-red-500 flex-shrink-0">
              {language === 'hi' ? 'तुरंत सहायता' : 'Immediate Help'}
            </div>
          </button>
        </div>
      </div>

      {/* Footer Reassurance */}
      <div className="pt-4 border-t border-slate-200 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0" />
          <span>{t('reassuranceText')}</span>
        </div>
      </div>
    </div>
  );
};
