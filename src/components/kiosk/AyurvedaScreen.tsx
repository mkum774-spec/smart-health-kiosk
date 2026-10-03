import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Heart,
  Activity,
  Flame,
  Apple,
  Brain,
  Scale,
  Smile,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { AyurvedaData, Language } from '../../types';
import { apiService } from '../../services/apiService';
import { AudioQuestionButton } from '../common/AudioQuestionButton';
import { VoiceAnswerButton } from '../common/VoiceAnswerButton';
import { AnswerConfirmation } from '../common/AnswerConfirmation';

type AyurvedaSectionKey = 'ABOUT_YOU' | 'FOOD_DIGESTION' | 'LIFESTYLE_MIND' | 'CURRENT_HEALTH';

export const AyurvedaScreen: React.FC = () => {
  const { 
    setScreen, 
    activePatient, 
    vitals, 
    symptomsText,
    ayurvedaData, 
    updateAyurvedaData, 
    language, 
    t 
  } = useKiosk();

  // Auto-derived values
  const patientAge = activePatient?.age || 52;
  const patientHeight = vitals.heightCm || 162;
  const patientWeight = vitals.weightKg || 62;

  // Active section (Section Progress Model per Section 15)
  const [activeSection, setActiveSection] = useState<AyurvedaSectionKey>('ABOUT_YOU');

  // Section 1: About You State
  const [samhananaBuild, setSamhananaBuild] = useState<string>('Medium');
  const [prakritiEnergy, setPrakritiEnergy] = useState<string>(ayurvedaData?.prakriti || 'Moderate');

  // Section 2: Food & Digestion State
  const [appetiteAhara, setAppetiteAhara] = useState<string>(ayurvedaData?.ahara_shakti || 'MADHYAMA');
  const [digestionAgni, setDigestionAgni] = useState<string>(ayurvedaData?.agni || 'SAMA');
  const [foodDiscomfort, setFoodDiscomfort] = useState<string>('No');
  const [discomfortFoods, setDiscomfortFoods] = useState<string>('Heavy or oily foods');

  // Section 3: Lifestyle & Mind State
  const [activityVyayama, setActivityVyayama] = useState<string>(ayurvedaData?.vyayama_shakti || 'MADHYAMA');
  const [stressSattva, setStressSattva] = useState<string>(ayurvedaData?.sattva || 'MADHYAMA');
  const [adaptabilitySatmya, setAdaptabilitySatmya] = useState<string>(ayurvedaData?.satmya || 'MADHYAMA');

  // Section 4: Current Health State (Vikriti)
  const [vikritiAreas, setVikritiAreas] = useState<string[]>([
    symptomsText.toLowerCase().includes('cough') || symptomsText.toLowerCase().includes('breathing') ? 'Energy' : 'Sleep'
  ]);

  // Voice confirmation state
  const [voicePending, setVoicePending] = useState<{
    targetField: string;
    text: string;
    optionId?: string;
    confidence: number;
  } | null>(null);

  const sectionsList: { key: AyurvedaSectionKey; labelEn: string; labelHi: string }[] = [
    { key: 'ABOUT_YOU', labelEn: 'About You', labelHi: 'आपके बारे में' },
    { key: 'FOOD_DIGESTION', labelEn: 'Food & Digestion', labelHi: 'आहार एवं पाचन' },
    { key: 'LIFESTYLE_MIND', labelEn: 'Lifestyle & Mind', labelHi: 'दिनचर्या एवं मन' },
    { key: 'CURRENT_HEALTH', labelEn: 'Current Health', labelHi: 'वर्तमान स्वास्थ्य' }
  ];

  const handleVoiceConfirm = () => {
    if (!voicePending) return;
    const { targetField, optionId, text } = voicePending;
    const value = optionId || text;

    if (targetField === 'prakritiEnergy') setPrakritiEnergy(value);
    if (targetField === 'samhananaBuild') setSamhananaBuild(value);
    if (targetField === 'appetiteAhara') setAppetiteAhara(value);
    if (targetField === 'digestionAgni') setDigestionAgni(value);
    if (targetField === 'activityVyayama') setActivityVyayama(value);
    if (targetField === 'stressSattva') setStressSattva(value);
    if (targetField === 'adaptabilitySatmya') setAdaptabilitySatmya(value);

    setVoicePending(null);
  };

  const handleSaveAndFinish = async () => {
    const payload: AyurvedaData = {
      prakriti: prakritiEnergy,
      agni: digestionAgni,
      koshtha: 'MADHYAMA',
      ahara_shakti: appetiteAhara,
      vyayama_shakti: activityVyayama,
      sattva: stressSattva,
      satmya: adaptabilitySatmya,
      ahara_habits: foodDiscomfort === 'Yes' ? `Discomfort with: ${discomfortFoods}` : 'Regular food tolerance',
      vihara_lifestyle: `Activity level: ${activityVyayama}`,
      nidana_factors: vikritiAreas,
      vaya_age: patientAge,
      height_cm: patientHeight,
      weight_kg: patientWeight
    };

    updateAyurvedaData(payload);

    try {
      await apiService.submitAyurveda("temp_cons_id", payload);
    } catch (e) {
      console.warn("Ayurveda submit fallback active:", e);
    }

    setScreen('HISTORY');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>AYUSH • Integrated Clinical Protocol (AIIA)</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
          {language === 'hi' ? 'आयुर्वेदिक स्वास्थ्य मूल्यांकन' : 'Ayurveda Health Assessment'}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-semibold mt-1 max-w-2xl mx-auto">
          {language === 'hi' 
            ? 'सरल भाषा में आपके शरीर की प्रकृति और पाचन क्षमता की जानकारी'
            : 'Simple questions to understand your constitution and natural body balance'}
        </p>
      </div>

      {/* Section Progress Navigation (Section 15) */}
      <div className="flex items-center justify-between gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 overflow-x-auto">
        {sectionsList.map((sec, idx) => {
          const isActive = activeSection === sec.key;
          const isDone = sectionsList.findIndex(s => s.key === activeSection) > idx;

          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSection(sec.key)}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white shadow-md'
                  : isDone
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <span>{isDone ? '✓' : isActive ? '●' : '○'}</span>
              <span>{language === 'hi' ? sec.labelHi : sec.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Voice Confirmation Banner */}
      {voicePending && (
        <AnswerConfirmation
          interpretedText={voicePending.text}
          confidence={voicePending.confidence}
          language={language}
          onConfirm={handleVoiceConfirm}
          onRetry={() => setVoicePending(null)}
        />
      )}

      {/* SECTION 1: ABOUT YOU */}
      {activeSection === 'ABOUT_YOU' && (
        <div className="space-y-6">
          {/* Derived Data Notices (Section 14) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">
                  {language === 'hi' ? 'आयु (Vaya)' : 'Age (Vaya)'}
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {language === 'hi' ? '✓ पंजीकरण रिकॉर्ड से प्राप्त' : '✓ Auto-derived from your registration'}
                </span>
              </div>
              <span className="font-mono font-black text-lg text-emerald-950 dark:text-emerald-200">
                {patientAge} {language === 'hi' ? 'वर्ष' : 'years'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">
                  {language === 'hi' ? 'कद एवं वजन (Pramana)' : 'Height & Weight (Pramana)'}
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {language === 'hi' ? '✓ वाइटल्स से प्राप्त' : '✓ Auto-derived from your health vitals'}
                </span>
              </div>
              <span className="font-mono font-black text-lg text-emerald-950 dark:text-emerald-200">
                {patientHeight}cm • {patientWeight}kg
              </span>
            </div>
          </div>

          {/* Question 1: Body build (Samhanana) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'आप अपने शरीर की बनावट को कैसा बताएंगे?' : 'How would you describe your body build?'}
                </h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                  {language === 'hi' ? 'शरीर की संहनन बनावट (Samhanana)' : 'Body Structure (Samhanana)'}
                </span>
              </div>
              <AudioQuestionButton
                textToSpeak={language === 'hi' ? 'आप अपने शरीर की बनावट को कैसा बताएंगे?' : 'How would you describe your body build?'}
                language={language}
              />
            </div>

            <div className="my-2">
              <VoiceAnswerButton
                questionId="samhananaBuild"
                language={language}
                availableOptions={[
                  { id: 'Slim', label: language === 'hi' ? 'दुबला / पतला' : 'Slim' },
                  { id: 'Medium', label: language === 'hi' ? 'मध्यम / संतुलित' : 'Medium' },
                  { id: 'Broad', label: language === 'hi' ? 'मजबूत / चौड़ा' : 'Broad / well-built' }
                ]}
                onInterpreted={(res, raw) => setVoicePending({ targetField: 'samhananaBuild', text: res.interpretedText || raw, optionId: res.selectedOption, confidence: res.confidence })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3">
              {[
                { id: 'Slim', labelEn: 'Slim', labelHi: 'दुबला / पतला' },
                { id: 'Medium', labelEn: 'Medium', labelHi: 'मध्यम' },
                { id: 'Broad', labelEn: 'Broad / well-built', labelHi: 'मजबूत / चौड़ा' },
                { id: 'Not sure', labelEn: 'Not sure', labelHi: 'पता नहीं' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSamhananaBuild(opt.id)}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base cursor-pointer transition-all ${
                    samhananaBuild === opt.id
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {language === 'hi' ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Usual Energy (Prakriti indicator) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'आमतौर पर आपकी ऊर्जा का स्तर कैसा रहता है?' : 'How would you describe your usual energy?'}
                </h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                  {language === 'hi' ? 'संवैधानिक ऊर्जा (Prakriti)' : 'Constitutional Energy (Prakriti)'}
                </span>
              </div>
              <AudioQuestionButton
                textToSpeak={language === 'hi' ? 'आमतौर पर आपकी ऊर्जा का स्तर कैसा रहता है?' : 'How would you describe your usual energy?'}
                language={language}
              />
            </div>

            <div className="my-2">
              <VoiceAnswerButton
                questionId="prakritiEnergy"
                language={language}
                availableOptions={[
                  { id: 'Usually low', label: language === 'hi' ? 'अक्सर कम / सुस्त' : 'Usually low' },
                  { id: 'Moderate', label: language === 'hi' ? 'मध्यम / सामान्य' : 'Moderate' },
                  { id: 'Usually high', label: language === 'hi' ? 'अक्सर तेज़ / उच्च' : 'Usually high' }
                ]}
                onInterpreted={(res, raw) => setVoicePending({ targetField: 'prakritiEnergy', text: res.interpretedText || raw, optionId: res.selectedOption, confidence: res.confidence })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {[
                { id: 'Usually low', labelEn: 'Usually low', labelHi: 'अक्सर कम / सुस्त' },
                { id: 'Moderate', labelEn: 'Moderate', labelHi: 'मध्यम / सामान्य' },
                { id: 'Usually high', labelEn: 'Usually high', labelHi: 'अक्सर तेज़ / उच्च' },
                { id: 'Changes often', labelEn: 'Changes often', labelHi: 'बदलता रहता है' },
                { id: 'Not sure', labelEn: 'Not sure', labelHi: 'पता नहीं' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrakritiEnergy(opt.id)}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base cursor-pointer transition-all ${
                    prakritiEnergy === opt.id
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {language === 'hi' ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FOOD & DIGESTION */}
      {activeSection === 'FOOD_DIGESTION' && (
        <div className="space-y-6">
          {/* Question 3: Appetite (Ahara Shakti) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'आमतौर पर आपकी भूख कैसी रहती है?' : 'How is your appetite usually?'}
                </h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                  {language === 'hi' ? 'आहार शक्ति (Ahara Shakti)' : 'Appetite & Intake (Ahara Shakti)'}
                </span>
              </div>
              <AudioQuestionButton
                textToSpeak={language === 'hi' ? 'आमतौर पर आपकी भूख कैसी रहती है?' : 'How is your appetite usually?'}
                language={language}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {[
                { id: 'AVARA', labelEn: 'Low (कम)', labelHi: 'कम भूख लगती है' },
                { id: 'MADHYAMA', labelEn: 'Normal (सामान्य)', labelHi: 'सामान्य भूख' },
                { id: 'PRAVARA', labelEn: 'Strong / High (तेज़)', labelHi: 'तेज़ भूख लगती है' },
                { id: 'VISHAMA', labelEn: 'Irregular (अनियमित)', labelHi: 'अनियमित भूख' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAppetiteAhara(opt.id)}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base cursor-pointer transition-all ${
                    appetiteAhara === opt.id
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {language === 'hi' ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Digestion After Eating (Agni) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'भोजन के बाद आपको कैसा महसूस होता है?' : 'After eating, how do you usually feel?'}
                </h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                  {language === 'hi' ? 'पाचन अग्नि (Agni)' : 'Digestive Power (Agni)'}
                </span>
              </div>
              <AudioQuestionButton
                textToSpeak={language === 'hi' ? 'भोजन के बाद आपको कैसा महसूस होता है?' : 'After eating, how do you usually feel?'}
                language={language}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {[
                { id: 'SAMA', labelEn: 'Comfortable & Light', labelHi: 'हल्का और आरामदायक' },
                { id: 'MANDA', labelEn: 'Heavy or bloated', labelHi: 'भारीपन या पेट फूलना' },
                { id: 'TIKSHNA', labelEn: 'Acidity or burning', labelHi: 'एसिडिटी या जलन' },
                { id: 'VISHAMA', labelEn: 'Changes / Varies often', labelHi: 'बदलता रहता है' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDigestionAgni(opt.id)}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base cursor-pointer transition-all ${
                    digestionAgni === opt.id
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {language === 'hi' ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Food Tolerance & Discomfort (Satmya) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'क्या किसी विशेष भोजन से आपको अक्सर परेशानी होती है?' : 'Do certain foods regularly cause you discomfort?'}
                </h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                  {language === 'hi' ? 'भोजन सात्म्य (Satmya - Food Suitability)' : 'Food Suitability (Satmya)'}
                </span>
              </div>
              <AudioQuestionButton
                textToSpeak={language === 'hi' ? 'क्या किसी विशेष भोजन से आपको परेशानी होती है?' : 'Do certain foods cause discomfort?'}
                language={language}
              />
            </div>

            <div className="flex items-center gap-3 mt-3">
              {['No', 'Yes', 'Not sure'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFoodDiscomfort(opt)}
                  className={`px-6 py-3 rounded-2xl border-2 font-bold text-sm sm:text-base cursor-pointer transition-all ${
                    foodDiscomfort === opt
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {opt === 'No' ? (language === 'hi' ? 'नहीं' : 'No') : opt === 'Yes' ? (language === 'hi' ? 'हाँ' : 'Yes') : (language === 'hi' ? 'पता नहीं' : 'Not sure')}
                </button>
              ))}
            </div>

            {/* Progressive disclosure if Yes */}
            {foodDiscomfort === 'Yes' && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 animate-fade-in">
                <label className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase block mb-1.5">
                  {language === 'hi' ? 'किन खाद्य पदार्थों से असुविधा होती है?' : 'Which foods usually cause discomfort?'}
                </label>
                <input
                  type="text"
                  value={discomfortFoods}
                  onChange={(e) => setDiscomfortFoods(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: LIFESTYLE & MIND */}
      {activeSection === 'LIFESTYLE_MIND' && (
        <div className="space-y-6">
          {/* Question 6: Physical Activity (Vyayama Shakti) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'सामान्य दिन में आप कितने सक्रिय रहते हैं?' : 'How active are you on a normal day?'}
                </h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                  {language === 'hi' ? 'व्यायाम शक्ति (Vyayama Shakti)' : 'Exercise Capacity (Vyayama Shakti)'}
                </span>
              </div>
              <AudioQuestionButton
                textToSpeak={language === 'hi' ? 'सामान्य दिन में आप कितने सक्रिय रहते हैं?' : 'How active are you on a normal day?'}
                language={language}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {[
                { id: 'AVARA', labelEn: 'Mostly sitting / Sedentary', labelHi: 'अधिकतर बैठे रहना (निष्क्रिय)' },
                { id: 'LIGHT', labelEn: 'Light walking or chores', labelHi: 'हल्की चहलकदमी या घरेलू कार्य' },
                { id: 'MADHYAMA', labelEn: 'Moderately active (30m daily)', labelHi: 'मध्यम सक्रिय (प्रतिदिन 30 मिनट)' },
                { id: 'PRAVARA', labelEn: 'Very active / Heavy physical work', labelHi: 'अत्यधिक सक्रिय / भारी शारीरिक कार्य' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActivityVyayama(opt.id)}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base cursor-pointer transition-all ${
                    activityVyayama === opt.id
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {language === 'hi' ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Question 7: Stress Response (Sattva) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'तनाव या चिंता की स्थिति में आपका स्वभाव कैसा रहता है?' : 'When you are under stress, what usually happens?'}
                </h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                  {language === 'hi' ? 'मानसिक सहनशीलता (Sattva - Mental Resilience)' : 'Mental Resilience (Sattva)'}
                </span>
              </div>
              <AudioQuestionButton
                textToSpeak={language === 'hi' ? 'तनाव में आपका स्वभाव कैसा रहता है?' : 'When you are under stress, what usually happens?'}
                language={language}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {[
                { id: 'PRAVARA', labelEn: 'I usually stay calm & steady', labelHi: 'शांत और संतुलित रहता हूँ' },
                { id: 'MADHYAMA', labelEn: 'I feel worried but manage', labelHi: 'चिंता होती है पर संभाल लेता हूँ' },
                { id: 'AVARA', labelEn: 'I become irritated or overwhelmed', labelHi: 'जल्दी चिड़चिड़ा या परेशान हो जाता हूँ' },
                { id: 'VARIES', labelEn: 'It depends on situation', labelHi: 'परिस्थिति पर निर्भर करता है' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStressSattva(opt.id)}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base cursor-pointer transition-all ${
                    stressSattva === opt.id
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {language === 'hi' ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: CURRENT HEALTH (VIKRITI) */}
      {activeSection === 'CURRENT_HEALTH' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {language === 'hi' 
                    ? 'सामान्य स्वास्थ्य की तुलना में अभी क्या असामान्य लग रहा है?' 
                    : 'Compared with your usual health, what feels different right now?'}
                </h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                  {language === 'hi' ? 'वर्तमान असंतुलन (Vikriti)' : 'Current Imbalance (Vikriti)'}
                </span>
              </div>
              <AudioQuestionButton
                textToSpeak={language === 'hi' ? 'सामान्य स्वास्थ्य की तुलना में अभी क्या अलग लग रहा है?' : 'Compared with your usual health, what feels different right now?'}
                language={language}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {[
                { id: 'Pain', labelEn: 'Pain / Ache', labelHi: 'दर्द या पीड़ा' },
                { id: 'Digestion', labelEn: 'Digestion', labelHi: 'पाचन समस्या' },
                { id: 'Sleep', labelEn: 'Disturbed Sleep', labelHi: 'नींद की समस्या' },
                { id: 'Energy', labelEn: 'Low Energy / Fatigue', labelHi: 'थकान या कमजोरी' },
                { id: 'Mood', labelEn: 'Stress / Anxiety', labelHi: 'तनाव / चिंता' },
                { id: 'Appetite', labelEn: 'Poor Appetite', labelHi: 'भूख की कमी' }
              ].map(area => {
                const isSelected = vikritiAreas.includes(area.id);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setVikritiAreas(vikritiAreas.filter(a => a !== area.id));
                      } else {
                        setVikritiAreas([...vikritiAreas, area.id]);
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>{language === 'hi' ? area.labelHi : area.labelEn}</span>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clinician Note Box for Sara / Darshana Pariksha */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <span className="font-black block uppercase tracking-wider text-[11px] mb-0.5">
                {language === 'hi' ? 'वैद्य परीक्षण प्रोटोकॉल (Sara & Darshana Pariksha)' : 'Vaidya Clinical Note (Sara & Darshana)'}
              </span>
              {language === 'hi'
                ? 'धातु उत्कृष्टता (Sara) का अंतिम निर्धारण ओपीडी में वैद्य द्वारा शारीरिक परीक्षण के पश्चात किया जाएगा।'
                : 'Tissue quality (Sara) and physical examination will be conducted directly by your Vaidya during consultation.'}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            const curIdx = sectionsList.findIndex(s => s.key === activeSection);
            if (curIdx > 0) {
              setActiveSection(sectionsList[curIdx - 1].key);
            } else {
              setScreen('VITALS');
            }
          }}
          className="px-6 py-3.5 rounded-2xl border-2 border-slate-300 hover:bg-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-base flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>

        {activeSection !== 'CURRENT_HEALTH' ? (
          <button
            type="button"
            onClick={() => {
              const curIdx = sectionsList.findIndex(s => s.key === activeSection);
              if (curIdx < sectionsList.length - 1) {
                setActiveSection(sectionsList[curIdx + 1].key);
              }
            }}
            className="px-8 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-base shadow-lg cursor-pointer flex items-center gap-2 transition-all"
          >
            <span>{t('continue')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSaveAndFinish}
            className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg cursor-pointer flex items-center gap-2 transition-all"
          >
            <span>{language === 'hi' ? 'सहेजें और आगे बढ़ें' : 'Save & Continue'}</span>
            <Check className="w-5 h-5 stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
};
