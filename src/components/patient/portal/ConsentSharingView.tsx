import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  AlertCircle, 
  Save, 
  HelpCircle,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { Language, GroupConsentSettings, SharingPreference } from '../../../types';
import { patientPortalService } from '../../../services/patientPortalService';

interface ConsentSharingViewProps {
  language: Language;
}

export const ConsentSharingView: React.FC<ConsentSharingViewProps> = ({ language }) => {
  const [consent, setConsent] = useState<GroupConsentSettings>(() => patientPortalService.getConsentSettings());
  const [savedToast, setSavedToast] = useState(false);

  const handleUpdatePreference = (key: keyof GroupConsentSettings, val: SharingPreference) => {
    if (key === 'allergies') return; // Cannot modify locked allergy safety rule

    const updated = { ...consent, [key]: val };
    setConsent(updated);
    patientPortalService.updateConsentSettings(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const categories: {
    key: keyof GroupConsentSettings;
    titleEn: string;
    titleHi: string;
    descEn: string;
    descHi: string;
    locked?: boolean;
  }[] = [
    {
      key: 'allergies',
      titleEn: 'Known Drug & Food Allergies',
      titleHi: 'दवा एवं खाद्य एलर्जी (सुरक्षा नियम)',
      descEn: 'Critical clinical safety parameter required to prevent adverse drug events. Locked for patient protection.',
      descHi: 'प्रतिकूल दवा प्रतिक्रियाओं से बचाव हेतु अनिवार्य। मरीज सुरक्षा हेतु हमेशा साझा किया जाता है।',
      locked: true
    },
    {
      key: 'personalHistory',
      titleEn: 'Personal Demographics & Age',
      titleHi: 'व्यक्तिगत पहचान एवं आयु',
      descEn: 'Basic demographic factors and emergency contact information.',
      descHi: 'बुनियादी जानकारी और आपातकालीन संपर्क विवरण।'
    },
    {
      key: 'currentIllness',
      titleEn: 'Current Symptoms & Chief Complaints',
      titleHi: 'वर्तमान लक्षण एवं मुख्य परेशानी',
      descEn: 'Symptoms recorded during kiosk intake and clinical conversation.',
      descHi: 'कियोस्क या सहायक से बातचीत के दौरान दर्ज किए गए लक्षण।'
    },
    {
      key: 'medicalHistory',
      titleEn: 'Past Medical & Surgical History',
      titleHi: 'पिछला चिकित्सीय एवं शल्य इतिहास',
      descEn: 'Chronic conditions, previous hospitalizations, and major medical diagnoses.',
      descHi: 'पुरानी बीमारियां, अस्पताल में भर्ती होने का विवरण और गंभीर निदान।'
    },
    {
      key: 'medications',
      titleEn: 'Current Prescribed Medications',
      titleHi: 'वर्तमान में ली जा रही दवाएं',
      descEn: 'Active pharmaceutical regimens and daily dosage schedules.',
      descHi: 'वर्तमान में चालू दवाएं और दैनिक खुराक विवरण।'
    },
    {
      key: 'documents',
      titleEn: 'Diagnostic Reports & Scanned Records',
      titleHi: 'जांच रिपोर्ट एवं मूल स्कैन प्रति',
      descEn: 'Blood tests, imaging X-rays, pathology reports, and prescriptions.',
      descHi: 'खून की जांच, एक्स-रे और पुराने चिकित्सकीय पर्चे।'
    },
    {
      key: 'ayurveda',
      titleEn: 'Ayurvedic Constitutional Profile',
      titleHi: 'आयुर्वेदिक प्रकृति एवं जीवनशैली',
      descEn: 'Daśavidha Parīkṣā data, Prakriti, Agni, and lifestyle habits.',
      descHi: 'प्रकृति, पाचन अग्नि और दैनिक जीवनशैली का विवरण।'
    },
    {
      key: 'familyHistory',
      titleEn: 'Family Medical History',
      titleHi: 'पारिवारिक स्वास्थ्य इतिहास',
      descEn: 'Hereditary conditions like diabetes, hypertension, or cardiac history.',
      descHi: 'परिवार में मधुमेह, उच्च रक्तचाप या हृदय रोग का इतिहास।'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto pb-12 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'hi' ? 'सहमति एवं डेटा साझाकरण नियंत्रण' : 'Consent & Data Sharing Preferences'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {language === 'hi'
              ? 'आप नियंत्रित करते हैं कि डॉक्टर या अस्पताल के साथ कौन सी स्वास्थ्य जानकारी साझा की जाए।'
              : 'You control exactly which categories of your health data are shared with hospital clinicians.'}
          </p>
        </div>

        {savedToast && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{language === 'hi' ? 'सेटिंग्स सुरक्षित हुईं' : 'Preferences Saved'}</span>
          </div>
        )}
      </div>

      {/* Safety Notice regarding Allergies */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
        <p className="leading-relaxed font-medium">
          <strong>{language === 'hi' ? 'चिकित्सकीय सुरक्षा नियम: ' : 'Clinical Safety Lock: '}</strong>
          {language === 'hi'
            ? 'एलर्जी और दवाओं के प्रतिकूल प्रभाव की जानकारी हमेशा डॉक्टरों के साथ साझा की जाती है ताकि किसी गलत दवा से मरीज को खतरा न हो।'
            : 'Known allergies are always shared with treating physicians to prevent adverse drug reactions and medical emergencies.'}
        </p>
      </div>

      {/* Categories Card Grid */}
      <div className="space-y-4">
        {categories.map(cat => {
          const isLocked = cat.locked;
          const currentVal = isLocked ? 'SHARE' : consent[cat.key];

          return (
            <div
              key={cat.key}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isLocked 
                  ? 'bg-slate-50 dark:bg-slate-850 border-teal-500/40' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {language === 'hi' ? cat.titleHi : cat.titleEn}
                  </h3>
                  {isLocked && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Safety Rule
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {language === 'hi' ? cat.descHi : cat.descEn}
                </p>
              </div>

              {/* Action Buttons: Share / Don't Share / Prefer Not to Say */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isLocked ? (
                  <span className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                    <span>Always Shared</span>
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdatePreference(cat.key, 'SHARE')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentVal === 'SHARE'
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {language === 'hi' ? 'साझा करें' : 'Share'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdatePreference(cat.key, 'DONT_SHARE')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentVal === 'DONT_SHARE'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {language === 'hi' ? 'न साझा करें' : "Don't Share"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdatePreference(cat.key, 'PREFER_NOT_TO_SAY')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentVal === 'PREFER_NOT_TO_SAY'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {language === 'hi' ? 'नहीं बताना' : 'Prefer Not to Say'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
