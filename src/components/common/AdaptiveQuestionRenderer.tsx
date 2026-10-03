import React, { useState } from 'react';
import { Check, CheckCircle2, ChevronRight, HelpCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { QuestionDefinition, QuestionOption, Language, VoiceInterpretationResponse } from '../../types';
import { AudioQuestionButton } from './AudioQuestionButton';
import { VoiceAnswerButton } from './VoiceAnswerButton';
import { AnswerConfirmation } from './AnswerConfirmation';

interface AdaptiveQuestionRendererProps {
  question: QuestionDefinition;
  language: Language;
  currentValue?: any;
  onAnswer: (val: any) => void;
  onSkip?: () => void;
  onPreferNotToSay?: () => void;
  onBack?: () => void;
  className?: string;
}

export const AdaptiveQuestionRenderer: React.FC<AdaptiveQuestionRendererProps> = ({
  question,
  language,
  currentValue,
  onAnswer,
  onSkip,
  onPreferNotToSay,
  onBack,
  className = ''
}) => {
  const [selectedVal, setSelectedVal] = useState<any>(currentValue);
  const [pendingVoiceConfirmation, setPendingVoiceConfirmation] = useState<{
    optionId?: string;
    text: string;
    confidence: number;
  } | null>(null);

  const title = language === 'hi' ? question.textHi : question.textEn;
  const secondary = language === 'hi' ? question.secondaryTextHi : question.secondaryTextEn;
  const derivedNotice = language === 'hi' ? question.derivedNoticeHi : question.derivedNoticeEn;

  // Build audio text for reading question & available options aloud
  const audioText = `${title}. ${secondary || ''}. ${
    question.options
      ? question.options.map(o => (language === 'hi' ? o.labelHi : o.labelEn)).join(', ')
      : ''
  }`;

  const availableVoiceOptions = question.options?.map(o => ({
    id: o.id,
    label: language === 'hi' ? o.labelHi : o.labelEn
  }));

  const handleOptionSelect = (optionId: string) => {
    if (question.answerType === 'multi_choice') {
      const currentList: string[] = Array.isArray(selectedVal) ? selectedVal : [];
      let nextList: string[];
      if (currentList.includes(optionId)) {
        nextList = currentList.filter(id => id !== optionId);
      } else {
        nextList = [...currentList, optionId];
      }
      setSelectedVal(nextList);
      onAnswer(nextList);
    } else {
      setSelectedVal(optionId);
      onAnswer(optionId);
    }
  };

  const handleVoiceInterpreted = (result: VoiceInterpretationResponse, rawTranscript: string) => {
    if (result.selectedOption) {
      setPendingVoiceConfirmation({
        optionId: result.selectedOption,
        text: result.interpretedText || rawTranscript,
        confidence: result.confidence
      });
    } else {
      // Free text / no direct option match
      setPendingVoiceConfirmation({
        text: rawTranscript,
        confidence: result.confidence
      });
    }
  };

  const handleConfirmVoice = () => {
    if (pendingVoiceConfirmation) {
      const val = pendingVoiceConfirmation.optionId || pendingVoiceConfirmation.text;
      setSelectedVal(val);
      onAnswer(val);
      setPendingVoiceConfirmation(null);
    }
  };

  const handleRetryVoice = () => {
    setPendingVoiceConfirmation(null);
  };

  return (
    <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md ${className}`}>
      {/* Derived Information Badge */}
      {question.isDerived && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            {derivedNotice || (language === 'hi'
              ? '✓ यह जानकारी आपके दर्ज रिकॉर्ड से स्वतः प्राप्त कर ली गई है'
              : '✓ Already available from your recorded health information')}
          </span>
          {question.derivedValue && (
            <span className="ml-auto font-mono bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-lg border border-emerald-300 text-slate-900 dark:text-slate-100">
              {question.derivedValue}
            </span>
          )}
        </div>
      )}

      {/* Header: Question + Audio Button */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
            {title}
          </h3>
          {secondary && (
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <span>{secondary}</span>
            </p>
          )}
        </div>

        {question.audioEnabled !== false && (
          <AudioQuestionButton
            textToSpeak={audioText}
            language={language}
          />
        )}
      </div>

      {/* Voice Interaction Row */}
      {question.voiceEnabled !== false && (
        <div className="my-3 flex items-center gap-2">
          <VoiceAnswerButton
            questionId={question.id}
            language={language}
            availableOptions={availableVoiceOptions}
            onInterpreted={handleVoiceInterpreted}
          />
        </div>
      )}

      {/* Voice Confirmation Box */}
      {pendingVoiceConfirmation && (
        <AnswerConfirmation
          interpretedText={pendingVoiceConfirmation.text}
          confidence={pendingVoiceConfirmation.confidence}
          language={language}
          onConfirm={handleConfirmVoice}
          onRetry={handleRetryVoice}
        />
      )}

      {/* Question Options / Input Controls */}
      <div className="mt-4">
        {question.options && question.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map(opt => {
              const isSelected = question.answerType === 'multi_choice'
                ? Array.isArray(selectedVal) && selectedVal.includes(opt.id)
                : selectedVal === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleOptionSelect(opt.id)}
                  className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer shadow-sm ${
                    isSelected
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  <div>
                    <span className="font-bold text-base block">
                      {language === 'hi' ? opt.labelHi : opt.labelEn}
                    </span>
                    {(opt.secondaryEn || opt.secondaryHi) && (
                      <span className={`text-xs block mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {language === 'hi' ? (opt.secondaryHi || opt.secondaryEn) : (opt.secondaryEn || opt.secondaryHi)}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-white text-teal-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Free Text Input */}
        {question.answerType === 'text' && (
          <div className="mt-3">
            <textarea
              rows={3}
              value={selectedVal || ''}
              onChange={(e) => {
                setSelectedVal(e.target.value);
                onAnswer(e.target.value);
              }}
              placeholder={language === 'hi' ? 'यहाँ अपना उत्तर लिखें या बोलें...' : 'Type or speak your answer here...'}
              className="w-full p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium text-base focus:outline-none focus:border-teal-600"
            />
          </div>
        )}

        {/* Numeric / Duration Input */}
        {(question.answerType === 'number' || question.answerType === 'duration') && (
          <div className="mt-3 flex items-center gap-3">
            <input
              type="text"
              value={selectedVal || ''}
              onChange={(e) => {
                setSelectedVal(e.target.value);
                onAnswer(e.target.value);
              }}
              placeholder={language === 'hi' ? 'संख्या या अवधि दर्ज करें' : 'Enter value or duration'}
              className="px-4 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-base focus:outline-none focus:border-teal-600 max-w-xs"
            />
          </div>
        )}
      </div>

      {/* Footer Navigation & Skip/Prefer not to say */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {question.allowPreferNotToSay && onPreferNotToSay && (
            <button
              type="button"
              onClick={onPreferNotToSay}
              className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
            >
              {language === 'hi' ? 'बताना नहीं चाहते' : 'Prefer not to say'}
            </button>
          )}

          {question.allowSkip && onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
            >
              {language === 'hi' ? 'आगे बढ़ें (छोड़ें)' : 'Skip question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
