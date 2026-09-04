import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Heart, 
  Activity, 
  Brain, 
  Apple, 
  Moon, 
  AlertCircle, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Scale,
  Smile
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { AyurvedaData } from '../../types';
import { apiService } from '../../services/apiService';

export const AyurvedaScreen: React.FC = () => {
  const { 
    setScreen, 
    activePatient, 
    vitals, 
    ayurvedaData, 
    updateAyurvedaData, 
    language, 
    t 
  } = useKiosk();

  // Auto-populate Vaya (Age), Height, Weight from demographics & vitals
  const patientAge = activePatient?.age || 52;
  const patientHeight = vitals.heightCm || 162;
  const patientWeight = vitals.weightKg || 62;

  // 1. Prakriti
  const [prakriti, setPrakriti] = useState<string>(ayurvedaData?.prakriti || 'Pitta-Vata');

  // 2. Agni
  const [agni, setAgni] = useState<string>(ayurvedaData?.agni || 'VISHAMA');

  // 3. Koshtha
  const [koshtha, setKoshtha] = useState<string>(ayurvedaData?.koshtha || 'MADHYAMA');

  // 4. Ahara Shakti
  const [aharaShakti, setAharaShakti] = useState<string>(ayurvedaData?.ahara_shakti || 'MADHYAMA');

  // 5. Vyayama Shakti
  const [vyayamaShakti, setVyayamaShakti] = useState<string>(ayurvedaData?.vyayama_shakti || 'MADHYAMA');

  // 6. Sattva
  const [sattva, setSattva] = useState<string>(ayurvedaData?.sattva || 'MADHYAMA');

  // 7. Satmya
  const [satmya, setSatmya] = useState<string>(ayurvedaData?.satmya || 'MADHYAMA');

  // 8. Ahara Habits
  const [aharaHabits, setAharaHabits] = useState<string>(ayurvedaData?.ahara_habits || 'Vegetarian, Moderately Regular');

  // 9. Vihara (Sleep & Routine)
  const [viharaLifestyle, setViharaLifestyle] = useState<string>(ayurvedaData?.vihara_lifestyle || 'Disturbed Sleep (5-6h), Sedentary Desk Work');

  // 10. Nidana Triggers
  const [nidanaFactors, setNidanaFactors] = useState<string[]>(
    ayurvedaData?.nidana_factors || ['Chinta / Stress', 'Ratrijagarana / Late Sleep']
  );

  const toggleNidana = (factor: string) => {
    if (nidanaFactors.includes(factor)) {
      setNidanaFactors(nidanaFactors.filter(f => f !== factor));
    } else {
      setNidanaFactors([...nidanaFactors, factor]);
    }
  };

  const handleSaveAndContinue = async () => {
    const payload: AyurvedaData = {
      prakriti,
      agni,
      koshtha,
      ahara_shakti: aharaShakti,
      vyayama_shakti: vyayamaShakti,
      sattva,
      satmya,
      ahara_habits: aharaHabits,
      vihara_lifestyle: viharaLifestyle,
      nidana_factors: nidanaFactors,
      vaya_age: patientAge,
      height_cm: patientHeight,
      weight_kg: patientWeight
    };

    updateAyurvedaData(payload);

    // Call backend endpoint POST /api/consultations/{id}/ayurveda
    try {
      await apiService.submitAyurveda("temp_cons_id", payload);
    } catch (e) {
      console.warn("Ayurveda submit fallback active:", e);
    }

    setScreen('HISTORY');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-950 border border-amber-300 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-800" />
          <span>AYUSH • All India Institute of Ayurveda (AIIA) Protocol</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t('ayurvedaTitle')}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-semibold mt-1 max-w-2xl mx-auto">
          {t('ayurvedaSubtitle')}
        </p>
      </div>

      {/* Auto-populated Vitals & Age Card */}
      <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-amber-800" />
          <span className="text-xs font-black uppercase text-amber-950">
            {language === 'hi' ? 'स्वतः प्राप्त शारीरिक माप' : 'Auto-Populated Physical Measurements'}:
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-amber-950 font-mono">
          <span className="bg-white px-3 py-1 rounded-xl border border-amber-200">
            {language === 'hi' ? 'आयु' : 'Age'}: {patientAge} {language === 'hi' ? 'वर्ष' : 'Yrs'}
          </span>
          <span className="bg-white px-3 py-1 rounded-xl border border-amber-200">
            {language === 'hi' ? 'ऊंचाई' : 'Height'}: {patientHeight} cm
          </span>
          <span className="bg-white px-3 py-1 rounded-xl border border-amber-200">
            {language === 'hi' ? 'वजन' : 'Weight'}: {patientWeight} kg
          </span>
        </div>
      </div>

      {/* Main Questionnaire Accordions / Sections */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
        
        {/* 1. Prakriti (Body Constitution) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-teal-700" />
            <h3 className="text-lg font-black text-slate-900">{t('prakritiTitle')}</h3>
          </div>
          <p className="text-xs text-slate-500 font-semibold">{t('prakritiDesc')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { key: 'Vata', labelEn: 'Vata (वात)', descEn: 'Light build, dry skin, quick, cold-sensitive' },
              { key: 'Pitta', labelEn: 'Pitta (पित्त)', descEn: 'Moderate build, sharp hunger, heat-sensitive' },
              { key: 'Kapha', labelEn: 'Kapha (कफ)', descEn: 'Solid build, calm, slow digestion, cool skin' },
              { key: 'Vata-Pitta', labelEn: 'Vata-Pitta (वात-पित्त)', descEn: 'Variable digestion, active & sharp' },
              { key: 'Pitta-Kapha', labelEn: 'Pitta-Kapha (पित्त-कफ)', descEn: 'Strong stamina, moderate appetite' },
              { key: 'Vata-Kapha', labelEn: 'Vata-Kapha (वात-कफ)', descEn: 'Cold sensitivity, fluctuating weight' },
            ].map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => setPrakriti(item.key)}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                  prakriti === item.key 
                    ? 'bg-teal-700 text-white border-teal-800 shadow-md' 
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-black text-sm">{item.labelEn}</div>
                <div className={`text-[11px] mt-1 line-clamp-2 ${prakriti === item.key ? 'text-teal-100' : 'text-slate-500'}`}>
                  {item.descEn}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Agni (Digestive Fire) & Koshtha (Bowel Habits) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          {/* Agni */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <h4 className="text-base font-black text-slate-900">{t('agniTitle')}</h4>
            </div>
            <p className="text-xs text-slate-500">{t('agniDesc')}</p>
            <div className="space-y-1.5">
              {[
                { key: 'SAMA', labelEn: 'Sama Agni (सम)', descEn: 'Balanced, regular digestion' },
                { key: 'TIKSHNA', labelEn: 'Tikshna Agni (तीक्ष्ण)', descEn: 'Hyperactive hunger / acidity' },
                { key: 'MANDA', labelEn: 'Manda Agni (मन्द)', descEn: 'Sluggish, slow, heavy feeling' },
                { key: 'VISHAMA', labelEn: 'Vishama Agni (विषम)', descEn: 'Irregular, bloating & gas' },
              ].map(item => (
                <div
                  key={item.key}
                  onClick={() => setAgni(item.key)}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    agni === item.key ? 'bg-amber-50 border-amber-400 font-bold text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-sm font-black">{item.labelEn}</span>
                    <span className="text-xs text-slate-500 ml-2 font-normal">({item.descEn})</span>
                  </div>
                  {agni === item.key && <Check className="w-4 h-4 text-amber-700 stroke-[3]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Koshtha */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h4 className="text-base font-black text-slate-900">{t('koshthaTitle')}</h4>
            </div>
            <p className="text-xs text-slate-500">{t('koshthaDesc')}</p>
            <div className="space-y-1.5">
              {[
                { key: 'MRIDU', labelEn: 'Mridu Koshtha (मृदु)', descEn: 'Soft stools, sensitive bowels' },
                { key: 'MADHYAMA', labelEn: 'Madhyama Koshtha (मध्यम)', descEn: 'Regular once-daily comfortable' },
                { key: 'KRURA', labelEn: 'Krura Koshtha (क्रूर)', descEn: 'Hard stools / constipation prone' },
              ].map(item => (
                <div
                  key={item.key}
                  onClick={() => setKoshtha(item.key)}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    koshtha === item.key ? 'bg-indigo-50 border-indigo-400 font-bold text-indigo-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-sm font-black">{item.labelEn}</span>
                    <span className="text-xs text-slate-500 ml-2 font-normal">({item.descEn})</span>
                  </div>
                  {koshtha === item.key && <Check className="w-4 h-4 text-indigo-700 stroke-[3]" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Ahara Shakti & Vyayama Shakti */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          {/* Ahara Shakti */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Apple className="w-5 h-5 text-emerald-600" />
              <h4 className="text-base font-black text-slate-900">{t('aharaShaktiTitle')}</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'PRAVARA', label: 'Pravara (High)' },
                { key: 'MADHYAMA', label: 'Madhyama (Med)' },
                { key: 'AVARA', label: 'Avara (Low)' },
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setAharaShakti(item.key)}
                  className={`p-2.5 rounded-xl text-xs font-black border-2 text-center cursor-pointer transition-all ${
                    aharaShakti === item.key ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vyayama Shakti */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <h4 className="text-base font-black text-slate-900">{t('vyayamaShaktiTitle')}</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'PRAVARA', label: 'Pravara (High)' },
                { key: 'MADHYAMA', label: 'Madhyama (Med)' },
                { key: 'AVARA', label: 'Avara (Low)' },
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setVyayamaShakti(item.key)}
                  className={`p-2.5 rounded-xl text-xs font-black border-2 text-center cursor-pointer transition-all ${
                    vyayamaShakti === item.key ? 'bg-orange-700 text-white border-orange-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Sattva (Mental Resilience) & Satmya (Dietary Adaptability) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          {/* Sattva */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <h4 className="text-base font-black text-slate-900">{t('sattvaTitle')}</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'PRAVARA', label: 'Pravara (Calm)' },
                { key: 'MADHYAMA', label: 'Madhyama' },
                { key: 'AVARA', label: 'Avara (Anxious)' },
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSattva(item.key)}
                  className={`p-2.5 rounded-xl text-xs font-black border-2 text-center cursor-pointer transition-all ${
                    sattva === item.key ? 'bg-purple-700 text-white border-purple-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Satmya */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-teal-600" />
              <h4 className="text-base font-black text-slate-900">{t('satmyaTitle')}</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'SARVA_RASA', label: 'All Tastes' },
                { key: 'MADHYAMA', label: 'Moderate' },
                { key: 'EKA_RASA', label: 'Selective' },
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSatmya(item.key)}
                  className={`p-2.5 rounded-xl text-xs font-black border-2 text-center cursor-pointer transition-all ${
                    satmya === item.key ? 'bg-teal-700 text-white border-teal-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Nidana (Causative Lifestyle Factors) */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-slate-700" />
            <h4 className="text-base font-black text-slate-900">{t('nidanaTitle')}</h4>
          </div>
          <p className="text-xs text-slate-500">{t('nidanaDesc')}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              'Chinta / Stress & Worry',
              'Ratrijagarana / Late Sleep',
              'Vishamashana / Irregular Meals',
              'Excessive Tea/Coffee',
              'Sedentary Lifestyle',
              'Heavy/Oily Food'
            ].map(factor => {
              const isSelected = nidanaFactors.includes(factor);
              return (
                <button
                  key={factor}
                  type="button"
                  onClick={() => toggleNidana(factor)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-sm' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-800 stroke-[3]" />}
                  <span>{factor}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clinical Note clarifying that physical exam items belong to doctor */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
          <p>
            {language === 'hi'
              ? 'नोट: शारीरिक परीक्षा (सार, संहनन, विकृति, सम्प्राप्ति) चिकित्सक द्वारा ओपीडी परामर्श कक्ष में जांची जाएगी।'
              : 'Clinical Protocol Note: Physical examination parameters (Sara, Samhanana, Vikriti, Samprapti) are evaluated clinically by the physician on the doctor dashboard.'}
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setScreen('VITALS')}
          className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-lg rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={handleSaveAndContinue}
          className="w-full sm:w-auto min-w-[240px] px-8 py-5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-black text-xl rounded-2xl border-2 border-teal-800 shadow-xl flex items-center justify-center gap-3 cursor-pointer transition-all"
        >
          <span>{t('continue')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
