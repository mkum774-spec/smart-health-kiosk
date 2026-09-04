import React, { useState } from 'react';
import { 
  Sliders, 
  Monitor, 
  Users, 
  Columns, 
  AlertOctagon, 
  RotateCcw, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Languages 
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { MOCK_OCR_PRESETS } from '../../services/mockData';

export const DemoToolbar: React.FC = () => {
  const {
    appView,
    setAppView,
    setLanguage,
    setScreen,
    triggerEmergencyRequest,
    loadPresetPatient,
    updateSymptoms,
    updateVitals,
    addDocument,
    staffAcceptCasualty,
    activeEmergencyRequest,
    emergencyRequests,
    isOffline,
    toggleOffline,
    resetKioskSession,
    language
  } = useKiosk();

  const [isOpen, setIsOpen] = useState(false);

  // Demo 1: Full Normal Patient Flow (Demo Patient P001)
  const runDemoNormal = () => {
    resetKioskSession();
    loadPresetPatient(0);
    setScreen('ABHA');
  };

  // Demo 2: Hindi Voice Registration
  const runDemoHindiVoice = () => {
    resetKioskSession();
    setLanguage('hi');
    loadPresetPatient(1); // Priya Sharma
    setScreen('ABHA');
  };

  // Demo 3: Voice Symptoms & Confirmation Loop
  const runDemoSymptomsVoice = () => {
    loadPresetPatient(0);
    updateSymptoms(
      "I have had severe chest discomfort and breathlessness since yesterday evening.",
      "1 - 3 days",
      "I have had severe chest discomfort and breathlessness since yesterday evening."
    );
    setScreen('SYMPTOMS');
  };

  // Demo 4: Scan Prescription & Simulated OCR
  const runDemoScanOcr = () => {
    loadPresetPatient(0);
    addDocument(MOCK_OCR_PRESETS[0]);
    setScreen('DOCUMENTS');
  };

  // Demo 5: Vitals Intake & Safety Alert
  const runDemoVitals = () => {
    loadPresetPatient(0);
    updateVitals({
      heightCm: 172,
      weightKg: 86,
      systolicBp: 165,
      diastolicBp: 102,
      heartRate: 98,
      spo2: 94,
      temperatureF: 101.4,
      bloodGlucoseMgDl: 185
    });
    setScreen('VITALS');
  };

  // Demo 8: Emergency Press
  const runDemoEmergency = () => {
    triggerEmergencyRequest();
  };

  // Demo 10: Staff Accepts Casualty
  const runDemoStaffAccept = () => {
    if (activeEmergencyRequest) {
      staffAcceptCasualty(activeEmergencyRequest.id, "Casualty Room C-02");
    } else if (emergencyRequests.length > 0) {
      staffAcceptCasualty(emergencyRequests[0].id, "Casualty Room C-02");
    }
  };

  return (
    <aside aria-label="Hackathon Demo Controller" className="w-full bg-slate-900 text-white border-b-2 border-teal-500/50 select-none z-40 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Switcher */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-teal-400 flex items-center gap-1.5 uppercase tracking-wider text-xs">
            <Sliders className="w-4 h-4" />
            Hackathon Demo Bar:
          </span>

          <div className="inline-flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setAppView('KIOSK')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                appView === 'KIOSK' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Patient Kiosk</span>
            </button>
            <button
              type="button"
              onClick={() => setAppView('STAFF')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                appView === 'STAFF' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Staff Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setAppView('SPLIT')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                appView === 'SPLIT' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span>Dual Split-Screen</span>
            </button>
          </div>
        </div>

        {/* Right: Quick Triggers */}
        <div className="flex items-center gap-2">
          {/* Emergency 1-click test button */}
          <button
            type="button"
            onClick={runDemoEmergency}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold rounded-xl border border-red-400 flex items-center gap-1.5 shadow cursor-pointer"
            title="Trigger instant Emergency Token"
          >
            <AlertOctagon className="w-4 h-4 animate-pulse" />
            <span>🚨 Demo Emergency</span>
          </button>

          {/* Accept Casualty 1-click test button */}
          <button
            type="button"
            onClick={runDemoStaffAccept}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-xl border border-emerald-400 flex items-center gap-1.5 shadow cursor-pointer"
            title="Simulate Staff Accepting Emergency to Casualty"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Accept Casualty</span>
          </button>

          {/* Toggle Offline */}
          <button
            type="button"
            onClick={toggleOffline}
            className={`px-2.5 py-1.5 rounded-xl font-bold border flex items-center gap-1 transition-all cursor-pointer ${
              isOffline
                ? 'bg-amber-600 text-amber-50 border-amber-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            <span>{isOffline ? 'Offline' : 'Online'}</span>
          </button>

          {/* Drawer Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-1 cursor-pointer"
            title="Toggle All Demo Scenarios"
          >
            <span className="text-xs font-bold">11 Demos</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={() => resetKioskSession(false)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 cursor-pointer"
            title="Reset Kiosk Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Demo Scenarios Drawer */}
      {isOpen && (
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={runDemoNormal}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-left rounded-xl border border-slate-700 cursor-pointer transition-all"
          >
            <p className="font-bold text-teal-300 flex items-center gap-1">
              <Play className="w-3 h-3" /> Demo 1: Normal
            </p>
            <p className="text-[11px] text-slate-400">ABHA Registration</p>
          </button>

          <button
            type="button"
            onClick={runDemoHindiVoice}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-left rounded-xl border border-slate-700 cursor-pointer transition-all"
          >
            <p className="font-bold text-amber-300 flex items-center gap-1">
              <Languages className="w-3 h-3" /> Demo 2: हिन्दी
            </p>
            <p className="text-[11px] text-slate-400">Hindi Voice Flow</p>
          </button>

          <button
            type="button"
            onClick={runDemoSymptomsVoice}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-left rounded-xl border border-slate-700 cursor-pointer transition-all"
          >
            <p className="font-bold text-sky-300 flex items-center gap-1">
              <Play className="w-3 h-3" /> Demo 3: Voice
            </p>
            <p className="text-[11px] text-slate-400">Symptoms & AI Loop</p>
          </button>

          <button
            type="button"
            onClick={runDemoScanOcr}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-left rounded-xl border border-slate-700 cursor-pointer transition-all"
          >
            <p className="font-bold text-emerald-300 flex items-center gap-1">
              <Play className="w-3 h-3" /> Demo 4: OCR Scan
            </p>
            <p className="text-[11px] text-slate-400">Prescription Parser</p>
          </button>

          <button
            type="button"
            onClick={runDemoVitals}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-left rounded-xl border border-slate-700 cursor-pointer transition-all"
          >
            <p className="font-bold text-indigo-300 flex items-center gap-1">
              <Play className="w-3 h-3" /> Demo 5: Vitals
            </p>
            <p className="text-[11px] text-slate-400">Safety Flag Alert</p>
          </button>

          <button
            type="button"
            onClick={() => setScreen('REVIEW')}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-left rounded-xl border border-slate-700 cursor-pointer transition-all"
          >
            <p className="font-bold text-purple-300 flex items-center gap-1">
              <Play className="w-3 h-3" /> Demo 6: EMR
            </p>
            <p className="text-[11px] text-slate-400">Doctor-ready Intake</p>
          </button>
        </div>
      )}
    </aside>
  );
};
