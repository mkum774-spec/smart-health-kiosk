import React from 'react';
import { Pill, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StructuredMedication, Language } from '../../types';

interface MedicationCardProps {
  medication: StructuredMedication;
  language: Language;
  className?: string;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  language,
  className = ''
}) => {
  const isActive = medication.status === 'ACTIVE';

  return (
    <div
      className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${
        isActive
          ? 'bg-white dark:bg-slate-900 border-teal-200 dark:border-teal-800'
          : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isActive ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' : 'bg-slate-200 text-slate-600'
          }`}>
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
              {medication.name}
            </h4>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-300 font-semibold">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {medication.dosage}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-teal-800 dark:text-teal-300">
                <Clock className="w-3 h-3" />
                {language === 'hi' && medication.frequencyHi ? medication.frequencyHi : medication.frequency}
              </span>
            </div>
            {medication.instructions && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic">
                "{language === 'hi' && medication.instructionsHi ? medication.instructionsHi : medication.instructions}"
              </p>
            )}
            {medication.duration && (
              <span className="text-[11px] font-mono text-slate-400 block mt-1">
                {language === 'hi' ? 'अवधि:' : 'Duration:'} {medication.duration}
              </span>
            )}
          </div>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
            isActive
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          {isActive ? (language === 'hi' ? 'सक्रिय' : 'Active') : medication.status}
        </span>
      </div>
    </div>
  );
};
