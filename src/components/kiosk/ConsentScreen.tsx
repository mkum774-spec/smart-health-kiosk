import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Users, 
  Check, 
  ArrowRight, 
  Lock, 
  ArrowLeft,
  AlertCircle,
  Pill,
  ShieldAlert,
  Activity,
  CalendarCheck,
  Clock,
  Sparkles,
  Heart
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { HistoryScope, ConsentPayload, SharingPreference, GroupConsentSettings } from '../../types';

export const ConsentScreen: React.FC = () => {
  const { 
    setScreen, 
    setConsentGiven, 
    selectedPastRecords, 
    timeFilter,
    updateConsentPayload,
    groupConsent,
    updateGroupConsent,
    language, 
    t 
  } = useKiosk();

  const getInitialScope = (): HistoryScope => {
    if (timeFilter === '1M' || timeFilter === '3M' || timeFilter === '6M') return 'SIX_MONTHS';
    if (timeFilter === '1Y') return 'ONE_YEAR';
    if (timeFilter === 'ALL') return 'THREE_YEARS';
    return 'SIX_MONTHS';
  };

  const [shareHistory, setShareHistory] = useState<boolean>(true);
  const [historyScope, setHistoryScope] = useState<HistoryScope>(getInitialScope());
  const [shareOldDocuments, setShareOldDocuments] = useState<boolean>(true);

  // Group-level granular preferences (Section 20)
  const [preferences, setPreferences] = useState<GroupConsentSettings>(groupConsent);

  const scopeOptions: { key: HistoryScope; labelEn: string; labelHi: string }[] = [
    { key: 'SIX_MONTHS', labelEn: '6 Months', labelHi: '6 महीने' },
    { key: 'ONE_YEAR', labelEn: '1 Year', labelHi: '1 साल' },
    { key: 'THREE_YEARS', labelEn: '3 Years', labelHi: '3 साल' },
    { key: 'PREFER_NOT_TO_SAY', labelEn: 'Prefer Not to Say', labelHi: 'साझा नहीं करना' },
  ];

  const consentGroups = [
    {
      key: 'currentIllness' as const,
      titleEn: 'Current Illness & Symptoms',
      titleHi: 'वर्तमान बीमारी एवं लक्षण',
      descEn: 'Helps the doctor diagnose your immediate reason for visit.',
      descHi: 'चिकित्सक को तुरंत आपकी वर्तमान समस्या समझने में सहायता करता है।'
    },
    {
      key: 'medicalHistory' as const,
      titleEn: 'Past Medical & Surgical History',
      titleHi: 'पूर्व चिकित्सकीय व सर्जरी इतिहास',
      descEn: 'Ensures treatments do not conflict with past diagnoses.',
      descHi: 'यह सुनिश्चित करता है कि नया उपचार पूर्व बीमारियों से मेल खाए।'
    },
    {
      key: 'medications' as const,
      titleEn: 'Active Medications',
      titleHi: 'वर्तमान दवाएं',
      descEn: 'Prevents dangerous drug-to-drug interactions.',
      descHi: 'दवाओं के परस्पर हानिकारक प्रभाव को रोकता है।'
    },
    {
      key: 'familyHistory' as const,
      titleEn: 'Family Medical History',
      titleHi: 'पारिवारिक स्वास्थ्य इतिहास',
      descEn: 'Helps evaluate genetic risk for conditions like diabetes or heart disease.',
      descHi: 'मधुमेह या हृदय रोग जैसे आनुवंशिक जोखिमों का मूल्यांकन करता है।'
    },
    {
      key: 'documents' as const,
      titleEn: 'Past Scanned Reports & Prescriptions',
      titleHi: 'पूर्व जांच रिपोर्ट एवं पर्चे',
      descEn: 'Enables your doctor to review trends in blood tests and scans.',
      descHi: 'डॉक्टर को आपकी पुरानी रिपोर्ट और स्वास्थ्य प्रगति देखने की सुविधा देता है।'
    },
    {
      key: 'ayurveda' as const,
      titleEn: 'Ayurveda Assessment (Prakriti & Agni)',
      titleHi: 'आयुर्वेदिक प्रकृति व अग्नि विवरण',
      descEn: 'Allows Vaidyas and doctors to provide holistic lifestyle guidance.',
      descHi: 'वैद्य को समग्र जीवनशैली व आहार परामर्श देने में मदद करता है।'
    }
  ];

  const handlePreferenceChange = (group: keyof GroupConsentSettings, value: SharingPreference) => {
    const updated = { ...preferences, [group]: value };
    setPreferences(updated);
    updateGroupConsent(updated);

    // Sync to backend 3-field contract:
    const anyHistoryShared = updated.medicalHistory === 'SHARE' || updated.personalHistory === 'SHARE';
    setShareHistory(anyHistoryShared);
    setShareOldDocuments(updated.documents === 'SHARE');
  };

  const handleGiveConsent = () => {
    const payload: ConsentPayload = {
      share_history: shareHistory,
      history_scope: shareHistory ? historyScope : 'NONE',
      share_old_documents: shareOldDocuments
    };

    updateConsentPayload(payload);
    updateGroupConsent(preferences);
    setConsentGiven(true);
    setScreen('DOCUMENTS');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Lock className="w-4 h-4 text-teal-800 dark:text-teal-400" />
          <span>{language === 'hi' ? 'गोपनीयता एवं सहमति नियंत्रण (ABDM/DPDP)' : 'Privacy & Consent Control'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
          {language === 'hi' ? 'अपनी जानकारी साझा करने के विकल्प' : 'Who Can See Your Health Information?'}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-semibold mt-1 max-w-2xl mx-auto">
          {language === 'hi' 
            ? 'आप स्वयं तय कर सकते हैं कि डॉक्टर के साथ कौन सी जानकारी साझा करनी है' 
            : 'You are in control. Choose what information is shared with your consulting doctor.'}
        </p>
      </div>

      {/* Mandatory Safety Notice Banner (Non-negotiable clinical safety) */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 flex items-start gap-3.5 shadow-sm">
        <AlertCircle className="w-6 h-6 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-base font-black text-amber-950 dark:text-amber-200">
            {language === 'hi' ? 'चिकित्सकीय सुरक्षा प्रोटोकॉल' : 'Clinical Safety Protocol'}
          </h4>
          <p className="text-sm font-medium text-amber-900 dark:text-amber-300 mt-0.5">
            {language === 'hi' 
              ? 'दवाओं की गंभीर प्रतिक्रिया से बचाव के लिए एलर्जी और मुख्य लक्षण हमेशा डॉक्टर के साथ साझा किए जाते हैं।'
              : 'Allergies and chief complaints are always shared with your doctor to prevent life-threatening medical errors.'}
          </p>
        </div>
      </div>

      {/* Time Horizon Scope (Backend Contract 3) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <h4 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          <span>{language === 'hi' ? 'पुराने रिकॉर्ड्स की समय सीमा' : 'Prior Records Sharing Window'}</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {scopeOptions.map(opt => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setHistoryScope(opt.key)}
              className={`p-3 rounded-2xl border-2 font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                historyScope === opt.key
                  ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              {language === 'hi' ? opt.labelHi : opt.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Group-Level Sharing Cards (Section 20) */}
      <div className="space-y-4">
        {consentGroups.map(group => {
          const pref = preferences[group.key] || 'SHARE';

          return (
            <div
              key={group.key}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="max-w-md">
                <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? group.titleHi : group.titleEn}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {language === 'hi' ? group.descHi : group.descEn}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { id: 'SHARE', labelEn: 'Share', labelHi: 'साझा करें' },
                  { id: 'DONT_SHARE', labelEn: "Don't share", labelHi: 'साझा न करें' },
                  { id: 'PREFER_NOT_TO_SAY', labelEn: 'Prefer not to say', labelHi: 'बताना नहीं' }
                ].map(choice => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handlePreferenceChange(group.key, choice.id as SharingPreference)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      pref === choice.id
                        ? choice.id === 'SHARE'
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500'
                          : choice.id === 'DONT_SHARE'
                          ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500'
                          : 'bg-slate-700 text-white shadow-sm ring-2 ring-slate-500'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {language === 'hi' ? choice.labelHi : choice.labelEn}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setScreen('PAST_RECORDS')}
          className="px-6 py-3.5 rounded-2xl border-2 border-slate-300 hover:bg-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-base flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={handleGiveConsent}
          className="px-8 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-base shadow-lg cursor-pointer flex items-center gap-2 transition-all"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{language === 'hi' ? 'सहमति स्वीकारें और आगे बढ़ें' : 'Save Consent & Continue'}</span>
        </button>
      </div>
    </div>
  );
};
