import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldAlert, 
  User, 
  FileText, 
  Edit3, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  AlertOctagon,
  Scale,
  Ruler,
  FolderOpen,
  Leaf,
  Stethoscope,
  Loader2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { TriageLevel } from '../../types';
import { AbnormalFindingCard } from '../common/AbnormalFindingCard';
import { MedicationCard } from '../common/MedicationCard';
import { IllnessTimeline } from '../common/IllnessTimeline';
import { EmergencyBanner } from '../common/EmergencyBanner';

export const EmrSummaryScreen: React.FC = () => {
  const { 
    setScreen, 
    activePatient, 
    symptomsText, 
    symptomsDuration, 
    vitals, 
    history, 
    documents, 
    selectedPastRecords,
    ayurvedaData,
    assessmentTrack,
    currentTriageLevel,
    abnormalFindings,
    structuredMedications,
    illnessRecords,
    groupConsent,
    generateTokenAndRegister, 
    language, 
    t 
  } = useKiosk();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleConfirmAndGenerate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await generateTokenAndRegister();
      setScreen('TOKEN');
    } catch (err: any) {
      console.error('Failed to generate token and register with backend:', err);
      const errMsg = err?.message || (language === 'hi'
        ? 'आधिकारिक टोकन जनरेट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
        : 'Failed to generate official consultation token. Please try again.');
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmergency = currentTriageLevel === 'EMERGENCY';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          <span>{language === 'hi' ? 'अंतिम सत्यापन एवं पुष्टि' : 'Pre-Consultation Review'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
          {language === 'hi' ? 'आपका स्वास्थ्य सारांश' : 'Your Health Summary'}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-semibold mt-1">
          {language === 'hi'
            ? 'कृपया विवरण की जांच करें। पुष्टि करने पर डॉक्टर के लिए आधिकारिक टोकन जनरेट होगा।'
            : 'Please review your details. Confirming will generate your official doctor consultation token.'}
        </p>
      </div>

      {/* Emergency State Banner (Section 27) */}
      {isEmergency && (
        <EmergencyBanner
          language={language}
          className="mb-6"
        />
      )}

      {/* Submission Error Banner */}
      {submitError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-black text-rose-950">
              {language === 'hi' ? 'टोकन निर्माण असफल' : 'Registration Failed'}
            </h4>
            <p className="text-xs font-medium text-rose-800 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Patient Demographics & Main Concern */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center font-black text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  {activePatient?.name || "Patient Record"}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  ABHA: {activePatient?.abhaNumber || activePatient?.abhaAddress || "ABHA-P001"} • {activePatient?.age || 52}y • {activePatient?.gender || "FEMALE"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setScreen('SYMPTOMS')}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('edit')}</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {language === 'hi' ? 'मुख्य समस्या एवं अवधि' : 'Main Concern & Duration'}
            </span>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {symptomsText || "General Health Consultation"}
            </p>
            <span className="text-xs text-slate-500 font-mono mt-0.5 block">
              {language === 'hi' ? 'अवधि:' : 'Duration:'} {symptomsDuration}
            </span>
          </div>
        </div>

        {/* 2. Abnormal Findings Highlighting (Section 21 & 23) */}
        {abnormalFindings && abnormalFindings.length > 0 && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                {language === 'hi' ? 'रिपोर्ट्स में ध्यान देने योग्य परिणाम' : 'Test Findings Requiring Attention'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {abnormalFindings.map(item => (
                <AbnormalFindingCard
                  key={item.id}
                  finding={item}
                  language={language}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Current Medications (Section 26) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              {language === 'hi' ? 'वर्तमान दवाएं' : 'Current Medications'}
            </h3>
            <button
              type="button"
              onClick={() => setScreen('HISTORY')}
              className="text-xs text-teal-700 font-bold hover:underline"
            >
              {t('edit')}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {structuredMedications.map(med => (
              <MedicationCard
                key={med.id}
                medication={med}
                language={language}
              />
            ))}
          </div>
        </div>

        {/* 4. Illness History Timeline (Section 25) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              {language === 'hi' ? 'बीमारी का कालक्रम (इतिहास)' : 'Health History Timeline'}
            </h3>
            <button
              type="button"
              onClick={() => setScreen('HISTORY')}
              className="text-xs text-teal-700 font-bold hover:underline"
            >
              {t('edit')}
            </button>
          </div>
          <IllnessTimeline
            illnesses={illnessRecords}
            language={language}
          />
        </div>

        {/* 5. Ayurveda Assessment Summary (Step 5 Redesign) */}
        {ayurvedaData && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'आयुर्वेदिक प्रोफाइल' : 'Ayurvedic Profile'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setScreen('AYURVEDA')}
                className="text-xs text-teal-700 font-bold hover:underline"
              >
                {t('edit')}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">प्रकृति (Prakriti)</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{ayurvedaData.prakriti}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">अग्नि (Agni)</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{ayurvedaData.agni}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">आहार शक्ति</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{ayurvedaData.ahara_shakti}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">व्यायाम शक्ति</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{ayurvedaData.vyayama_shakti}</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Information Shared with Doctor (Section 21) */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>{language === 'hi' ? 'डॉक्टर के साथ साझा की जा रही जानकारी' : 'Information Shared with Doctor'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{language === 'hi' ? 'लक्षण एवं मुख्य समस्या' : 'Symptoms & Chief Complaint'}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{language === 'hi' ? 'एलर्जी (सुरक्षा प्रोटोकॉल)' : 'Allergies (Clinical Safety Protocol)'}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{language === 'hi' ? 'वर्तमान दवाएं' : 'Current Active Medications'}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{language === 'hi' ? 'अपलोड की गई जांच रिपोर्ट' : 'Uploaded Test Reports & Scans'}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{language === 'hi' ? 'पूर्व चिकित्सकीय इतिहास' : 'Past Medical History'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              {groupConsent.familyHistory === 'SHARE' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700 dark:text-emerald-400">{language === 'hi' ? 'पारिवारिक इतिहास (साझा)' : 'Family History (Shared)'}</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 text-slate-400 stroke-[3]" />
                  <span>{language === 'hi' ? 'पारिवारिक इतिहास (साझा नहीं किया गया)' : 'Family History (Withheld per patient preference)'}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Actions */}
      <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setScreen('HISTORY')}
          disabled={isSubmitting}
          className="px-6 py-3.5 rounded-2xl border-2 border-slate-300 hover:bg-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-base flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={handleConfirmAndGenerate}
          disabled={isSubmitting}
          className="px-8 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-black text-lg shadow-xl cursor-pointer flex items-center gap-3 transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{language === 'hi' ? 'टोकन बनाया जा रहा है...' : 'Generating Token...'}</span>
            </>
          ) : (
            <>
              <span>{language === 'hi' ? 'पुष्टि करें और टोकन जनरेट करें' : 'Confirm & Generate Token'}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
