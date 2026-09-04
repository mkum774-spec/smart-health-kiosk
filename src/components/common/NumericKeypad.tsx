import React from 'react';
import { Delete, Check } from 'lucide-react';
import { voiceEngine } from '../../services/voiceEngine';

interface NumericKeypadProps {
  onKeyPress: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  disableSubmit?: boolean;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onKeyPress,
  onBackspace,
  onClear,
  onSubmit,
  submitLabel = "Continue",
  disableSubmit = false,
}) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  const handleDigit = (digit: string) => {
    voiceEngine.playChime('tap');
    onKeyPress(digit);
  };

  const handleBackspace = () => {
    voiceEngine.playChime('tap');
    onBackspace();
  };

  const handleClear = () => {
    voiceEngine.playChime('alert');
    onClear();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-100 p-4 rounded-3xl border-2 border-slate-200 shadow-inner">
      <div className="grid grid-cols-3 gap-3">
        {/* Keys 1 to 9 */}
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigit(digit)}
            className="h-18 min-h-[72px] bg-white hover:bg-slate-50 active:bg-teal-50 active:border-teal-500 active:scale-95 text-3xl font-bold text-slate-800 rounded-2xl border-2 border-slate-300 shadow-sm transition-all flex items-center justify-center cursor-pointer select-none"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          className="h-18 min-h-[72px] bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:scale-95 text-base font-bold text-slate-700 rounded-2xl border-2 border-slate-300 transition-all flex items-center justify-center cursor-pointer select-none uppercase tracking-wider"
        >
          Clear
        </button>

        {/* 0 Key */}
        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="h-18 min-h-[72px] bg-white hover:bg-slate-50 active:bg-teal-50 active:border-teal-500 active:scale-95 text-3xl font-bold text-slate-800 rounded-2xl border-2 border-slate-300 shadow-sm transition-all flex items-center justify-center cursor-pointer select-none"
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          onClick={handleBackspace}
          aria-label="Backspace"
          className="h-18 min-h-[72px] bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 active:scale-95 rounded-2xl border-2 border-rose-200 transition-all flex items-center justify-center cursor-pointer select-none"
        >
          <Delete className="w-8 h-8" />
        </button>
      </div>

      {onSubmit && (
        <div className="mt-4">
          <button
            type="button"
            disabled={disableSubmit}
            onClick={onSubmit}
            className="w-full min-h-[64px] bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl border-2 border-teal-800 shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer select-none"
          >
            <Check className="w-7 h-7" />
            <span>{submitLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};
