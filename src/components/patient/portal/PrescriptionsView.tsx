import React, { useState } from 'react';
import { 
  Pill, 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';
import { Language, PatientPrescription, StructuredMedication } from '../../../types';

interface PrescriptionsViewProps {
  language: Language;
  prescriptions: PatientPrescription[];
  medications: StructuredMedication[];
}

export const PrescriptionsView: React.FC<PrescriptionsViewProps> = ({
  language,
  prescriptions,
  medications
}) => {
  const [activeTab, setActiveTab] = useState<'MEDICATIONS' | 'PRESCRIPTIONS'>('MEDICATIONS');
  const [selectedPrescriptionDoc, setSelectedPrescriptionDoc] = useState<PatientPrescription | null>(null);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hi' ? 'दवाएं एवं चिकित्सकीय पर्चे' : 'Prescriptions & Active Medications'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {language === 'hi'
            ? 'आपके द्वारा ली जा रही दवाएं, खुराक का समय और डॉक्टरों द्वारा जारी मूल पर्चे।'
            : 'Dosage schedules, food timing instructions, and verified outpatient prescriptions.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('MEDICATIONS')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm transition-colors border-b-2 cursor-pointer ${
            activeTab === 'MEDICATIONS'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {language === 'hi' ? 'वर्तमान दवाएं' : 'Current Active Medications'} ({medications.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PRESCRIPTIONS')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm transition-colors border-b-2 cursor-pointer ${
            activeTab === 'PRESCRIPTIONS'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {language === 'hi' ? 'डॉक्टर के पर्चे' : 'Prescription Slips'} ({prescriptions.length})
        </button>
      </div>

      {/* 1. Medications Tab View */}
      {activeTab === 'MEDICATIONS' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
            ℹ️ {language === 'hi' 
              ? 'कृपया दवाएं हमेशा डॉक्टर के निर्देशानुसार और बताए गए समय पर ही लें। कोई भी बदलाव करने से पहले डॉक्टर से परामर्श करें।' 
              : 'Take medications strictly according to instructions. Consult your physician before discontinuing any active treatment.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {medications.map(med => (
              <div
                key={med.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                          {med.name}
                        </h3>
                        <span className="text-xs text-slate-500 font-bold font-mono">
                          {med.dosage}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      med.status === 'ACTIVE' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300' 
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {med.status}
                    </span>
                  </div>

                  {/* Frequency & Food Instructions */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Frequency:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {language === 'hi' && med.frequencyHi ? med.frequencyHi : med.frequency}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Instructions:</span>
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        {language === 'hi' && med.instructionsHi ? med.instructionsHi : med.instructions}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-medium">
                  <span>Prescribed by: {med.prescribedBy || 'OPD Physician'}</span>
                  <span>{med.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Prescriptions Tab View */}
      {activeTab === 'PRESCRIPTIONS' && (
        <div className="space-y-4">
          {prescriptions.map(rx => (
            <div
              key={rx.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      Prescription — {rx.doctorName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {rx.department} • {rx.hospitalName} • {rx.date}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Diagnosis: {rx.diagnosisSummary}
                </p>

                {/* Medicines List summary */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rx.medicines.map((m, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {m.name} ({m.dosage})
                    </span>
                  ))}
                </div>
              </div>

              {rx.originalDocumentUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedPrescriptionDoc(rx)}
                  className="px-4 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer flex-shrink-0 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>{language === 'hi' ? 'मूल पर्चा देखें' : 'View Original Slip'}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Prescription Document Modal */}
      {selectedPrescriptionDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in select-none">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border-2 border-slate-300 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-teal-600 text-white">
              <span className="font-bold text-sm">
                Original Prescription • {selectedPrescriptionDoc.doctorName}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPrescriptionDoc(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <img
                src={selectedPrescriptionDoc.originalDocumentUrl}
                alt="Prescription Scan"
                className="max-h-[500px] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
