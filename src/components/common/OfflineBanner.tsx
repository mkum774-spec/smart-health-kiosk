import React, { useState } from 'react';
import { RefreshCw, CloudOff } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';

export const OfflineBanner: React.FC = () => {
  const { isOffline, isOfflineDemoData, retryBackendConnection, language } = useKiosk();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await retryBackendConnection();
    setTimeout(() => setIsRetrying(false), 1000);
  };

  // Show Red OFFLINE — DEMO DATA banner whenever tunnel drops or fallback is active
  if (isOfflineDemoData || isOffline) {
    return (
      <div className="bg-red-600 text-white px-4 sm:px-6 py-2.5 font-bold text-sm sm:text-base border-b-4 border-red-800 flex items-center justify-between shadow-xl z-50 animate-fade-in select-none">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-white text-red-700 font-black rounded-lg text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 flex-shrink-0">
              <CloudOff className="w-4 h-4 text-red-600" />
              <span>OFFLINE — DEMO DATA</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-red-50">
              {language === 'hi' 
                ? 'बैकएंड टनल अनुपलब्ध है। डेमो डेटा प्रदर्शित किया जा रहा है (सहमति और एपीआई स्थानीय रूप से चल रहे हैं)।' 
                : 'Backend tunnel unreachable. Displaying cached demo data. Consent & API responses are currently local.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRetrying}
              className="px-3.5 py-1.5 bg-red-800 hover:bg-red-900 active:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-red-500 shadow-sm cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{language === 'hi' ? 'पुनः प्रयास करें' : 'Retry Connection'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
