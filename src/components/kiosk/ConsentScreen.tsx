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
  Clock
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { HistoryScope, ConsentPayload } from '../../types';

export const ConsentScreen: React.FC = () => {
  const { 
    setScreen, 
    setConsentGiven, 
    selectedPastRecords, 
    timeFilter,
    updateConsentPayload,
    language, 
    t 
  } = useKiosk();

  // Map initial time filter from past records to backend scope
  const getInitialScope = (): HistoryScope => {
    if (timeFilter === '1M' || timeFilter === '3M' || timeFilter === '6M') return 'SIX_MONTHS';
    if (timeFilter === '1Y') return 'ONE_YEAR';
    if (timeFilter === 'ALL') return 'THREE_YEARS';
    return 'SIX_MONTHS';
  };

  // Exactly the three backend consent fields:
  const [shareHistory, setShareHistory] = useState<boolean>(true);
  const [historyScope, setHistoryScope] = useState<HistoryScope>(getInitialScope());
  const [shareOldDocuments, setShareOldDocuments] = useState<boolean>(selectedPastRecords.length > 0 || true);
  const [hasConfirmedConsent, setHasConfirmedConsent] = useState<boolean>(true);

  const scopeOptions: { key: HistoryScope; labelEn: string; labelHi: string }[] = [
    { key: 'SIX_MONTHS', labelEn: '6 Months', labelHi: '6 महीने' },
    { key: 'ONE_YEAR', labelEn: '1 Year', labelHi: '1 साल' },
    { key: 'THREE_YEARS', labelEn: '3 Years', labelHi: '3 साल' },
    { key: 'PREFER_NOT_TO_SAY', labelEn: 'Prefer Not to Say', labelHi: 'साझा नहीं करना' },
    { key: 'NONE', labelEn: 'None', labelHi: 'कोई नहीं' },
  ];

  const handleGiveConsent = () => {
    const payload: ConsentPayload = {
      share_history: shareHistory,
      history_scope: shareHistory ? historyScope : 'NONE',
      share_old_documents: shareOldDocuments
    };

    updateConsentPayload(payload);
    setConsentGiven(true);
    setScreen('SYMPTOMS');
  };

  const handleGoBack = () => {
    setScreen('PAST_RECORDS');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 text-teal-900 border border-teal-300 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Lock className="w-4 h-4 text-teal-800" />
          <span>{language === 'hi' ? 'डिजिटल डेटा सुरक्षा सहमति (ABDM/DPDP)' : 'ABDM & DPDP Digital Health Consent'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('consentTitle')}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-semibold mt-1 max-w-2xl mx-auto">
          {t('consentSubtitle')}
        </p>
      </div>

      {/* Mandatory Safety Notice Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start gap-3.5 shadow-sm">
        <AlertCircle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-base font-black text-amber-950">
            {language === 'hi' ? 'चिकित्सकीय सुरक्षा नियम' : 'Clinical Safety Protocol'}
          </h4>
          <p className="text-sm font-medium text-amber-900 mt-0.5">
            {t('consentAlwaysSharedDesc')}
          </p>
        </div>
      </div>

      {/* Sharing Categories List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-5">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
          {language === 'hi' ? 'स्वास्थ्य डेटा सहमति विनिर्देश (3 मुख्य क्षेत्र)' : 'CONSENT SPECIFICATION (3 BACKEND FIELDS)'}
        </h3>

        {/* 1. MANDATORY SAFETY DATA (Allergies & Current Meds - Permanently Locked On) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Allergies Locked */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border-2 border-teal-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 border border-teal-300">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{t('consentAllergiesTitle')}</p>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800">
                  <Lock className="w-3 h-3 text-teal-700" />
                  <span>{t('consentAlwaysSharedNotice')}</span>
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-700 text-white uppercase">
              {t('consentLockedBadge')}
            </span>
          </div>

          {/* Current Medications Locked */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border-2 border-teal-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 border border-teal-300">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{t('consentMedsTitle')}</p>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800">
                  <Lock className="w-3 h-3 text-teal-700" />
                  <span>{t('consentAlwaysSharedNotice')}</span>
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-700 text-white uppercase">
              {t('consentLockedBadge')}
            </span>
          </div>
        </div>

        {/* 2. FIELD 1: share_history (bool) */}
        <div 
          onClick={() => setShareHistory(!shareHistory)}
          className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            shareHistory 
              ? 'bg-slate-50 border-slate-300 hover:border-slate-400' 
              : 'bg-white border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all ${
              shareHistory ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-lg font-black text-slate-900">
                  {language === 'hi' ? 'पूर्व चिकित्सीय इतिहास साझा करें (share_history)' : 'Share Previous Consultation History (share_history)'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 font-mono">
                  {shareHistory ? 'true' : 'false'}
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium mt-1">
                {t('consentPastConsultationsDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              type="button"
              className={`w-16 h-9 rounded-full p-1 flex items-center transition-colors cursor-pointer ${
                shareHistory ? 'bg-teal-700 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
                {shareHistory ? (
                  <Check className="w-4 h-4 text-teal-700 stroke-[3]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* 3. FIELD 2: history_scope (Enum) */}
        {shareHistory && (
          <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/60 border-2 border-sky-200 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-700" />
              <span className="text-xs font-black uppercase tracking-wider text-sky-900">
                {language === 'hi' ? 'इतिहास साझा करने की समयावधि (history_scope)' : 'History Scope Period (history_scope)'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {scopeOptions.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setHistoryScope(opt.key)}
                  className={`p-2.5 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all cursor-pointer text-center ${
                    historyScope === opt.key
                      ? 'bg-sky-700 text-white border-sky-800 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>{language === 'hi' ? opt.labelHi : opt.labelEn}</div>
                  <div className="text-[10px] font-mono opacity-80 mt-0.5">{opt.key}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. FIELD 3: share_old_documents (bool) */}
        <div 
          onClick={() => setShareOldDocuments(!shareOldDocuments)}
          className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            shareOldDocuments 
              ? 'bg-slate-50 border-slate-300 hover:border-slate-400' 
              : 'bg-white border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all ${
              shareOldDocuments ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-lg font-black text-slate-900">
                  {language === 'hi' ? 'पुराने चिकित्सकीय दस्तावेज़ साझा करें (share_old_documents)' : 'Share Old Medical Documents & Scans (share_old_documents)'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 font-mono">
                  {shareOldDocuments ? 'true' : 'false'}
                </span>
                {selectedPastRecords.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-teal-100 text-teal-800 border border-teal-300">
                    {selectedPastRecords.length} {language === 'hi' ? 'दस्तावेज़ चयनित' : 'selected'}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 font-medium mt-1">
                {t('consentReportsDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              type="button"
              className={`w-16 h-9 rounded-full p-1 flex items-center transition-colors cursor-pointer ${
                shareOldDocuments ? 'bg-teal-700 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
                {shareOldDocuments ? (
                  <Check className="w-4 h-4 text-teal-700 stroke-[3]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* 3 Privacy Guardrails */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <Users className="w-4 h-4 text-teal-700 flex-shrink-0" />
            <span className="font-semibold text-slate-700">
              {language === 'hi' ? 'केवल आज के डॉक्टर' : 'Authorized Doctors Only'}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0" />
            <span className="font-semibold text-slate-700">
              {language === 'hi' ? 'परामर्श व सुरक्षा उद्देश्य' : 'OPD Care & Safety Purpose'}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <CalendarCheck className="w-4 h-4 text-teal-700 flex-shrink-0" />
            <span className="font-semibold text-slate-700">
              {language === 'hi' ? 'केवल आज के लिए वैध' : 'Valid for Today (24h)'}
            </span>
          </div>
        </div>

        {/* Checkbox confirmation */}
        <div 
          onClick={() => setHasConfirmedConsent(!hasConfirmedConsent)}
          className="flex items-center gap-4 p-4 bg-teal-50 border-2 border-teal-300 rounded-2xl cursor-pointer select-none transition-all hover:bg-teal-100/70 mt-2"
        >
          <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            hasConfirmedConsent ? 'bg-teal-700 border-teal-800 text-white' : 'bg-white border-slate-400'
          }`}>
            {hasConfirmedConsent && <Check className="w-6 h-6 stroke-[3]" />}
          </div>
          <p className="text-base sm:text-lg font-black text-teal-950">
            {t('consentCheckboxLabel')}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleGoBack}
          className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-lg rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('consentGoBackBtn')}</span>
        </button>

        <button
          type="button"
          disabled={!hasConfirmedConsent}
          onClick={handleGiveConsent}
          className="w-full sm:w-auto min-w-[280px] px-8 py-5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xl rounded-2xl border-2 border-teal-800 shadow-xl flex items-center justify-center gap-3 cursor-pointer transition-all"
        >
          <span>{t('giveConsentBtn')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
