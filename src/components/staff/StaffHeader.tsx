import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Bell, 
  ShieldAlert, 
  Clock, 
  UserCheck, 
  Monitor, 
  CheckCircle2, 
  Wifi, 
  Search 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';

interface StaffHeaderProps {
  activeTab: 'overview' | 'emergency' | 'queue' | 'departments';
  setActiveTab: (tab: 'overview' | 'emergency' | 'queue' | 'departments') => void;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({ activeTab, setActiveTab }) => {
  const { emergencyRequests, queue, setAppView } = useKiosk();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingEmergencies = emergencyRequests.filter(e => e.status === 'AWAITING_ASSESSMENT').length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 select-none">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Hospital Administration Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shadow">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight">Hospital Clinical Staff Portal</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-900 text-teal-300 border border-teal-700 uppercase">
                Staff / Doctor
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              OPD Triage & Emergency Response Coordination
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="hidden md:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-sm font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('emergency')}
            className={`px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'emergency' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Emergency</span>
            {pendingEmergencies > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-red-600 rounded-full text-xs font-black animate-pulse">
                {pendingEmergencies}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'queue' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Patient Queue ({queue.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'departments' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Department Load
          </button>
        </nav>

        {/* Right Tools: Doctor on Duty, Clock, Switch to Kiosk */}
        <div className="flex items-center gap-3">
          {/* Clock */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{timeStr}</span>
          </div>

          {/* Attending Doctor Profile */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
              Dr
            </div>
            <div className="text-left">
              <span className="text-xs font-bold block text-slate-200">Dr. Vikram Seth</span>
              <span className="text-[10px] text-teal-400 font-semibold block">Casualty & Triage Lead</span>
            </div>
          </div>

          {/* Jump to Kiosk View */}
          <button
            type="button"
            onClick={() => setAppView('KIOSK')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            title="Switch to Patient Kiosk"
          >
            <Monitor className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Kiosk View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
