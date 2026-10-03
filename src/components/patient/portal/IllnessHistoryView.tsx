import React from 'react';
import { 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Pill, 
  FileText, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Language, IllnessRecord } from '../../../types';

interface IllnessHistoryViewProps {
  language: Language;
  illnesses: IllnessRecord[];
}

export const IllnessHistoryView: React.FC<IllnessHistoryViewProps> = ({
  language,
  illnesses
}) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hi' ? 'बीमारी एवं पूर्व स्वास्थ्य इतिहास' : 'Illness Chronology & History'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {language === 'hi'
            ? 'आपकी दर्ज की गई पुरानी बीमारियां, वर्तमान स्थिति और संबंधित उपचार।'
            : 'Review chronic conditions, historical episodes, and resolved health concerns.'}
        </p>
      </div>

      <div className="space-y-4">
        {illnesses.map(ill => (
          <div
            key={ill.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {language === 'hi' && ill.titleHi ? ill.titleHi : ill.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Recorded Date: {ill.yearOrDate}
                  </span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase self-start sm:self-auto border ${
                ill.status === 'UNDER_TREATMENT'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {ill.status === 'UNDER_TREATMENT' ? (language === 'hi' ? 'उपचार जारी' : 'Under Active Care') : (language === 'hi' ? 'ठीक हो चुका' : 'Resolved')}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              {ill.summary}
            </p>

            {ill.relatedMedications && ill.relatedMedications.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Pill className="w-4 h-4 text-indigo-500" />
                <span className="font-semibold">Associated Therapy:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{ill.relatedMedications.join(', ')}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
