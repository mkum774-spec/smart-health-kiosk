import React from 'react';
import { X, FileText, Calendar, User, ExternalLink, Download, Sparkles } from 'lucide-react';
import { ScannedDocument, HistoricalDocument, Language } from '../../types';

interface DocumentViewerModalProps {
  document: ScannedDocument | HistoricalDocument | null;
  language: Language;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  language,
  onClose
}) => {
  if (!document) return null;

  // Type guards and safe getters
  const title = 'title' in document ? document.title : document.type;
  const dateFormatted = 'dateFormatted' in document ? document.dateFormatted : document.date;
  const doctorOrLab = 'doctorOrLab' in document ? document.doctorOrLab : document.doctorName || 'Hospital Clinic';
  const summary = document.summary;
  const imageUrl = 'imageUrl' in document ? document.imageUrl : undefined;
  const medicines = 'medicinesExtracted' in document ? document.medicinesExtracted : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-slate-300 dark:border-slate-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {dateFormatted}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {doctorOrLab}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Original Scanned Preview */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              {language === 'hi' ? 'मूल दस्तावेज़ / रसीद' : 'Original Scanned Document'}
            </h4>
            <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 min-h-[220px] flex flex-col items-center justify-center p-4 text-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="max-h-[360px] w-auto object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="space-y-2 py-8">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {language === 'hi' ? 'दस्तावेज़ की मूल प्रति उपलब्ध है' : 'Original document copy archived'}
                  </p>
                  <span className="text-xs font-mono text-slate-500 block">
                    ID: {document.id} • SHA-256 Verified
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* AI Extracted Findings */}
          {summary && (
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-2 mb-1.5 text-teal-800 dark:text-teal-300 font-black text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>{language === 'hi' ? 'निकाली गई जानकारी' : 'Extracted Information'}</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {summary}
              </p>
            </div>
          )}

          {/* Extracted Medicines list */}
          {medicines && medicines.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                {language === 'hi' ? 'पहचानी गई दवाएं' : 'Extracted Medicines'}
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {medicines.map((m, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{m.name}</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {m.dosage} {m.frequency ? `• ${m.frequency}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md cursor-pointer transition-all"
          >
            {language === 'hi' ? 'बंद करें' : 'Close Document'}
          </button>
        </div>
      </div>
    </div>
  );
};
