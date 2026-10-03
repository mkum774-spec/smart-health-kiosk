import React, { useState } from 'react';
import { 
  FolderHeart, 
  Calendar, 
  Clock, 
  FileText, 
  Pill, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Building,
  User,
  ExternalLink
} from 'lucide-react';
import { Language, IllnessRecord, PatientReport, StructuredMedication } from '../../../types';

interface HealthRecordsViewProps {
  language: Language;
  illnessTimeline: IllnessRecord[];
  reports: PatientReport[];
  medications: StructuredMedication[];
  onViewReport: (report: PatientReport) => void;
}

export const HealthRecordsView: React.FC<HealthRecordsViewProps> = ({
  language,
  illnessTimeline,
  reports,
  medications,
  onViewReport
}) => {
  const [expandedIllnessId, setExpandedIllnessId] = useState<string | null>(illnessTimeline[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedIllnessId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hi' ? 'दीर्घकालिक स्वास्थ्य टाइमलाइन' : 'Longitudinal Health Records'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {language === 'hi'
            ? 'आपकी संपूर्ण स्वास्थ्य यात्रा — परामर्श, जांच रिपोर्ट्स और दवाओं का परस्पर संबंध।'
            : 'Track your longitudinal healthcare journey grouped by health episode and chronological progression.'}
        </p>
      </div>

      {/* Conceptual Journey Banner */}
      <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex flex-wrap items-center justify-between gap-2 font-medium">
        <span>Care Episode → Clinical Intake → Consultation → Verified Reports → Prescriptions → Current Status</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
          Longitudinal EMR
        </span>
      </div>

      {/* Timeline Accordion Sections */}
      <div className="space-y-4">
        {illnessTimeline.map(ill => {
          const isExpanded = expandedIllnessId === ill.id;
          const relatedReps = reports.filter(r => ill.relatedReports?.includes(r.id));
          const relatedMeds = medications.filter(m => ill.relatedMedications?.some(name => m.name.includes(name)));

          return (
            <div
              key={ill.id}
              className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all"
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleExpand(ill.id)}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold text-sm">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {language === 'hi' && ill.titleHi ? ill.titleHi : ill.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ill.yearOrDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    ill.status === 'UNDER_TREATMENT'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {ill.status === 'UNDER_TREATMENT' ? (language === 'hi' ? 'उपचार जारी' : 'Active Care') : (language === 'hi' ? 'ठीक हो चुका' : 'Resolved')}
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {/* Accordion Expanded Details */}
              {isExpanded && (
                <div className="p-6 pt-0 space-y-5 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm animate-fade-in">
                  
                  {/* Summary Narrative */}
                  <div className="pt-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Clinical Overview</h4>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {ill.summary}
                    </p>
                  </div>

                  {/* Connected Medications */}
                  {relatedMeds.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                        <Pill className="w-4 h-4 text-indigo-600" />
                        <span>Prescribed Medications in this Episode</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {relatedMeds.map(m => (
                          <div key={m.id} className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs">
                            <span className="font-bold text-slate-900 dark:text-white block">{m.name}</span>
                            <span className="text-slate-600 dark:text-slate-400">{m.frequency} • {m.instructions}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connected Reports */}
                  {relatedReps.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-sky-600" />
                        <span>Associated Laboratory & Diagnostic Reports</span>
                      </h4>
                      <div className="space-y-2">
                        {relatedReps.map(r => (
                          <div
                            key={r.id}
                            className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">
                                {language === 'hi' && r.titleHi ? r.titleHi : r.title}
                              </span>
                              <span className="text-slate-500 font-mono text-[11px]">{r.date} • {r.hospitalOrLab}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onViewReport(r)}
                              className="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-sky-700"
                            >
                              <span>View Scan</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
