import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { apiService } from '../../services/apiService';
import { DEMO_CREDENTIALS, API_BASE_URL } from '../../config/api';

export const PatientLoginScreen: React.FC = () => {
  const { 
    setScreen, 
    setPortalPatient, 
    setPortalConsultations, 
    setIsLiveBackendSync, 
    language, 
    t 
  } = useKiosk();

  const [abhaId, setAbhaId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<'abha' | 'password'>('abha');

  const handleQuickFillDemo = () => {
    setAbhaId(DEMO_CREDENTIALS.ABHA_ID);
    setPassword(DEMO_CREDENTIALS.PASSWORD);
    setErrorMessage(null);
  };

  const handleKeypadPress = (val: string) => {
    if (activeField === 'abha') {
      setAbhaId(prev => prev + val);
    } else {
      setPassword(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    if (activeField === 'abha') {
      setAbhaId(prev => prev.slice(0, -1));
    } else {
      setPassword(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (activeField === 'abha') {
      setAbhaId('');
    } else {
      setPassword('');
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!abhaId.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपनी आभा आईडी दर्ज करें।' : 'Please enter your ABHA ID.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Authenticate patient
      const loginResult = await apiService.patientLogin(abhaId.trim(), password.trim());
      setPortalPatient(loginResult.patient);
      setIsLiveBackendSync(loginResult.isLiveBackend);

      // 2. Fetch past consultations
      const consultationsResult = await apiService.getPatientConsultations(loginResult.patient.id);
      setPortalConsultations(consultationsResult.consultations);

      // 3. Move to My Records screen
      setScreen('MY_RECORDS');
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorMessage(err?.message || (language === 'hi' ? 'लॉगिन विफल रहा। कृपया विवरण पुनः जांचें।' : 'Login failed. Please verify credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 text-teal-900 border border-teal-300 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <FolderOpen className="w-4 h-4 text-teal-800" />
          <span>{language === 'hi' ? 'आयुष्मान भारत डिजिटल मिशन' : 'Ayushman Bharat Digital Health Portal'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('portalTitle')}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-semibold mt-1 max-w-2xl mx-auto">
          {t('portalSubtitle')}
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md max-w-2xl mx-auto space-y-6">
        {/* Demo Autofill Banner */}
        <div className="p-4 bg-teal-50 border-2 border-teal-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-teal-700 flex-shrink-0" />
            <div>
              <p className="text-xs font-black text-teal-900 uppercase">
                {language === 'hi' ? 'परीक्षण हेतु त्वरित डेमो' : 'Evaluation Demo Account'}
              </p>
              <p className="text-xs text-teal-800 font-mono">
                ABHA: DEMO-ABHA-P001 • Pass: demo123
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickFillDemo}
            className="w-full sm:w-auto px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>{t('quickFillDemoBtn')}</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center gap-3 text-red-900">
            <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0" />
            <p className="text-sm font-bold">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* ABHA ID Input */}
          <div>
            <label className="block text-sm font-black text-slate-800 uppercase tracking-wide mb-1.5">
              {t('abhaIdInputLabel')}
            </label>
            <div 
              onClick={() => setActiveField('abha')}
              className={`relative flex items-center rounded-2xl border-2 transition-all ${
                activeField === 'abha' 
                  ? 'border-teal-700 ring-4 ring-teal-100 bg-white' 
                  : 'border-slate-300 bg-slate-50'
              }`}
            >
              <div className="pl-4 text-slate-500">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={abhaId}
                onChange={e => setAbhaId(e.target.value)}
                onFocus={() => setActiveField('abha')}
                placeholder="e.g. DEMO-ABHA-P001 or 14-1234-5678-9012"
                className="w-full px-4 py-4 text-lg font-mono font-bold text-slate-900 bg-transparent rounded-2xl focus:outline-none"
              />
              {abhaId && (
                <button
                  type="button"
                  onClick={() => setAbhaId('')}
                  className="pr-4 text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-black text-slate-800 uppercase tracking-wide mb-1.5">
              {t('passwordInputLabel')}
            </label>
            <div 
              onClick={() => setActiveField('password')}
              className={`relative flex items-center rounded-2xl border-2 transition-all ${
                activeField === 'password' 
                  ? 'border-teal-700 ring-4 ring-teal-100 bg-white' 
                  : 'border-slate-300 bg-slate-50'
              }`}
            >
              <div className="pl-4 text-slate-500">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setActiveField('password')}
                placeholder="••••••••"
                className="w-full px-4 py-4 text-lg font-mono font-bold text-slate-900 bg-transparent rounded-2xl focus:outline-none"
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setPassword('')}
                  className="pr-4 text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Touchscreen Quick Keypad for Easy Kiosk Typing */}
          <div className="pt-2">
            <p className="text-xs font-black uppercase text-slate-400 text-center mb-2">
              {language === 'hi' ? 'टचस्क्रीन कीपैड' : 'On-Screen Touchpad'}
            </p>
            <div className="grid grid-cols-6 gap-1.5 max-w-md mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', 'P'].map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleKeypadPress(k)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 active:bg-teal-700 active:text-white rounded-xl text-base font-mono font-black text-slate-800 border border-slate-200 transition-all cursor-pointer"
                >
                  {k}
                </button>
              ))}
              <button
                type="button"
                onClick={handleBackspace}
                className="col-span-3 p-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                ⌫ Backspace
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="col-span-3 p-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !abhaId || !password}
              className="w-full min-h-[64px] px-6 py-4 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg sm:text-xl rounded-2xl border-2 border-teal-800 shadow-xl flex items-center justify-center gap-3 cursor-pointer transition-all active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>{t('loginProcessing')}</span>
                </>
              ) : (
                <>
                  <span>{t('loginButton')}</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security and Endpoint Info Footer */}
        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>256-bit Encrypted ABDM Gateway</span>
          </div>
          <div className="font-mono text-[10px] text-slate-400 truncate max-w-[280px]">
            API: {API_BASE_URL.replace('https://', '')}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => setScreen('HOME')}
          className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-base sm:text-lg rounded-2xl border-2 border-slate-300 flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to Home'}</span>
        </button>
      </div>
    </div>
  );
};
