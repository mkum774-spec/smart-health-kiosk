// Voice & Speech synthesis / recognition service for Smart Medical Healthcare Kiosk

class VoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isVoicesLoaded = false;
  private recognition: any = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }
      
      // Initialize SpeechRecognition if available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    this.isVoicesLoaded = this.voices.length > 0;
  }

  // Play gentle clinical feedback chime using Web Audio API
  public playChime(type: 'success' | 'alert' | 'emergency' | 'tap' = 'tap') {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'tap') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'alert') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.12);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'emergency') {
        // Urgent 2-tone hospital buzzer
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(700, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {
      console.warn("Audio chime not supported or blocked", e);
    }
  }

  // Speak text in either Hindi or Indian English
  public speak(text: string, lang: 'en' | 'hi' = 'en', onEnd?: () => void) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92; // Slightly slower, calm cadence for elderly & low-digital literacy
      utterance.pitch = 1.0;

      if (lang === 'hi') {
        utterance.lang = 'hi-IN';
        // Try to locate a Hindi voice
        const hiVoice = this.voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
        if (hiVoice) utterance.voice = hiVoice;
      } else {
        utterance.lang = 'en-IN';
        // Try Indian English or standard English
        const enInVoice = this.voices.find(v => v.lang === 'en-IN' || v.name.includes('India'));
        const enVoice = enInVoice || this.voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = () => onEnd();
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
      if (onEnd) onEnd();
    }
  }

  public cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public stopSpeaking() {
    this.cancel();
  }

  // Real Speech Recognition or simulated speech recognition for browser compatibility
  public startListening(
    lang: 'en' | 'hi',
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void
  ): () => void {
    if (this.recognition) {
      try {
        this.recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        this.recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (final) {
            onResult(final.trim(), true);
          } else {
            onResult(interim.trim(), false);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          onError(event.error);
        };

        this.recognition.start();

        return () => {
          try {
            this.recognition.stop();
          } catch (e) {}
        };
      } catch (e) {
        console.warn("Could not start native recognition, using fallback", e);
      }
    }

    // Fallback simulation for environments without mic permissions or Web Speech API
    let step = 0;
    const fallbackPhrasesEn = [
      "I have",
      "I have had severe chest discomfort",
      "I have had severe chest discomfort and breathlessness since yesterday evening."
    ];
    const fallbackPhrasesHi = [
      "मुझे कल",
      "मुझे कल शाम से छाती में भारीपन",
      "मुझे कल शाम से छाती में भारीपन और सांस लेने में कठिनाई हो रही है।"
    ];
    const phrases = lang === 'hi' ? fallbackPhrasesHi : fallbackPhrasesEn;

    const timer = setInterval(() => {
      if (step < phrases.length) {
        const isFinal = step === phrases.length - 1;
        onResult(phrases[step], isFinal);
        step++;
      } else {
        clearInterval(timer);
      }
    }, 1200);

    return () => clearInterval(timer);
  }
}

export const voiceEngine = new VoiceEngine();
