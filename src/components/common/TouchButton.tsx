import React from 'react';
import { voiceEngine } from '../../services/voiceEngine';

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emergency' | 'success' | 'warning' | 'ghost';
  size?: 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  sublabel?: string;
  badge?: string;
  fullWidth?: boolean;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  variant = 'primary',
  size = 'lg',
  icon,
  sublabel,
  badge,
  fullWidth = false,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    voiceEngine.playChime(variant === 'emergency' ? 'emergency' : 'tap');
    if (onClick) onClick(e);
  };

  const sizeClasses = {
    md: 'min-h-[52px] px-5 py-3 text-lg font-semibold',
    lg: 'min-h-[64px] px-6 py-4 text-xl font-bold',
    xl: 'min-h-[80px] px-8 py-5 text-2xl font-bold',
  };

  const variantClasses = {
    primary: 'bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900 border-2 border-teal-800 shadow-md',
    secondary: 'bg-white text-slate-800 hover:bg-slate-50 active:bg-slate-100 border-2 border-slate-300 shadow-sm',
    emergency: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border-2 border-red-700 shadow-lg shadow-red-200 animate-pulse-slow',
    success: 'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 border-2 border-emerald-800 shadow-md',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 border-2 border-amber-700 shadow-md',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 border-2 border-transparent',
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center gap-3 rounded-2xl
        transition-all duration-150 ease-out select-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        active:scale-[0.985] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0 text-current">{icon}</span>}
      <div className="flex flex-col items-center justify-center text-center">
        <span>{children}</span>
        {sublabel && (
          <span className="text-sm font-medium opacity-90 mt-0.5 tracking-normal">
            {sublabel}
          </span>
        )}
      </div>
      {badge && (
        <span className="absolute top-2 right-2 bg-white text-red-600 text-xs font-black px-2 py-0.5 rounded-full border border-red-200 uppercase">
          {badge}
        </span>
      )}
    </button>
  );
};
