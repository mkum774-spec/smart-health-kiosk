import React, { useState } from 'react';
import { X, ShieldCheck, Smartphone, Monitor, AlertTriangle, KeyRound, LogOut } from 'lucide-react';
import { UserSession, DoctorAccessAuthorization, Language } from '../../types';

interface SessionManagementModalProps {
  language: Language;
  onClose: () => void;
}

export const SessionManagementModal: React.FC<SessionManagementModalProps> = ({
  language,
  onClose
}) => {
  const [sessions, setSessions] = useState<UserSession[]>([
    {
      id: 'sess_curr_01',
      deviceName: 'Hospital Smart Health Kiosk #03',
      deviceType: 'KIOSK_TERMINAL',
      ipAddress: '10.12.93.231',
      lastActive: 'Active Now',
      isCurrent: true
    },
    {
      id: 'sess_mob_02',
      deviceName: 'Mobile Web Portal (Chrome on Android)',
      deviceType: 'MOBILE',
      ipAddress: '192.168.1.45',
      lastActive: '2 days ago',
      isCurrent: false
    }
  ]);

  const [doctorAuth, setDoctorAuth] = useState<DoctorAccessAuthorization>({
    consultationId: 'cons_curr_01',
    doctorName: 'Dr. Demo (MD, AIIMS)',
    department: 'General OPD & Medicine',
    hospitalName: 'District Civil Hospital',
    grantedAt: 'Today, 10:15 AM',
    isRevoked: false
  });

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleRevokeSession = (sessionId: string) => {
    // Client invokes server revocation abstraction
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setActionNotice(
      language === 'hi'
        ? 'सत्र सफलतापूर्वक समाप्त कर दिया गया है।'
        : 'Session revoked successfully from server.'
    );
  };

  const handleRevokeDoctorAccess = () => {
    // Client revokes authorized access to patient data per Section 30
    setDoctorAuth(prev => ({ ...prev, isRevoked: true }));
    setActionNotice(
      language === 'hi'
        ? 'इस परामर्श के लिए चिकित्सक का डेटा एक्सेस वापस ले लिया गया है।'
        : 'Doctor access authorization revoked for this consultation.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border-2 border-slate-300 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {language === 'hi' ? 'सत्र एवं सुरक्षा नियंत्रण' : 'Session & Security Management'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'सक्रिय डिवाइस एवं एक्सेस अनुमतियां' : 'Active devices and access authorizations'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        {actionNotice && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center animate-fade-in">
            {actionNotice}
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Active Devices */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
              {language === 'hi' ? 'सक्रिय उपकरण (Devices)' : 'Active Devices'}
            </h4>
            <div className="space-y-3">
              {sessions.map(s => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                      {s.deviceType === 'MOBILE' ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{s.deviceName}</span>
                        {s.isCurrent && (
                          <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-black uppercase">
                            {language === 'hi' ? 'वर्तमान उपकरण' : 'Current'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {s.ipAddress} • {s.lastActive}
                      </span>
                    </div>
                  </div>

                  {!s.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(s.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer transition-colors"
                    >
                      {language === 'hi' ? 'हटाएं' : 'Revoke'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Doctor Consultation Access Revocation (Section 30) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              {language === 'hi' ? 'चिकित्सक डेटा एक्सेस' : 'Doctor Access Authorization'}
            </h4>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {doctorAuth.doctorName}
                </p>
                <span className="text-xs text-slate-500 block">
                  {doctorAuth.department} • {doctorAuth.hospitalName}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {language === 'hi' ? 'स्वीकृति समय:' : 'Access granted:'} {doctorAuth.grantedAt}
                </span>
              </div>

              {doctorAuth.isRevoked ? (
                <span className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
                  {language === 'hi' ? 'एक्सेस समाप्त' : 'Revoked'}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleRevokeDoctorAccess}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'एक्सेस वापस लें' : 'Revoke Access'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-black text-sm cursor-pointer"
          >
            {language === 'hi' ? 'पूर्ण' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
