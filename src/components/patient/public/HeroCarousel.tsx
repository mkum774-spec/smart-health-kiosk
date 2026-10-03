import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bot, 
  FileText, 
  QrCode, 
  Upload, 
  ArrowRight, 
  ShieldCheck,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Language } from '../../../types';

interface HeroCarouselProps {
  language: Language;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onLearnMore: (topic: string) => void;
}

interface SlideData {
  id: number;
  badgeEn: string;
  badgeHi: string;
  headlineEn: string;
  headlineHi: string;
  textEn: string;
  textHi: string;
  ctaEn: string;
  ctaHi: string;
  ctaAction: 'login' | 'signup' | 'records' | 'kiosk_qr' | 'reports';
  icon: React.ReactNode;
  accentBg: string;
  accentBorder: string;
  visualGraphic: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  language,
  onOpenLogin,
  onOpenSignUp,
  onLearnMore
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<any>(null);

  const slides: SlideData[] = [
    {
      id: 0,
      badgeEn: "AI Clinical Companion",
      badgeHi: "एआई स्वास्थ्य सहायक",
      headlineEn: "Your Health Companion, Anytime, Anywhere",
      headlineHi: "आपका स्वास्थ्य साथी, कभी भी, कहीं भी",
      textEn: "Talk to the MediKiosk clinical assistant, share your concerns in English or हिन्दी, and prepare seamlessly for your doctor consultation.",
      textHi: "मेडीकियोस्क सहायक से बात करें, अपनी समस्याएं साझा करें और अपने डॉक्टर परामर्श की सहज तैयारी करें।",
      ctaEn: "Login to Continue",
      ctaHi: "जारी रखने हेतु लॉगिन करें",
      ctaAction: 'login',
      icon: <Bot className="w-8 h-8 text-teal-600" />,
      accentBg: "from-teal-500/10 to-sky-500/10",
      accentBorder: "border-teal-500/20",
      visualGraphic: "chat_ai"
    },
    {
      id: 1,
      badgeEn: "Longitudinal Health Records",
      badgeHi: "स्थायी स्वास्थ्य रिकॉर्ड",
      headlineEn: "Your Health Information, Always Within Reach",
      headlineHi: "आपकी स्वास्थ्य जानकारी, हमेशा आपकी पहुंच में",
      textEn: "Access verified lab reports, digital prescriptions, past hospital consultations, and longitudinal history from one secure, organized place.",
      textHi: "जांच रिपोर्ट, डॉक्टर के पर्चे, पूर्व परामर्श और संपूर्ण स्वास्थ्य इतिहास एक ही सुरक्षित स्थान पर देखें।",
      ctaEn: "Explore Your Records",
      ctaHi: "अपने रिकॉर्ड देखें",
      ctaAction: 'records',
      icon: <FileText className="w-8 h-8 text-sky-600" />,
      accentBg: "from-sky-500/10 to-indigo-500/10",
      accentBorder: "border-sky-500/20",
      visualGraphic: "records_timeline"
    },
    {
      id: 2,
      badgeEn: "Kiosk to Phone Continuity",
      badgeHi: "कियोस्क से फोन तक निरंतरता",
      headlineEn: "Continue Your Care, From Hospital to Home",
      headlineHi: "अस्पताल से घर तक, निरंतर स्वास्थ्य देखभाल",
      textEn: "Scan the QR code displayed at the hospital kiosk to securely link your visit and continue your clinical intake directly on your mobile device.",
      textHi: "अस्पताल कियोस्क पर प्रदर्शित क्यूआर कोड को स्कैन करें और अपनी जानकारी सीधे फोन पर जारी रखें।",
      ctaEn: "Learn How It Works",
      ctaHi: "कार्यप्रणाली जानें",
      ctaAction: 'kiosk_qr',
      icon: <QrCode className="w-8 h-8 text-emerald-600" />,
      accentBg: "from-emerald-500/10 to-teal-500/10",
      accentBorder: "border-emerald-500/20",
      visualGraphic: "qr_transfer"
    },
    {
      id: 3,
      badgeEn: "Original Document Preservation",
      badgeHi: "मूल दस्तावेज़ सुरक्षा",
      headlineEn: "Share Your Reports, Simply",
      headlineHi: "अपनी जांच रिपोर्ट आसानी से साझा करें",
      textEn: "Upload reports or capture medical documents using your phone camera. Original scans are permanently preserved alongside plain-language AI explanations.",
      textHi: "फोन कैमरे से रिपोर्ट फोटो खींचें या फाइल अपलोड करें। मूल दस्तावेज़ हमेशा सुरक्षित रहते हैं।",
      ctaEn: "Upload a Report",
      ctaHi: "रिपोर्ट अपलोड करें",
      ctaAction: 'reports',
      icon: <Upload className="w-8 h-8 text-teal-600" />,
      accentBg: "from-teal-500/10 to-emerald-500/10",
      accentBorder: "border-teal-500/20",
      visualGraphic: "report_camera"
    }
  ];

