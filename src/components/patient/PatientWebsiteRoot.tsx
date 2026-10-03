import React, { useState, useEffect } from 'react';
import { 
  Language, 
  ABHAPatient, 
  PatientPortalTab, 
  PatientAppointment, 
  PatientReport, 
  PatientPrescription,
  StructuredMedication, 
  IllnessRecord, 
  AyurvedaFactorGroup, 
  PatientNotification,
  QrLinkSessionResult
} from '../../types';
import { patientPortalService } from '../../services/patientPortalService';
import { useKiosk } from '../../context/KioskContext';

// Public Components
import { PublicHeader } from './public/PublicHeader';
import { HeroCarousel } from './public/HeroCarousel';
import { FeatureSection } from './public/FeatureSection';
import { HowItWorksSection } from './public/HowItWorksSection';
import { TrustSecuritySection } from './public/TrustSecuritySection';
import { PublicFooter } from './public/PublicFooter';
import { PatientLoginModal } from './public/PatientLoginModal';
import { PatientSignUpModal } from './public/PatientSignUpModal';

// Authenticated Portal Components
import { PortalHeader } from './portal/PortalHeader';
import { PortalSidebar } from './portal/PortalSidebar';
import { MobileBottomNav } from './portal/MobileBottomNav';
import { DashboardHome } from './portal/DashboardHome';
import { KioskQrLinkModal } from './portal/KioskQrLinkModal';
import { ClinicalConversationView } from './portal/ClinicalConversationView';
import { ReportsView } from './portal/ReportsView';
import { AppointmentsView } from './portal/AppointmentsView';
import { PrescriptionsView } from './portal/PrescriptionsView';
import { HealthRecordsView } from './portal/HealthRecordsView';
import { IllnessHistoryView } from './portal/IllnessHistoryView';
import { AyurvedicHealthView } from './portal/AyurvedicHealthView';
import { ConsentSharingView } from './portal/ConsentSharingView';
import { SessionsDevicesView } from './portal/SessionsDevicesView';
import { PatientProfileView } from './portal/PatientProfileView';
import { HelpSupportView } from './portal/HelpSupportView';
import { FindHospitalView } from './portal/FindHospitalView';

