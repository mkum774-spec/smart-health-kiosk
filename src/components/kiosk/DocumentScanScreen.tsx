import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  UserCheck, 
  Eye, 
  Plus, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
  Folder,
  Layers,
  Clock,
  ExternalLink,
  Bot
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { HistoricalDocument, ScannedDocument, TimeFilter } from '../../types';
import { MOCK_OCR_PRESETS } from '../../services/mockData';
import { voiceEngine } from '../../services/voiceEngine';
import { DocumentViewerModal } from '../common/DocumentViewerModal';

export const DocumentScanScreen: React.FC = () => {
  const { 
    setScreen, 
    historicalRecords,
    selectedPastRecords, 
    togglePastRecord,
    timeFilter,
    setTimeFilter,
    documents, 
    addDocument, 
    removeDocument, 
    checkDuplicateDocument,
    language, 
    t 
  } = useKiosk();

  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzingOcr, setIsAnalyzingOcr] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Duplicate detection state
  const [duplicateMatch, setDuplicateMatch] = useState<{
    scannedDoc: ScannedDocument;
    existingHistDoc: HistoricalDocument;
  } | null>(null);

  const [viewingDoc, setViewingDoc] = useState<ScannedDocument | HistoricalDocument | null>(null);

  // Time filter options for kiosk (Section 31)
  const timeFilterOptions: { key: TimeFilter; labelEn: string; labelHi: string }[] = [
    { key: '6M', labelEn: 'Last 6 Months', labelHi: 'पिछले 6 महीने' },
    { key: '1Y', labelEn: 'Last 1 Year', labelHi: 'पिछला 1 साल' },
    { key: 'ALL', labelEn: 'All Documents', labelHi: 'सभी दस्तावेज़' }
  ];

  // AI Recommended document IDs (e.g. chronic metabolic follow-up records: Blood Glucose, Lipid, Cardiology Rx)
  const aiRecommendedIds = useMemo(() => {
    return ['hist-1', 'hist-2', 'hist-3', 'hist-5'];
  }, []);

  // Filter historical records based on selected time filter
  const filteredRecords = useMemo(() => {
    if (timeFilter === '6M') {
      return historicalRecords.filter(r => r.monthYear.includes('June') || r.monthYear.includes('July') || r.monthYear.includes('August'));
    }
    if (timeFilter === '1Y') {
      return historicalRecords;
    }
    return historicalRecords;
  }, [historicalRecords, timeFilter]);

  // Dynamically group records by category (DO NOT HARD-CODE CATEGORIES!)
  const dynamicCategories = useMemo(() => {
    const cats = Array.from(new Set(filteredRecords.map(r => r.category)));
    return cats;
  }, [filteredRecords]);

  // Selected document count (historical + scanned during this session)
  const totalSelectedCount = selectedPastRecords.length + documents.length;

  // Trigger camera scan
  const startScan = (presetIndex: number = 0) => {
    setActivePresetIndex(presetIndex);
    setIsScanning(true);
    voiceEngine.playChime('tap');
  };

  const captureAndExtract = () => {
    voiceEngine.playChime('success');
    setIsScanning(false);
    setIsAnalyzingOcr(true);

    setTimeout(() => {
      setIsAnalyzingOcr(false);
      const rawPreset = MOCK_OCR_PRESETS[activePresetIndex % MOCK_OCR_PRESETS.length];
      const newDoc: ScannedDocument = {
        ...rawPreset,
        id: `scanned-${Date.now()}`
      };

      const dup = checkDuplicateDocument(newDoc);
      if (dup) {
        voiceEngine.playChime('alert');
        setDuplicateMatch({
          scannedDoc: newDoc,
          existingHistDoc: dup
        });
      } else {
        addDocument(newDoc);
      }
    }, 1200);
  };

  const handleUseExistingDuplicate = () => {
    setDuplicateMatch(null);
    voiceEngine.playChime('success');
  };

  const handleUploadAnyway = () => {
    if (duplicateMatch) {
      addDocument(duplicateMatch.scannedDoc);
      setDuplicateMatch(null);
    }
  };

  // Explicit confirmation and transition to ROS (Symptoms)
  const handleConfirmAndProceedToRos = () => {
    voiceEngine.playChime('success');
    setScreen('SYMPTOMS');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 select-none animate-fade-in">
      
      {/* Title & Guidance Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4 text-teal-800 dark:text-teal-400" />
          <span>{language === 'hi' ? 'चिकित्सीय दस्तावेज़ एवं परामर्श चयन' : 'Medical Documents & Consultation Sharing'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'hi' ? 'डॉक्टर के लिए दस्तावेज़ चुनें' : 'Select Documents for Your Doctor'}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-semibold mt-1 max-w-2xl mx-auto">
          {language === 'hi'
            ? 'केवल चुने गए दस्तावेज़ इस परामर्श के लिए साझा होंगे। आपकी पूरी मेडिकल लाइब्रेरी सुरक्षित रहेगी।'
            : 'Only selected records are shared for this visit. Your full repository remains safely archived.'}
        </p>
      </div>

      {/* Main Container */}
      <div className="space-y-6">

        {/* 1. Time-Range Filter & Summary Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              {language === 'hi' ? 'समय अवधि:' : 'Time Range:'}
            </span>
            <div className="flex items-center gap-1.5">
              {timeFilterOptions.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setTimeFilter(opt.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    timeFilter === opt.key
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {language === 'hi' ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Scanner Action */}
          <button
            type="button"
            onClick={() => startScan(0)}
            className="px-4 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-800 hover:bg-teal-100 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm self-start sm:self-auto"
          >
            <Camera className="w-4 h-4 text-teal-600" />
            <span>{language === 'hi' ? '+ नया पर्चा/रिपोर्ट स्कैन करें' : '+ Scan Paper Document'}</span>
          </button>
        </div>

        {/* 2. AI DOCUMENT RECOMMENDATIONS (Section 27) */}
        <div className="bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-teal-500/10 dark:from-teal-950/40 dark:to-emerald-950/40 p-5 sm:p-6 rounded-3xl border-2 border-teal-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h3 className="text-base sm:text-lg font-black text-teal-900 dark:text-teal-200">
                {language === 'hi' ? '⭐ इस परामर्श के लिए अनुशंसित दस्तावेज़' : '⭐ Recommended for This Consultation'}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-white/70 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-teal-200">
              AI Clinical Relevance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRecords.filter(r => aiRecommendedIds.includes(r.id)).map(rec => {
              const isSelected = selectedPastRecords.some(s => s.id === rec.id);
              return (
                <div
                  key={rec.id}
                  onClick={() => togglePastRecord(rec.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-teal-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-teal-400'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                        {rec.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">{rec.dateFormatted}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                      {language === 'hi' && rec.titleHi ? rec.titleHi : rec.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium truncate max-w-[240px]">
                      {rec.summary || rec.doctorOrLab}
                    </p>
                  </div>

                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. DYNAMIC CATEGORIES & PERSISTENT LIBRARY (Section 26 & 30) */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Folder className="w-5 h-5 text-slate-500" />
              <span>{language === 'hi' ? 'आपकी मेडिकल रिपॉजिटरी' : 'Your Medical Record Repository'}</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {filteredRecords.length} records available
            </span>
          </div>

          {/* Grouped by Dynamic Category */}
          <div className="space-y-6">
            {dynamicCategories.map(cat => {
              const catRecords = filteredRecords.filter(r => r.category === cat);
              return (
                <div key={cat} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {cat} ({catRecords.length})
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catRecords.map(rec => {
                      const isSelected = selectedPastRecords.some(s => s.id === rec.id);
                      const isRecommended = aiRecommendedIds.includes(rec.id);

                      return (
                        <div
                          key={rec.id}
                          className={`p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div
                            onClick={() => togglePastRecord(rec.id)}
                            className="space-y-1 cursor-pointer flex-1"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-500 font-bold">{rec.dateFormatted}</span>
                              {isRecommended && (
                                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  ⭐ AI Recommended
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              {language === 'hi' && rec.titleHi ? rec.titleHi : rec.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                              {rec.summary || rec.doctorOrLab}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setViewingDoc(rec)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Inspect Document"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => togglePastRecord(rec.id)}
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors cursor-pointer ${
                                isSelected
                                  ? 'border-teal-600 bg-teal-600 text-white'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. DOCUMENTS SCANNED ON THIS VISIT (Preserved) */}
        {documents.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border-2 border-teal-500/40 shadow-sm space-y-3">
            <h4 className="text-xs sm:text-sm font-black uppercase text-teal-800 dark:text-teal-200 tracking-wider">
              {language === 'hi' ? 'इस विजिट में स्कैन किए गए दस्तावेज़' : 'Scanned on Kiosk for This Visit'} ({documents.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map(doc => (
                <div key={doc.id} className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{doc.type} Document</p>
                    <p className="text-[11px] text-teal-700 dark:text-teal-300">{doc.type} • {doc.date} {doc.doctorName ? `• ${doc.doctorName}` : ''}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(doc.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OCR Analyzing Loader */}
        {isAnalyzingOcr && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-teal-500 shadow-lg text-center space-y-3 animate-pulse max-w-xl mx-auto">
            <div className="w-12 h-12 mx-auto border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-black text-teal-900 dark:text-teal-200">
              {t('simulatingOcr')}
            </p>
          </div>
        )}

        {/* Duplicate Detection Modal (Preserved) */}
        {duplicateMatch && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border-2 border-amber-400 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {language === 'hi' ? 'यह दस्तावेज़ पहले से उपलब्ध है' : 'Document Already in Records'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? `"${duplicateMatch.existingHistDoc.title}" (${duplicateMatch.existingHistDoc.dateFormatted}) आपके स्वास्थ्य रिकॉर्ड में पहले से मौजूद है।`
                  : `"${duplicateMatch.existingHistDoc.title}" (${duplicateMatch.existingHistDoc.dateFormatted}) is already saved in your ABHA health records.`}
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleUseExistingDuplicate}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs cursor-pointer"
                >
                  {language === 'hi' ? 'मौजूदा रिकॉर्ड का उपयोग करें' : 'Use Existing Record'}
                </button>
                <button
                  type="button"
                  onClick={handleUploadAnyway}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-100"
                >
                  {language === 'hi' ? 'फिर भी जोड़ें' : 'Add Anyway'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Kiosk Camera Viewfinder Overlay (Preserved) */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-lg w-full border-2 border-teal-500 shadow-2xl text-center space-y-6">
            <h3 className="text-2xl font-black text-white">
              {language === 'hi' ? 'दस्तावेज़ स्कैनर' : 'Document Scanner'}
            </h3>

            <div className="relative aspect-[4/3] bg-slate-800 rounded-2xl overflow-hidden border-4 border-dashed border-teal-400 flex flex-col items-center justify-center p-6 text-slate-300">
              <div className="w-48 h-32 border-2 border-teal-300 rounded-xl flex items-center justify-center shadow-inner relative">
                <FileText className="w-16 h-16 text-teal-400 opacity-60" />
                <div className="absolute inset-x-0 top-0 h-1 bg-teal-400 animate-bounce" />
              </div>
              <p className="text-sm font-bold text-teal-200 mt-4">
                {language === 'hi' 
                  ? 'पर्चे या रिपोर्ट को चौकोर बॉक्स के अंदर रखें' 
                  : 'Align prescription or lab report inside boundary'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsScanning(false)}
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-600 cursor-pointer"
              >
                {t('cancel')}
              </button>

              <button
                type="button"
                onClick={captureAndExtract}
                className="px-8 py-4 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-black text-xl rounded-2xl shadow-lg flex items-center gap-3 cursor-pointer"
              >
                <Camera className="w-6 h-6" />
                <span>{language === 'hi' ? 'फोटो खींचें' : 'Capture'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal (Preserved) */}
      <DocumentViewerModal
        document={viewingDoc}
        onClose={() => setViewingDoc(null)}
        language={language}
      />

      {/* 5. EXPLICIT CONFIRMATION BAR & NAVIGATION FOOTER (Section 28 & 33) */}
      <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setScreen('CONSENT')}
          className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-bold text-base rounded-2xl border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>

        {/* Confirmation Summary & Proceed to Clinical ROS */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="text-center sm:text-right">
            <span className="text-xs font-bold text-slate-500 block">
              {totalSelectedCount === 0
                ? (language === 'hi' ? 'कोई दस्तावेज़ चयनित नहीं' : 'No documents selected')
                : `${totalSelectedCount} ${language === 'hi' ? 'दस्तावेज़ इस परामर्श हेतु चयनित' : 'documents selected for this visit'}`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirmAndProceedToRos}
            className="w-full sm:w-auto min-w-[260px] px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white font-black text-lg rounded-2xl border-2 border-teal-800 shadow-xl flex items-center justify-center gap-3 cursor-pointer transition-all"
          >
            <span>
              {language === 'hi' ? 'पुष्टि करें और क्लिनिकल प्रश्नोत्तरी शुरू करें' : 'Confirm & Proceed to Clinical ROS'}
            </span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </div>

    </div>
  );
};
