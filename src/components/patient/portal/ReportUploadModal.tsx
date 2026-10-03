import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  CameraOff, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Language, PatientReport } from '../../../types';
import { patientPortalService } from '../../../services/patientPortalService';

interface ReportUploadModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newReport: PatientReport) => void;
}

export const ReportUploadModal: React.FC<ReportUploadModalProps> = ({
  language,
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [mode, setMode] = useState<'CHOICE' | 'FILE' | 'CAMERA'>('CHOICE');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PatientReport['category']>('Lab Reports');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Camera state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleStartCamera = async () => {
    setErrorMsg(null);
    setMode('CAMERA');
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorMsg(language === 'hi' ? 'कैमरा उपलब्ध नहीं है।' : 'Camera not supported.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      setErrorMsg(language === 'hi' ? 'कैमरा अनुमति नहीं मिली।' : 'Camera permission denied or camera busy.');
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setFilePreview(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveReport = async () => {
    if (!filePreview) {
      setErrorMsg(language === 'hi' ? 'कृपया पहले दस्तावेज़ की फोटो लें या फाइल चुनें।' : 'Please take a photo or select a file first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const rep = await patientPortalService.uploadReport(
        title || (language === 'hi' ? 'अपलोड की गई जांच रिपोर्ट' : 'Uploaded Medical Report'),
        category,
        filePreview
      );
      onUploadSuccess(rep);
      handleClose();
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to upload report.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setFilePreview(null);
    setTitle('');
    setMode('CHOICE');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border-2 border-slate-300 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-teal-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {language === 'hi' ? 'मेडिकल रिपोर्ट जोड़ें' : 'Upload Medical Report'}
              </h3>
              <p className="text-xs text-teal-100 font-medium">
                {language === 'hi' ? 'मूल दस्तावेज़ हमेशा सुरक्षित रहेगा' : 'Original document is permanently preserved'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode 1: Choice */}
          {mode === 'CHOICE' && !filePreview && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <button
                type="button"
                onClick={handleStartCamera}
                className="p-6 rounded-3xl border-2 border-dashed border-teal-400 bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-50 dark:hover:bg-teal-950/60 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all hover:scale-105"
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    {language === 'hi' ? 'फोटो खींचें' : 'Take Photo'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {language === 'hi' ? 'फोन कैमरे से स्कैन करें' : 'Capture with phone camera'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('FILE');
                  fileInputRef.current?.click();
                }}
                className="p-6 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all hover:scale-105"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-700 text-white flex items-center justify-center shadow-md">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    {language === 'hi' ? 'फाइल चुनें' : 'Upload File'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    PDF, JPEG, PNG
                  </span>
                </div>
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileSelected}
            className="hidden"
          />

          {/* Mode 2: Camera Live Viewfinder */}
          {mode === 'CAMERA' && !filePreview && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border-2 border-slate-700">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="flex-1 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  <span>{language === 'hi' ? 'फोटो लें (Capture)' : 'Snap Document Photo'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { stopCamera(); setMode('CHOICE'); }}
                  className="px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-pointer"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            </div>
          )}

          {/* Mode 3: Preview and Metadata Entry */}
          {filePreview && (
            <div className="space-y-4 animate-fade-in">
              {/* Document Image Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 max-h-56 flex items-center justify-center p-2">
                <img src={filePreview} alt="Preview" className="max-h-52 w-auto object-contain rounded-lg" />
                <button
                  type="button"
                  onClick={() => setFilePreview(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 cursor-pointer"
                  title="Retake / Change"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Category Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'रिपोर्ट का शीर्षक *' : 'Report Title *'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Thyroid Test or Chest X-Ray"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'दस्तावेज़ की श्रेणी' : 'Document Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Lab Reports">Lab Reports (रक्त/मूत्र जांच)</option>
                    <option value="Imaging">Imaging (एक्स-रे/अल्ट्रासाउंड)</option>
                    <option value="Prescriptions">Prescriptions (चिकित्सकीय पर्चा)</option>
                    <option value="Other">Other Medical Document (अन्य)</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveReport}
                disabled={isProcessing}
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'दस्तावेज़ सुरक्षित हो रहा है...' : 'Archiving Original Document...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'hi' ? 'रिपोर्ट सुरक्षित करें' : 'Confirm & Save to Records'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
