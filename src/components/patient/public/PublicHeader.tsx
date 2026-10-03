import React from 'react';
import { 
  Heart, 
  Languages, 
  Eye, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  ShieldCheck,
  Stethoscope,
  Sun,
  Moon
} from 'lucide-react';
import { Language } from '../../../types';

interface PublicHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  textScale: number;
  onTextScaleChange: (scale: number) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onNavigateSection: (sectionId: string) => void;
  onSwitchToKiosk?: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  language,
  onLanguageChange,
  textScale,
  onTextScaleChange,
  highContrast,
  onToggleHighContrast,
  darkMode,
  onToggleDarkMode,
  onOpenLogin,
  onOpenSignUp,
  onNavigateSection,
  onSwitchToKiosk
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: MediKiosk Brand */}
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => onNavigateSection('hero')}
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Medi<span className="text-teal-600">Kiosk</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    {language === 'hi' ? 'मरीज पोर्टल' : 'Patient Portal'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'hi' ? 'आपका स्वास्थ्य, आपके हाथ में।' : 'Your Health. In Your Hands.'}
                </p>
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button 
              type="button"
              onClick={() => onNavigateSection('hero')}
              className="px-3.5 py-2 rounded-xl hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
            </button>
            <button 
              type="button"
              onClick={() => onNavigateSection('features')}
              className="px-3.5 py-2 rounded-xl hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'सेवाएं' : 'Services'}
            </button>
            <button 
              type="button"
              onClick={() => onNavigateSection('how-it-works')}
              className="px-3.5 py-2 rounded-xl hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'कार्यप्रणाली' : 'How It Works'}
            </button>
            <button 
              type="button"
              onClick={() => onNavigateSection('trust-security')}
              className="px-3.5 py-2 rounded-xl hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'सुरक्षा एवं गोपनीयता' : 'Trust & Security'}
            </button>
            <button 
              type="button"
              onClick={() => onNavigateSection('help')}
              className="px-3.5 py-2 rounded-xl hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'सहायता' : 'Help & Support'}
            </button>
          </nav>

          {/* Right: Controls & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-teal-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'hi' 
                    ? 'bg-teal-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="हिन्दी"
              >
                हिन्दी
              </button>
            </div>

            {/* Accessibility: Font Size Controls (A- / A / A+) */}
            <div className="hidden sm:inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" title="Text Resizing">
              <button
                type="button"
                onClick={() => onTextScaleChange(0.9)}
                className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  textScale === 0.9 ? 'bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50'
                }`}
                aria-label="Decrease Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => onTextScaleChange(1.0)}
                className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  textScale === 1.0 ? 'bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50'
                }`}
                aria-label="Default Font Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onTextScaleChange(1.15)}
                className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  textScale === 1.15 ? 'bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50'
                }`}
                aria-label="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Authentication Buttons */}
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{language === 'hi' ? 'लॉगिन' : 'Login'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenSignUp}
              className="hidden sm:flex px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 items-center gap-1.5 cursor-pointer transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'hi' ? 'साइन अप' : 'Sign Up'}</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-fade-in">
            <button
              type="button"
              onClick={() => { onNavigateSection('hero'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
            </button>
            <button
              type="button"
              onClick={() => { onNavigateSection('features'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {language === 'hi' ? 'सेवाएं' : 'Services'}
            </button>
            <button
              type="button"
              onClick={() => { onNavigateSection('how-it-works'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {language === 'hi' ? 'कार्यप्रणाली' : 'How It Works'}
            </button>
            <button
              type="button"
              onClick={() => { onNavigateSection('trust-security'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {language === 'hi' ? 'सुरक्षा एवं गोपनीयता' : 'Trust & Security'}
            </button>
            <button
              type="button"
              onClick={() => { onNavigateSection('help'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {language === 'hi' ? 'सहायता एवं संपर्क' : 'Help & Support'}
            </button>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 rounded-xl font-bold text-center bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800 text-sm"
              >
                {language === 'hi' ? 'लॉगिन' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => { onOpenSignUp(); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 rounded-xl font-bold text-center bg-teal-600 text-white text-sm shadow-sm"
              >
                {language === 'hi' ? 'साइन अप' : 'Sign Up'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
