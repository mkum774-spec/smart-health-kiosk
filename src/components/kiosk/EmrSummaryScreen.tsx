import React from 'react';
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
  Stethoscope
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { TriageLevel } from '../../types';

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
    generateTokenAndRegister, 
    language, 
    t 
  } = useKiosk();

  const handleConfirmAndGenerate = () => {
    generateTokenAndRegister();
    setScreen('TOKEN');
  };

  const triageBadgeConfig: Record<TriageLevel, { bg: string; border: string; text: string; labelEn: string; labelHi: string; icon: any }> = {
    EMERGENCY: {
      bg: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-900',
      labelEn: '🔴 Emergency Priority (Immediate Clinical Review)',
      labelHi: '🔴 आपातकालीन प्राथमिकता (तत्काल समीक्षा)',
      icon: AlertOctagon
    },
    URGENT: {
      bg: 'bg-amber-100',
      border: 'border-amber-400',
      text: 'text-amber-950',
      labelEn: '🟠 Urgent / Priority Assessment',
      labelHi: '🟠 प्राथमिकता मूल्यांकन',
      icon: AlertCircle
    },
    MODERATE: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-400',
      text: 'text-yellow-950',
      labelEn: '🟡 Moderate (Standard OPD Queue)',
      labelHi: '🟡 मध्यम (ओपीडी परामर्श)',
      icon: CheckCircle2
    },
    ROUTINE: {
      bg: 'bg-emerald-100',
      border: 'border-emerald-400',
      text: 'text-emerald-950',
      labelEn: '🟢 Routine (Standard OPD Queue)',
      labelHi: '🟢 सामान्य ओपीडी परामर्श',
      icon: CheckCircle2
    }
  };

  const triageCfg = triageBadgeConfig[currentTriageLevel] || triageBadgeConfig.ROUTINE;
  const TriageIcon = triageCfg.icon;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 select-none">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('reviewTitle')}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-semibold mt-1">
          {t('reviewSubtitle')}
        </p>
      </div>

      {/* Main Review Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-300 shadow-xl space-y-6">
        {/* Preliminary Triage Banner */}
        <div className={`p-4 rounded-2xl border-2 ${triageCfg.bg} ${triageCfg.border} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <TriageIcon className={`w-7 h-7 ${triageCfg.text}`} />
            <div>
              <span className="text-xs font-black uppercase tracking-wider block opacity-75">
                {t('preliminaryTriageTitle')}
              </span>
              <p className={`text-xl font-black ${triageCfg.text}`}>
                {language === 'hi' ? triageCfg.labelHi : triageCfg.labelEn}
              </p>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-600 max-w-xs text-right hidden sm:block">
            {t('triageDisclaimer')}
          </p>
        </div>

        {/* Prominent Allergy Banner */}
        {history.allergies && history.allergies.length > 0 ? (
          <div className="p-4 bg-red-100 border-2 border-red-500 rounded-2xl flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-red-900">
                ⚠ {t('allergiesSummary')}:
              </span>
              <p className="text-xl font-black text-red-950">
                {history.allergies.join(', ')}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t('noKnownAllergiesBtn')}</span>
          </div>
        )}

        {/* Structured 2-Column Clinical Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Patient Information & Current Symptoms */}
          <div className="space-y-4">
            {/* Patient Info */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-teal-800 font-bold text-xs uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{t('patientInfo')}</span>
                </span>
                <button 
                  type="button" 
                  onClick={() => setScreen('ABHA')}
                  className="text-xs text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {t('edit')}
                </button>
              </div>
              <p className="text-2xl font-black text-slate-900">
                {language === 'hi' && activePatient?.nameHi ? activePatient.nameHi : (activePatient?.name || 'Demo Patient P001')}
              </p>
              <p className="text-sm font-semibold text-slate-600">
                {activePatient?.age || 52} yrs • {activePatient?.gender || 'FEMALE'} • {activePatient?.phone || '+91 98765 43210'}
              </p>
              <p className="text-xs font-mono font-bold text-teal-800">
                ABHA: {activePatient?.abhaNumber || 'DEMO-ABHA-P001'}
              </p>
            </div>

            {/* Current Symptoms */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-teal-800 font-bold text-xs uppercase tracking-wider">
                <span>{t('currentSymptoms')}</span>
                <button 
                  type="button" 
                  onClick={() => setScreen('SYMPTOMS')}
                  className="text-xs text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {t('edit')}
                </button>
              </div>
              <p className="text-lg font-black text-slate-900 leading-snug">
                "{symptomsText || 'General Outpatient Consultation'}"
              </p>
              <p className="text-xs font-bold text-slate-500">
                Duration: <span className="text-slate-800 font-black">{symptomsDuration || '1 - 3 days'}</span>
              </p>
            </div>

            {/* Height & Weight */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-teal-800 font-bold text-xs uppercase tracking-wider">
                <span>{t('heightWeight')}</span>
                <button 
                  type="button" 
                  onClick={() => setScreen('VITALS')}
                  className="text-xs text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {t('edit')}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">{t('heightLabel')}</span>
                  <span className="text-lg font-black font-mono text-slate-900">{vitals.heightCm || 162} cm</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">{t('weightLabel')}</span>
                  <span className="text-lg font-black font-mono text-slate-900">{vitals.weightKg || 62} kg</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">{t('bmiLabel')}</span>
                  <span className="text-lg font-black font-mono text-teal-800">{vitals.bmi || 23.6}</span>
                </div>
              </div>
            </div>

            {/* Assessment Track Summary (Ayurveda vs General) */}
            {assessmentTrack === 'ayurveda' ? (
              <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-300 space-y-2">
                <div className="flex items-center justify-between text-amber-950 font-bold text-xs uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'hi' ? 'आयुर्वेदिक प्रश्न परीक्षा' : 'Ayurvedic Assessment (Prashna Pariksha)'}</span>
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setScreen('AYURVEDA')}
                    className="text-xs text-amber-900 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> {t('edit')}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
                  <div className="p-2 bg-white rounded-xl border border-amber-200">
                    <span className="text-[10px] text-slate-400 block uppercase">Prakriti</span>
                    <span className="text-amber-950">{ayurvedaData?.prakriti || 'Pitta-Vata'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-amber-200">
                    <span className="text-[10px] text-slate-400 block uppercase">Agni</span>
                    <span className="text-amber-950">{ayurvedaData?.agni || 'VISHAMA (Irregular)'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-amber-200">
                    <span className="text-[10px] text-slate-400 block uppercase">Koshtha</span>
                    <span className="text-amber-950">{ayurvedaData?.koshtha || 'MADHYAMA'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-amber-200">
                    <span className="text-[10px] text-slate-400 block uppercase">Ahara / Vyayama</span>
                    <span className="text-amber-950">{ayurvedaData?.ahara_shakti || 'MADHYAMA'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-2">
                <div className="flex items-center justify-between text-teal-950 font-bold text-xs uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-teal-700" />
                    <span>{language === 'hi' ? 'सामान्य / त्वरित चेक-इन' : 'General / Quick Check-in'}</span>
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setScreen('ASSESSMENT_TYPE')}
                    className="text-xs text-teal-800 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> {t('edit')}
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  {language === 'hi' 
                    ? 'त्वरित ओपीडी परामर्श मोड चुना गया। संवैधानिक प्रश्न (प्रकृति/अग्नि) छोड़े गए।' 
                    : 'Standard outpatient consultation selected. Constitutional questions omitted for faster check-in.'}
                </p>
                <div className="inline-block px-2.5 py-0.5 bg-white border border-teal-300 rounded-lg text-[11px] font-mono font-black text-teal-900">
                  TRACK: GENERAL OPD
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Medical History & Shared Records Summary */}
          <div className="space-y-4">
            {/* Medical History */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-teal-800 font-bold text-xs uppercase tracking-wider">
                <span>{t('medicalHistorySummary')}</span>
                <button 
                  type="button" 
                  onClick={() => setScreen('HISTORY')}
                  className="text-xs text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {t('edit')}
                </button>
              </div>
              <p className="text-sm font-bold text-slate-800">
                Conditions: <span className="font-semibold text-slate-600">{history.chronicConditions?.join(', ') || 'None reported'}</span>
              </p>
              <p className="text-sm font-bold text-slate-800">
                Current Medications: <span className="font-semibold text-slate-600">{history.currentMedications?.join(', ') || 'None reported'}</span>
              </p>
            </div>

            {/* Previous Records Shared */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-teal-800 font-bold text-xs uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <FolderOpen className="w-4 h-4" />
                  <span>{t('previousRecordsShared')}</span>
                </span>
                <button 
                  type="button" 
                  onClick={() => setScreen('PAST_RECORDS')}
                  className="text-xs text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {t('edit')}
                </button>
              </div>
              <p className="text-lg font-black text-slate-900">
                {selectedPastRecords.length > 0
                  ? `${selectedPastRecords.length} ${selectedPastRecords.length === 1 ? 'document' : 'documents'}`
                  : (language === 'hi' ? 'कोई रिकॉर्ड साझा नहीं किया गया' : 'None shared for this visit')}
              </p>
              {selectedPastRecords.length > 0 && (
                <div className="text-xs text-slate-600 space-y-0.5 pt-1">
                  {selectedPastRecords.map(doc => (
                    <p key={doc.id} className="truncate">• {doc.title} ({doc.dateFormatted})</p>
                  ))}
                </div>
              )}
            </div>

            {/* New Documents Scanned */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-teal-800 font-bold text-xs uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{t('newDocumentsSummary')}</span>
                </span>
                <button 
                  type="button" 
                  onClick={() => setScreen('DOCUMENTS')}
                  className="text-xs text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {t('edit')}
                </button>
              </div>
              <p className="text-lg font-black text-slate-900">
                {documents.length > 0
                  ? `${documents.length} ${documents.length === 1 ? 'document scanned' : 'documents scanned'}`
                  : (language === 'hi' ? 'कोई नया दस्तावेज़ स्कैन नहीं' : 'None scanned today')}
              </p>
              {documents.length > 0 && (
                <div className="text-xs text-slate-600 space-y-0.5 pt-1">
                  {documents.map(d => (
                    <p key={d.id} className="truncate">• [{d.type}] {d.doctorName || d.summary}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setScreen('DOCUMENTS')}
          className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-lg rounded-2xl border-2 border-slate-300 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={handleConfirmAndGenerate}
          className="min-w-[280px] px-8 py-5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-black text-2xl rounded-2xl border-2 border-teal-800 shadow-xl flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>{t('confirmGenerateToken')}</span>
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
