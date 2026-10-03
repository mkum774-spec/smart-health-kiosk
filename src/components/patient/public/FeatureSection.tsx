import React from 'react';
import { 
  MessageSquareHeart, 
  FileText, 
  CalendarDays, 
  Pill, 
  FolderHeart, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Language } from '../../../types';

interface FeatureSectionProps {
  language: Language;
  onSelectFeature: (featureKey: string) => void;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  language,
  onSelectFeature
}) => {
  const features = [
    {
      key: 'conversation',
      icon: <MessageSquareHeart className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      bg: 'bg-teal-50 dark:bg-teal-950/60',
      titleEn: "Clinical Conversation",
      titleHi: "क्लिनिकल बातचीत एवं लक्षण",
      descEn: "Describe your symptoms and concerns in English or Hindi through voice, typing, or touch before your doctor visit.",
      descHi: "बोलकर या लिखकर अपने लक्षणों का विवरण दें और डॉक्टर परामर्श से पहले तैयारी करें।"
    },
    {
      key: 'reports',
      icon: <FileText className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      bg: 'bg-sky-50 dark:bg-sky-950/60',
      titleEn: "Medical Reports",
      titleHi: "मेडिकल रिपोर्ट्स एवं जांच",
      descEn: "Upload files or snap photo of physical documents. Original scans are permanently saved with clear extracted parameters.",
      descHi: "कैमरे से फोटो खींचें या फाइल अपलोड करें। मूल दस्तावेज़ हमेशा सुरक्षित रहते हैं।"
    },
    {
      key: 'appointments',
      icon: <CalendarDays className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      titleEn: "Appointments",
      titleHi: "डॉक्टर परामर्श एवं अपॉइंटमेंट",
      descEn: "View upcoming hospital visits, assigned OPD rooms, token numbers, and clinical preparation guidelines.",
      descHi: "आगामी परामर्श, ओपीडी कक्ष, टोकन नंबर और आवश्यक तैयारी की जानकारी देखें।"
    },
    {
      key: 'prescriptions',
      icon: <Pill className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/60',
      titleEn: "Prescriptions & Meds",
      titleHi: "दवाएं एवं चिकित्सकीय पर्चे",
      descEn: "Review prescription slips, dosage schedules, food timing instructions, and duration in plain, understandable language.",
      descHi: "डॉक्टर के पर्चे, दवा की खुराक, खाने का सही समय और जरूरी सावधानियां आसानी से समझें।"
    },
    {
      key: 'records',
      icon: <FolderHeart className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      titleEn: "Health Records",
      titleHi: "दीर्घकालिक स्वास्थ्य रिकॉर्ड",
      descEn: "Track your longitudinal health journey grouped by illness and chronology, from hospital visits to follow-ups.",
      descHi: "बीमारी और समय के अनुसार व्यवस्थित अपना संपूर्ण स्वास्थ्य इतिहास ट्रैक करें।"
    },
    {
      key: 'ai',
      icon: <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      bg: 'bg-purple-50 dark:bg-purple-950/60',
      titleEn: "AI Health Assistance",
      titleHi: "एआई स्वास्थ्य सहायता",
      descEn: "Get plain-language explanations of complicated medical reports and ask follow-up questions safely with medical disclaimers.",
      descHi: "जटिल जांच रिपोर्टों का सरल भाषा में अर्थ समझें और स्वास्थ्य संबंधी प्रश्न पूछें।"
    }
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hi' ? 'आपकी स्वास्थ्य देखभाल के लिए सभी सुविधाएं' : 'Everything You Need for Your Care'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
          {language === 'hi'
            ? 'स्वास्थ्य जानकारी, सेवाएं और डिजिटल सहायता — सब कुछ एक सुरक्षित जगह पर।'
            : 'Healthcare information, services and digital assistance — all organized in one secure place.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.key}
            onClick={() => onSelectFeature(f.key)}
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner`}>
                {f.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {language === 'hi' ? f.titleHi : f.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {language === 'hi' ? f.descHi : f.descEn}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              <span>{language === 'hi' ? 'विवरण देखें' : 'Learn more'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
