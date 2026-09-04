import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, RotateCcw, Edit3, Sparkles } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { voiceEngine } from '../../services/voiceEngine';

interface VoiceRecorderProps {
  onConfirm: (text: string) => void;
  initialText?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onConfirm, initialText = '' }) => {
  const { language, t } = useKiosk();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [hasRecorded, setHasRecorded] = useState(Boolean(initialText));
  const [isEditing, setIsEditing] = useState(false);
  const stopListeningRef = useRef<(() => void) | null>(null);

  const startRecording = () => {
    voiceEngine.playChime('tap');
    setIsListening(true);
    setTranscript('');
    setHasRecorded(false);
    setIsEditing(false);

    stopListeningRef.current = voiceEngine.startListening(
      language,
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          setIsListening(false);
          setHasRecorded(true);
          voiceEngine.playChime('success');
          // AI Confirmation loop: read understood text back to patient
          const prefix = language === 'hi' ? "हमने समझा: " : "We understood: ";
          voiceEngine.speak(prefix + text, language);
        }
      },
      (error) => {
        setIsListening(false);
        console.warn("Speech recorder error:", error);
      }
    );
  };

  const stopRecording = () => {
    if (stopListeningRef.current) {
      stopListeningRef.current();
      stopListeningRef.current = null;
    }
    setIsListening(false);
    setHasRecorded(true);
    voiceEngine.playChime('success');

    if (transcript) {
      const prefix = language === 'hi' ? "हमने समझा: " : "We understood: ";
      voiceEngine.speak(prefix + transcript, language);
    }
  };

  const playBackTranscript = () => {
    voiceEngine.playChime('tap');
    const prefix = language === 'hi' ? "हमने समझा: " : "We understood: ";
    voiceEngine.speak(prefix + transcript, language);
  };

  const handleConfirm = () => {
    voiceEngine.playChime('success');
    onConfirm(transcript);
  };

  useEffect(() => {
    return () => {
      if (stopListeningRef.current) {
        stopListeningRef.current();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md">
      {!hasRecorded || isListening ? (
        /* Listening / Mic Trigger Screen */
        <div className="flex flex-col items-center text-center">
          <p className="text-xl font-bold text-slate-800 mb-6">
            {isListening ? t('listening') : t('symptomSubtitle')}
          </p>

          {/* Big Touch Microphone Button */}
          <button
            type="button"
            onClick={isListening ? stopRecording : startRecording}
            className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xl select-none ${
              isListening
                ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-200 scale-105'
                : 'bg-teal-700 hover:bg-teal-800 text-white border-4 border-teal-800 active:scale-95'
            }`}
            aria-label={isListening ? t('stopSpeaking') : t('tapToSpeak')}
          >
            {isListening ? (
              <MicOff className="w-16 h-16 stroke-[2.5]" />
            ) : (
              <Mic className="w-16 h-16 stroke-[2.5]" />
            )}
          </button>

          {/* State Text & Sound Wave Animation */}
          <div className="mt-6">
            {isListening ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-1.5 h-8">
                  <div className="w-2 h-4 bg-teal-600 rounded-full animate-pulse" />
                  <div className="w-2 h-7 bg-teal-600 rounded-full animate-pulse delay-75" />
                  <div className="w-2 h-10 bg-teal-600 rounded-full animate-pulse delay-150" />
                  <div className="w-2 h-6 bg-teal-600 rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-3 bg-teal-600 rounded-full animate-pulse delay-200" />
                </div>
                <p className="text-lg font-extrabold text-teal-800">{t('listening')}</p>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold text-sm"
                >
                  {t('stopSpeaking')}
                </button>
              </div>
            ) : (
              <p className="text-lg font-bold text-slate-700">
                {t('tapToSpeak')}
              </p>
            )}
          </div>

          {/* Live Interim Transcript */}
          {transcript && (
            <div className="mt-6 p-4 w-full bg-slate-50 rounded-2xl border border-slate-200 text-left text-slate-800 text-lg italic">
              "{transcript}"
            </div>
          )}
        </div>
      ) : (
        /* AI Audio Confirmation Loop UI */
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-teal-800 border-b border-slate-200 pb-3">
            <Sparkles className="w-6 h-6 text-teal-600" />
            <h4 className="text-xl font-black">{t('audioConfirmationTitle')}</h4>
          </div>

          <p className="text-slate-600 font-medium">
            {t('audioConfirmationIntro')}
          </p>

          {/* Transcript Box (Editable if clicked edit) */}
          {isEditing ? (
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={3}
              className="w-full p-4 text-xl font-bold text-slate-900 bg-slate-50 border-2 border-teal-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-200"
              placeholder="Edit symptoms text..."
            />
          ) : (
            <div className="p-5 bg-teal-50/70 border-2 border-teal-200 rounded-2xl">
              <p className="text-2xl font-black text-slate-900 leading-snug">
                "{transcript || 'No symptom transcribed yet'}"
              </p>
            </div>
          )}

          {/* Controls: Listen Again, Confirm, Edit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={playBackTranscript}
              className="min-h-[56px] px-4 py-3 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 text-sky-900 font-extrabold text-base rounded-2xl border-2 border-sky-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Volume2 className="w-5 h-5 text-sky-700" />
              <span>{t('listenAgainBtn')}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="min-h-[56px] px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-base rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Edit3 className="w-5 h-5 text-slate-600" />
              <span>{isEditing ? t('save') : t('editSymptomBtn')}</span>
            </button>

            <button
              type="button"
              onClick={startRecording}
              className="min-h-[56px] px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-base rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-5 h-5 text-slate-600" />
              <span>{language === 'hi' ? 'पुनः बोलें' : 'Re-record'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full min-h-[64px] bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xl font-black rounded-2xl border-2 border-teal-800 shadow-md flex items-center justify-center gap-3 cursor-pointer mt-4"
          >
            <CheckCircle2 className="w-7 h-7" />
            <span>{t('confirmSymptomBtn')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