  // Auto rotation effect
  useEffect(() => {
    if (isPaused) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const handleCtaClick = (action: SlideData['ctaAction']) => {
    if (action === 'login' || action === 'records' || action === 'reports') {
      onOpenLogin();
    } else if (action === 'signup') {
      onOpenSignUp();
    } else {
      onLearnMore('how-it-works');
    }
  };

  const slide = slides[currentSlide];

  return (
    <section 
      aria-label="Patient Portal Highlights Carousel"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className={`relative rounded-3xl bg-gradient-to-br ${slide.accentBg} border-2 ${slide.accentBorder} dark:bg-slate-900/90 shadow-xl overflow-hidden transition-all duration-500 p-6 sm:p-10 lg:p-12 min-h-[420px] sm:min-h-[460px] flex flex-col justify-between`}>
        
        {/* Background decorative subtle organic rings (Ayurvedic/Health subtle visual language) */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-teal-500/5 dark:bg-teal-400/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-sky-500/5 dark:bg-sky-400/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Text Content Area */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>{language === 'hi' ? slide.badgeHi : slide.badgeEn}</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {language === 'hi' ? slide.headlineHi : slide.headlineEn}
            </h1>

            {/* Supporting description */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
              {language === 'hi' ? slide.textHi : slide.textEn}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCtaClick(slide.ctaAction)}
                className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{language === 'hi' ? slide.ctaHi : slide.ctaEn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {currentSlide === 0 && (
                <button
                  type="button"
                  onClick={onOpenSignUp}
                  className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm sm:text-base border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer transition-all"
                >
                  {language === 'hi' ? 'खाता बनाएं' : 'Create Account'}
                </button>
              )}
            </div>
          </div>

          {/* Graphic Visual Representation (Honest, clean card presentation) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-6 border-2 border-slate-200/80 dark:border-slate-700/80 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center shadow-inner">
                    {slide.icon}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      MediKiosk Portal
                    </h2>
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                      {language === 'hi' ? 'सुरक्षित स्वास्थ्य साथी' : 'Secure Health Companion'}
                    </span>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Dynamic Mock Graphic per slide */}
              {slide.visualGraphic === 'chat_ai' && (
                <div className="space-y-2.5 text-xs font-medium">
                  <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 border border-teal-200/60 dark:border-teal-800/60">
                    <p className="font-bold flex items-center gap-1.5 text-teal-700 dark:text-teal-300 text-[11px] uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {language === 'hi' ? 'एआई सहायक' : 'MediKiosk Assistant'}
                    </p>
                    {language === 'hi' 
                      ? 'नमस्ते! आप अपनी पुरानी जांच रिपोर्ट एवं दवाओं के बारे में कोई भी प्रश्न पूछ सकते हैं।' 
                      : 'Hello! You can ask questions about your medications, reports, or prepare for OPD.'}
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 ml-4 text-right">
                    {language === 'hi' ? '“मुझे डॉक्टर परामर्श के लिए क्या लाना चाहिए?”' : '“What documents should I prepare for Dr. Mehta?”'}
                  </div>
                </div>
              )}

              {slide.visualGraphic === 'records_timeline' && (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">Complete Blood Count (CBC)</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">Normal</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">Lipid Profile Test</span>
                    </div>
                    <span className="text-[10px] text-sky-700 bg-sky-100 px-2 py-0.5 rounded font-bold">Desirable</span>
                  </div>
                </div>
              )}

              {slide.visualGraphic === 'qr_transfer' && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center space-y-2">
                  <div className="w-20 h-20 mx-auto bg-white p-2 rounded-xl shadow-inner border border-emerald-300 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-slate-900" />
                  </div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    {language === 'hi' ? 'कियोस्क स्क्रीन से स्कैन करें' : 'Scan From Kiosk Screen'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'hi' ? 'कियोस्क #03 से तुरंत फोन पर लिंक' : 'Seamless transfer to your mobile'}
                  </p>
                </div>
              )}

              {slide.visualGraphic === 'report_camera' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center gap-3">
                    <Smartphone className="w-7 h-7 text-teal-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold block text-slate-800 dark:text-slate-200">
                        {language === 'hi' ? 'फोन कैमरा कैप्चर' : 'Phone Camera Capture'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {language === 'hi' ? 'मूल प्रति हमेशा सुरक्षित' : 'Original document preserved'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 text-[11px] text-slate-500 text-center font-medium">
                {language === 'hi' ? 'आयुष्मान भारत डिजिटल मिशन (ABDM) संगत' : 'Compatible with Ayushman Bharat Digital ID'}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Bottom Controls: Prev, Next & Indicators */}
        <div className="pt-6 sm:pt-8 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/60 relative z-10">
          
          {/* Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx 
                    ? 'w-8 bg-teal-600' 
                    : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm cursor-pointer transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm cursor-pointer transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
