import React from 'react';
import { CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { Language } from '../../types';

interface AnswerConfirmationProps {
  interpretedText: string;
  confidence?: number;
  language: Language;
  onConfirm: () => void;
  onRetry: () => void;
}

export const AnswerConfirmation: React.FC<AnswerConfirmationProps> = ({
  interpretedText,
  confidence,
  language,
  onConfirm,
  onRetry
}) => {
  return (
    <div className="w-full my-3 p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-500 shadow-md animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Sparkles className="w-5 h-5 text-teal-200" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 block">
            {language === 'hi' ? 'हमने यह समझा:' : 'We understood:'}
          </span>
          <p className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
            "{interpretedText}"
          </p>
          {confidence && (
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'सटीकता' : 'Confidence'}: {Math.round(confidence * 100)}%
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{language === 'hi' ? 'हाँ, यह सही है' : 'Yes, correct'}</span>
        </button>

        <button
          type="button"
          onClick={onRetry}
          className="px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
        >
          <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span>{language === 'hi' ? 'दोबारा कहें' : 'Try again'}</span>
        </button>
      </div>
    </div>
  );
};
