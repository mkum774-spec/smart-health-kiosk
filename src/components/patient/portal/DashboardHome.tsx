import React from 'react';
import { 
  Calendar, 
  Clock, 
  Building, 
  FileText, 
  Pill, 
  MessageSquareHeart, 
  FolderHeart, 
  Sparkles, 
  Mic, 
  ChevronRight, 
  Building2,
  FolderLock,
  ArrowRight,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { 
  Language, 
  ABHAPatient, 
  PatientAppointment, 
  PatientReport, 
  StructuredMedication, 
  IllnessRecord,
  PatientPortalTab
} from '../../../types';

interface DashboardHomeProps {
  language: Language;
  patient: ABHAPatient;
  nextAppointment?: PatientAppointment;
  recentReport?: PatientReport;
  currentMedications: StructuredMedication[];
  recentIllness?: IllnessRecord;
  onSelectTab: (tab: PatientPortalTab) => void;
  onOpenKioskScan: () => void;
  onViewReport: (report: PatientReport) => void;
  onStartVoiceAssistant?: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  language,
  patient,
  nextAppointment,
  recentReport,
  recentIllness,
  onSelectTab,
  onOpenKioskScan,
  onViewReport
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto pb-12 select-none">
      
      {/* 1. Welcoming Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white shadow-xl shadow-teal-900/15">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" />
            <span>ABHA: {patient.abhaNumber}</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            {language === 'hi' 
              ? `नमस्ते, ${patient.name} 👋` 
              : `Hello, ${patient.name} 👋`}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
            {language === 'hi' 
              ? 'आपका व्यक्तिगत स्वास्थ्य साथी — परामर्श की तैयारी करें एवं अपने मेडिकल रिकॉर्ड्स सुरक्षित देखें।' 
              : "Your verified personal health companion. Prepare for your consultations and manage your health records."}
          </p>
        </div>

        {/* Quick Kiosk Connect button on top */}
        <button
          type="button"
          onClick={onOpenKioskScan}
          className="self-start sm:self-center px-4 py-2.5 rounded-2xl bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 flex-shrink-0"
        >
          <QrCode className="w-4 h-4 text-teal-600" />
          <span>{language === 'hi' ? 'कियोस्क QR स्कैन' : 'Scan Kiosk QR'}</span>
        </button>
      </div>

      {/* 2. PRIMARY USP: CLINICAL ASSISTANT HERO CARD */}
      <section 
        aria-label="Clinical Assistant"
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-sky-500/10 border-2 border-teal-500/30 dark:border-teal-500/20 shadow-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रमुख सुविधा • क्लिनिकल सहायक' : 'Main Feature • Clinical Assistant'}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'द्विभाषी वाक् एवं टेक्स्ट इनपुट' : 'Bilingual Voice & Text Intake'}
            </span>
          </div>

          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'hi' ? 'अपने मेडीकियोस्क क्लिनिकल सहायक से बात करें' : 'Talk to your MediKiosk Clinical Assistant'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {language === 'hi'
                ? 'अपनी स्वास्थ्य समस्याएं साझा करें, लक्षणों के सवालों के जवाब दें और डॉक्टर से मिलने से पहले अपनी जानकारी व्यवस्थित करें।'
                : 'Describe your symptoms, answer structured health questions, and organize clinical context before your doctor consultation using voice or text.'}
            </p>
          </div>

          {/* Primary & Secondary Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectTab('CONVERSATION')}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-teal-600/25 flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <MessageSquareHeart className="w-4 h-4" />
              <span>{language === 'hi' ? 'क्लिनिकल सहायक शुरू करें' : 'Start Clinical Assistant'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('CONVERSATION')}
              className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Mic className="w-4 h-4 text-teal-600" />
              <span>{language === 'hi' ? '🎙 सहायक से बोलकर बात करें' : '🎙 Talk to Assistant'}</span>
            </button>
          </div>

          {/* Clinical Clarification Disclaimer */}
          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span>
              {language === 'hi'
                ? 'परामर्श पूर्व तैयारी सहायक • डॉक्टर के निदान का विकल्प नहीं है।'
                : 'Consultation intake & preparation companion • Does not replace physician diagnosis.'}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Immediate Care Info Grid (Next Appointment & Recent Report) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Next Appointment Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                {language === 'hi' ? 'आगामी परामर्श' : 'Next Appointment'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                Confirmed
              </span>
            </div>

            {nextAppointment ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {nextAppointment.doctorName}
                  </h3>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">
                    {nextAppointment.doctorSpecialty} • {nextAppointment.department}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold">{nextAppointment.date} at {nextAppointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{nextAppointment.hospitalName} ({nextAppointment.room})</span>
                  </div>
                  {nextAppointment.tokenNumber && (
                    <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900 font-mono text-[11px]">
                        {nextAppointment.tokenNumber}
                      </span>
                      <span>Assigned OPD Token</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4">
                {language === 'hi' ? 'कोई आगामी अपॉइंटमेंट नहीं है' : 'No upcoming appointments scheduled.'}
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onSelectTab('APPOINTMENTS')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'hi' ? 'सभी अपॉइंटमेंट देखें' : 'View all appointments'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recent Report Card with Original Doc link */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                {language === 'hi' ? 'नवीनतम जांच रिपोर्ट' : 'Recent Medical Report'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                Verified
              </span>
            </div>

            {recentReport ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {language === 'hi' && recentReport.titleHi ? recentReport.titleHi : recentReport.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {recentReport.hospitalOrLab} • {recentReport.date}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {recentReport.summary}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4">
                {language === 'hi' ? 'कोई हालिया रिपोर्ट उपलब्ध नहीं है' : 'No recent reports.'}
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {recentReport ? (
              <button
                type="button"
                onClick={() => onViewReport(recentReport)}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'hi' ? 'मूल दस्तावेज़ व एआई व्याख्या देखें' : 'View Original Document & AI Summary'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelectTab('REPORTS')}
                className="text-xs font-bold text-teal-600"
              >
                {language === 'hi' ? 'रिपोर्ट्स पर जाएं' : 'Go to reports'}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 4. Modest Discovery Card: Find a Hospital Near You */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'अपने नजदीकी अस्पताल खोजें' : 'Find a Hospital Near You'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {language === 'hi'
                ? 'अपने स्थान या पिन कोड के आधार पर स्वास्थ्य सुविधाएं खोजें एवं तुलना करें।'
                : 'Find healthcare facilities based on your location or PIN code.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab('FIND_HOSPITAL')}
          className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors flex-shrink-0"
        >
          <span>{language === 'hi' ? 'अस्पताल खोजें' : 'Find Hospitals'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5. Clean Secondary Service Shortcuts (My Documents, Prescriptions, Health Records) */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {language === 'hi' ? 'त्वरित स्वास्थ्य रिकॉर्ड्स:' : 'Quick Health Access:'}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectTab('REPORTS')}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:border-teal-500 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FolderLock className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'hi' ? 'मेरे दस्तावेज़' : 'My Documents'}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('PRESCRIPTIONS')}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:border-teal-500 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Pill className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === 'hi' ? 'पर्चे एवं दवाएं' : 'Prescriptions'}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('HEALTH_RECORDS')}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:border-teal-500 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FolderHeart className="w-3.5 h-3.5 text-rose-600" />
            <span>{language === 'hi' ? 'स्वास्थ्य टाइमलाइन' : 'Health Timeline'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