export const PatientWebsiteRoot: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    darkMode, 
    toggleDarkMode, 
    setAppView 
  } = useKiosk();

  // Authentication & Patient State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if user was previously logged in or accessing portal directly
    try {
      const hash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
      if (hash.includes('portal') || hash.includes('dashboard') || hash.includes('patient')) return true;
      const stored = localStorage.getItem('medikiosk_patient_auth');
      return stored !== 'false';
    } catch {
      return true;
    }
  });

  // Keep authenticated state in sync with URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('portal') || hash.includes('dashboard')) {
        setIsAuthenticated(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const [activePatient, setActivePatient] = useState<ABHAPatient>(() => patientPortalService.getPatientProfile());
  const [activeTab, setActiveTab] = useState<PatientPortalTab>('HOME');

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isKioskScanOpen, setIsKioskScanOpen] = useState(false);

  // Search & Reports detail
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportDetail, setSelectedReportDetail] = useState<PatientReport | null>(null);

  // Portal data state
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [prescriptions, setPrescriptions] = useState<PatientPrescription[]>([]);
  const [medications, setMedications] = useState<StructuredMedication[]>([]);
  const [illnessTimeline, setIllnessTimeline] = useState<IllnessRecord[]>([]);
  const [ayurvedaGroups, setAyurvedaGroups] = useState<AyurvedaFactorGroup[]>([]);
  const [notifications, setNotifications] = useState<PatientNotification[]>([]);

  // Accessibility Scaling & Contrast
  const [textScale, setTextScale] = useState<number>(1.0);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Fetch portal data
  useEffect(() => {
    patientPortalService.getAppointments().then(setAppointments);
    patientPortalService.getReports().then(setReports);
    patientPortalService.getPrescriptions().then(setPrescriptions);
    patientPortalService.getMedications().then(setMedications);
    patientPortalService.getIllnessTimeline().then(setIllnessTimeline);
    patientPortalService.getAyurvedaGroups().then(setAyurvedaGroups);
    patientPortalService.getNotifications().then(setNotifications);
  }, []);

  // Text scaling effect
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = `${textScale * 100}%`;
    }
  }, [textScale]);

  // High contrast effect
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (highContrast) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    }
  }, [highContrast]);

  const handleLoginSuccess = (patient: ABHAPatient) => {
    setActivePatient(patient);
    setIsAuthenticated(true);
    setActiveTab('HOME');
    try {
      localStorage.setItem('medikiosk_patient_auth', 'true');
    } catch {}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('HOME');
    try {
      localStorage.removeItem('medikiosk_patient_auth');
    } catch {}
  };

  const handleReportUploaded = (newReport: PatientReport) => {
    setReports(prev => [newReport, ...prev]);
  };

  const handleSessionLinked = (result: QrLinkSessionResult) => {
    // Refresh sessions and notifications
    patientPortalService.getNotifications().then(setNotifications);
    setActiveTab('HOME');
  };

  const handleViewReportDetail = (report: PatientReport) => {
    setSelectedReportDetail(report);
    setActiveTab('REPORTS');
  };

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors ${isAuthenticated ? 'fixed inset-0 h-screen max-h-screen overflow-hidden z-0' : 'min-h-screen'}`}>
      
      {/* ------------------------------------------------------------- */}
      {/* CASE A: PUBLIC LANDING PAGE (When patient is not logged in)   */}
      {/* ------------------------------------------------------------- */}
      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col">
          <PublicHeader
            language={language}
            onLanguageChange={setLanguage}
            textScale={textScale}
            onTextScaleChange={setTextScale}
            highContrast={highContrast}
            onToggleHighContrast={() => setHighContrast(prev => !prev)}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onOpenSignUp={() => setIsSignUpModalOpen(true)}
            onNavigateSection={handleNavigateSection}
          />

          <main className="flex-1">
            <HeroCarousel
              language={language}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              onOpenSignUp={() => setIsSignUpModalOpen(true)}
              onLearnMore={handleNavigateSection}
            />

            <FeatureSection
              language={language}
              onSelectFeature={(featKey) => {
                // If user clicks any primary feature, prompt login/signup
                setIsLoginModalOpen(true);
              }}
            />

            <HowItWorksSection
              language={language}
              onOpenSignUp={() => setIsSignUpModalOpen(true)}
            />

            <TrustSecuritySection
              language={language}
            />
          </main>

          <PublicFooter
            language={language}
            onNavigateSection={handleNavigateSection}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />

          {/* Login & Sign Up Modals */}
          <PatientLoginModal
            language={language}
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignUp={() => {
              setIsLoginModalOpen(false);
              setIsSignUpModalOpen(true);
            }}
          />

          <PatientSignUpModal
            language={language}
            isOpen={isSignUpModalOpen}
            onClose={() => setIsSignUpModalOpen(false)}
            onSignUpSuccess={handleLoginSuccess}
            onSwitchToLogin={() => {
              setIsSignUpModalOpen(false);
              setIsLoginModalOpen(true);
            }}
          />
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* CASE B: AUTHENTICATED PATIENT COMPANION PORTAL               */
        /* ------------------------------------------------------------- */
        <div className="flex-1 flex flex-col h-full max-h-full min-h-0 overflow-hidden">
          {/* Authenticated Top Navigation Header */}
          <PortalHeader
            language={language}
            onLanguageChange={setLanguage}
            textScale={textScale}
            onTextScaleChange={setTextScale}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            patient={activePatient}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            notifications={notifications}
            onMarkNotificationRead={(id) => patientPortalService.markNotificationRead(id)}
            onOpenKioskScan={() => setIsKioskScanOpen(true)}
            onLogout={handleLogout}
          />

          {/* Portal Body with Sidebar & Center Tab Content */}
          <div className="flex-1 flex flex-row overflow-hidden min-h-0 w-full relative">
            {/* Desktop Left Navigation Sidebar (Stationary & Independently scrollable) */}
            <PortalSidebar
              language={language}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />

            {/* Main Content Area (Independently scrollable) */}
            <main 
              id="patient-portal-main-scroll"
              className={`flex-1 h-full min-h-0 overflow-y-auto ${activeTab === 'CONVERSATION' ? 'p-0 overflow-hidden' : 'p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8'}`}
            >
              {activeTab === 'HOME' && (
                <DashboardHome
                  language={language}
                  patient={activePatient}
                  nextAppointment={appointments[0]}
                  recentReport={reports[0]}
                  currentMedications={medications}
                  recentIllness={illnessTimeline[0]}
                  onSelectTab={setActiveTab}
                  onOpenKioskScan={() => setIsKioskScanOpen(true)}
                  onViewReport={handleViewReportDetail}
                />
              )}

              {activeTab === 'CONVERSATION' && (
                <ClinicalConversationView
                  language={language}
                />
              )}

              {activeTab === 'REPORTS' && (
                <ReportsView
                  language={language}
                  reports={reports}
                  onUploadSuccess={handleReportUploaded}
                  selectedReportFromParent={selectedReportDetail}
                  onClearSelectedReport={() => setSelectedReportDetail(null)}
                />
              )}

              {activeTab === 'APPOINTMENTS' && (
                <AppointmentsView
                  language={language}
                  appointments={appointments}
                  onAppointmentBooked={(newApt) => setAppointments(prev => [newApt, ...prev])}
                />
              )}

              {activeTab === 'PRESCRIPTIONS' && (
                <PrescriptionsView
                  language={language}
                  prescriptions={prescriptions}
                  medications={medications}
                />
              )}

              {activeTab === 'HEALTH_RECORDS' && (
                <HealthRecordsView
                  language={language}
                  illnessTimeline={illnessTimeline}
                  reports={reports}
                  medications={medications}
                  onViewReport={handleViewReportDetail}
                />
              )}

              {activeTab === 'ILLNESS_HISTORY' && (
                <IllnessHistoryView
                  language={language}
                  illnesses={illnessTimeline}
                />
              )}

              {activeTab === 'AYURVEDA' && (
                <AyurvedicHealthView
                  language={language}
                  ayurvedaGroups={ayurvedaGroups}
                />
              )}

              {activeTab === 'CONSENT' && (
                <ConsentSharingView
                  language={language}
                />
              )}

              {activeTab === 'SESSIONS' && (
                <SessionsDevicesView
                  language={language}
                />
              )}

              {activeTab === 'PROFILE' && (
                <PatientProfileView
                  language={language}
                  patient={activePatient}
                  onUpdatePatient={setActivePatient}
                  onLogout={handleLogout}
                  onSelectTab={setActiveTab}
                />
              )}

              {activeTab === 'HELP' && (
                <HelpSupportView
                  language={language}
                />
              )}

              {activeTab === 'FIND_HOSPITAL' && (
                <FindHospitalView
                  language={language}
                />
              )}
            </main>
          </div>

          {/* Mobile Bottom Navigation (Sticky to bottom on small screens) */}
          <MobileBottomNav
            language={language}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenKioskScan={() => setIsKioskScanOpen(true)}
          />

          {/* Hospital Kiosk -> Phone QR Link Modal */}
          <KioskQrLinkModal
            language={language}
            isOpen={isKioskScanOpen}
            onClose={() => setIsKioskScanOpen(false)}
            onSessionLinked={handleSessionLinked}
          />
        </div>
      )}
    </div>
  );
};
