import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Filter, 
  CheckSquare, 
  Square, 
  SkipForward 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { HistoricalDocument, TimeFilter } from '../../types';

export const PastRecordsScreen: React.FC = () => {
  const { 
    setScreen, 
    historicalRecords, 
    selectedPastRecords, 
    timeFilter, 
    setTimeFilter, 
    togglePastRecord, 
    selectAllPastRecords, 
    clearPastRecordsSelection, 
    shareAllForFilter, 
    language, 
    t 
  } = useKiosk();

  const [shareMode, setShareMode] = useState<'all' | 'specific'>('specific');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "June 2026-Blood Test Reports": true,
    "June 2026-Prescriptions": true,
    "June 2026-Diagnostic Reports": false,
    "July 2026-Prescriptions": false,
    "August 2026-Lab Reports": false,
  });

  const toggleFolder = (folderKey: string) => {
    setOpenFolders(prev => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const timeFilters: { key: TimeFilter; label: string }[] = [
    { key: '1M', label: t('filter1M') },
    { key: '3M', label: t('filter3M') },
    { key: '6M', label: t('filter6M') },
    { key: '1Y', label: t('filter1Y') },
    { key: 'ALL', label: t('filterAll') },
  ];

  // Group historical documents by Month/Year and Category
  const grouped: Record<string, Record<string, HistoricalDocument[]>> = {};
  historicalRecords.forEach(doc => {
    if (!grouped[doc.monthYear]) {
      grouped[doc.monthYear] = {};
    }
    if (!grouped[doc.monthYear][doc.category]) {
      grouped[doc.monthYear][doc.category] = [];
    }
    grouped[doc.monthYear][doc.category].push(doc);
  });

  const handleShareAll = () => {
    setShareMode('all');
    shareAllForFilter(timeFilter);
  };

  const handleChooseSpecific = () => {
    setShareMode('specific');
  };

  const handleContinue = () => {
    if (selectedPastRecords.length > 0) {
      // Proceed to contextual DPDP consent for the selected records
      setScreen('CONSENT');
    } else {
      // If none selected, proceed to Symptoms
      setScreen('SYMPTOMS');
    }
  };

  const handleSkip = () => {
    clearPastRecordsSelection();
    setScreen('SYMPTOMS');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 select-none">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('pastRecordsTitle')}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-semibold mt-1 max-w-3xl mx-auto">
          {t('pastRecordsSubtitle')}
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="mb-5 max-w-2xl mx-auto p-3.5 rounded-2xl bg-teal-50 border-2 border-teal-300 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
        <p className="text-xs sm:text-sm font-bold text-teal-950">
          {language === 'hi'
            ? 'आपकी सुरक्षा के लिए एलर्जी और वर्तमान दवाएं हमेशा साझा की जाती हैं। नीचे दिए गए पुराने पर्चे और रिपोर्ट में से आवश्यकतानुसार चयन करें।'
            : 'Allergies and current medications are always shared for your safety. Select specific past reports and prescriptions below.'}
        </p>
      </div>

      {/* Time-Period Filter Buttons */}
      <div className="mb-6 flex items-center justify-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-500 mr-1">
          <Filter className="w-4 h-4 text-teal-700" />
          <span>Period:</span>
        </div>
        {timeFilters.map(f => (
          <button
            key={f.key}
            type="button"
            onClick={() => setTimeFilter(f.key)}
            className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all cursor-pointer ${
              timeFilter === f.key
                ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Sharing Mode Options: All vs Specific */}
      <div className="bg-slate-100 p-4 rounded-3xl border border-slate-300 mb-6 max-w-2xl mx-auto">
        <p className="text-xs font-black uppercase tracking-wider text-slate-500 text-center mb-2">
          {t('shareModeTitle')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleShareAll}
            className={`p-3.5 rounded-2xl font-bold text-sm text-center border-2 transition-all cursor-pointer ${
              shareMode === 'all'
                ? 'bg-teal-700 text-white border-teal-800 shadow-md'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-teal-50'
            }`}
          >
            {t('shareAllRecordsBtn')}
          </button>
          <button
            type="button"
            onClick={handleChooseSpecific}
            className={`p-3.5 rounded-2xl font-bold text-sm text-center border-2 transition-all cursor-pointer ${
              shareMode === 'specific'
                ? 'bg-teal-700 text-white border-teal-800 shadow-md'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-teal-50'
            }`}
          >
            {t('chooseSpecificBtn')}
          </button>
        </div>
      </div>

      {/* Timeline / Folder View */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
        {/* Action Header: Counter + Select All / Clear */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-slate-900">
              {t('selectedRecordsCount')}{' '}
              <span className="text-2xl text-teal-800 font-mono font-black ml-1">
                {selectedPastRecords.length}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAllPastRecords}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              {t('selectAllBtn')}
            </button>
            <button
              type="button"
              onClick={clearPastRecordsSelection}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              {t('clearSelectionBtn')}
            </button>
          </div>
        </div>

        {/* Month by Month Accordion */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([monthYear, categories]) => (
            <div key={monthYear} className="space-y-3">
              {/* Month Header */}
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 w-fit">
                <Calendar className="w-4 h-4 text-teal-700" />
                <span>{monthYear}</span>
              </div>

              {/* Folders in this month */}
              <div className="space-y-3 pl-2 sm:pl-4">
                {Object.entries(categories).map(([category, docs]) => {
                  const folderKey = `${monthYear}-${category}`;
                  const isOpen = Boolean(openFolders[folderKey]);
                  const selectedInFolder = docs.filter(d => selectedPastRecords.some(s => s.id === d.id)).length;

                  return (
                    <div 
                      key={folderKey}
                      className="border-2 border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm"
                    >
                      {/* Folder Header Row */}
                      <button
                        type="button"
                        onClick={() => toggleFolder(folderKey)}
                        className="w-full p-4 bg-slate-50 hover:bg-slate-100 text-left flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {isOpen ? (
                            <FolderOpen className="w-6 h-6 text-teal-700 flex-shrink-0" />
                          ) : (
                            <Folder className="w-6 h-6 text-teal-700 flex-shrink-0" />
                          )}
                          <div>
                            <span className="text-base sm:text-lg font-black text-slate-900">
                              {category}
                            </span>
                            <span className="text-xs text-slate-500 ml-2">
                              ({docs.length} {docs.length === 1 ? 'document' : 'documents'})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {selectedInFolder > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-100 text-teal-800 border border-teal-300">
                              {selectedInFolder} selected
                            </span>
                          )}
                          {isOpen ? (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Folder Documents List */}
                      {isOpen && (
                        <div className="p-3 bg-white divide-y divide-slate-100 border-t border-slate-200 space-y-1">
                          {docs.map(doc => {
                            const isSelected = selectedPastRecords.some(s => s.id === doc.id);
                            return (
                              <div
                                key={doc.id}
                                onClick={() => togglePastRecord(doc.id)}
                                className={`p-3 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-teal-50 border border-teal-300'
                                    : 'hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                    isSelected
                                      ? 'bg-teal-700 border-teal-800 text-white'
                                      : 'border-slate-400 bg-white'
                                  }`}>
                                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                                  </div>
                                  <div>
                                    <p className="text-base font-bold text-slate-900">
                                      {language === 'hi' && doc.titleHi ? doc.titleHi : doc.title}
                                    </p>
                                    <p className="text-xs text-slate-500 font-semibold">
                                      {doc.dateFormatted} • {doc.doctorOrLab}
                                    </p>
                                    {doc.summary && (
                                      <p className="text-xs text-slate-600 mt-0.5 italic">
                                        {doc.summary}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Back */}
        <button
          type="button"
          onClick={() => setScreen('ASSESSMENT_TYPE')}
          className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-lg rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>

        {/* Skip for Now */}
        <button
          type="button"
          onClick={handleSkip}
          className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base rounded-2xl border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <SkipForward className="w-4 h-4" />
          <span>{t('skipPastRecordsBtn')}</span>
        </button>

        {/* Continue */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto min-w-[220px] px-8 py-5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-black text-xl rounded-2xl border-2 border-teal-800 shadow-xl flex items-center justify-center gap-3 cursor-pointer transition-all"
        >
          <span>{t('continue')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
