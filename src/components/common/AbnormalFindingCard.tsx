import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { AbnormalFinding, Language } from '../../types';

interface AbnormalFindingCardProps {
  finding: AbnormalFinding;
  language: Language;
  className?: string;
}

export const AbnormalFindingCard: React.FC<AbnormalFindingCardProps> = ({
  finding,
  language,
  className = ''
}) => {
  const isCritical = finding.status === 'CRITICAL';
  const isAttention = finding.status === 'ATTENTION';

  return (
    <div
      className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${
        isCritical
          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 dark:border-rose-700'
          : isAttention
          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
          : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-400 dark:border-amber-600'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {isCritical ? (
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
              {language === 'hi' && finding.testNameHi ? finding.testNameHi : finding.testName}
            </h4>
            <div className="flex flex-wrap items-baseline gap-2 mt-1">
              <span className="text-lg font-black font-mono text-slate-900 dark:text-slate-100">
                {finding.value} {finding.unit || ''}
              </span>
              {finding.referenceRange && (
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  ({language === 'hi' ? 'मानक संदर्भ:' : 'Reference:'} {finding.referenceRange})
                </span>
              )}
            </div>
            {finding.notes && (
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {finding.notes}
              </p>
            )}
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex-shrink-0 ${
            isCritical
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-amber-500 text-white shadow-sm'
          }`}
        >
          {isCritical
            ? (language === 'hi' ? 'गंभीर ध्यान दें' : 'Critical')
            : (language === 'hi' ? 'ध्यान देने योग्य' : 'Needs Attention')}
        </span>
      </div>
    </div>
  );
};
