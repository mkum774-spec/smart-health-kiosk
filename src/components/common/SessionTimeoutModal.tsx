import React from 'react';
import { Clock, RotateCcw, UserCheck } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';

export const SessionTimeoutModal: React.FC = () => {
  const { 
    inactivityWarning, 
    inactivitySecondsLeft, 
    extendSession, 
    resetKioskSession, 
    t, 
    language 
  } = useKiosk();

  if (!inactivityWarning) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full border-4 border-amber-400 shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center border-4 border-amber-300 animate-pulse">
          <Clock className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-3xl font-black text-slate-900 mb-2">
            {t('sessionTimeoutTitle')}
          </h3>
          <p className="text-lg text-slate-600 font-semibold">
            {t('sessionTimeoutDesc')}
          </p>
        </div>

        {/* Large Visible Countdown */}
        <div className="py-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-1">
            {t('resettingIn')}
          </span>
          <div className="text-7xl sm:text-8xl font-black font-mono text-amber-600 tracking-tight animate-pulse">
            {inactivitySecondsLeft}
          </div>
        </div>

        {/* Primary Action: Very Large "I'm Still Here" button */}
        <button
          type="button"
          onClick={extendSession}
          className="w-full min-h-[80px] py-5 px-8 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-black text-2xl rounded-2xl border-2 border-teal-800 shadow-xl cursor-pointer transition-all flex items-center justify-center gap-3 active:scale-98"
        >
          <UserCheck className="w-8 h-8" />
          <span>{t('imStillHereBtn')}</span>
        </button>

        {/* Secondary Action: End Session Now */}
        <div>
          <button
            type="button"
            onClick={() => resetKioskSession(true)}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-bold text-sm rounded-xl border border-slate-300 cursor-pointer transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('resetNowBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
