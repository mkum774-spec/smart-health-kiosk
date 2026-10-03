import React, { useState } from 'react';
import { X, Send, Mic, Sparkles, Bot, User, FileText, AlertCircle } from 'lucide-react';
import { Language } from '../../types';
import { voiceEngine } from '../../services/voiceEngine';

interface HealthAssistantChatProps {
  language: Language;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'PATIENT' | 'ASSISTANT';
  text: string;
  sourceDoc?: string;
  timestamp: string;
}

export const HealthAssistantChat: React.FC<HealthAssistantChatProps> = ({
  language,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'ASSISTANT',
      text: language === 'hi'
        ? 'नमस्ते! मैं आपका स्वास्थ्य सहायक हूँ। आप अपनी दवाओं, जाँच रिपोर्ट या निर्देशों के बारे में कोई भी प्रश्न पूछ सकते हैं।'
        : 'Hello! I am your health assistant. You can ask questions about your medications, test reports, or consultation preparation.',
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const patientMsg: ChatMessage = {
      id: `p_${Date.now()}`,
      sender: 'PATIENT',
      text: query,
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, patientMsg]);
    setInputValue('');

    // Contextual explanation based on clinical records
    setTimeout(() => {
      let reply = language === 'hi'
        ? 'आपके द्वारा दर्ज की गई जानकारी के आधार पर, यह दवा भोजन के बाद लेने का निर्देश है। अधिक मार्गदर्शन के लिए अपने चिकित्सक से परामर्श लें।'
        : 'Based on your recorded prescription, this medication is scheduled after meals. Please discuss exact timing with your doctor during consultation.';
      let source = 'Prescription Record (Dr. Verma, June 2026)';

      if (query.toLowerCase().includes('energy') || query.toLowerCase().includes('कमजोरी') || query.toLowerCase().includes('थकान')) {
        reply = language === 'hi'
          ? 'आपकी कम ऊर्जा और थकान की शिकायत को आपके केस सारांश में शामिल कर दिया गया है ताकि डॉक्टर इस पर विशेष ध्यान दे सकें।'
          : 'Your reported low energy and fatigue have been noted in your clinical summary for the doctor to review.';
        source = 'Patient Intake History';
      }

      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        sender: 'ASSISTANT',
        text: reply,
        sourceDoc: source,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, assistantMsg]);
      voiceEngine.playChime('success');
    }, 600);
  };

  const handleVoiceInput = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
      const rec = new SpeechRec();
      rec.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        setIsListening(false);
        setInputValue(spoken);
        handleSend(spoken);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full h-[620px] max-h-[90vh] border-2 border-slate-300 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-teal-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="text-base font-black">
                {language === 'hi' ? 'स्वास्थ्य सहायक (AI Assistant)' : 'Health Information Assistant'}
              </h3>
              <p className="text-[11px] text-teal-100 font-medium">
                {language === 'hi' ? 'अपनी रिपोर्ट एवं दवाओं के बारे में पूछें' : 'Ask about your records & medications'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 flex items-center gap-2 text-[11px] font-semibold text-amber-900 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-700" />
          <span>
            {language === 'hi'
              ? 'यह सहायक केवल आपकी दर्ज जानकारी स्पष्ट करता है। यह डॉक्टर का विकल्प नहीं है।'
              : 'AI explains your recorded information. It does not replace your doctor\'s diagnosis.'}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'PATIENT' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ASSISTANT' && (
                <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                msg.sender === 'PATIENT'
                  ? 'bg-teal-700 text-white rounded-br-none shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                {msg.sourceDoc && (
                  <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1 text-[10px] text-teal-700 dark:text-teal-400 font-mono">
                    <FileText className="w-3 h-3" />
                    <span>{msg.sourceDoc}</span>
                  </div>
                )}
              </div>

              {msg.sender === 'PATIENT' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center gap-2">
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            }`}
            title="Speak"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'hi' ? 'दवा या रिपोर्ट के बारे में पूछें...' : 'Ask about medicines, reports...'}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 dark:text-slate-100"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white shadow-md cursor-pointer transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
