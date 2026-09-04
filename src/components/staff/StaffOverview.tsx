import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Clock, 
  Users, 
  CheckCircle2, 
  Activity, 
  Building2, 
  TrendingUp, 
  RefreshCw 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { EmergencyAlertPanel } from './EmergencyAlertPanel';
import { PatientQueueTable } from './PatientQueueTable';
import { PatientDetailModal } from './PatientDetailModal';
import { DepartmentCapacityView } from './DepartmentCapacityView';
import { PatientRegistration } from '../../types';

interface StaffOverviewProps {
  activeTab: 'overview' | 'emergency' | 'queue' | 'departments';
}

export const StaffOverview: React.FC<StaffOverviewProps> = ({ activeTab }) => {
  const { queue, emergencyRequests } = useKiosk();
  const [selectedPatient, setSelectedPatient] = useState<PatientRegistration | null>(null);

  // Compute KPI counts
  const emergencyCount = emergencyRequests.filter(e => e.status === 'AWAITING_ASSESSMENT').length;
  const priorityCount = queue.filter(q => q.triageLevel === 'URGENT' && q.status !== 'COMPLETED').length;
  const waitingCount = queue.filter(q => q.status === 'WAITING' || q.status === 'CALLED').length;
  const completedToday = queue.filter(q => q.status === 'COMPLETED').length + 86; // mock + live

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 select-none">
      {/* Top KPI Metrics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Emergency Requests */}
        <div className={`p-5 rounded-3xl border-2 transition-all shadow-sm ${
          emergencyCount > 0 
            ? 'bg-red-50 border-red-400 text-red-950 animate-pulse' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Emergency Requests</span>
            <AlertOctagon className={`w-5 h-5 ${emergencyCount > 0 ? 'text-red-600' : 'text-slate-400'}`} />
          </div>
          <div className="text-4xl sm:text-5xl font-black font-mono mt-2 text-red-600">
            {emergencyCount < 10 ? `0${emergencyCount}` : emergencyCount}
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {emergencyCount > 0 ? 'Action required immediately' : 'No pending alerts'}
          </p>
        </div>

        {/* 2. Priority Patients */}
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm text-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Priority OPD</span>
            <Activity className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-4xl sm:text-5xl font-black font-mono mt-2 text-amber-600">
            {priorityCount < 10 ? `0${priorityCount}` : priorityCount}
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Expedited consultations
          </p>
        </div>

        {/* 3. Waiting Patients */}
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm text-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Waiting Patients</span>
            <Clock className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-4xl sm:text-5xl font-black font-mono mt-2 text-sky-700">
            {waitingCount}
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Avg wait: 14 minutes
          </p>
        </div>

        {/* 4. Completed Today */}
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm text-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Completed Today</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-4xl sm:text-5xl font-black font-mono mt-2 text-emerald-700">
            {completedToday}
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Total patients triaged & treated
          </p>
        </div>
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Emergency Alert Panel */}
          <EmergencyAlertPanel />

          {/* Live Patient Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">
                Live Outpatient Queue Management
              </h3>
              <span className="text-xs font-bold text-slate-500">Click any row for doctor-ready EMR summary</span>
            </div>
            <PatientQueueTable onSelectPatient={(p) => setSelectedPatient(p)} />
          </div>

          {/* Department Load Balancing Overview */}
          <DepartmentCapacityView />
        </div>
      )}

      {activeTab === 'emergency' && (
        <EmergencyAlertPanel />
      )}

      {activeTab === 'queue' && (
        <PatientQueueTable onSelectPatient={(p) => setSelectedPatient(p)} />
      )}

      {activeTab === 'departments' && (
        <DepartmentCapacityView />
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};
