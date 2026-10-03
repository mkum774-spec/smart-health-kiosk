import React from 'react';
import { Heart, ShieldCheck, Phone, Mail, HelpCircle } from 'lucide-react';
import { Language } from '../../../types';

interface PublicFooterProps {
  language: Language;
  onNavigateSection: (sectionId: string) => void;
  onOpenLogin: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  language,
  onNavigateSection,
  onOpenLogin
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                Medi<span className="text-teal-400">Kiosk</span>
              </span>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed">
              {language === 'hi' 
                ? 'अस्पताल कियोस्क, डॉक्टर और मरीज के बीच निरंतर स्वास्थ्य सेतु।' 
                : 'Connecting patients, hospital kiosks, doctors, and longitudinal health records.'}
            </p>
            <p className="text-[11px] text-teal-400 font-semibold">
              {language === 'hi' ? 'आपका स्वास्थ्य, आपके हाथ में।' : 'Your Health. In Your Hands.'}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
            </h4>
            <ul className="space-y-1.5 font-medium">
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigateSection('hero')} 
                  className="hover:text-teal-400 transition-colors"
                >
                  {language === 'hi' ? 'मुख्य पृष्ठ (Home)' : 'Home'}
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigateSection('features')} 
                  className="hover:text-teal-400 transition-colors"
                >
                  {language === 'hi' ? 'सेवाएं (Services)' : 'Services'}
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onNavigateSection('how-it-works')} 
                  className="hover:text-teal-400 transition-colors"
                >
                  {language === 'hi' ? 'कार्यप्रणाली (How It Works)' : 'How It Works'}
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={onOpenLogin} 
                  className="hover:text-teal-400 transition-colors"
                >
                  {language === 'hi' ? 'मरीज पोर्टल लॉगिन' : 'Patient Portal Login'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Privacy */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'hi' ? 'सहायता एवं नीतियां' : 'Support & Privacy'}
            </h4>
            <ul className="space-y-1.5 font-medium text-slate-400">
              <li className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
                <span>{language === 'hi' ? 'मरीज सहायता केंद्र' : 'Patient Help Center'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'सहमति एवं डेटा सुरक्षा' : 'Consent & Data Policy'}</span>
              </li>
              <li>
                <span>{language === 'hi' ? 'उपयोग की शर्तें' : 'Terms of Service'}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Hospital & Emergency Contacts */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'hi' ? 'आपातकालीन सहायता' : 'Emergency & Helpline'}
            </h4>
            <div className="space-y-1.5 font-medium text-slate-400">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>National Emergency: <strong className="text-white">112 / 108</strong></span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>Tele-MANAS: <strong className="text-white">14416</strong></span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>support@medikiosk.internal</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} MediKiosk Platform. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Accessible Design</span>
            <span>•</span>
            <span>ABDM Compatible</span>
            <span>•</span>
            <span>Bilingual Experience</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
