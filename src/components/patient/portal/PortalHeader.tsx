import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  Languages, 
  Bell, 
  User, 
  LogOut, 
  Shield, 
  Settings, 
  Sun, 
  Moon, 
  Check, 
  X,
  QrCode,
  Sparkles
} from 'lucide-react';
import { Language, ABHAPatient, PatientNotification, PatientPortalTab } from '../../../types';

interface PortalHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  textScale: number;
  onTextScaleChange: (scale: number) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  patient: ABHAPatient;
  activeTab: PatientPortalTab;
  onSelectTab: (tab: PatientPortalTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notifications: PatientNotification[];
  onMarkNotificationRead: (id: string) => void;
  onOpenKioskScan: () => void;
  onLogout: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  language,
  onLanguageChange,
  textScale,
  onTextScaleChange,
  darkMode,
  onToggleDarkMode,
  patient,
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  notifications,
  onMarkNotificationRead,
  onOpenKioskScan,
  onLogout
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectTab('HOME')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Medi<span className="text-teal-600">Kiosk</span>
                </span>
                <span className="block text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
                  {language === 'hi' ? 'स्वास्थ्य साथी' : 'Health Companion'}
                </span>
              </div>
            </button>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={language === 'hi' ? 'रिपोर्ट, दवाएं, डॉक्टर खोजें...' : 'Search reports, prescriptions, doctors...'}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Kiosk Connect button */}
            <button
              type="button"
              onClick={onOpenKioskScan}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold transition-all cursor-pointer"
              title="Link hospital kiosk session via QR"
            >
              <QrCode className="w-4 h-4 text-teal-600" />
              <span>{language === 'hi' ? 'कियोस्क QR' : 'Link Kiosk'}</span>
            </button>

            {/* Language toggle */}
            <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'en' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'hi' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Accessibility text resize */}
            <div className="hidden lg:inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" title="Text Resizing">
              <button
                type="button"
                onClick={() => onTextScaleChange(0.9)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer ${textScale === 0.9 ? 'bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900' : 'text-slate-600 dark:text-slate-300'}`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => onTextScaleChange(1.0)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer ${textScale === 1.0 ? 'bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900' : 'text-slate-600 dark:text-slate-300'}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onTextScaleChange(1.15)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer ${textScale === 1.15 ? 'bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900' : 'text-slate-600 dark:text-slate-300'}`}
              >
                A+
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDrawerOpen(prev => !prev)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifDrawerOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 animate-fade-in">
                  <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {language === 'hi' ? 'सूचनाएं' : 'Notifications'} ({notifications.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotifDrawerOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-slate-500">
                        {language === 'hi' ? 'कोई नई सूचना नहीं है' : 'No notifications'}
                      </p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            onMarkNotificationRead(n.id);
                            if (n.actionTab) onSelectTab(n.actionTab);
                            setNotifDrawerOpen(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                            !n.read ? 'bg-teal-50/40 dark:bg-teal-950/20' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {language === 'hi' && n.titleHi ? n.titleHi : n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            {language === 'hi' && n.messageHi ? n.messageHi : n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs">
                  {patient.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {patient.name}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono">
                    {patient.abhaNumber.slice(-9)}
                  </span>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 p-2 space-y-1 animate-fade-in">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{patient.name}</p>
                    <p className="text-[11px] text-slate-500">{patient.abhaAddress}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => { onSelectTab('PROFILE'); setProfileDropdownOpen(false); }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-teal-600" />
                    <span>{language === 'hi' ? 'मेरी प्रोफाइल' : 'My Profile'}</span>
                  </button>


                  <button
                    type="button"
                    onClick={() => { onLogout(); setProfileDropdownOpen(false); }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{language === 'hi' ? 'लॉगआउट' : 'Log Out'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
