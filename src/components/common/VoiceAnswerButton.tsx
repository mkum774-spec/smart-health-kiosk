import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { voiceEngine } from '../../services/voiceEngine';
import { voiceInterpretationService } from '../../services/voiceInterpretationService';
import { Language, VoiceInterpretationResponse } from '../../types';

interface VoiceAnswerButtonProps {
  questionId: string;
  language: Language;
  availableOptions?: Array<{ id: string; label: string }>;
  onInterpreted: (result: VoiceInterpretationResponse, rawTranscript: string) => void;
  className?: string;
}

export const VoiceAnswerButton: React.FC<VoiceAnswerButtonProps> = ({
  questionId,
  language,
  availableOptions,
  onInterpreted,
  className = ''
}) => {
  const [state, setState] = useState<'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startVoiceInput = () => {
    setState('LISTENING');
    setErrorMessage(null);
    voiceEngine.playChime('tap');

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setState('ERROR');
      setErrorMessage(language === 'hi' ? 'माइक्रोफ़ोन समर्थित नहीं है' : 'Speech recognition not supported in browser');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setState('LISTENING');
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setState('PROCESSING');
        try {
          const interpretation = await voiceInterpretationService.interpretSpeech({
            questionId,
            spokenInput: transcript,
            language,
            availableOptions
          });
          voiceEngine.playChime('success');
          setState('IDLE');
          onInterpreted(interpretation, transcript);
        } catch (e) {
          console.warn("NLU interpretation failed:", e);
          setState('ERROR');
          setErrorMessage(language === 'hi' ? 'आवाज़ समझने में त्रुटि' : 'Could not understand response');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech error:", event.error);
        setState('ERROR');
        setErrorMessage(
          event.error === 'not-allowed'
            ? (language === 'hi' ? 'माइक्रोफ़ोन अनुमति नहीं है' : 'Microphone permission denied')
            : (language === 'hi' ? 'आवाज़ नहीं सुनी जा सकी' : 'No speech detected. Please retry.')
        );
      };

      recognition.onend = () => {
        setState(prev => prev === 'LISTENING' ? 'IDLE' : prev);
      };

      recognition.start();
    } catch (err) {
      console.warn("Recognition start failed:", err);
      setState('ERROR');
      setErrorMessage(language === 'hi' ? 'माइक्रोफ़ोन चालू करने में त्रुटि' : 'Failed to initialize microphone');
    }
  };

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={startVoiceInput}
        disabled={state === 'LISTENING' || state === 'PROCESSING'}
        className={`px-4 py-2.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-md cursor-pointer ${
          state === 'LISTENING'
            ? 'bg-rose-600 text-white animate-pulse border-2 border-rose-400'
            : state === 'PROCESSING'
            ? 'bg-teal-700 text-white border-2 border-teal-500'
            : state === 'ERROR'
            ? 'bg-amber-100 text-amber-900 border-2 border-amber-400 hover:bg-amber-200'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-500'
        }`}
      >
        {state === 'LISTENING' ? (
          <>
            <Mic className="w-5 h-5 animate-bounce text-white" />
            <span>{language === 'hi' ? 'सुन रहे हैं... बोलिए' : 'Listening... Speak now'}</span>
          </>
        ) : state === 'PROCESSING' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            <span>{language === 'hi' ? 'उत्तर समझा जा रहा है...' : 'Understanding answer...'}</span>
          </>
        ) : state === 'ERROR' ? (
          <>
            <MicOff className="w-5 h-5 text-amber-800" />
            <span>{language === 'hi' ? 'पुनः प्रयास करें' : 'Retry Voice'}</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            <span>{language === 'hi' ? 'बोलकर उत्तर दें' : 'Speak your answer'}</span>
          </>
        )}
      </button>

      {errorMessage && (
        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 animate-fade-in text-center">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
