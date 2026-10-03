import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Calendar, 
  User, 
  Building, 
  Sparkles, 
  Eye, 
  Download, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  ExternalLink,
  Bot,
  Folder,
  FolderOpen,
  ChevronRight,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Edit2,
  Clock,
  ShieldCheck,
  Camera,
  Layers,
  Filter,
  Share2
} from 'lucide-react';
import { Language, PatientReport } from '../../../types';
import { ReportUploadModal } from './ReportUploadModal';

interface ReportsViewProps {
  language: Language;
  reports: PatientReport[];
  onUploadSuccess: (newReport: PatientReport) => void;
  selectedReportFromParent?: PatientReport | null;
  onClearSelectedReport?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  language,
  reports,
  onUploadSuccess,
  selectedReportFromParent,
  onClearSelectedReport
}) => {
  // Navigation level: 'FOLDERS' (Samsung Notes folder overview) | 'FOLDER_ITEMS' (inside a category)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [activeReportDetail, setActiveReportDetail] = useState<PatientReport | null>(selectedReportFromParent || null);
  const [search, setSearch] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Local state for reports to support Confirm/Correct and Encounter Sharing
  const [localReports, setLocalReports] = useState<PatientReport[]>(reports);

  // Correction modal state
  const [correctingReport, setCorrectingReport] = useState<PatientReport | null>(null);
  const [newCategoryChoice, setNewCategoryChoice] = useState('');

  // Zoom level for document previewer
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Sync if parent updates reports
  React.useEffect(() => {
    setLocalReports(reports);
  }, [reports]);

  // Sync if parent passes selectedReport
  React.useEffect(() => {
    if (selectedReportFromParent) {
      setActiveReportDetail(selectedReportFromParent);
      setSelectedFolder(selectedReportFromParent.category);
    }
  }, [selectedReportFromParent]);

  // Dynamically compute folders and counts from backend documents (DO NOT HARD-CODE!)
  const dynamicFolders = useMemo(() => {
    const counts: Record<string, number> = {};
    localReports.forEach(r => {
      const cat = r.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count
    }));
  }, [localReports]);

  // Filtered reports inside current view
  const currentDisplayedReports = useMemo(() => {
    return localReports.filter(r => {
      const matchesFolder = selectedFolder ? r.category === selectedFolder : true;
      const matchesSearch = search.trim() === '' || 
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        (r.titleHi && r.titleHi.includes(search)) ||
        (r.hospitalOrLab && r.hospitalOrLab.toLowerCase().includes(search.toLowerCase())) ||
        (r.doctorName && r.doctorName.toLowerCase().includes(search.toLowerCase())) ||
        (r.fileName && r.fileName.toLowerCase().includes(search.toLowerCase()));

      return matchesFolder && matchesSearch;
    });
  }, [localReports, selectedFolder, search]);

  // Shared documents count
  const sharedCount = localReports.filter(r => r.isSharedForConsultation).length;

  // Toggle encounter-specific document sharing
  const handleToggleSharing = (id: string) => {
    setLocalReports(prev => prev.map(r => 
      r.id === id ? { ...r, isSharedForConsultation: !r.isSharedForConsultation } : r
    ));
  };

  // Confirm AI Classification
  const handleConfirmClassification = (id: string) => {
    setLocalReports(prev => prev.map(r => 
      r.id === id ? { ...r, processingStatus: 'PROCESSED', aiConfidence: 'HIGH' } : r
    ));
    if (activeReportDetail && activeReportDetail.id === id) {
      setActiveReportDetail(prev => prev ? { ...prev, processingStatus: 'PROCESSED', aiConfidence: 'HIGH' } : null);
    }
  };

  // Open correction dialog
  const handleOpenCorrection = (report: PatientReport) => {
    setCorrectingReport(report);
    setNewCategoryChoice(report.category);
  };

  // Save corrected classification
  const handleSaveCorrection = () => {
    if (!correctingReport || !newCategoryChoice) return;
    setLocalReports(prev => prev.map(r => 
      r.id === correctingReport.id ? { 
        ...r, 
        category: newCategoryChoice,
        aiClassification: newCategoryChoice,
        processingStatus: 'PROCESSED'
      } : r
    ));

    if (activeReportDetail && activeReportDetail.id === correctingReport.id) {
      setActiveReportDetail(prev => prev ? { 
        ...prev, 
        category: newCategoryChoice, 
        aiClassification: newCategoryChoice,
        processingStatus: 'PROCESSED' 
      } : null);
    }
    setCorrectingReport(null);
  };

  const handleOpenDetail = (rep: PatientReport) => {
    setActiveReportDetail(rep);
    setZoomLevel(100);
  };

  const handleCloseDetail = () => {
    setActiveReportDetail(null);
    if (onClearSelectedReport) onClearSelectedReport();
  };

  const handleLocalUploadSuccess = (newDoc: PatientReport) => {
    const enriched: PatientReport = {
      ...newDoc,
      uploadDate: newDoc.uploadDate || 'Just now',
      documentDate: newDoc.documentDate || newDoc.date,
      processingStatus: 'PROCESSED',
      aiClassification: newDoc.category,
      aiConfidence: 'HIGH',
      fileName: newDoc.fileName || `DOC_${Date.now()}.pdf`,
      fileSize: newDoc.fileSize || '1.1 MB'
    };
    setLocalReports(prev => [enriched, ...prev]);
    onUploadSuccess(enriched);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-16 select-none">
      
      {/* Top Header & Repository Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
            <FolderOpen className="w-4 h-4" />
            <span>{language === 'hi' ? 'स्थायी दस्तावेज़ रिपॉजिटरी' : 'Persistent Document Repository'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'मेरे दस्तावेज़ (My Documents)' : 'My Documents'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {language === 'hi'
              ? 'आपकी सभी डिजिटल रिपोर्ट्स, पर्चे, और डिस्चार्ज सारांश मूल गुणवत्ता में सुरक्षित हैं।'
              : 'Complete longitudinal medical records, prescriptions, and diagnostic test reports.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>{language === 'hi' ? '+ दस्तावेज़ अपलोड करें' : '+ Upload Document'}</span>
        </button>
      </div>

      {/* Distinction Banner: Patient Repository vs Encounter Sharing (Section 14) */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-teal-900 dark:text-teal-200">
              {language === 'hi' ? 'व्यक्तिगत रिपॉजिटरी नियंत्रण' : 'Encounter-Specific Sharing Control'}
            </p>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-0.5">
              {language === 'hi'
                ? 'आपके सभी दस्तावेज़ निजी लाइब्रेरी में सुरक्षित रहते हैं। किसी परामर्श के लिए चुने गए दस्तावेज़ केवल उसी विजिट के लिए साझा होते हैं।'
                : 'Your complete repository is safely archived. Documents selected for an encounter are shared only for that consultation.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-black text-xs shadow-sm flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            <span>{sharedCount} {language === 'hi' ? 'परामर्श में साझा' : 'Shared for Visit'}</span>
          </span>
        </div>
      </div>

      {/* Navigation Breadcrumbs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <button
            type="button"
            onClick={() => setSelectedFolder(null)}
            className={`hover:text-teal-600 transition-colors cursor-pointer ${!selectedFolder ? 'text-teal-600 dark:text-teal-400 font-black' : ''}`}
          >
            {language === 'hi' ? 'सभी फ़ोल्डर' : 'All Folders'}
          </button>

          {selectedFolder && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-black">
                {selectedFolder}
              </span>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'hi' ? 'दस्तावेज़, डॉक्टर या तारीख खोजें...' : 'Search by title, doctor, date...'}
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* 1. ROOT FOLDER OVERVIEW (Samsung Notes inspired folder organization, Section 15) */}
      {!selectedFolder && !search && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              {language === 'hi' ? 'गतिशील श्रेणियां (फ़ोल्डर)' : 'Category Folders'} ({dynamicFolders.length})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {dynamicFolders.map(folder => (
              <button
                key={folder.name}
                type="button"
                onClick={() => setSelectedFolder(folder.name)}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between h-36"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Folder className="w-5 h-5 fill-teal-600/20" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-1">
                    {folder.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">
                    {folder.count} {folder.count === 1 ? 'document' : 'documents'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. DOCUMENT LIST (Inside folder or active search) */}
      <div className="space-y-4">
        {selectedFolder && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedFolder(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'वापस सभी फ़ोल्डरों पर जाएं' : 'Back to All Folders'}</span>
            </button>

            <span className="text-xs font-bold text-slate-500">
              {currentDisplayedReports.length} {language === 'hi' ? 'दस्तावेज़ मिले' : 'documents'}
            </span>
          </div>
        )}

        {currentDisplayedReports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'कोई दस्तावेज़ नहीं मिला' : 'No documents found in this view'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'hi'
                ? 'नया दस्तावेज़ अपलोड करने के लिए ऊपर "+ दस्तावेज़ अपलोड करें" बटन दबाएं।'
                : 'You can upload PDF records or capture paper prescriptions with your phone camera.'}
            </p>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              {language === 'hi' ? 'दस्तावेज़ जोड़ें' : 'Upload Document'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentDisplayedReports.map(rep => (
              <div
                key={rep.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/50 hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                {/* Header: Title, Category, Date, Status */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                          {language === 'hi' && rep.titleHi ? rep.titleHi : rep.title}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate max-w-[200px]">
                          {rep.fileName || 'Document.pdf'} {rep.fileSize ? `• ${rep.fileSize}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Encounter Sharing Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleSharing(rep.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black border flex items-center gap-1 cursor-pointer transition-all ${
                        rep.isSharedForConsultation
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                      }`}
                      title="Toggle sharing for current doctor consultation"
                    >
                      <Check className={`w-3 h-3 ${rep.isSharedForConsultation ? 'opacity-100' : 'opacity-0'}`} />
                      <span>{rep.isSharedForConsultation ? 'Shared for Visit' : 'Private in Library'}</span>
                    </button>
                  </div>

                  {/* Metadata Chips: Category, Date, Facility */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-semibold">
                    <span className="px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                      {rep.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{rep.documentDate || rep.date}</span>
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[170px]">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{rep.hospitalOrLab}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                    {rep.summary}
                  </p>

                  {/* AI Classification & Verification Section (Section 21) */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-black block">AI Classification</span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {rep.aiClassification || rep.category}
                        </span>
                        <span className="text-[10px] text-teal-600 font-bold ml-1.5">
                          ({rep.aiConfidence || 'HIGH'} Confidence)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        type="button"
                        onClick={() => handleConfirmClassification(rep.id)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-600 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Confirm</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenCorrection(rep)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Correct</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions: View Detail & Original Preserved */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Original Preserved</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenDetail(rep)}
                    className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 text-teal-800 dark:text-teal-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'दस्तावेज़ देखें' : 'View & Preview'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. DUAL-MODE ZOOMABLE PREVIEW MODAL (Section 22) */}
      {activeReportDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border-2 border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-teal-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">
                    {language === 'hi' && activeReportDetail.titleHi ? activeReportDetail.titleHi : activeReportDetail.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-teal-100 font-semibold mt-0.5">
                    <span>{activeReportDetail.documentDate || activeReportDetail.date}</span>
                    <span>•</span>
                    <span>{activeReportDetail.hospitalOrLab}</span>
                    <span>•</span>
                    <span className="font-mono">{activeReportDetail.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseDetail}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Zoom Controls & Preview Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      {language === 'hi' ? 'मूल संरक्षित दस्तावेज़ (Original Preserved Document)' : 'Original Preserved Document'}
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  {/* Zoom Action Buttons */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.max(75, prev - 25))}
                      className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-mono text-[11px]">{zoomLevel}%</span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))}
                      className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(100)}
                      className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-4 flex items-center justify-center min-h-[320px] max-h-[460px] overflow-auto">
                  {activeReportDetail.originalDocumentUrl ? (
                    <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
                      <img
                        src={activeReportDetail.originalDocumentUrl}
                        alt={activeReportDetail.title}
                        className="max-h-[420px] w-auto object-contain rounded-xl shadow-md border border-slate-300 dark:border-slate-700"
                      />
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 space-y-2">
                      <FileCheck className="w-12 h-12 mx-auto" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {language === 'hi' ? 'मूल डिजिटल प्रति संग्रहीत है' : 'Original digital document copy securely archived.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Extracted Parameters (if present) */}
              {activeReportDetail.extractedValues && activeReportDetail.extractedValues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {language === 'hi' ? 'निकाले गए जांच मान (Extracted Parameters)' : 'Extracted Test Parameters'}
                  </h4>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-black text-[10px]">
                        <tr>
                          <th className="p-3">Test Parameter</th>
                          <th className="p-3">Result</th>
                          <th className="p-3">Units</th>
                          <th className="p-3">Reference Range</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                        {activeReportDetail.extractedValues.map((val, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="p-3 font-bold">{val.name}</td>
                            <td className="p-3 font-mono font-bold text-teal-700 dark:text-teal-300">{val.value}</td>
                            <td className="p-3 text-slate-500">{val.unit || '-'}</td>
                            <td className="p-3 text-slate-500">{val.referenceRange || 'Standard'}</td>
                            <td className="p-3 text-right">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {val.status || 'NORMAL'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* AI Clinical Summary */}
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-200 text-xs font-black uppercase">
                  <Bot className="w-4 h-4" />
                  <span>{language === 'hi' ? 'एआई रिपोर्ट सारांश एवं व्याख्या' : 'AI Clinical Explanation'}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {language === 'hi' && activeReportDetail.aiExplanationHi
                    ? activeReportDetail.aiExplanationHi
                    : activeReportDetail.aiExplanation || activeReportDetail.summary}
                </p>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleToggleSharing(activeReportDetail.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-colors shadow-sm ${
                  activeReportDetail.isSharedForConsultation
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:border-teal-500'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {activeReportDetail.isSharedForConsultation
                    ? (language === 'hi' ? 'परामर्श में साझा (सक्रिय)' : 'Shared for Active Consultation')
                    : (language === 'hi' ? 'परामर्श के लिए साझा करें' : 'Share for Active Consultation')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([activeReportDetail.summary], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = activeReportDetail.originalDocumentUrl || url;
                  a.download = activeReportDetail.fileName || `${activeReportDetail.id}.png`;
                  a.click();
                }}
                className="px-5 py-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-teal-600" />
                <span>{language === 'hi' ? 'मूल दस्तावेज़ डाउनलोड करें' : 'Download Original'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. RE-CLASSIFICATION / CORRECTION MODAL (Section 21) */}
      {correctingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in select-none">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border-2 border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {language === 'hi' ? 'दस्तावेज़ वर्गीकरण सही करें' : 'Correct Document Classification'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {correctingReport.title}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                {language === 'hi' ? 'सही श्रेणी चुनें:' : 'Select True Category:'}
              </label>
              <div className="grid grid-cols-1 gap-2">
                {['Lab Reports', 'Prescriptions', 'Diagnostic Reports', 'Imaging', 'Discharge Summaries', 'Other'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewCategoryChoice(cat)}
                    className={`p-3 rounded-2xl text-xs font-bold border-2 text-left flex items-center justify-between cursor-pointer transition-all ${
                      newCategoryChoice === cat
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {newCategoryChoice === cat && <Check className="w-4 h-4 text-teal-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCorrectingReport(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-50"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleSaveCorrection}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-sm cursor-pointer"
              >
                {language === 'hi' ? 'परिवर्तन सहेजें' : 'Save Correction'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal (Integrated file drag/drop and camera capture) */}
      <ReportUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        language={language}
        onUploadSuccess={handleLocalUploadSuccess}
      />

    </div>
  );
};
