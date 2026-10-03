/**
 * Voice Interpretation Service
 *
 * Provides a clean typed frontend service abstraction for speech-to-text semantic understanding.
 *
 * Backend responsibility (when endpoint deployed):
 * - Speech audio / STT transcript analysis
 * - Intent extraction and mapping to question option IDs
 * - Ambiguity detection & confidence scoring
 *
 * Frontend responsibility:
 * - Capture microphone audio or Web Speech transcript
 * - Show processing state
 * - Display interpreted result to patient
 * - Explicit confirmation loop before accepting selection
 */

import { VoiceInterpretationRequest, VoiceInterpretationResponse } from '../types';

class VoiceInterpretationService {
  /**
   * Interprets spoken input against a question's available options.
   */
  public async interpretSpeech(request: VoiceInterpretationRequest): Promise<VoiceInterpretationResponse> {
    const { spokenInput, availableOptions } = request;
    const clean = spokenInput.trim().toLowerCase();

    if (!clean) {
      return {
        confidence: 0,
        needsConfirmation: false,
        ambiguous: true
      };
    }

    // Colloquial semantic map for common healthcare concepts (Hindi, Hinglish, English)
    const lowEnergyKeywords = [
      'low', 'kam', 'thoda kam', 'susti', 'thak', 'down', 'kamzor', 'jaan kam', 
      'tired', 'fatigue', 'weak', 'sluggish', 'exhausted'
    ];
    const highEnergyKeywords = [
      'high', 'jyada', 'bahut', 'achhi', 'tez', 'energetic', 'active', 'strong', 
      'badhiya', 'full', 'active hoon'
    ];
    const moderateEnergyKeywords = [
      'moderate', 'theek', 'theek-thaak', 'normal', 'medium', 'beech', 'average'
    ];

    const affirmativeKeywords = ['yes', 'haan', 'ha', 'sahi', 'ji haan', 'bilkul', 'true', 'correct'];
    const negativeKeywords = ['no', 'nahi', 'nahin', 'na', 'galat', 'false', 'never'];

    let matchedOptionId: string | undefined;
    let confidence = 0.85;

    if (availableOptions && availableOptions.length > 0) {
      const directMatch = availableOptions.find(opt => 
        clean.includes(opt.id.toLowerCase()) || 
        clean.includes(opt.label.toLowerCase())
      );
      if (directMatch) {
        matchedOptionId = directMatch.id;
        confidence = 0.96;
      } else {
        const hasLow = lowEnergyKeywords.some(k => clean.includes(k));
        const hasHigh = highEnergyKeywords.some(k => clean.includes(k));
        const hasMod = moderateEnergyKeywords.some(k => clean.includes(k));
        const hasYes = affirmativeKeywords.some(k => clean.includes(k));
        const hasNo = negativeKeywords.some(k => clean.includes(k));

        if (hasLow && !hasHigh) {
          const opt = availableOptions.find(o => o.id.toLowerCase().includes('low') || o.id.toLowerCase().includes('avara') || o.id.toLowerCase().includes('manda'));
          if (opt) matchedOptionId = opt.id;
        } else if (hasHigh && !hasLow) {
          const opt = availableOptions.find(o => o.id.toLowerCase().includes('high') || o.id.toLowerCase().includes('pravara') || o.id.toLowerCase().includes('tikshna'));
          if (opt) matchedOptionId = opt.id;
        } else if (hasMod) {
          const opt = availableOptions.find(o => o.id.toLowerCase().includes('moderate') || o.id.toLowerCase().includes('madhyama') || o.id.toLowerCase().includes('sama'));
          if (opt) matchedOptionId = opt.id;
        } else if (hasYes && !hasNo) {
          const opt = availableOptions.find(o => o.id.toLowerCase() === 'yes' || o.id.toLowerCase() === 'true');
          if (opt) matchedOptionId = opt.id;
        } else if (hasNo && !hasYes) {
          const opt = availableOptions.find(o => o.id.toLowerCase() === 'no' || o.id.toLowerCase() === 'false');
          if (opt) matchedOptionId = opt.id;
        }
      }
    }

    const selectedOptObj = availableOptions?.find(o => o.id === matchedOptionId);

    return {
      selectedOption: matchedOptionId,
      interpretedText: selectedOptObj ? selectedOptObj.label : spokenInput,
      confidence: matchedOptionId ? confidence : 0.65,
      needsConfirmation: true, // Always ask confirmation for clinical safety
      ambiguous: !matchedOptionId
    };
  }
}

export const voiceInterpretationService = new VoiceInterpretationService();
