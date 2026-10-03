import React from 'react';
import { AlertCircle, PhoneCall, Building2, ShieldAlert } from 'lucide-react';
import { Language } from '../../types';

interface EmergencyBannerProps {
  language: Language;
  assignedRoom?: string;
  departmentName?: string;
  contactNumber?: string;
  onContinueOnlyIfInstructed?: () => void;
  className?: string;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  language,
  assignedRoom = "Casualty Room C-01",
  departmentName = "Emergency & Trauma Care",
  contactNumber = "108 / 102",
  onContinueOnlyIfInstructed,
  className = ''
}) => {
  return (
    <div
      className={`p-5 rounded-3xl bg-rose-600 text-white shadow-xl border-4 border-rose-700 animate-fade-in select-none ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-white/20 font-black text-xs uppercase tracking-wider">
            {language === 'hi' ? 'तत्काल ध्यान आवश्यक' : 'Urgent Attention Needed'}
          </div>
          <h3 className="text-xl sm:text-2xl font-black leading-tight">
            {language === 'hi'
              ? 'आपकी स्थिति को तत्काल चिकित्सकीय जांच की आवश्यकता है।'
              : 'Your information indicates that you may need immediate medical attention.'}
          </h3>
          <p className="text-sm font-semibold text-rose-100 max-w-2xl">
            {language === 'hi'
              ? 'कृपया तुरंत आपातकालीन वार्ड या नजदीकी अस्पताल में उपस्थित डॉक्टर से संपर्क करें।'
              : 'Please contact emergency care or visit the nearest appropriate healthcare facility immediately.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-white text-rose-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm">
              <Building2 className="w-4 h-4 text-rose-700" />
              <span>{assignedRoom} ({departmentName})</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white/20 text-white font-mono font-bold text-xs sm:text-sm flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              <span>{language === 'hi' ? 'आपातकालीन हेल्पलाइन:' : 'Helpline:'} {contactNumber}</span>
            </div>
          </div>

          {onContinueOnlyIfInstructed && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onContinueOnlyIfInstructed}
                className="text-xs text-rose-200 hover:text-white underline font-semibold cursor-pointer"
              >
                {language === 'hi' ? 'चिकित्सक के निर्देशानुसार ही आगे बढ़ें' : 'Continue only if instructed by clinician'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
