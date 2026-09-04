import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { HistoricalDocument, ScannedDocument } from '../../types';
import { MOCK_OCR_PRESETS } from '../../services/mockData';
import { voiceEngine } from '../../services/voiceEngine';

export const DocumentScanScreen: React.FC = () => {
  const { 
    setScreen, 
    documents, 
    addDocument, 
    removeDocument, 
    selectedPastRecords, 
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

  const [viewingExistingDoc, setViewingExistingDoc] = useState<HistoricalDocument | null>(null);

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

      // Check for duplicate against selected ABHA records or available historical records
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
    // Dismiss duplicate prompt without adding redundant copy
    setDuplicateMatch(null);
    voiceEngine.playChime('success');
  };

  const handleUploadAnyway = () => {
    if (duplicateMatch) {
      addDocument(duplicateMatch.scannedDoc);
      setDuplicateMatch(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 select-none">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('docTitle')}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-semibold mt-1">
          {t('docSubtitle')}
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Scanner Trigger: Clean, Large, Professional */}
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => startScan(0)}
            className="w-full min-h-[96px] p-6 bg-white hover:bg-teal-50 active:bg-teal-100 rounded-3xl border-3 border-teal-700 shadow-lg flex items-center justify-between gap-4 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0 shadow-md">
                <Camera className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{t('scanDocument')}</p>
                <p className="text-xs sm:text-sm font-bold text-teal-800 mt-0.5">
                  Prescriptions, Lab Reports, Diagnostic Tests
                </p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0">
              <Plus className="w-6 h-6" />
            </div>
          </button>
        </div>

        {/* OCR Analyzing Loader */}
        {isAnalyzingOcr && (
          <div className="bg-white p-8 rounded-3xl border-2 border-teal-500 shadow-lg text-center space-y-3 animate-pulse max-w-xl mx-auto">
            <div className="w-12 h-12 mx-auto border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
            <p className="text-xl font-black text-teal-900">
              {t('simulatingOcr')}
            </p>
          </div>
        )}

        {/* DOCUMENT SELECTION SUMMARY (Itemized: FROM HEALTH RECORDS vs FROM THIS VISIT) */}
        {(selectedPastRecords.length > 0 || documents.length > 0) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>{t('scannedDocsList')}</span>
              </h3>
              <button
                type="button"
                onClick={() => startScan(1)}
                className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs sm:text-sm rounded-xl border border-teal-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{t('addAnotherDocBtn')}</span>
              </button>
            </div>

            {/* Sub-section 1: FROM HEALTH RECORDS (ABHA) */}
            {selectedPastRecords.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 inline-block">
                  {t('fromHealthRecords')} ({selectedPastRecords.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPastRecords.map(doc => (
                    <div
                      key={doc.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-teal-700 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900">{doc.title}</p>
                          <p className="text-[11px] text-slate-500 font-semibold">{doc.dateFormatted} • {doc.doctorOrLab}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700">✓ Attached</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-section 2: FROM THIS VISIT (Newly Scanned) */}
            {documents.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block">
                  {t('fromThisVisit')} ({documents.length})
                </span>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="p-4 bg-white rounded-2xl border-2 border-slate-300 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <Camera className="w-5 h-5 text-teal-700 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-black uppercase">
                            {doc.type}
                          </span>
                          <p className="font-black text-slate-900 text-base mt-0.5">{doc.summary || doc.doctorName}</p>
                          <p className="text-xs text-slate-500 font-semibold">{doc.date} • {doc.doctorName}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>{t('ocrDisclaimer')}</span>
            </div>
          </div>
        )}
      </div>

      {/* DUPLICATE DOCUMENT DETECTION MODAL */}
      {duplicateMatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-3 border-amber-400 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  {t('duplicateDocTitle')}
                </h3>
                <p className="text-xs font-bold text-amber-800">
                  {t('duplicateDocDesc')}
                </p>
              </div>
            </div>

            {/* Matching Document Preview Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-2">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                Existing Historical Record
              </span>
              <p className="text-lg font-black text-slate-900">
                {duplicateMatch.existingHistDoc.title}
              </p>
              <p className="text-xs text-slate-600 font-semibold">
                {duplicateMatch.existingHistDoc.dateFormatted} • {duplicateMatch.existingHistDoc.doctorOrLab}
              </p>
              {duplicateMatch.existingHistDoc.summary && (
                <p className="text-xs text-slate-500 italic mt-1">
                  "{duplicateMatch.existingHistDoc.summary}"
                </p>
              )}
            </div>

            {/* Actions: View Existing, Use Existing, Upload Anyway */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleUseExistingDuplicate}
                className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-black text-base rounded-2xl border-2 border-teal-800 shadow-md cursor-pointer transition-all"
              >
                ✓ {t('useExistingDoc')}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setViewingExistingDoc(duplicateMatch.existingHistDoc)}
                  className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t('viewExistingDoc')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleUploadAnyway}
                  className="py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 cursor-pointer"
                >
                  {t('uploadAnyway')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Existing Historical Doc Quick Modal */}
      {viewingExistingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-slate-300 shadow-2xl space-y-4">
            <h4 className="text-lg font-black text-slate-900">{viewingExistingDoc.title}</h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <p><strong>Category:</strong> {viewingExistingDoc.category}</p>
              <p><strong>Date:</strong> {viewingExistingDoc.dateFormatted}</p>
              <p><strong>Issued by:</strong> {viewingExistingDoc.doctorOrLab}</p>
              <p><strong>Summary:</strong> {viewingExistingDoc.summary}</p>
            </div>
            <button
              type="button"
              onClick={() => setViewingExistingDoc(null)}
              className="w-full py-3 bg-teal-700 text-white font-bold rounded-xl"
            >
              {t('done')}
            </button>
          </div>
        </div>
      )}

      {/* Simulated Camera Scanner Viewfinder */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-lg w-full border-2 border-teal-500 shadow-2xl text-center space-y-6">
            <h3 className="text-2xl font-black text-white">
              {language === 'hi' ? 'दस्तावेज़ स्कैनर' : 'Document Scanner'}
            </h3>

            {/* Viewfinder Frame */}
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

            {/* Shutter Button */}
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

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setScreen('HISTORY')}
          className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-lg rounded-2xl border-2 border-slate-300 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={() => setScreen('REVIEW')}
          className="min-w-[240px] px-8 py-5 bg-teal-700 hover:bg-teal-800 text-white font-black text-xl rounded-2xl border-2 border-teal-800 shadow-xl flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>{(documents.length > 0 || selectedPastRecords.length > 0) ? t('continue') : t('skipDocBtn')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
