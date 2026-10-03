import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { voiceEngine } from '../../services/voiceEngine';
import { Language } from '../../types';

interface AudioQuestionButtonProps {
  textToSpeak: string;
  language: Language;
  className?: string;
  label?: string;
}

export const AudioQuestionButton: React.FC<AudioQuestionButtonProps> = ({
  textToSpeak,
  language,
  className = '',
  label
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      voiceEngine.stopSpeaking();
    };
  }, []);

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      voiceEngine.stopSpeaking();
      setIsSpeaking(false);
    } else {
      voiceEngine.stopSpeaking();
      setIsSpeaking(true);
      voiceEngine.speak(textToSpeak, language, () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      aria-label={label || (language === 'hi' ? 'सवाल सुनें' : 'Hear question')}
      title={label || (language === 'hi' ? 'सवाल सुनें' : 'Hear question')}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm ${
        isSpeaking
          ? 'bg-amber-500 text-white animate-pulse border-2 border-amber-600'
          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
      } ${className}`}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4 flex-shrink-0" />
          <span>{language === 'hi' ? 'रोकें' : 'Stop Audio'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{label || (language === 'hi' ? 'सवाल सुनें' : 'Hear Question')}</span>
        </>
      )}
    </button>
  );
};
