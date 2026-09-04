import React from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { EmergencyRequest } from '../../types';

interface EmergencyAlertPanelProps {
  onSelectRequest?: (req: EmergencyRequest) => void;
}

export const EmergencyAlertPanel: React.FC<EmergencyAlertPanelProps> = ({ onSelectRequest }) => {
  const { 
    emergencyRequests, 
    staffAcceptCasualty, 
    staffRedirectPriority 
  } = useKiosk();

  const pendingList = emergencyRequests.filter(e => e.status === 'AWAITING_ASSESSMENT');
  const resolvedList = emergencyRequests.filter(e => e.status !== 'AWAITING_ASSESSMENT');

  if (pendingList.length === 0 && resolvedList.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 text-center text-slate-500">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
        <p className="font-bold text-slate-700">No Active Emergency Requests</p>
        <p className="text-xs text-slate-500">All outpatient kiosks operating normally.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 select-none">
      {/* Pending Active Emergencies Banner (Unmissable Red Card) */}
      {pendingList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-red-600 flex items-center gap-2 uppercase tracking-wide">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
              <span>🚨 Active Emergency Requests ({pendingList.length})</span>
            </h3>
            <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full animate-pulse border border-red-300">
              Immediate Clinical Assessment Required
            </span>
          </div>

          {pendingList.map((req) => (
            <div
              key={req.id}
              className="bg-red-50/90 border-3 border-red-500 rounded-3xl p-6 shadow-xl shadow-red-100 space-y-4 animate-fade-in relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 bottom-0 w-3 bg-red-600 animate-pulse" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-red-200 pb-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-red-600 tracking-tight">
                    {req.tokenNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-lg">
                        {req.patientName || 'Walk-up Emergency Patient'}
                      </span>
                      <span className="px-2.5 py-0.5 bg-red-200 text-red-900 rounded-full text-xs font-black uppercase">
                        Awaiting Assessment
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-700" />
                        {req.kioskId}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {req.timeFormatted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Clinical Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Accept to Casualty */}
                  <button
                    type="button"
                    onClick={() => staffAcceptCasualty(req.id, "Casualty Room C-02")}
                    className="flex-1 sm:flex-initial px-5 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-sm sm:text-base rounded-2xl border-2 border-red-700 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <AlertOctagon className="w-4 h-4" />
                    <span>ACCEPT → CASUALTY</span>
                  </button>

                  {/* Redirect to Priority OPD */}
                  <button
                    type="button"
                    onClick={() => staffRedirectPriority(req.id, "Priority OPD Room 105")}
                    className="flex-1 sm:flex-initial px-5 py-3 bg-white hover:bg-amber-50 active:bg-amber-100 text-amber-900 font-extrabold text-sm sm:text-base rounded-2xl border-2 border-amber-400 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4 text-amber-600" />
                    <span>REDIRECT → PRIORITY OPD</span>
                  </button>
                </div>
              </div>

              {/* Reported Symptoms Note */}
              <div className="bg-white/80 p-3 rounded-2xl border border-red-200 text-xs sm:text-sm text-slate-800 flex items-center justify-between">
                <p>
                  <span className="font-extrabold text-red-800">Reported Chief Complaint: </span>
                  <span className="font-semibold text-slate-700">"{req.reportedSymptoms || 'Patient initiated walk-up emergency alert'}"</span>
                </p>
                <span className="text-[11px] font-bold text-slate-500 hidden md:inline">
                  Real-time sync to Kiosk active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolved / Triaged Emergency Requests History */}
      {resolvedList.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-3">
          <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">
            Recently Triaged Emergency Requests ({resolvedList.length})
          </h4>
          <div className="space-y-2">
            {resolvedList.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-slate-900 text-base">{item.tokenNumber}</span>
                  <span className="font-bold text-slate-700">{item.patientName}</span>
                  <span className="text-slate-500 font-medium">({item.kioskId})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                    item.status === 'ACCEPTED_CASUALTY' 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {item.status === 'ACCEPTED_CASUALTY' ? 'Casualty (Room C-02)' : 'Priority OPD (Room 105)'}
                  </span>
                  <span className="text-slate-400 text-xs hidden sm:inline">
                    {item.responseTime || item.timeFormatted}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
