import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Volume2, 
  Printer, 
  QrCode, 
  MapPin, 
  ArrowRight, 
  Home, 
  Users, 
  Info 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { voiceEngine } from '../../services/voiceEngine';

export const TokenScreen: React.FC = () => {
  const { 
    generatedToken, 
    setScreen, 
    resetKioskSession, 
    language, 
    t 
  } = useKiosk();

  const [isPrinted, setIsPrinted] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const token = generatedToken || {
    id: "fallback",
    tokenNumber: "TK-1001",
    departmentName: "General Medicine",
    assignedRoom: "Room 204",
    queuePosition: 6,
    patient: { name: "Demo Patient P001", abhaNumber: "DEMO-ABHA-P001" },
    triageLevel: "ROUTINE",
    timestamp: new Date().toISOString()
  };

  const isEmergency = token.triageLevel === 'EMERGENCY';
  const isUrgent = token.triageLevel === 'URGENT';

  const handleAnnounce = () => {
    voiceEngine.playChime('tap');
    const msg = language === 'hi'
      ? `ध्यान दें। टोकन नंबर ${token.tokenNumber}। कृपया विभाग ${token.departmentName}, कक्ष ${token.assignedRoom} में जाएं। अपना टोकन नंबर पुकारे जाने तक प्रतीक्षा करें।`
      : `Attention please. Token number ${token.tokenNumber}. Please proceed to ${token.departmentName}, ${token.assignedRoom}. Please wait until your token is called.`;
    voiceEngine.speak(msg, language);
  };

  const handlePrint = () => {
    voiceEngine.playChime('success');
    setIsPrinted(true);
    setTimeout(() => {
      setIsPrinted(false);
    }, 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{language === 'hi' ? 'पंजीकरण पूर्ण' : 'Registration Completed'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('tokenTitle')}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-semibold mt-1">
          {t('tokenSubtitle')}
        </p>
      </div>

      {/* High-Legibility Outpatient Token Card */}
      <div className={`rounded-3xl p-6 sm:p-8 border-4 shadow-2xl space-y-6 ${
        isEmergency 
          ? 'bg-red-50 border-red-500' 
          : isUrgent 
          ? 'bg-amber-50 border-amber-500' 
          : 'bg-white border-teal-700'
      }`}>
        {/* Token Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-200 pb-4 gap-2">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 block">
              {language === 'hi' ? 'स्मार्ट स्वास्थ्य कियोस्क पर्ची' : 'SMART HEALTH KIOSK DIGITAL TOKEN'}
            </span>
            <span className="text-lg font-black text-slate-900">
              {token.patient?.name || 'Walk-in Patient'}
            </span>
          </div>

          <div className="text-xs font-mono font-bold text-slate-600">
            {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* The Huge Token Number (Readable from distance) */}
        <div className="text-center py-4">
          <span className="text-sm font-black text-slate-500 uppercase tracking-widest block mb-1">
            {t('tokenNumber')}
          </span>
          <div className={`text-8xl sm:text-9xl font-black font-mono tracking-tight ${
            isEmergency ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-teal-800'
          }`}>
            {token.tokenNumber}
          </div>
        </div>

        {/* Room & Department Grid (Without Estimated Time) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t-2 border-slate-200 text-center">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-black text-slate-500 uppercase block">{t('department')}</span>
            <span className="text-xl font-black text-slate-900 block mt-1">{token.departmentName}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-black text-slate-500 uppercase block">{t('assignedRoom')}</span>
            <span className="text-2xl font-black text-teal-800 block mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-5 h-5 text-teal-700" />
              {token.assignedRoom}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-black text-slate-500 uppercase block">{t('patientsAhead')}</span>
            <span className="text-2xl font-black text-slate-900 block mt-1 flex items-center justify-center gap-1">
              <Users className="w-5 h-5 text-teal-700" />
              {token.queuePosition || 6}
            </span>
          </div>
        </div>

        {/* Queue Notice (Objective wait guidance) */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 text-center">
          {t('queueWaitNotice')}
        </div>

        {/* Utility Actions: Audio, Print, QR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Announce Audio */}
          <button
            type="button"
            onClick={handleAnnounce}
            className="p-4 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 text-sky-950 font-bold text-base rounded-2xl border-2 border-sky-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Volume2 className="w-5 h-5 text-sky-700" />
            <span>{t('announceAudioBtn')}</span>
          </button>

          {/* Print Slip */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-base rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Printer className="w-5 h-5 text-slate-700" />
            <span>{isPrinted ? (language === 'hi' ? 'प्रिंट हो रहा है...' : 'Printing...') : t('printTokenBtn')}</span>
          </button>

          {/* QR Code */}
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="p-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-base rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <QrCode className="w-5 h-5 text-slate-700" />
            <span>{language === 'hi' ? '📱 मोबाइल QR' : '📱 Mobile QR'}</span>
          </button>
        </div>
      </div>

      {/* Forward Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setScreen('QUEUE')}
          className="w-full sm:w-auto px-8 py-5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-black text-xl rounded-2xl border-2 border-teal-800 shadow-xl flex items-center justify-center gap-3 cursor-pointer"
        >
          <Users className="w-6 h-6" />
          <span>{t('viewLiveQueueBtn')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => resetKioskSession(false)}
          className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-lg rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span>{t('doneFinishSessionBtn')}</span>
        </button>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full border-2 border-slate-300 shadow-2xl text-center space-y-4">
            <h3 className="text-2xl font-black text-slate-900">
              {language === 'hi' ? 'मोबाइल लाइव कतार' : 'Track on Mobile'}
            </h3>
            <div className="w-48 h-48 mx-auto bg-slate-100 rounded-2xl border-2 border-slate-300 flex items-center justify-center p-3 shadow-inner">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                <rect width="100" height="100" fill="white" />
                <path d="M10 10h30v30h-30z M15 15h20v20h-20z M20 20h10v10h-10z" fill="currentColor" />
                <path d="M60 10h30v30h-30z M65 15h20v20h-20z M70 20h10v10h-10z" fill="currentColor" />
                <path d="M10 60h30v30h-30z M15 65h20v20h-20z M20 70h10v10h-10z" fill="currentColor" />
                <circle cx="50" cy="50" r="8" fill="#0d9488" />
                <rect x="45" y="15" width="10" height="20" fill="currentColor" />
                <rect x="65" y="45" width="25" height="10" fill="currentColor" />
                <rect x="55" y="65" width="15" height="25" fill="currentColor" />
                <rect x="75" y="75" width="15" height="15" fill="currentColor" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-600">
              {t('takeToPhoneQR')}
            </p>
            <p className="text-xs text-slate-400 font-mono">
              TOKEN: {token.tokenNumber}
            </p>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-base rounded-xl"
            >
              {language === 'hi' ? 'बंद करें' : 'Close QR'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
