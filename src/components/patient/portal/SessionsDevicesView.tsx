import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Trash2, 
  KeyRound, 
  AlertCircle, 
  Check, 
  Lock,
  UserCheck
} from 'lucide-react';
import { Language, UserSession, DoctorAccessAuthorization } from '../../../types';
import { patientPortalService } from '../../../services/patientPortalService';

interface SessionsDevicesViewProps {
  language: Language;
}

export const SessionsDevicesView: React.FC<SessionsDevicesViewProps> = ({ language }) => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [doctorAccess, setDoctorAccess] = useState<DoctorAccessAuthorization[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    patientPortalService.getActiveSessions().then(setSessions);
    patientPortalService.getDoctorAccess().then(setDoctorAccess);
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    await patientPortalService.revokeSession(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setNotice(language === 'hi' ? 'सत्र सफलतापूर्वक समाप्त कर दिया गया।' : 'Session terminated successfully.');
    setTimeout(() => setNotice(null), 3000);
  };

  const handleRevokeDoctorAccess = async (consultationId: string) => {
    await patientPortalService.revokeDoctorAccess(consultationId);
    setDoctorAccess(prev => prev.map(d => d.consultationId === consultationId ? { ...d, isRevoked: true } : d));
    setNotice(language === 'hi' ? 'चिकित्सक का डेटा एक्सेस वापस ले लिया गया है।' : 'Doctor data access authorization revoked.');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto pb-12 select-none">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-teal-600" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'सक्रिय सत्र एवं डिवाइस प्रबंधन' : 'Connected Devices & Session Management'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          {language === 'hi'
            ? 'आपके खाते से जुड़े सक्रिय मोबाइल, कियोस्क टर्मिनल और अधिकृत डॉक्टर एक्सेस।'
            : 'Review currently logged-in devices and manage authorized clinical access.'}
        </p>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* 1. Active Devices & Logins */}
      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
          {language === 'hi' ? 'सक्रिय डिवाइस (Active Login Sessions)' : 'Active Login Sessions'}
        </h2>

        <div className="space-y-3">
          {sessions.map(sess => (
            <div
              key={sess.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                  {sess.deviceType === 'MOBILE' ? <Smartphone className="w-5 h-5 text-teal-600" /> : <Monitor className="w-5 h-5 text-sky-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {sess.deviceName}
                    </h3>
                    {sess.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        Current Device
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    IP: {sess.ipAddress || '10.xx.xx.xx'} • {sess.lastActive}
                  </p>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleRevokeSession(sess.id)}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सत्र समाप्त करें' : 'Revoke Session'}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Authorized Healthcare Clinical Access */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
          {language === 'hi' ? 'अधिकृत चिकित्सक एक्सेस (Authorized Healthcare Access)' : 'Authorized Healthcare Access'}
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'hi'
            ? 'आपके अस्पताल परामर्श के दौरान डॉक्टरों को दी गई अस्थायी रिकॉर्ड देखने की अनुमति।'
            : 'Active consent authorizations granted to OPD physicians during consultation.'}
        </p>

        <div className="space-y-3">
          {doctorAccess.map(doc => (
            <div
              key={doc.consultationId}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {doc.doctorName} ({doc.department})
                  </h3>
                  <p className="text-xs text-slate-500">
                    {doc.hospitalName} • Granted: {doc.grantedAt}
                  </p>
                </div>
              </div>

              {doc.isRevoked ? (
                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                  {language === 'hi' ? 'एक्सेस वापस लिया गया' : 'Access Revoked'}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRevokeDoctorAccess(doc.consultationId)}
                  className="px-3.5 py-1.5 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'एक्सेस वापस लें' : 'Revoke Access'}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
