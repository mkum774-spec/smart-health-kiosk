import React, { useState, useEffect } from 'react';
import { useKiosk } from './context/KioskContext';
import { DemoToolbar } from './components/common/DemoToolbar';
import { KioskHeader } from './components/common/KioskHeader';
import { SessionTimeoutModal } from './components/common/SessionTimeoutModal';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

// Kiosk Screens
import { HomeScreen } from './components/kiosk/HomeScreen';
import { EmergencyScreen } from './components/kiosk/EmergencyScreen';
import { AbhaScreen } from './components/kiosk/AbhaScreen';
import { AssessmentTypeScreen } from './components/kiosk/AssessmentTypeScreen';
import { PastRecordsScreen } from './components/kiosk/PastRecordsScreen';
import { ConsentScreen } from './components/kiosk/ConsentScreen';
import { SymptomScreen } from './components/kiosk/SymptomScreen';
import { VitalsScreen } from './components/kiosk/VitalsScreen';
import { MedicalHistoryScreen } from './components/kiosk/MedicalHistoryScreen';
import { DocumentScanScreen } from './components/kiosk/DocumentScanScreen';
import { EmrSummaryScreen } from './components/kiosk/EmrSummaryScreen';
import { TokenScreen } from './components/kiosk/TokenScreen';
import { LiveQueueScreen } from './components/kiosk/LiveQueueScreen';
import { AyurvedaScreen } from './components/kiosk/AyurvedaScreen';
import { PatientLoginScreen } from './components/kiosk/PatientLoginScreen';
import { MyRecordsScreen } from './components/kiosk/MyRecordsScreen';

// Staff Screens
import { StaffHeader } from './components/staff/StaffHeader';
import { StaffOverview } from './components/staff/StaffOverview';

export const AppContent: React.FC = () => {
  const { 
    currentScreen, 
    appView, 
    setAppView, 
    accessibility,
    sessionResetToast,
    clearSessionResetToast 
  } = useKiosk();

  const [staffTab, setStaffTab] = useState<'overview' | 'emergency' | 'queue' | 'departments'>('overview');

  // Check URL pathname or hash for staff routing
  useEffect(() => {
    if (window.location.pathname.includes('/staff') || window.location.hash.includes('staff')) {
      setAppView('STAFF');
    }
  }, [setAppView]);

  // Synchronize accessibility classes on body
  useEffect(() => {
    if (accessibility.largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }

    if (accessibility.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [accessibility.largeText, accessibility.highContrast]);

  // Render Kiosk Main Content Screen
  const renderKioskScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen />;
      case 'EMERGENCY':
        return <EmergencyScreen />;
      case 'ABHA':
        return <AbhaScreen />;
      case 'ASSESSMENT_TYPE':
        return <AssessmentTypeScreen />;
      case 'PAST_RECORDS':
        return <PastRecordsScreen />;
      case 'CONSENT':
        return <ConsentScreen />;
      case 'PATIENT_LOGIN':
        return <PatientLoginScreen />;
      case 'MY_RECORDS':
        return <MyRecordsScreen />;
      case 'SYMPTOMS':
        return <SymptomScreen />;
      case 'VITALS':
        return <VitalsScreen />;
      case 'AYURVEDA':
        return <AyurvedaScreen />;
      case 'HISTORY':
        return <MedicalHistoryScreen />;
      case 'DOCUMENTS':
        return <DocumentScanScreen />;
      case 'REVIEW':
        return <EmrSummaryScreen />;
      case 'TOKEN':
        return <TokenScreen />;
      case 'QUEUE':
        return <LiveQueueScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative transition-colors duration-200">
      {/* Privacy Session Reset Toast */}
      {sessionResetToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl border-2 border-teal-500 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
          <span className="font-bold text-sm sm:text-base">{sessionResetToast}</span>
          <button 
            type="button" 
            onClick={clearSessionResetToast}
            className="text-xs text-slate-400 hover:text-white font-mono ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Presentation Views */}
      {/* 1. PATIENT KIOSK (Clean, No Hackathon Bar) */}
      {appView === 'KIOSK' && (
        <div className="flex-1 flex flex-col min-h-screen">
          <KioskHeader />
          <main className="flex-1 flex flex-col justify-center py-4">
            {renderKioskScreen()}
          </main>
          <SessionTimeoutModal />
        </div>
      )}

      {/* 2. STAFF DASHBOARD (Developer / Staff Bar preserved here) */}
      {appView === 'STAFF' && (
        <div className="flex-1 flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900">
          <DemoToolbar />
          <StaffHeader activeTab={staffTab} setActiveTab={setStaffTab} />
          <main className="flex-1 py-4">
            <StaffOverview activeTab={staffTab} />
          </main>
        </div>
      )}

      {/* 3. SPLIT VIEW (For Staff/Admin multi-display testing) */}
      {appView === 'SPLIT' && (
        <div className="flex-1 flex flex-col min-h-screen">
          <DemoToolbar />
          <div className="flex-1 flex flex-col lg:flex-row divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-teal-600">
            {/* Left: Patient Kiosk */}
            <div className="w-full lg:w-1/2 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto">
              <div className="bg-teal-800 text-white text-xs font-black uppercase px-4 py-1.5 flex items-center justify-between">
                <span>Patient Kiosk Terminal</span>
                <span className="font-mono">KIOSK #03 • LIVE</span>
              </div>
              <KioskHeader />
              <div className="flex-1 py-4">
                {renderKioskScreen()}
              </div>
              <SessionTimeoutModal />
            </div>

            {/* Right: Staff Dashboard */}
            <div className="w-full lg:w-1/2 flex flex-col bg-slate-100 overflow-y-auto">
              <div className="bg-slate-900 text-teal-400 text-xs font-black uppercase px-4 py-1.5 flex items-center justify-between">
                <span>Staff Management Portal</span>
                <span className="font-mono text-white">SYNC ACTIVE</span>
              </div>
              <StaffHeader activeTab={staffTab} setActiveTab={setStaffTab} />
              <div className="flex-1 py-4">
                <StaffOverview activeTab={staffTab} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
