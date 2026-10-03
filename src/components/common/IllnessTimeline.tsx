import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Activity, CheckCircle2, History } from 'lucide-react';
import { IllnessRecord, Language } from '../../types';

interface IllnessTimelineProps {
  illnesses: IllnessRecord[];
  language: Language;
  className?: string;
}

export const IllnessTimeline: React.FC<IllnessTimelineProps> = ({
  illnesses,
  language,
  className = ''
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(illnesses[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getStatusBadge = (status: IllnessRecord['status']) => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: language === 'hi' ? 'सक्रिय' : 'Active',
          color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
        };
      case 'UNDER_TREATMENT':
        return {
          label: language === 'hi' ? 'उपचार जारी' : 'Under Treatment',
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
        };
      case 'RESOLVED':
        return {
          label: language === 'hi' ? 'ठीक हो चुका' : 'Resolved',
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
        };
      case 'HISTORICAL':
      default:
        return {
          label: language === 'hi' ? 'ऐतिहासिक' : 'Historical',
          color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300'
        };
    }
  };

  if (!illnesses || illnesses.length === 0) {
    return (
      <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center text-slate-500">
        <History className="w-8 h-8 mx-auto mb-2 opacity-60" />
        <p className="font-semibold text-sm">
          {language === 'hi' ? 'कोई पूर्व बीमारी दर्ज नहीं है' : 'No previous illnesses recorded'}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {illnesses.map((ill) => {
        const isExpanded = expandedId === ill.id;
        const badge = getStatusBadge(ill.status);

        return (
          <div
            key={ill.id}
            className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all"
          >
            <button
              type="button"
              onClick={() => toggleExpand(ill.id)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                    {language === 'hi' && ill.titleHi ? ill.titleHi : ill.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{ill.yearOrDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${badge.color}`}>
                  {badge.label}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2.5 bg-slate-50/50 dark:bg-slate-900/50 animate-fade-in">
                <p className="leading-relaxed font-medium">
                  {ill.summary}
                </p>

                {ill.relatedMedications && ill.relatedMedications.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="font-bold text-slate-500 uppercase text-[10px]">
                      {language === 'hi' ? 'संबंधित दवाएं:' : 'Related meds:'}
                    </span>
                    {ill.relatedMedications.map((med, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono">
                        {med}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
