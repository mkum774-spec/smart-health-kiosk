import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  QrCode, 
  Camera, 
  CameraOff, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  Smartphone,
  RefreshCw,
  Upload
} from 'lucide-react';
import { Language, QrLinkSessionResult } from '../../../types';
import { patientPortalService } from '../../../services/patientPortalService';

interface KioskQrLinkModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSessionLinked: (result: QrLinkSessionResult) => void;
}

export const KioskQrLinkModal: React.FC<KioskQrLinkModalProps> = ({
  language,
  isOpen,
  onClose,
  onSessionLinked
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [linkedResult, setLinkedResult] = useState<QrLinkSessionResult | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start real webcam preview
  const startCamera = async () => {
    setErrorMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermission('denied');
        setErrorMsg(language === 'hi' ? 'कैमरा इस ब्राउज़र में समर्थित नहीं है।' : 'Camera is not supported on this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setCameraPermission('granted');
    } catch (err: any) {
      console.warn("Camera access denied or unavailable:", err);
      setCameraPermission('denied');
      setErrorMsg(language === 'hi' 
        ? 'कैमरा अनुमति अस्वीकृत या अनुपलब्ध है। आप नीचे दिए गए सैंपल क्यूआर बटन से टेस्ट कर सकते हैं।' 
        : 'Camera permission denied or device camera unavailable. You can use the Quick Test QR button below.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLinkedResult(null);
      setErrorMsg(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const handleVerifyQr = async (payload: string) => {
    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const res = await patientPortalService.linkHospitalKioskSession(payload);
      if (res.success) {
        setLinkedResult(res);
        stopCamera();
        onSessionLinked(res);
      } else {
        setErrorMsg(res.message || 'QR session linking failed.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error linking kiosk session.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border-2 border-slate-300 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-teal-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {language === 'hi' ? 'अस्पताल कियोस्क सत्र लिंक करें' : 'Link Hospital Kiosk Session'}
              </h3>
              <p className="text-[11px] text-teal-100 font-medium">
                {language === 'hi' ? 'कियोस्क स्क्रीन का क्यूआर कोड स्कैन करें' : 'Scan the QR code displayed at the kiosk'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Success Linked State */}
          {linkedResult ? (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {language === 'hi' ? 'सत्र सफलतापूर्वक जुड़ गया!' : 'Kiosk Session Connected!'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                  {linkedResult.message}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 text-left space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">{language === 'hi' ? 'टोकन संख्या' : 'Token Number'}:</span>
                  <span className="text-teal-700 dark:text-teal-300 font-mono text-sm">{linkedResult.tokenNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'hi' ? 'विभाग' : 'Department'}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{linkedResult.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'hi' ? 'कक्ष' : 'Room'}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{linkedResult.assignedRoom}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md cursor-pointer transition-colors"
              >
                {language === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Continue to Dashboard'}
              </button>
            </div>
          ) : (
            <>
              {/* Camera Scanner Viewport */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-300 dark:border-slate-700 aspect-square max-h-64 mx-auto flex items-center justify-center">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                ) : (
                  <div className="p-6 text-center text-slate-400 space-y-2">
                    <CameraOff className="w-10 h-10 mx-auto opacity-60" />
                    <p className="text-xs font-semibold">
                      {cameraPermission === 'denied' 
                        ? (language === 'hi' ? 'कैमरा अनुमति नहीं मिली' : 'Camera permission denied') 
                        : (language === 'hi' ? 'कैमरा चालू हो रहा है...' : 'Starting camera viewfinder...')}
                    </p>
                  </div>
                )}

                {/* Animated Scanner Reticle */}
                {cameraActive && (
                  <div className="absolute inset-0 border-2 border-teal-400/50 m-8 rounded-2xl flex flex-col justify-between p-2 pointer-events-none">
                    <div className="flex justify-between">
                      <div className="w-5 h-5 border-t-2 border-l-2 border-teal-400" />
                      <div className="w-5 h-5 border-t-2 border-r-2 border-teal-400" />
                    </div>
                    <div className="h-0.5 bg-teal-400/80 shadow-[0_0_8px_#2dd4bf] animate-pulse" />
                    <div className="flex justify-between">
                      <div className="w-5 h-5 border-b-2 border-l-2 border-teal-400" />
                      <div className="w-5 h-5 border-b-2 border-r-2 border-teal-400" />
                    </div>
                  </div>
                )}

                {/* Verifying Overlay */}
                {isVerifying && (
                  <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-white space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                    <span className="text-xs font-bold">
                      {language === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Verifying Kiosk Session...'}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Instructions */}
              <p className="text-xs text-slate-500 text-center font-medium">
                {language === 'hi'
                  ? 'अस्पताल कियोस्क के टोकन स्क्रीन पर दिए गए क्यूआर कोड को कैमरे के सामने रखें।'
                  : 'Point your camera at the QR code displayed on the MediKiosk terminal screen.'}
              </p>

              {/* Quick Simulated QR Test Action */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider text-center">
                  {language === 'hi' ? 'परीक्षण हेतु तुरंत स्कैन करें:' : 'Quick Test (One-Click Simulate):'}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleVerifyQr("MEDIKIOSK:K03:TK-1004:cons_001:General Medicine:Room 204")}
                    disabled={isVerifying}
                    className="flex-1 py-2 px-3 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-300 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-teal-100 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Scan Kiosk #03 QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVerifyQr("MEDIKIOSK:EXPIRED_SESSION")}
                    disabled={isVerifying}
                    className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-200 transition-colors"
                    title="Simulate expired QR error handling"
                  >
                    Test Expired
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
