import React, { useState } from 'react';
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  QrCode, 
  FileText, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  ExternalLink,
  Building
} from 'lucide-react';
import { Language } from '../../../types';

interface HelpSupportViewProps {
  language: Language;
}

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({ language }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      qEn: "How do I connect the hospital kiosk visit to my phone?",
      qHi: "अस्पताल कियोस्क को अपने फोन से कैसे जोड़ें?",
      aEn: "On the hospital kiosk terminal, after completing intake or generating a token, click 'Transfer to Mobile'. A secure QR code will appear on the kiosk screen. In this patient website, tap 'Scan Kiosk QR' from the dashboard or sidebar, point your phone camera at the screen, and your session will immediately sync.",
      aHi: "अस्पताल कियोस्क पर टोकन बनने के बाद 'Transfer to Mobile' पर क्लिक करें। स्क्रीन पर एक सुरक्षित क्यूआर कोड दिखेगा। अपने फोन पर 'Scan Kiosk QR' बटन दबाएं और कोड को कैमरे से स्कैन करें।"
    },
    {
      qEn: "Can I access my original physical reports if they were summarized by AI?",
      qHi: "क्या मैं एआई सारांश के बाद भी मूल जांच रिपोर्ट देख सकता हूँ?",
      aEn: "Yes, absolutely. Under MediKiosk's mandatory original document preservation rule, every uploaded document and hospital scan is permanently preserved in its original high resolution. AI summaries complement your records but never replace the original medical documents.",
      aHi: "हाँ, बिल्कुल। मूल दस्तावेज़ हमेशा सुरक्षित रहते हैं। एआई सारांश केवल समझने में मदद करता है और मूल रिपोर्ट को कभी नहीं हटाता।"
    },
    {
      qEn: "How does MediKiosk protect my medical data privacy?",
      qHi: "मेडीकियोस्क मेरे स्वास्थ्य डेटा की गोपनीयता कैसे सुरक्षित रखता है?",
      aEn: "MediKiosk implements granular consent management compliant with ABDM standards. You can choose which data categories are shared with treating physicians. You can also revoke access anytime from the Connected Devices & Sessions tab.",
      aHi: "मेडीकियोस्क पर आप खुद तय करते हैं कि कौन सी जानकारी डॉक्टर के साथ साझा करनी है। आप 'सहमति व गोपनीयता' टैब से किसी भी समय एक्सेस वापस ले सकते हैं।"
    },
    {
      qEn: "What should I do if I experience sudden severe chest pain or breathlessness?",
      qHi: "अचानक सीने में तेज दर्द या सांस फूलने पर क्या करें?",
      aEn: "Do not wait for clinical intake or chat responses. Immediately dial National Emergency helpline 112 or 108, or proceed directly to the nearest hospital Casualty / Emergency department.",
      aHi: "कृपया तुरंत राष्ट्रीय आपातकालीन नंबर 112 या 108 पर कॉल करें या सीधे अस्पताल के आकस्मिक वार्ड (Casualty) जाएं।"
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto pb-12 select-none">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-teal-600" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'सहायता, आपातकालीन संपर्क एवं निर्देश' : 'Patient Help & Support Directory'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          {language === 'hi'
            ? 'अक्सर पूछे जाने वाले सवाल, अस्पताल संपर्क और आपातकालीन नंबर।'
            : 'Frequently asked questions, kiosk usage guides, and 24/7 medical emergency helplines.'}
        </p>
      </div>

      {/* Emergency Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 space-y-2">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
            <Phone className="w-4 h-4 text-rose-600" />
            <span>National Emergency</span>
          </div>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-300">112 / 108</p>
          <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 font-medium">
            Ambulance & Casualty (24 Hours)
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-sky-50 dark:bg-sky-950/40 border-2 border-sky-200 dark:border-sky-900/60 text-sky-900 dark:text-sky-200 space-y-2">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
            <Phone className="w-4 h-4 text-sky-600" />
            <span>Tele-MANAS Support</span>
          </div>
          <p className="text-2xl font-black text-sky-700 dark:text-sky-300">14416</p>
          <p className="text-[11px] text-sky-800/80 dark:text-sky-300/80 font-medium">
            Mental Health & Counseling
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-200 dark:border-teal-900/60 text-teal-900 dark:text-teal-200 space-y-2">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
            <Building className="w-4 h-4 text-teal-600" />
            <span>Hospital Helpdesk</span>
          </div>
          <p className="text-2xl font-black text-teal-700 dark:text-teal-300">0141-25678</p>
          <p className="text-[11px] text-teal-800/80 dark:text-teal-300/80 font-medium">
            OPD Inquiry & Token Assistance
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">
          {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल (FAQs)' : 'Frequently Asked Questions'}
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer font-bold text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <span>{language === 'hi' ? faq.qHi : faq.qEn}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <p className="pt-2">{language === 'hi' ? faq.aHi : faq.aEn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
