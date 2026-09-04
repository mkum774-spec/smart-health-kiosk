import React from 'react';
import { Building2, Activity, Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';

export const DepartmentCapacityView: React.FC = () => {
  const { departments, queue } = useKiosk();

  return (
    <div className="space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Hospital Department Capacity & Load Balancing</h3>
          <p className="text-sm font-semibold text-slate-500">Live outpatient clinic occupancy and automated triage routing metrics</p>
        </div>
        <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-black rounded-full uppercase">
          Dynamic Triage Routing Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          // Calculate queue active in this department
          const activeInDept = queue.filter(q => q.departmentId === dept.id && q.status !== 'COMPLETED').length;
          const loadPercentage = Math.min(100, Math.round((activeInDept / dept.totalCapacity) * 100));

          const isHighLoad = loadPercentage >= 80;
          const isMediumLoad = loadPercentage >= 50 && loadPercentage < 80;

          return (
            <div
              key={dept.id}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4"
            >
              {/* Dept Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-black text-slate-900">{dept.name}</h4>
                  <p className="text-xs font-bold text-teal-700">{dept.nameHi}</p>
                </div>
                <span className="text-xs font-mono font-black text-slate-400">
                  {dept.code}
                </span>
              </div>

              {/* Load Bar & Numbers */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Live Load ({activeInDept}/{dept.totalCapacity} capacity)</span>
                  <span className={`font-mono font-black ${
                    isHighLoad ? 'text-red-600' : isMediumLoad ? 'text-amber-600' : 'text-emerald-700'
                  }`}>
                    {loadPercentage}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHighLoad ? 'bg-red-500' : isMediumLoad ? 'bg-amber-500' : 'bg-teal-600'
                    }`}
                    style={{ width: `${loadPercentage}%` }}
                  />
                </div>
              </div>

              {/* Consultation Rooms in Dept */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  Active Consultation Rooms:
                </span>
                <div className="space-y-1.5">
                  {dept.rooms.map((room) => (
                    <div
                      key={room.roomNumber}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-extrabold text-slate-900">{room.roomNumber}</span>
                        <span className="text-slate-500 block text-[11px]">{room.doctorName}</span>
                      </div>
                      <div className="text-right">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                        <span className="font-bold text-slate-700">{room.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
