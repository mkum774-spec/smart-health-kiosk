import React, { useState } from 'react';
import { 
  Home, 
  MessageSquareHeart, 
  FileText, 
  Calendar, 
  User, 
  Menu, 
  X,
  Pill,
  FolderHeart,
  Activity,
  Leaf,
  ShieldCheck,
  Smartphone,
  HelpCircle,
  QrCode,
  Building2
} from 'lucide-react';
import { PatientPortalTab, Language } from '../../../types';

interface MobileBottomNavProps {
  language: Language;
  activeTab: PatientPortalTab;
  onSelectTab: (tab: PatientPortalTab) => void;
  onOpenKioskScan: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  language,
  activeTab,
  onSelectTab,
  onOpenKioskScan
}) => {
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  const primaryTabs: { tab: PatientPortalTab; labelEn: string; labelHi: string; icon: React.ReactNode }[] = [
    {
      tab: 'HOME',
      labelEn: 'Home',
      labelHi: 'मुख्य',
      icon: <Home className="w-5 h-5" />
    },
    {
      tab: 'CONVERSATION',
      labelEn: 'Assistant',
      labelHi: 'सहायक',
      icon: <MessageSquareHeart className="w-5 h-5" />
    },
    {
      tab: 'REPORTS',
      labelEn: 'Reports',
      labelHi: 'रिपोर्ट्स',
      icon: <FileText className="w-5 h-5" />
    },
    {
      tab: 'APPOINTMENTS',
      labelEn: 'Visits',
      labelHi: 'अपॉइंटमेंट',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      tab: 'PROFILE',
      labelEn: 'Profile',
      labelHi: 'प्रोफाइल',
      icon: <User className="w-5 h-5" />
    }
  ];

  const secondaryTabs: { tab: PatientPortalTab; labelEn: string; labelHi: string; icon: React.ReactNode }[] = [
    {
      tab: 'FIND_HOSPITAL',
      labelEn: 'Find a Hospital',
      labelHi: 'अस्पताल खोजें',
      icon: <Building2 className="w-5 h-5 text-teal-600" />
    },
    {
      tab: 'PRESCRIPTIONS',
      labelEn: 'Prescriptions & Meds',
      labelHi: 'दवाएं एवं पर्चे',
      icon: <Pill className="w-5 h-5 text-indigo-600" />
    },
    {
      tab: 'HEALTH_RECORDS',
      labelEn: 'Health Records Timeline',
      labelHi: 'स्वास्थ्य टाइमलाइन',
      icon: <FolderHeart className="w-5 h-5 text-amber-600" />
    },
    {
      tab: 'ILLNESS_HISTORY',
      labelEn: 'Illness Chronology',
      labelHi: 'बीमारी का इतिहास',
      icon: <Activity className="w-5 h-5 text-rose-600" />
    },
    {
      tab: 'AYURVEDA',
      labelEn: 'Ayurvedic Health',
      labelHi: 'आयुर्वेदिक स्वास्थ्य',
      icon: <Leaf className="w-5 h-5 text-teal-600" />
    },
    {
      tab: 'CONSENT',
      labelEn: 'Consent & Privacy',
      labelHi: 'सहमति व गोपनीयता',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
    },
    {
      tab: 'SESSIONS',
      labelEn: 'Active Sessions & Devices',
      labelHi: 'सक्रिय सत्र व सुरक्षा',
      icon: <Smartphone className="w-5 h-5 text-sky-600" />
    },
    {
      tab: 'HELP',
      labelEn: 'Help & Emergency Support',
      labelHi: 'सहायता व आपातकालीन नंबर',
      icon: <HelpCircle className="w-5 h-5 text-purple-600" />
    }
  ];

  return (
    <>
      {/* Mobile Bottom Bar (Sticky to bottom on small/medium screens) */}
      <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 shadow-2xl">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {primaryTabs.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => {
                  onSelectTab(item.tab);
                  setMoreDrawerOpen(false);
                }}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-teal-50 dark:bg-teal-950/60' : ''}`}>
                  {item.icon}
                </div>
                <span className="truncate max-w-[64px]">
                  {language === 'hi' ? item.labelHi : item.labelEn}
                </span>
              </button>
            );
          })}

          {/* More Menu Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMoreDrawerOpen(prev => !prev)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-bold cursor-pointer transition-colors ${
              moreDrawerOpen ? 'text-teal-600' : 'text-slate-500'
            }`}
            aria-label="More Features"
          >
            <div className="p-1 rounded-xl">
              <Menu className="w-5 h-5" />
            </div>
            <span>{language === 'hi' ? 'अन्य' : 'More'}</span>
          </button>
        </div>
      </nav>

      {/* Slide-up "More" Drawer for Mobile */}
      {moreDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t-2 border-slate-300 dark:border-slate-700 p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {language === 'hi' ? 'सभी सुविधाएं' : 'All Health Features'}
              </span>
              <button
                type="button"
                onClick={() => setMoreDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Kiosk Link CTA inside drawer */}
            <div 
              onClick={() => { onOpenKioskScan(); setMoreDrawerOpen(false); }}
              className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-teal-900 dark:text-teal-200">
                  {language === 'hi' ? 'अस्पताल कियोस्क से लिंक करें' : 'Link from Hospital Kiosk'}
                </span>
                <span className="text-[11px] text-teal-700 dark:text-teal-400">
                  {language === 'hi' ? 'कियोस्क स्क्रीन का क्यूआर कोड स्कैन करें' : 'Scan QR code on kiosk screen'}
                </span>
              </div>
            </div>

            {/* Secondary Destinations Grid */}
            <div className="space-y-1.5 pt-2">
              {secondaryTabs.map(item => (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.tab);
                    setMoreDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === item.tab 
                      ? 'bg-teal-600 text-white shadow-sm' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
