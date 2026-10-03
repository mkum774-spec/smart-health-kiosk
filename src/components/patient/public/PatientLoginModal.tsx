import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Loader2, 
  Sparkles,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Phone,
  Smartphone,
  CheckCircle2,
  FileCheck2,
  QrCode
} from 'lucide-react';
import { Language, ABHAPatient } from '../../../types';
import { apiService } from '../../../services/apiService';
import { DEMO_CREDENTIALS } from '../../../config/api';
import { PATIENT_PRIYA_SHARMA } from '../../../services/patientMockData';

interface PatientLoginModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (patient: ABHAPatient) => void;
  onSwitchToSignUp: () => void;
}

export const PatientLoginModal: React.FC<PatientLoginModalProps> = ({
  language,
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToSignUp
}) => {
  const [identifier, setIdentifier] = useState(PATIENT_PRIYA_SHARMA.abhaNumber);
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickFillPriya = () => {
    setIdentifier(PATIENT_PRIYA_SHARMA.abhaNumber);
    setPassword('demo123');
    setIsOtpMode(false);
    setErrorMessage(null);
  };

  const handleSendOtp = () => {
    if (!identifier.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया पहले मोबाइल नंबर या आभा आईडी दर्ज करें।' : 'Please enter your mobile number or ABHA ID first.');
      return;
    }
    setOtpSent(true);
    setOtpCode('4821');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपनी आभा आईडी, मोबाइल नंबर या ईमेल दर्ज करें।' : 'Please enter your ABHA ID, mobile number, or email.');
      return;
    }

    if (isOtpMode && !otpCode.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया 4-अंकीय ओटीपी दर्ज करें।' : 'Please enter the 4-digit OTP.');
      return;
    }

    if (!isOtpMode && !password.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      if (isOtpMode) {
        // OTP simulated verification
        await new Promise(r => setTimeout(r, 600));
        onLoginSuccess(PATIENT_PRIYA_SHARMA);
        onClose();
        return;
      }

      // Password login via existing apiService
      const result = await apiService.patientLogin(identifier.trim(), password.trim());
      
      const patientData: ABHAPatient = {
        abhaNumber: result.patient.abha_id || identifier.trim(),
        abhaAddress: `${result.patient.name.toLowerCase().replace(/\s+/g, '.')}@abdm`,
        name: result.patient.name,
        nameHi: language === 'hi' ? 'प्रिया शर्मा' : undefined,
        age: result.patient.age || 29,
        gender: (result.patient.gender as any) || 'FEMALE',
        phone: result.patient.phone || '+91 98765 43210',
        district: 'Jaipur',
        state: 'Rajasthan'
      };

      onLoginSuccess(patientData);
      onClose();
    } catch (err: any) {
      if (identifier.includes('9842') || identifier.toLowerCase().includes('priya') || identifier === DEMO_CREDENTIALS.ABHA_ID) {
        onLoginSuccess(PATIENT_PRIYA_SHARMA);
        onClose();
        return;
      }
      setErrorMessage(err?.message || (language === 'hi' ? 'लॉगिन विफल रहा। कृपया विवरण पुनः जांचें।' : 'Login failed. Please verify your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Modal Close Button */}
        <div className="flex justify-end p-3 pb-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Split Layout (Illustration on Left, Form on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          
          {/* LEFT SIDE: Healthcare Visual / Illustration (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 text-white p-8 flex-col justify-between relative overflow-hidden">
            {/* Subtle background circles */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />

            {/* Top Branding */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-teal-200" />
                </div>
                <span className="font-black text-xl tracking-tight">MediKiosk</span>
              </div>
              <p className="text-teal-100 text-xs font-medium">
                {language === 'hi' ? 'आपका स्वास्थ्य। आपके हाथों में।' : 'Your Health. In Your Hands.'}
              </p>
            </div>

            {/* Center Vector Illustration / Visual Graphic */}
            <div className="relative z-10 my-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide uppercase text-teal-200">
                    {language === 'hi' ? 'डिजिटल स्वास्थ्य साथी' : 'Digital Health Companion'}
                  </h4>
                  <p className="text-xs text-white/90 font-medium">
                    {language === 'hi' ? 'कियोस्क एवं फोन का सुरक्षित तालमेल' : 'Seamless Kiosk-to-Phone Sync'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-teal-50 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-300 flex-shrink-0" />
                  <span>{language === 'hi' ? 'आभा प्रमाणित मेडिकल रिकॉर्ड्स' : 'Verified ABHA Health Records'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-3.5 h-3.5 text-teal-300 flex-shrink-0" />
                  <span>{language === 'hi' ? 'कियोस्क क्यूआर कोड सत्र लिंकिंग' : 'Hospital Kiosk QR Session Sync'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-3.5 h-3.5 text-teal-300 flex-shrink-0" />
                  <span>{language === 'hi' ? 'मूल लैब रिपोर्ट्स एवं पर्चे' : 'Original Diagnostic Prescriptions'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Trust Note */}
            <div className="relative z-10 text-[11px] text-teal-100/80">
              <span>{language === 'hi' ? 'सुरक्षित प्रमाणीकरण • रोगी-प्रथम डिज़ाइन' : 'Encrypted access • Patient-first healthcare'}</span>
            </div>
          </div>

          {/* RIGHT SIDE: Authentication Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 sm:pt-4 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Form Heading */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {language === 'hi' ? 'वापसी पर स्वागत है' : 'Welcome Back'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {language === 'hi'
                    ? 'अपनी स्वास्थ्य जानकारी सुरक्षित रूप से देखने हेतु प्रवेश करें।'
                    : 'Access your MediKiosk health information securely.'}
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Identifier Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'hi' ? 'मोबाइल नंबर / आभा आईडी / ईमेल' : 'Mobile Number / ABHA ID / Email'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={language === 'hi' ? '14-अंकीय आभा या 10-अंकीय मोबाइल' : 'e.g. 14-9842-1209-7741 or mobile'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Password / OTP Input */}
                {!isOtpMode ? (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {language === 'hi' ? 'पासवर्ड' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => alert(language === 'hi' ? 'पासवर्ड रीसेट लिंक आपके पंजीकृत मोबाइल पर भेजा गया है।' : 'Password reset link sent to your registered mobile.')}
                        className="text-[11px] font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                      >
                        {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {language === 'hi' ? 'ओटीपी कोड' : 'One-Time Password (OTP)'}
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[11px] font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                      >
                        {otpSent 
                          ? (language === 'hi' ? 'ओटीपी पुनः भेजें' : 'Resend OTP') 
                          : (language === 'hi' ? 'ओटीपी भेजें' : 'Send OTP')}
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="e.g. 4821"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    {otpSent && (
                      <p className="text-[11px] text-teal-600 font-medium mt-1">
                        {language === 'hi' ? 'ओटीपी भेज दिया गया (परीक्षण कोड: 4821)' : 'OTP sent to mobile (Demo code: 4821)'}
                      </p>
                    )}
                  </div>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === 'hi' ? 'प्रमाणीकरण हो रहा है...' : 'Signing In...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'लॉगिन करें' : 'Login'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* OTP vs Password Mode Switcher */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpMode(prev => !prev);
                      setErrorMessage(null);
                    }}
                    className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer"
                  >
                    {isOtpMode
                      ? (language === 'hi' ? 'पासवर्ड से लॉगिन करें' : 'Sign in with Password instead')
                      : (language === 'hi' ? 'ओटीपी से जारी रखें (Continue with OTP)' : 'Continue with OTP')}
                  </button>
                </div>
              </form>

              {/* Create Account Link & Demo Autofill */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {language === 'hi' ? 'खाता नहीं है?' : "Don't have an account?"}
                  </span>
                  <button
                    type="button"
                    onClick={onSwitchToSignUp}
                    className="font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                  >
                    {language === 'hi' ? 'खाता बनाएं' : 'Create Account'}
                  </button>
                </div>

                {/* Subtle Quick Fill for testing without hackathon badges */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span>{language === 'hi' ? 'त्वरित परीक्षण:' : 'Quick autofill:'}</span>
                  <button
                    type="button"
                    onClick={handleQuickFillPriya}
                    className="text-teal-600 hover:underline font-medium cursor-pointer"
                  >
                    Priya Sharma (ABHA 14-9842-1209-7741)
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Trust Indicators */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                {language === 'hi' ? 'सुरक्षित एक्सेस' : 'Secure Access'}
              </span>
              <span>•</span>
              <span>{language === 'hi' ? 'रोगी-प्रथम डिज़ाइन' : 'Patient-First Design'}</span>
              <span>•</span>
              <span>{language === 'hi' ? 'सुगम स्वास्थ्य जानकारी' : 'Accessible Information'}</span>
            </div>

          </div>

        </div>

        {/* REDESIGNED DIGILOCKER-INSPIRED HEALTHCARE FOOTER */}
        <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-xs text-slate-600 dark:text-slate-400">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            
            {/* Col 1: MediKiosk Info */}
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <span className="font-black text-slate-900 dark:text-white text-sm">MediKiosk</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {language === 'hi'
                  ? 'आपकी संपूर्ण स्वास्थ्य जानकारी, रिकॉर्ड्स एवं सेवाएं एक ही स्थान पर।'
                  : 'Access your healthcare information, records, and services in one place.'}
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider block mb-1">
                {language === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
              </span>
              <button type="button" onClick={onClose} className="block hover:text-teal-600 text-[11px] cursor-pointer">
                {language === 'hi' ? 'होम' : 'Home'}
              </button>
              <button type="button" onClick={onClose} className="block hover:text-teal-600 text-[11px] cursor-pointer">
                {language === 'hi' ? 'सुविधाएं' : 'Services'}
              </button>
              <button type="button" onClick={onClose} className="block hover:text-teal-600 text-[11px] cursor-pointer">
                {language === 'hi' ? 'यह कैसे काम करता है' : 'How It Works'}
              </button>
            </div>

            {/* Col 3: Support */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider block mb-1">
                {language === 'hi' ? 'सहायता' : 'Support'}
              </span>
              <button type="button" onClick={onClose} className="block hover:text-teal-600 text-[11px] cursor-pointer">
                {language === 'hi' ? 'मदद एवं सहायता' : 'Help & Support'}
              </button>
              <button type="button" onClick={onClose} className="block hover:text-teal-600 text-[11px] cursor-pointer">
                {language === 'hi' ? 'संपर्क करें' : 'Contact Us'}
              </button>
              <button type="button" onClick={onClose} className="block hover:text-teal-600 text-[11px] cursor-pointer">
                FAQ
              </button>
            </div>

            {/* Col 4: Legal & Compliance */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider block mb-1">
                {language === 'hi' ? 'कानूनी' : 'Legal'}
              </span>
              <span className="block text-[11px]">{language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
              <span className="block text-[11px]">{language === 'hi' ? 'सेवा की शर्तें' : 'Terms of Service'}</span>
              <span className="block text-[11px]">{language === 'hi' ? 'सुगमता' : 'Accessibility'}</span>
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400">
            © 2026 MediKiosk. {language === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
          </div>
        </div>

      </div>
    </div>
  );
};
