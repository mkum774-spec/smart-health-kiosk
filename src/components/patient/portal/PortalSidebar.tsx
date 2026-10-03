import React from 'react';
import { 
  Home, 
  MessageSquareHeart, 
  FolderLock, 
  Calendar, 
  Pill, 
  FolderHeart, 
  Activity, 
  Leaf, 
  ShieldCheck, 
  Smartphone, 
  User, 
  Building2
} from 'lucide-react';
import { PatientPortalTab, Language } from '../../../types';

interface PortalSidebarProps {
  language: Language;
  activeTab: PatientPortalTab;
  onSelectTab: (tab: PatientPortalTab) => void;
  onOpenKioskScan?: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  language,
  activeTab,
  onSelectTab
}) => {
  const navItems: { tab: PatientPortalTab; labelEn: string; labelHi: string; icon: React.ReactNode }[] = [
    {
      tab: 'HOME',
      labelEn: 'Overview',
      labelHi: 'मुख्य सारांश',
      icon: <Home className="w-5 h-5" />
    },
    {
      tab: 'CONVERSATION',
      labelEn: 'Clinical Assistant',
      labelHi: 'क्लिनिकल सहायक',
      icon: <MessageSquareHeart className="w-5 h-5 text-teal-600" />
    },
    {
      tab: 'REPORTS',
      labelEn: 'My Documents',
      labelHi: 'मेरे दस्तावेज़',
      icon: <FolderLock className="w-5 h-5 text-sky-600" />
    },
    {
      tab: 'FIND_HOSPITAL',
      labelEn: 'Find a Hospital',
      labelHi: 'अस्पताल खोजें',
      icon: <Building2 className="w-5 h-5 text-indigo-600" />
    },
    {
      tab: 'APPOINTMENTS',
      labelEn: 'Appointments',
      labelHi: 'परामर्श व अपॉइंटमेंट',
      icon: <Calendar className="w-5 h-5 text-amber-600" />
    },
    {
      tab: 'PRESCRIPTIONS',
      labelEn: 'Prescriptions & Meds',
      labelHi: 'पर्चे एवं दवाएं',
      icon: <Pill className="w-5 h-5 text-teal-600" />
    },
    {
      tab: 'HEALTH_RECORDS',
      labelEn: 'Health Records',
      labelHi: 'स्वास्थ्य टाइमलाइन',
      icon: <FolderHeart className="w-5 h-5 text-rose-600" />
    },
    {
      tab: 'ILLNESS_HISTORY',
      labelEn: 'Illness History',
      labelHi: 'बीमारी का इतिहास',
      icon: <Activity className="w-5 h-5 text-cyan-600" />
    },
    {
      tab: 'AYURVEDA',
      labelEn: 'Ayurvedic Health',
      labelHi: 'आयुर्वेदिक स्वास्थ्य',
      icon: <Leaf className="w-5 h-5 text-emerald-600" />
    },
    {
      tab: 'CONSENT',
      labelEn: 'Consent & Sharing',
      labelHi: 'सहमति व गोपनीयता',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
    },
    {
      tab: 'SESSIONS',
      labelEn: 'Connected Devices',
      labelHi: 'सक्रिय सत्र व डिवाइस',
      icon: <Smartphone className="w-5 h-5 text-slate-600" />
    },
    {
      tab: 'PROFILE',
      labelEn: 'Profile & Settings',
      labelHi: 'प्रोफाइल व सेटिंग्स',
      icon: <User className="w-5 h-5 text-teal-600" />
    }
  ];

  return (
    <aside 
      aria-label="Patient Portal Navigation"
      className="hidden lg:flex flex-col w-64 xl:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2 flex-shrink-0 select-none h-full min-h-0 overflow-y-auto"
    >
      {/* Main Navigation List */}
      <nav className="flex-1 space-y-1 pr-1">
        {navItems.map(item => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => onSelectTab(item.tab)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs xl:text-sm font-bold transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'}`}>
                {item.icon}
              </div>
              <span className="truncate">
                {language === 'hi' ? item.labelHi : item.labelEn}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
