import React from 'react';
import { ShieldCheck, Accessibility, Smartphone, FileCheck2, Lock, HeartHandshake } from 'lucide-react';
import { Language } from '../../../types';

interface TrustSecuritySectionProps {
  language: Language;
}

export const TrustSecuritySection: React.FC<TrustSecuritySectionProps> = ({ language }) => {
  const trustPoints = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
      titleEn: "Secure & Private",
      titleHi: "सुरक्षित एवं निजी",
      descEn: "Your healthcare information is protected using granular patient consent preferences, strict session controls, and ABDM protocol standards.",
      descHi: "आपकी स्वास्थ्य जानकारी आपकी सहमति, कड़े सत्र नियंत्रण और आभा सुरक्षा मानकों के अनुसार सुरक्षित रखी जाती है।"
    },
    {
      icon: <Accessibility className="w-6 h-6 text-sky-600" />,
      titleEn: "Accessible to Everyone",
      titleHi: "सभी के लिए सुलभ",
      descEn: "Designed for elderly patients and individuals with low digital familiarity. Includes voice interaction, text resizing, and bilingual interfaces.",
      descHi: "वरिष्ठ नागरिकों और कम डिजिटल जानकारी वाले मरीजों के लिए आसान। बोलकर बातचीत, बड़े अक्षर और द्विभाषी इंटरफेस।"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-emerald-600" />,
      titleEn: "Available Across Devices",
      titleHi: "सभी डिवाइस पर उपलब्ध",
      descEn: "Easily access your records from your smartphone, tablet, or desktop browser with responsive and touch-optimized navigation.",
      descHi: "स्मार्टफोन, टैबलेट या कंप्यूटर से किसी भी समय अपनी स्वास्थ्य जानकारी आसानी से देखें।"
    },
    {
      icon: <FileCheck2 className="w-6 h-6 text-indigo-600" />,
      titleEn: "Paperless Organization",
      titleHi: "कागज-मुक्त स्वास्थ्य रिकॉर्ड",
      descEn: "Preserve original copies of prescriptions and reports so you never have to worry about lost physical papers during hospital visits.",
      descHi: "जांच रिपोर्ट और पर्चियों की डिजिटल मूल प्रति सुरक्षित रखें, ताकि अस्पताल में कागज खोने का डर न रहे।"
    }
  ];

  return (
    <section id="trust-security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'भरोसा, गोपनीयता एवं सुगमता' : 'Trust, Privacy & Accessibility'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {language === 'hi'
              ? 'मरीजों के हित में निर्मित एक पारदर्शी स्वास्थ्य प्लेटफॉर्म।'
              : 'Built with patient-first transparency, medical dignity, and clear data consent.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((pt, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {pt.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? pt.titleHi : pt.titleEn}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {language === 'hi' ? pt.descHi : pt.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* Responsible Healthcare Notice */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-center text-xs text-amber-900 dark:text-amber-300 font-medium max-w-3xl mx-auto">
          {language === 'hi'
            ? '⚠️ महत्वपूर्ण सूचना: मेडीकियोस्क पर दी गई डिजिटल जानकारी और एआई सहायता आपके चिकित्सक के निर्णय का विकल्प नहीं है। किसी भी गंभीर लक्षण या आपात स्थिति में तुरंत निकटतम अस्पताल से संपर्क करें।'
            : '⚠️ Important Healthcare Notice: MediKiosk informational features and AI assistance assist in preparation and organization, but do not replace authorized doctor consultations. In case of acute symptoms or emergency, seek immediate hospital attention.'}
        </div>
      </div>
    </section>
  );
};
