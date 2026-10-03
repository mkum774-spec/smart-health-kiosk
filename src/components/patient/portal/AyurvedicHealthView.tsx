import React from 'react';
import { 
  Leaf, 
  Sparkles, 
  User, 
  Utensils, 
  Heart, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { Language, AyurvedaFactorGroup } from '../../../types';

interface AyurvedicHealthViewProps {
  language: Language;
  ayurvedaGroups: AyurvedaFactorGroup[];
}

export const AyurvedicHealthView: React.FC<AyurvedicHealthViewProps> = ({
  language,
  ayurvedaGroups
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto pb-12 select-none">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-teal-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'आयुर्वेदिक स्वास्थ्य आयाम (Ayurvedic Health)' : 'Ayurvedic Health & Wellness Dimension'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'दशविध परीक्षा पर आधारित शारीरिक संतुलन, पाचन शक्ति एवं जीवनशैली का समग्र अवलोकन।'
            : 'Holistic assessment based on traditional Daśavidha Parīkṣā principles: constitution, digestive fire, vitality, and seasonal balance.'}
        </p>
      </div>

      {/* Transparent Clinical & Assessment Boundary Notice (Section 20 & 56) */}
      <div className="p-4 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border-2 border-amber-200/80 dark:border-amber-900/40 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{language === 'hi' ? 'महत्वपूर्ण पारदर्शी सूचना:' : 'Important Transparency & Assessment Note:'}</span>
        </div>
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
          {language === 'hi'
            ? 'नीचे दिया गया विवरण आपके द्वारा दी गई जानकारी और क्लिनिकल साक्ष्यों का समग्र विश्लेषण है। यह कोई स्वचालित स्व-निदान नहीं है। विशिष्ट आयुर्वेदिक उपचार के लिए पंजीकृत वैद्य से परामर्श लें।'
            : 'The parameters below distinguish patient-reported lifestyle habits from clinical observations. This is not an automated self-diagnosis. Consult a registered Ayurvedic practitioner for individualized therapy.'}
        </p>

        {/* Legend for patient-provided vs clinically-derived */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span>Patient-Reported Habit (मरीज द्वारा दर्ज)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Clinical / AI Assessment (क्लिनिकल अवलोकन)</span>
          </span>
        </div>
      </div>

      {/* The 4 Canonical Ayurvedic Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ayurvedaGroups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                {gIdx === 0 && <User className="w-4 h-4" />}
                {gIdx === 1 && <Utensils className="w-4 h-4" />}
                {gIdx === 2 && <Heart className="w-4 h-4" />}
                {gIdx === 3 && <Activity className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'hi' && group.nameHi ? group.nameHi : group.name}
                </h3>
                <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">
                  Dimension 0{gIdx + 1}
                </span>
              </div>
            </div>

            {/* Factors list */}
            <div className="space-y-3">
              {group.items.map((item, iIdx) => {
                const isDerived = item.source === 'CLINICAL_DERIVED';
                return (
                  <div
                    key={iIdx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {language === 'hi' && item.labelHi ? item.labelHi : item.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isDerived 
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' 
                          : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                      }`}>
                        {isDerived ? 'Clinical Insight' : 'Reported'}
                      </span>
                    </div>

                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      {language === 'hi' && item.valueHi ? item.valueHi : item.value}
                    </p>

                    {item.description && (
                      <p className="text-slate-500 font-medium leading-relaxed pt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
