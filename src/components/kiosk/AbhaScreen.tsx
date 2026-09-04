import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { NumericKeypad } from '../common/NumericKeypad';
import { ABHAPatient } from '../../types';
import { PRESET_PATIENTS } from '../../services/mockData';

export const AbhaScreen: React.FC = () => {
  const { 
    setScreen, 
    activePatient, 
    setActivePatient, 
    verifyAbha, 
    language, 
    t 
  } = useKiosk();

  // Raw digits string (max 14 digits)
  const [digits, setDigits] = useState<string>(() => {
    return activePatient ? activePatient.abhaNumber.replace(/\D/g, '') : '14239481923041'; // default preset
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [patientRecord, setPatientRecord] = useState<ABHAPatient | null>(activePatient);

  // Format 14 digits into XXXX-XXXX-XXXX-XX
  const formatAbha = (raw: string) => {
    const clean = raw.replace(/\D/g, '').slice(0, 14);
    const parts = [];
    if (clean.length > 0) parts.push(clean.slice(0, 2));
    if (clean.length > 2) parts.push(clean.slice(2, 6));
    if (clean.length > 6) parts.push(clean.slice(6, 10));
    if (clean.length > 10) parts.push(clean.slice(10, 14));
    return parts.join('-');
  };

  const handleDigit = (d: string) => {
    if (d === '.') return; // ABHA is pure integer
    if (digits.length < 14) {
      setDigits(prev => prev + d);
      setErrorMessage('');
      setPatientRecord(null);
    }
  };

  const handleBackspace = () => {
    setDigits(prev => prev.slice(0, -1));
    setErrorMessage('');
    setPatientRecord(null);
  };

  const handleClear = () => {
    setDigits('');
    setErrorMessage('');
    setPatientRecord(null);
  };

  const handleVerify = async () => {
    if (digits.length !== 14) {
      setErrorMessage(t('errorAbhaInvalid'));
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const patient = await verifyAbha(digits);
      setIsLoading(false);
      if (patient) {
        setPatientRecord(patient);
      } else {
        setErrorMessage(language === 'hi' 
          ? "आभा रिकॉर्ड नहीं मिला। कृपया नंबर दोबारा जांचें।" 
          : "ABHA record not found. Please re-check the 14 digits.");
      }
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(t('errorGeneral'));
    }
  };

  const handleConfirmAndProceed = () => {
    if (patientRecord) {
      setActivePatient(patientRecord);
      setScreen('ASSESSMENT_TYPE');
    }
  };

  // Quick preset loader buttons for hackathon demonstration
  const handleSelectPreset = (p: ABHAPatient) => {
    setDigits(p.abhaNumber.replace(/\D/g, ''));
    setPatientRecord(p);
    setActivePatient(p);
    setErrorMessage('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 select-none">
      {/* Screen Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('abhaTitle')}
        </h2>
        <p className="text-lg text-slate-600 font-semibold mt-1">
          {t('abhaSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Field & Keypad */}
        <div className="lg:col-span-7 space-y-6">
          {/* Formatted ABHA Display Box */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-300 shadow-sm text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-teal-800 font-bold text-sm uppercase tracking-wider">
              <CreditCard className="w-4 h-4" />
              <span>14-Digit ABHA Number</span>
            </div>

            <div className="text-3xl sm:text-4xl font-mono font-black text-slate-900 tracking-wider py-3 bg-slate-50 border-2 border-teal-600/50 rounded-2xl min-h-[68px] flex items-center justify-center">
              {formatAbha(digits) || (
                <span className="text-slate-400 font-normal text-2xl">
                  {t('abhaInputPlaceholder')}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">
              {t('abhaHint')}
            </p>

            {errorMessage && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-sm font-bold flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Touchscreen Numeric Keypad */}
          <NumericKeypad
            onKeyPress={handleDigit}
            onBackspace={handleBackspace}
            onClear={handleClear}
            onSubmit={handleVerify}
            submitLabel={isLoading ? t('verifyingAbha') : t('verifyAbhaBtn')}
            disableSubmit={digits.length !== 14 || isLoading}
          />

          {/* Quick Demo Selector Chips */}
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>{t('useDemoProfile')}:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_PATIENTS.map((p, idx) => (
                <button
                  key={p.abhaNumber}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="px-3 py-2 bg-white hover:bg-teal-50 active:bg-teal-100 border border-slate-300 rounded-xl text-left text-xs font-bold text-slate-800 transition-all cursor-pointer truncate"
                >
                  <span className="text-teal-800 font-black">{idx + 1}. </span>
                  <span>{language === 'hi' && p.nameHi ? p.nameHi : p.name}</span>
                  <span className="text-slate-600 text-[10px] block font-mono">{p.abhaNumber}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Retrieved Patient Demographics & Confirmation */}
        <div className="lg:col-span-5">
          {isLoading ? (
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
              <p className="text-xl font-bold text-slate-800">{t('verifyingAbha')}</p>
              <p className="text-sm text-slate-500">
                {language === 'hi' 
                  ? 'सुरक्षित ABDM गेटवे से संपर्क स्थापित किया जा रहा है...' 
                  : 'Establishing encrypted gateway handshake with ABDM registry...'}
              </p>
            </div>
          ) : patientRecord ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-3 border-teal-600 shadow-lg space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 text-teal-800 border-b border-slate-200 pb-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 stroke-[2.5]" />
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {t('patientFoundTitle')}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700">
                    {language === 'hi' ? 'आयुष्मान भारत खाता सत्यापित' : 'Ayushman Account Verified'}
                  </p>
                </div>
              </div>

              {/* Demographic Fields */}
              <div className="space-y-3 text-slate-800">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-bold text-slate-500">{t('name')}</span>
                  <span className="text-lg font-black text-slate-900">
                    {language === 'hi' && patientRecord.nameHi ? patientRecord.nameHi : patientRecord.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-500 block">{t('age')}</span>
                    <span className="text-base font-black text-slate-900">{patientRecord.age} yrs</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-500 block">{t('gender')}</span>
                    <span className="text-base font-black text-slate-900">
                      {patientRecord.gender === 'MALE' ? t('male') : t('female')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-bold text-slate-500">{t('phone')}</span>
                  <span className="text-base font-bold font-mono text-slate-800">{patientRecord.phone}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-bold text-slate-500">{t('district')}</span>
                  <span className="text-base font-bold text-slate-800">{patientRecord.district}, {patientRecord.state}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-bold text-slate-500">{t('abhaId')}</span>
                  <span className="text-xs font-mono font-bold text-teal-800">{patientRecord.abhaAddress}</span>
                </div>
              </div>

              {/* Primary Action */}
              <button
                type="button"
                onClick={handleConfirmAndProceed}
                className="w-full min-h-[64px] py-4 px-6 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-black text-xl rounded-2xl border-2 border-teal-800 shadow-md flex items-center justify-center gap-3 cursor-pointer transition-all"
              >
                <span>{t('confirmDetailsBtn')}</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          ) : (
            /* Waiting for verification card */
            <div className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-300 text-center space-y-3">
              <User className="w-14 h-14 mx-auto text-slate-400" />
              <h4 className="text-lg font-bold text-slate-700">
                {language === 'hi' ? 'मरीज का रिकॉर्ड यहां दिखेगा' : 'Patient Record Preview'}
              </h4>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                {language === 'hi' 
                  ? 'अपना 14 अंकों का नंबर दर्ज करके हरे बटन को दबाएं।'
                  : 'Enter the 14-digit ABHA ID on the keypad to securely load verified demographics.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
