/**
 * SIH26047 — Assessment type selector, shown right after patient ID/ABHA
 * entry, before consent or history collection begins.
 *
 * This REPLACES the mid-flow "Skip this section" approach — the decision
 * happens once, upfront, and later screens simply don't render the
 * Ayurveda step at all if "general" was chosen. Cleaner than a skip button
 * buried in the form.
 */

import React from "react";
import { Leaf, Stethoscope, ChevronRight, ArrowLeft } from "lucide-react";
import { useKiosk } from "../../context/KioskContext";
import { AssessmentTrack } from "../../types";
import { voiceEngine } from "../../services/voiceEngine";

export type { AssessmentTrack };

export interface AssessmentTypeScreenProps {
  patientName?: string;
  onSelect?: (track: AssessmentTrack) => void;
}

export function AssessmentTypeScreen({
  patientName,
  onSelect,
}: AssessmentTypeScreenProps) {
  const { 
    activePatient, 
    setAssessmentTrack, 
    setScreen, 
    language, 
    t 
  } = useKiosk();

  const resolvedName = patientName || 
    (language === 'hi' && activePatient?.nameHi ? activePatient.nameHi : activePatient?.name) || 
    "Demo Patient P001";

  const handleSelectTrack = (track: AssessmentTrack) => {
    voiceEngine.playChime('tap');
    setAssessmentTrack(track);

    if (onSelect) {
      onSelect(track);
    } else {
      setScreen('PAST_RECORDS');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-8 select-none">
      {/* Top Welcome & Header */}
      <div className="text-center mb-8">
        <p className="text-teal-800 font-black text-base sm:text-lg">
          {t('welcomePatientPrefix')} {resolvedName}
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
          {t('assessmentTypeTitle')}
        </h1>
        <p className="text-slate-600 font-semibold text-base mt-2">
          {t('assessmentTypeSubtitle')}
        </p>
      </div>

      {/* Touch Options Cards */}
      <div className="space-y-5">
        {/* 1. Ayurvedic Assessment */}
        <button
          type="button"
          onClick={() => handleSelectTrack("ayurveda")}
          className="w-full text-left p-6 sm:p-7 rounded-3xl border-3 border-teal-700
                     bg-teal-700 text-white hover:bg-teal-800 active:scale-[0.99] transition-all
                     flex items-start gap-5 cursor-pointer shadow-lg group"
        >
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-white border border-white/20">
            <Leaf size={28} className="stroke-[2.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-xl sm:text-2xl leading-tight">
                {t('ayurvedaTrackTitle')}
              </span>
            </div>
            <div className="text-sm text-teal-100 font-bold mt-1">
              {t('ayurvedaTrackSubtitle')}
            </div>
            <p className="text-sm sm:text-base text-white/90 font-medium mt-2 leading-relaxed">
              {t('ayurvedaTrackDesc')}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-black text-white mt-3 border border-white/20">
              <span>🌿 {t('ayurvedaTrackBadge')}</span>
            </div>
          </div>
          <ChevronRight className="shrink-0 mt-5 text-white/70 group-hover:translate-x-1 transition-transform" size={26} />
        </button>

        {/* 2. General / Quick Check-in */}
        <button
          type="button"
          onClick={() => handleSelectTrack("general")}
          className="w-full text-left p-6 sm:p-7 rounded-3xl border-3 border-slate-200
                     bg-white text-slate-900 hover:border-teal-600 hover:bg-slate-50 active:scale-[0.99] transition-all
                     flex items-start gap-5 cursor-pointer shadow-md group"
        >
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center">
            <Stethoscope className="text-teal-700 stroke-[2.5]" size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-xl sm:text-2xl leading-tight text-slate-900">
                {t('generalTrackTitle')}
              </span>
            </div>
            <div className="text-sm text-slate-500 font-bold mt-1">
              {t('generalTrackSubtitle')}
            </div>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-2 leading-relaxed">
              {t('generalTrackDesc')}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-black text-slate-700 mt-3 border border-slate-200">
              <span>⚡ {t('generalTrackBadge')}</span>
            </div>
          </div>
          <ChevronRight className="shrink-0 mt-5 text-slate-400 group-hover:translate-x-1 transition-transform" size={26} />
        </button>
      </div>

      {/* Back Button */}
      <div className="mt-8 flex items-center justify-start">
        <button
          type="button"
          onClick={() => setScreen('ABHA')}
          className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-base rounded-2xl border-2 border-slate-300 flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </button>
      </div>
    </div>
  );
}
