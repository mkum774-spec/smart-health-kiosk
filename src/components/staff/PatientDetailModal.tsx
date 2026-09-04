import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  User, 
  Activity, 
  Heart, 
  Pill, 
  FileText, 
  Clock, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Send 
} from 'lucide-react';
import { PatientRegistration } from '../../types';
import { useKiosk } from '../../context/KioskContext';
import { AyurvedaEmptyState } from '../common/AyurvedaEmptyState';

interface PatientDetailModalProps {
  patient: PatientRegistration | null;
  onClose: () => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, onClose }) => {
  const { staffCallNext, staffCompletePatient, staffUpdateNotes } = useKiosk();
  const [notes, setNotes] = useState(patient?.staffNotes || '');

  if (!patient) return null;

  const handleSaveNotes = () => {
    staffUpdateNotes(patient.id, notes);
  };

  const handleCall = () => {
    staffCallNext(patient.id);
  };

  const handleComplete = () => {
    staffCompletePatient(patient.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border-2 border-slate-300 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header: Name, ABHA, Room, Close Button */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-black font-mono text-teal-800 bg-teal-50 px-4 py-2 rounded-2xl border border-teal-200">
              {patient.tokenNumber}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-slate-900">{patient.patient.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                  patient.triageLevel === 'EMERGENCY' ? 'bg-red-100 text-red-800' :
                  patient.triageLevel === 'URGENT' ? 'bg-amber-100 text-amber-900' :
                  'bg-emerald-100 text-emerald-900'
                }`}>
                  {patient.triageLevel}
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                ABHA: {patient.patient.abhaNumber} • {patient.patient.age} yrs • {patient.patient.gender}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PROMINENT ALLERGY BANNER (Safety Essential) */}
        {patient.history.allergies && patient.history.allergies.length > 0 ? (
          <div className="p-4 bg-red-100 border-2 border-red-500 rounded-2xl flex items-center gap-3 animate-pulse">
            <ShieldAlert className="w-8 h-8 text-red-600 flex-shrink-0 stroke-[2.5]" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-red-900 block">
                ⚠ KNOWN DRUG ALLERGY WARNING:
              </span>
              <p className="text-xl font-black text-red-950">
                {patient.history.allergies.join(', ')}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>No Known Drug Allergies (Reported by Patient)</span>
          </div>
        )}

        {/* DOCTOR-READY CLINICAL SUMMARY (Fast Glance) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chief Complaint & Symptoms */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
              Chief Complaint
            </span>
            <p className="text-base font-extrabold text-slate-900 leading-snug">
              "{patient.symptomsText}"
            </p>
            <p className="text-xs font-bold text-slate-500">
              Reported Duration: <span className="text-slate-800">{patient.symptomsDuration || '1 - 3 days'}</span>
            </p>
          </div>

          {/* Vitals */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
              Intake Vitals
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">BP</span>
                <span className="text-sm font-black font-mono text-slate-900">
                  {patient.vitals.systolicBp || 120}/{patient.vitals.diastolicBp || 80}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">HR</span>
                <span className="text-sm font-black font-mono text-slate-900">
                  {patient.vitals.heartRate || 72} bpm
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">SpO₂</span>
                <span className="text-sm font-black font-mono text-slate-900">
                  {patient.vitals.spo2 || 99}%
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Temp</span>
                <span className="text-sm font-black font-mono text-slate-900">
                  {patient.vitals.temperatureF || 98.6}°F
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Height/Wt</span>
                <span className="text-xs font-black font-mono text-slate-900">
                  {patient.vitals.heightCm || 170}cm / {patient.vitals.weightKg || 68}kg
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">BMI</span>
                <span className="text-sm font-black font-mono text-teal-800">
                  {patient.vitals.bmi || 23.5}
                </span>
              </div>
            </div>
          </div>

          {/* Medical History & Current Meds */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
              Chronic Conditions & Current Meds
            </span>
            <p className="text-xs font-bold text-slate-700">
              Conditions: {patient.history.chronicConditions?.length ? patient.history.chronicConditions.join(', ') : 'None'}
            </p>
            <p className="text-xs font-bold text-slate-700">
              Current Medications: {patient.history.currentMedications?.length ? patient.history.currentMedications.join(', ') : 'None reported'}
            </p>
          </div>

          {/* Scanned Documents & OCR Data */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
              Attached Documents ({patient.documents.length})
            </span>
            {patient.documents.length > 0 ? (
              <div className="space-y-1 text-xs font-medium text-slate-700">
                {patient.documents.map((doc, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-teal-800">[{doc.type}]</span> {doc.doctorName} • {doc.date}
                    {doc.medicinesExtracted && (
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Extracted: {doc.medicinesExtracted.map(m => m.name).join(', ')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No scanned documents attached.</p>
            )}
          </div>
        </div>

        {/* AYURVEDIC ASSESSMENT OR EMPTY STATE (SIH26047) */}
        {patient.assessmentTrack === 'ayurveda' && patient.ayurveda ? (
          <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <span>🌿</span>
                <span>Ayurvedic Assessment (Prashna Pariksha)</span>
              </span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                Ayurveda Track
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold pt-1">
              <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                <span className="text-[10px] text-slate-400 block uppercase">Prakriti</span>
                <span className="text-amber-950">{patient.ayurveda.prakriti}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                <span className="text-[10px] text-slate-400 block uppercase">Agni</span>
                <span className="text-amber-950">{patient.ayurveda.agni}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                <span className="text-[10px] text-slate-400 block uppercase">Koshtha</span>
                <span className="text-amber-950">{patient.ayurveda.koshtha}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                <span className="text-[10px] text-slate-400 block uppercase">Ahara / Vyayama</span>
                <span className="text-amber-950">{patient.ayurveda.ahara_shakti} / {patient.ayurveda.vyayama_shakti}</span>
              </div>
            </div>
          </div>
        ) : (
          <AyurvedaEmptyState />
        )}

        {/* Attending Doctor Clinical Notes */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
            Attending Doctor Notes & Orders:
          </label>
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter prescription notes, lab orders, or referral..."
              className="flex-1 p-3 text-sm font-medium bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-600"
            />
            <button
              type="button"
              onClick={handleSaveNotes}
              className="px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </div>

        {/* Action Buttons: Call Next, Mark Completed */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleCall}
            className="px-6 py-3.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-base rounded-2xl border border-sky-800 shadow cursor-pointer transition-all"
          >
            📢 Call Patient to Room
          </button>

          <button
            type="button"
            onClick={handleComplete}
            className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base rounded-2xl border border-emerald-800 shadow cursor-pointer transition-all"
          >
            ✓ Mark Consultation Completed
          </button>
        </div>
      </div>
    </div>
  );
};
