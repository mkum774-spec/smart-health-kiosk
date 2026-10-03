import React from 'react';
import { UserCheck, MessageSquarePlus, QrCode, HeartHandshake, ArrowRight } from 'lucide-react';
import { Language } from '../../../types';

interface HowItWorksSectionProps {
  language: Language;
  onOpenSignUp: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  language,
  onOpenSignUp
}) => {
  const steps = [
    {
      num: "1",
      icon: <UserCheck className="w-6 h-6 text-teal-600" />,
      titleEn: "Create Your Account",
      titleHi: "अपना खाता बनाएं",
      descEn: "Securely sign in with your ABHA ID or phone number. No extensive forms required.",
      descHi: "अपने आभा नंबर या मोबाइल से सुरक्षित लॉगिन करें। लंबी कागजी कार्रवाई की जरूरत नहीं।"
    },
    {
      num: "2",
      icon: <MessageSquarePlus className="w-6 h-6 text-sky-600" />,
      titleEn: "Share Your Health Information",
      titleHi: "स्वास्थ्य विवरण दर्ज करें",
      descEn: "Answer questions through speech or typing, upload reports, or share previous hospital visits.",
      descHi: "बोलकर या लिखकर अपने लक्षणों का विवरण दें और पुरानी जांच रिपोर्ट अपलोड करें।"
    },
    {
      num: "3",
      icon: <QrCode className="w-6 h-6 text-emerald-600" />,
      titleEn: "Connect Your Hospital Visit",
      titleHi: "अस्पताल कियोस्क से कनेक्ट करें",
      descEn: "Scan the QR code displayed at the MediKiosk terminal to link your session directly to your phone.",
      descHi: "अस्पताल में लगे मेडीकियोस्क पर प्रदर्शित क्यूआर कोड स्कैन कर अपना सत्र फोन पर लाएं।"
    },
    {
      num: "4",
      icon: <HeartHandshake className="w-6 h-6 text-indigo-600" />,
      titleEn: "Stay Connected & Prepared",
      titleHi: "निरंतर देखभाल एवं फॉलो-अप",
      descEn: "View consultation summary, medications, reminders, and follow up smoothly after your visit.",
      descHi: "परामर्श सारांश, दवाएं, रिपोर्ट और आगे की देखभाल के निर्देश आसानी से देखें।"
    }
  ];

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            {language === 'hi' ? 'सरल एवं सुगम प्रक्रिया' : 'Simple 4-Step Process'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'मेडीकियोस्क कैसे कार्य करता है?' : 'How MediKiosk Works'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            {language === 'hi'
              ? 'अस्पताल कियोस्क से लेकर आपके मोबाइल फोन तक, देखभाल की पूरी यात्रा एक साथ।'
              : 'Connecting your hospital intake to your personal smartphone seamlessly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, i) => (
            <div key={st.num} className="relative flex flex-col items-start bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between w-full mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  {st.icon}
                </div>
                <span className="text-2xl font-black text-slate-300 dark:text-slate-600 font-mono">
                  0{st.num}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {language === 'hi' ? st.titleHi : st.titleEn}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {language === 'hi' ? st.descHi : st.descEn}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={onOpenSignUp}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>{language === 'hi' ? 'अभी शुरुआत करें' : 'Get Started with MediKiosk'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
