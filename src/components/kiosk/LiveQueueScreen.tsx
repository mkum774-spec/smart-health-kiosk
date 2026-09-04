import React from 'react';
import { 
  Users, 
  MapPin, 
  Volume2, 
  Home, 
  Radio 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { voiceEngine } from '../../services/voiceEngine';

export const LiveQueueScreen: React.FC = () => {
  const { 
    generatedToken, 
    queue, 
    resetKioskSession, 
    language, 
    t 
  } = useKiosk();

  const myToken = generatedToken ? generatedToken.tokenNumber : "TK-1001";
  const myDept = generatedToken ? generatedToken.departmentName : "General Medicine";
  const myRoom = generatedToken ? generatedToken.assignedRoom : "Room 204";

  // Filter department queue
  const deptQueue = queue.filter(q => q.departmentName === myDept && q.status !== 'COMPLETED');
  const nowServingItem = deptQueue.find(q => q.status === 'CALLED' || q.status === 'IN_CONSULTATION') || deptQueue[0];
  const nowServingToken = nowServingItem ? nowServingItem.tokenNumber : "TK-1000";

  // Calculate patients ahead
  const myIndex = deptQueue.findIndex(q => q.tokenNumber === myToken);
  const patientsAhead = myIndex > 0 ? myIndex : 5;

  const announceTurn = () => {
    voiceEngine.playChime('tap');
    const msg = language === 'hi'
      ? `वर्तमान में देखा जा रहा है टोकन नंबर ${nowServingToken}। आपका टोकन ${myToken} है। आपसे आगे ${patientsAhead} मरीज हैं। कृपया अपना टोकन पुकारे जाने तक प्रतीक्षा करें।`
      : `Currently serving token ${nowServingToken}. Your token is ${myToken}. There are ${patientsAhead} patients ahead of you. Please wait until your token is called.`;
    voiceEngine.speak(msg, language);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 select-none">
      {/* Title & Live Broadcast Badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 text-red-900 border border-red-300 rounded-full text-xs font-black uppercase tracking-wider mb-2 animate-pulse">
          <Radio className="w-3.5 h-3.5 text-red-600" />
          <span>{language === 'hi' ? 'लाइव ओपीडी प्रसारण' : 'Live OPD Board Sync'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('queueTitle')}
        </h2>
        <p className="text-lg text-slate-600 font-semibold mt-1">
          {myDept} • {myRoom}
        </p>
      </div>

      {/* KPI Cards: Currently Serving vs Your Token */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Currently Serving Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 border-4 border-slate-800 shadow-2xl text-center space-y-2">
          <span className="text-sm font-black uppercase tracking-widest text-teal-400">
            {t('nowServing')}
          </span>
          <div className="text-7xl sm:text-8xl font-black font-mono text-white tracking-tight">
            {nowServingToken}
          </div>
          <p className="text-xs font-bold text-slate-400">
            {language === 'hi' ? 'परामर्श कक्ष में उपस्थित' : 'Currently with attending doctor'}
          </p>
        </div>

        {/* Your Token Card */}
        <div className="bg-teal-700 text-white rounded-3xl p-8 border-4 border-teal-800 shadow-2xl text-center space-y-2">
          <span className="text-sm font-black uppercase tracking-widest text-teal-200">
            {t('yourToken')}
          </span>
          <div className="text-7xl sm:text-8xl font-black font-mono text-white tracking-tight">
            {myToken}
          </div>
          <p className="text-xs font-bold text-teal-100">
            {myRoom} • {language === 'hi' ? 'प्रतीक्षा क्षेत्र में बैठें' : 'Please remain in waiting lounge'}
          </p>
        </div>
      </div>

      {/* Queue Details: Patients Ahead & Status Notice (No false wait times) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center max-w-md mx-auto">
          <span className="text-xs font-black text-slate-500 uppercase block mb-1">
            {t('patientsAhead')}
          </span>
          <div className="text-6xl font-black text-slate-900 font-mono flex items-center justify-center gap-2">
            <Users className="w-9 h-9 text-teal-700" />
            <span>{patientsAhead}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-500 text-center max-w-xl mx-auto">
          {t('queueWaitNotice')}
        </p>

        {/* Live Queue Tape */}
        <div className="pt-2">
          <h4 className="text-xs font-black text-slate-500 mb-3 uppercase tracking-wider">
            {language === 'hi' ? 'कतार स्थिति क्रम:' : 'Department Queue Order:'}
          </h4>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {deptQueue.slice(0, 6).map((item, idx) => {
              const isMine = item.tokenNumber === myToken;
              const isServing = item.tokenNumber === nowServingToken;
              return (
                <div
                  key={item.id}
                  className={`flex-shrink-0 px-5 py-3 rounded-2xl border-2 text-center transition-all ${
                    isMine
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md'
                      : isServing
                      ? 'bg-slate-900 text-teal-300 border-slate-950 font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-xs font-mono opacity-80 block">#{idx + 1}</span>
                  <span className="text-xl font-black font-mono">{item.tokenNumber}</span>
                  <span className="text-[10px] block font-bold uppercase mt-0.5">
                    {isServing ? 'Now Serving' : isMine ? 'You' : item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={announceTurn}
          className="w-full sm:w-auto px-6 py-4 bg-sky-50 hover:bg-sky-100 text-sky-950 font-bold text-base rounded-2xl border-2 border-sky-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Volume2 className="w-5 h-5 text-sky-700" />
          <span>{language === 'hi' ? 'कतार स्थिति सुनें' : 'Announce Status Aloud'}</span>
        </button>

        <button
          type="button"
          onClick={() => resetKioskSession(false)}
          className="w-full sm:w-auto px-8 py-5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-black text-xl rounded-2xl border-2 border-teal-800 shadow-xl flex items-center justify-center gap-3 cursor-pointer"
        >
          <Home className="w-6 h-6" />
          <span>{t('stepBackToHome')}</span>
        </button>
      </div>
    </div>
  );
};
