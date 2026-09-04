import React from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Volume2, 
  Home 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { TouchButton } from '../common/TouchButton';

export const EmergencyScreen: React.FC = () => {
  const { 
    activeEmergencyRequest, 
    repeatCurrentAudio, 
    resetKioskSession, 
    language, 
    t 
  } = useKiosk();

  const req = activeEmergencyRequest || {
    id: "emg-fallback",
    tokenNumber: "E-104",
    kioskId: "Kiosk 03 (Ground Floor OPD)",
    timestamp: new Date().toISOString(),
    timeFormatted: "Just Now",
    status: 'AWAITING_ASSESSMENT',
    assignedRoom: undefined
  };

  const isAcceptedCasualty = req.status === 'ACCEPTED_CASUALTY';
  const isRedirectedPriority = req.status === 'REDIRECTED_PRIORITY';
  const isAwaiting = req.status === 'AWAITING_ASSESSMENT';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[calc(100vh-160px)] select-none">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-100 text-red-900 border-2 border-red-300 rounded-2xl text-lg font-black uppercase tracking-wider animate-pulse">
          <AlertOctagon className="w-6 h-6 text-red-600" />
          <span>{language === 'hi' ? '🚨 आपातकालीन सहायता सक्रिय' : '🚨 Emergency Request Active'}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900">
          {isAcceptedCasualty 
            ? (language === 'hi' ? 'कैजुअल्टी में स्वीकृत' : 'Accepted for Casualty Care')
            : isRedirectedPriority
            ? (language === 'hi' ? 'प्राथमिकता ओपीडी में भेजा गया' : 'Redirected to Priority OPD')
            : t('emergencyTitle')}
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-slate-700 max-w-2xl mx-auto">
          {isAcceptedCasualty
            ? t('emergencyProceedCasualty')
            : isRedirectedPriority
            ? t('emergencyProceedPriority')
            : t('emergencySubtitle')}
        </p>
      </div>

      {/* Main Status & Token Card */}
      <div className="my-8 bg-white rounded-3xl p-8 border-4 border-slate-200 shadow-2xl relative overflow-hidden">
        {/* Status Indicator Stripe */}
        <div className={`absolute top-0 left-0 right-0 h-4 ${
          isAcceptedCasualty ? 'bg-red-600' : isRedirectedPriority ? 'bg-amber-500' : 'bg-red-500 animate-pulse'
        }`} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Big Emergency Token */}
          <div className="text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-8">
            <span className="text-sm font-black text-slate-500 uppercase tracking-widest">
              {t('emergencyTokenLabel')}
            </span>
            <div className="text-7xl sm:text-8xl font-black text-red-600 tracking-tight font-mono">
              {req.tokenNumber}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-base font-bold text-slate-700">
              <MapPin className="w-5 h-5 text-teal-700" />
              <span>{req.kioskId}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-semibold text-slate-500">
              <Clock className="w-4 h-4" />
              <span>{language === 'hi' ? 'अनुरोध समय' : 'Requested'}: {req.timeFormatted}</span>
            </div>
          </div>

          {/* Right Column: Live Clinical Assessment Status */}
          <div className="space-y-5">
            <div>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {language === 'hi' ? 'चिकित्सकीय समीक्षा स्थिति' : 'Clinical Assessment Status'}
              </span>

              {isAwaiting && (
                <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center gap-3">
                  <div className="w-6 h-6 border-4 border-amber-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-lg font-black text-amber-950">
                      {t('emergencyStatusAwaiting')}
                    </p>
                    <p className="text-sm font-medium text-amber-800 mt-0.5">
                      {language === 'hi' 
                        ? 'ड्यूटी डॉक्टर/नर्स द्वारा आपके अनुरोध का मूल्यांकन किया जा रहा है।' 
                        : 'Attending triage nurse / doctor is evaluating your alert right now.'}
                    </p>
                  </div>
                </div>
              )}

              {isAcceptedCasualty && (
                <div className="p-5 bg-red-50 border-3 border-red-500 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3 text-red-700">
                    <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                    <div>
                      <p className="text-2xl font-black text-red-900">
                        {language === 'hi' ? 'कैजुअल्टी कक्ष C-02 में जाएं' : 'Proceed to Casualty Room C-02'}
                      </p>
                      <p className="text-sm font-bold text-red-700">
                        {language === 'hi' ? 'आपातकालीन टीम प्रतीक्षा कर रही है' : 'Trauma response team is ready'}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-red-200 text-sm font-bold text-slate-800 flex items-center justify-between">
                    <span>{language === 'hi' ? 'निर्देश' : 'Directions'}:</span>
                    <span className="text-red-700 font-extrabold">{language === 'hi' ? 'ग्राउंड फ्लोर, लिफ्ट के सामने' : 'Ground Floor, Opposite Lift B'}</span>
                  </div>
                </div>
              )}

              {isRedirectedPriority && (
                <div className="p-5 bg-amber-50 border-3 border-amber-500 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3 text-amber-800">
                    <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                    <div>
                      <p className="text-2xl font-black text-amber-950">
                        {language === 'hi' ? 'प्राथमिकता ओपीडी कक्ष 105' : 'Proceed to Priority OPD Room 105'}
                      </p>
                      <p className="text-sm font-bold text-amber-800">
                        {language === 'hi' ? 'त्वरित डॉक्टर परामर्श' : 'Expedited Doctor Consultation'}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-amber-200 text-sm font-bold text-slate-800 flex items-center justify-between">
                    <span>{language === 'hi' ? 'निर्देश' : 'Directions'}:</span>
                    <span className="text-amber-800 font-extrabold">{language === 'hi' ? 'पहला तल (1st Floor), रूम 105' : 'First Floor, Room 105'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-extrabold text-slate-800">
                {language === 'hi' ? '⚠️ सुरक्षा और नैदानिक प्रोटोकॉल:' : '⚠️ Safety & Triage Protocol:'}
              </p>
              <p>
                {language === 'hi'
                  ? 'कियोस्क कोई स्वचालित बीमारी का निदान नहीं करता। अंतिम नैदानिक निर्णय ड्यूटी पर उपस्थित डॉक्टर द्वारा लिया जाता है।'
                  : 'This kiosk provides preliminary staff triage notification. Final medical decisions remain strictly with attending hospital doctors.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation: Listen Audio or Finish */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={repeatCurrentAudio}
          className="w-full sm:w-auto px-8 py-4 bg-sky-100 hover:bg-sky-200 text-sky-950 font-black text-lg rounded-2xl border-2 border-sky-300 flex items-center justify-center gap-3 cursor-pointer shadow-sm"
        >
          <Volume2 className="w-6 h-6 text-sky-800" />
          <span>{t('repeatAudio')}</span>
        </button>

        <button
          type="button"
          onClick={() => resetKioskSession(false)}
          className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span>{language === 'hi' ? 'सत्र समाप्त करें (होम)' : 'Finish Session (Home)'}</span>
        </button>
      </div>
    </div>
  );
};
