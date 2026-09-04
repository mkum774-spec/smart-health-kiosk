import React, { useState } from 'react';
import { 
  FolderOpen, 
  Calendar, 
  Clock, 
  Building, 
  DoorClosed, 
  FileText, 
  User, 
  ArrowRight, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Stethoscope, 
  ChevronRight, 
  X,
  PlusCircle,
  Activity,
  HeartPulse
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { BackendConsultation } from '../../types';

export const MyRecordsScreen: React.FC = () => {
  const { 
    portalPatient, 
    portalConsultations, 
    isLiveBackendSync, 
    startVisitFromPortal, 
    resetKioskSession, 
    language, 
    t 
  } = useKiosk();

  const [selectedConsultation, setSelectedConsultation] = useState<BackendConsultation | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'ACTIVE'>('ALL');

  const filteredConsultations = portalConsultations.filter(c => {
    if (filter === 'COMPLETED') return c.status.toLowerCase().includes('completed');
    if (filter === 'ACTIVE') return !c.status.toLowerCase().includes('completed');
    return true;
  });

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent Visit';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes('COMPLETED')) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>{language === 'hi' ? 'परामर्श पूर्ण' : 'Completed'}</span>
        </span>
      );
    }
    if (s.includes('READY') || s.includes('WAITING') || s.includes('CALLED')) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-900 border border-sky-300">
          <Clock className="w-3.5 h-3.5 text-sky-700" />
          <span>{language === 'hi' ? 'सक्रिय / प्रतीक्षारत' : 'Active / In Queue'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-800 border border-slate-300">
        <span>{status}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const p = (priority || '').toUpperCase();
    if (p.includes('EMERGENCY') || p.includes('HIGH')) {
      return (
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-red-100 text-red-800 border border-red-300 uppercase">
          {language === 'hi' ? 'उच्च प्राथमिकता' : 'High Priority'}
        </span>
      );
    }
    if (p.includes('URGENT') || p.includes('MEDIUM')) {
      return (
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase">
          {language === 'hi' ? 'मध्यम प्राथमिकता' : 'Medium Priority'}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
        {language === 'hi' ? 'सामान्य' : 'Routine'}
      </span>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 select-none">
      {/* Top Patient Profile Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-2 border-teal-700">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-700/80 border-2 border-teal-500/50 flex items-center justify-center text-white flex-shrink-0 shadow-inner">
            <User className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {portalPatient?.name || "Demo Patient P001"}
              </h2>
              {/* Live Connection Badge */}
              <span className={`px-3 py-0.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
                isLiveBackendSync 
                  ? 'bg-emerald-400 text-emerald-950' 
                  : 'bg-teal-700 text-teal-100 border border-teal-500'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-950 animate-pulse" />
                <span>{isLiveBackendSync ? 'Live Hospital API' : 'ABDM Health Portal'}</span>
              </span>
            </div>
            <div className="text-teal-200 text-sm font-semibold flex items-center gap-3 mt-1 flex-wrap font-mono">
              <span>ABHA: {portalPatient?.abha_id || "DEMO-ABHA-P001"}</span>
              <span>•</span>
              <span>{portalPatient?.age || 42} Yrs / {portalPatient?.gender || "MALE"}</span>
              <span>•</span>
              <span>{portalPatient?.phone || "+91 98765 43210"}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Start Today's Check-in Button */}
          <button
            type="button"
            onClick={startVisitFromPortal}
            className="flex-1 md:flex-initial px-6 py-3.5 bg-white hover:bg-teal-50 active:bg-slate-100 text-teal-900 font-black text-base rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <PlusCircle className="w-5 h-5 text-teal-700" />
            <span>{t('startNewVisitBtn')}</span>
          </button>

          {/* Logout / Exit */}
          <button
            type="button"
            onClick={() => resetKioskSession(true)}
            className="px-4 py-3.5 bg-teal-950/60 hover:bg-teal-950 text-teal-200 hover:text-white font-bold text-sm rounded-2xl border border-teal-600/50 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            title="Log Out & Reset Session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t('logoutButton')}</span>
          </button>
        </div>
      </div>

      {/* Consultations Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-700" />
            <span>{t('myRecordsHeader')}</span>
            <span className="text-sm font-bold text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">
              {portalConsultations.length}
            </span>
          </h3>
          <p className="text-sm text-slate-600 font-medium">
            {t('myRecordsSub')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-300">
          {(['ALL', 'COMPLETED', 'ACTIVE'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab 
                  ? 'bg-teal-700 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL' ? (language === 'hi' ? 'सभी रिकॉर्ड' : 'All') : (
                tab === 'COMPLETED' ? (language === 'hi' ? 'पूर्ण' : 'Completed') : (language === 'hi' ? 'सक्रिय' : 'Active')
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Consultations List */}
      <div className="space-y-4">
        {filteredConsultations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border-2 border-slate-200">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-bold text-slate-600">
              {language === 'hi' ? 'इस श्रेणी में कोई परामर्श रिकॉर्ड नहीं मिला।' : 'No consultation records found in this category.'}
            </p>
          </div>
        ) : (
          filteredConsultations.map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedConsultation(c)}
              className="p-5 sm:p-6 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-teal-400 rounded-3xl shadow-sm transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 group"
            >
              {/* Left Column: Token + Details */}
              <div className="flex items-start gap-4">
                {/* Token Badge */}
                <div className="w-24 sm:w-28 min-h-[4.5rem] py-2 px-2 rounded-2xl bg-teal-50 border-2 border-teal-300 flex flex-col items-center justify-center flex-shrink-0 text-teal-900 group-hover:bg-teal-700 group-hover:text-white transition-colors shadow-sm self-start sm:self-center">
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-75">TOKEN</span>
                  <span className="text-base sm:text-lg font-mono font-black whitespace-nowrap leading-tight mt-0.5">{c.token_number || "TK-1001"}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-lg font-black text-slate-900">
                      {c.department || "General Medicine"}
                    </span>
                    {c.assigned_room && (
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {c.assigned_room}
                      </span>
                    )}
                    {getPriorityBadge(c.priority)}
                    {getStatusBadge(c.status)}
                  </div>

                  {/* Chief Complaint */}
                  <p className="text-sm font-medium text-slate-700">
                    <span className="font-bold text-slate-900">{t('complaintLabel')}: </span>
                    {c.chief_complaint || "Routine follow-up and prescription review"}
                  </p>

                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                    <span>{formatDate(c.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: View Details CTA */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="text-sm font-bold text-teal-800 group-hover:translate-x-1 transition-transform">
                  {t('viewSummaryBtn')}
                </span>
                <ChevronRight className="w-5 h-5 text-teal-700 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Sticky Action Bar for Easy Kiosk Touch */}
      <div className="mt-8 p-4 bg-teal-50 border-2 border-teal-300 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-teal-950">
          <Activity className="w-6 h-6 text-teal-700 flex-shrink-0" />
          <p className="text-sm sm:text-base font-bold">
            {language === 'hi' 
              ? 'क्या आप आज के डॉक्टर परामर्श के लिए कतार टोकन लेना चाहते हैं?' 
              : 'Need to see a doctor today? Start your consultation check-in now.'}
          </p>
        </div>

        <button
          type="button"
          onClick={startVisitFromPortal}
          className="w-full sm:w-auto px-8 py-4 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-black text-lg rounded-2xl border-2 border-teal-800 shadow-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-95"
        >
          <span>{t('startNewVisitBtn')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Consultation Details Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-slate-300 shadow-2xl space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                  {t('consultationDetails')}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {selectedConsultation.department || "General Medicine"}
                </h3>
                <p className="text-xs font-mono text-slate-500">
                  ID: {selectedConsultation.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedConsultation(null)}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">{t('tokenNumberLabel')}</span>
                <p className="text-xl font-mono font-black text-teal-900">{selectedConsultation.token_number || "TK-1001"}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">{t('assignedRoomLabel')}</span>
                <p className="text-xl font-bold text-slate-900">{selectedConsultation.assigned_room || "Room 204"}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">{t('statusLabel')}</span>
                <div className="mt-1">{getStatusBadge(selectedConsultation.status)}</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">{t('consultationDateLabel')}</span>
                <p className="text-sm font-bold text-slate-800 mt-1">{formatDate(selectedConsultation.created_at)}</p>
              </div>
            </div>

            {/* Complaint Section */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-black uppercase text-slate-500">{t('complaintLabel')}</span>
              <p className="text-base font-bold text-slate-900 mt-1">
                {selectedConsultation.chief_complaint || "Patient presented for routine health check and medical consultation."}
              </p>
            </div>

            {/* Clinical Safety Protocol Notice */}
            <div className="p-4 bg-teal-50 rounded-2xl border-2 border-teal-300 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-800 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-teal-950 uppercase">
                  {language === 'hi' ? 'रोगी सुरक्षा रिकॉर्ड' : 'Clinical Safety Protocol'}
                </p>
                <p className="text-xs font-medium text-teal-900 mt-0.5">
                  {language === 'hi'
                    ? 'इस परामर्श के दौरान सभी ज्ञात एलर्जी और वर्तमान दवाएं डॉक्टर के साथ सुरक्षित रूप से साझा की गई थीं।'
                    : 'Allergies and active medications were permanently locked and shared during this consultation for clinical safety.'}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedConsultation(null)}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base rounded-2xl border border-slate-300 cursor-pointer"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedConsultation(null);
                  startVisitFromPortal();
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-black text-base rounded-2xl border-2 border-teal-800 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('startNewVisitBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
