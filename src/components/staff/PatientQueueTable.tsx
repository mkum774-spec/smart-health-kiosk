import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  MapPin 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { PatientRegistration, QueueStatus, TriageLevel } from '../../types';

interface PatientQueueTableProps {
  onSelectPatient: (patient: PatientRegistration) => void;
}

export const PatientQueueTable: React.FC<PatientQueueTableProps> = ({ onSelectPatient }) => {
  const { queue, staffCallNext, staffCompletePatient } = useKiosk();
  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = queue.filter(item => {
    const matchDept = filterDept === 'ALL' || item.departmentName.toLowerCase().includes(filterDept.toLowerCase());
    const matchSearch = item.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  const getPriorityBadge = (lvl: TriageLevel) => {
    switch (lvl) {
      case 'EMERGENCY':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300 uppercase">Emergency</span>;
      case 'URGENT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase">Priority</span>;
      case 'MODERATE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-yellow-100 text-yellow-900 border border-yellow-300 uppercase">Moderate</span>;
      case 'ROUTINE':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase">Routine</span>;
    }
  };

  const getStatusBadge = (status: QueueStatus) => {
    switch (status) {
      case 'IN_CONSULTATION':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900">In Consultation</span>;
      case 'CALLED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-900 animate-pulse">Called</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">Completed</span>;
      case 'WAITING':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">Waiting</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden select-none">
      {/* Search & Filter Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search token, patient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-teal-600"
            />
          </div>

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            <option value="Casualty">Casualty</option>
            <option value="Medicine">General Medicine</option>
            <option value="Priority">Priority OPD</option>
            <option value="ENT">ENT</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Showing <span className="text-slate-900 font-extrabold">{filtered.length}</span> registered patients
        </div>
      </div>

      {/* Interactive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Token</th>
              <th className="py-3.5 px-6">Patient Name</th>
              <th className="py-3.5 px-6">Department</th>
              <th className="py-3.5 px-6">Triage</th>
              <th className="py-3.5 px-6">Room</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filtered.map((row) => (
              <tr 
                key={row.id}
                onClick={() => onSelectPatient(row)}
                className="hover:bg-teal-50/40 cursor-pointer transition-colors"
              >
                {/* Token */}
                <td className="py-4 px-6 font-mono font-black text-base text-teal-800">
                  {row.tokenNumber}
                </td>

                {/* Patient */}
                <td className="py-4 px-6">
                  <div className="font-extrabold text-slate-900">{row.patient.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{row.patient.age}y • {row.patient.gender}</div>
                </td>

                {/* Department */}
                <td className="py-4 px-6 font-bold text-slate-700">
                  {row.departmentName}
                </td>

                {/* Priority */}
                <td className="py-4 px-6">
                  {getPriorityBadge(row.triageLevel)}
                </td>

                {/* Room */}
                <td className="py-4 px-6 font-bold font-mono text-slate-800">
                  {row.assignedRoom}
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  {getStatusBadge(row.status)}
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                  {row.status !== 'COMPLETED' && (
                    <button
                      type="button"
                      onClick={() => staffCallNext(row.id)}
                      className="p-2 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl border border-sky-200 cursor-pointer"
                      title="Call Patient"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectPatient(row)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 cursor-pointer"
                    title="View EMR Summary"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
