import { 
  PatientAppointment, 
  PatientReport, 
  PatientPrescription, 
  StructuredMedication, 
  IllnessRecord, 
  AyurvedaFactorGroup, 
  UserSession, 
  DoctorAccessAuthorization, 
  PatientNotification,
  GroupConsentSettings,
  QrLinkSessionResult,
  ABHAPatient
} from '../types';
import { 
  PATIENT_PRIYA_SHARMA, 
  MOCK_APPOINTMENTS, 
  MOCK_PATIENT_REPORTS, 
  MOCK_PRESCRIPTIONS, 
  MOCK_ACTIVE_MEDICATIONS, 
  MOCK_ILLNESS_TIMELINE, 
  MOCK_AYURVEDA_GROUPS, 
  MOCK_ACTIVE_SESSIONS, 
  MOCK_DOCTOR_ACCESS, 
  MOCK_NOTIFICATIONS 
} from './patientMockData';
import { apiService } from './apiService';

class PatientPortalService {
  private activePatient: ABHAPatient = { ...PATIENT_PRIYA_SHARMA };
  private appointments: PatientAppointment[] = [...MOCK_APPOINTMENTS];
  private reports: PatientReport[] = [...MOCK_PATIENT_REPORTS];
  private prescriptions: PatientPrescription[] = [...MOCK_PRESCRIPTIONS];
  private medications: StructuredMedication[] = [...MOCK_ACTIVE_MEDICATIONS];
  private illnessTimeline: IllnessRecord[] = [...MOCK_ILLNESS_TIMELINE];
  private ayurvedaGroups: AyurvedaFactorGroup[] = [...MOCK_AYURVEDA_GROUPS];
  private sessions: UserSession[] = [...MOCK_ACTIVE_SESSIONS];
  private doctorAccess: DoctorAccessAuthorization[] = [...MOCK_DOCTOR_ACCESS];
  private notifications: PatientNotification[] = [...MOCK_NOTIFICATIONS];
  
  private consentSettings: GroupConsentSettings = {
    personalHistory: 'SHARE',
    medicalHistory: 'SHARE',
    familyHistory: 'SHARE',
    currentIllness: 'SHARE',
    medications: 'SHARE',
    allergies: 'ALWAYS_SHARED',
    documents: 'SHARE',
    ayurveda: 'SHARE'
  };

  public getPatientProfile(): ABHAPatient {
    return { ...this.activePatient };
  }

  public updatePatientProfile(updated: Partial<ABHAPatient>): ABHAPatient {
    this.activePatient = { ...this.activePatient, ...updated };
    return { ...this.activePatient };
  }

  public async getAppointments(): Promise<PatientAppointment[]> {
    return [...this.appointments];
  }

  public async getReports(): Promise<PatientReport[]> {
    return [...this.reports];
  }

  public async uploadReport(
    title: string, 
    category: PatientReport['category'], 
    fileDataUrl: string, 
    notes?: string
  ): Promise<PatientReport> {
    const newReport: PatientReport = {
      id: `rep-up-${Date.now()}`,
      title: title || 'Patient Uploaded Document',
      titleHi: 'मरीज द्वारा अपलोड किया गया दस्तावेज़',
      category: category || 'Other',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      hospitalOrLab: 'Patient Portal Upload',
      summary: notes || 'Document uploaded securely via patient companion portal. Stored in original resolution.',
      originalDocumentUrl: fileDataUrl,
      isUploadedByUser: true,
      extractedValues: [
        { name: 'Document Status', value: 'Original File Archived', status: 'NORMAL' },
        { name: 'AI Text Extraction', value: 'Pending clinical verification', status: 'NORMAL' }
      ],
      aiExplanation: 'Your document copy has been securely uploaded to your personal records. It will be accessible during your upcoming doctor consultation.',
      aiExplanationHi: 'आपका दस्तावेज़ सफलतापूर्वक सुरक्षित कर लिया गया है। यह आपके अगले परामर्श के समय डॉक्टर को उपलब्ध रहेगा।'
    };

    this.reports.unshift(newReport);
    return newReport;
  }

  public async getPrescriptions(): Promise<PatientPrescription[]> {
    return [...this.prescriptions];
  }

  public async getMedications(): Promise<StructuredMedication[]> {
    return [...this.medications];
  }

  public async getIllnessTimeline(): Promise<IllnessRecord[]> {
    return [...this.illnessTimeline];
  }

  public async getAyurvedaGroups(): Promise<AyurvedaFactorGroup[]> {
    return [...this.ayurvedaGroups];
  }

  public getConsentSettings(): GroupConsentSettings {
    return { ...this.consentSettings };
  }

  public updateConsentSettings(settings: Partial<GroupConsentSettings>): GroupConsentSettings {
    this.consentSettings = {
      ...this.consentSettings,
      ...settings,
      allergies: 'ALWAYS_SHARED' // Mandatory clinical patient safety rule per Section 21 & Round 2
    };
    return { ...this.consentSettings };
  }

  public async getActiveSessions(): Promise<UserSession[]> {
    return [...this.sessions];
  }

  public async revokeSession(sessionId: string): Promise<boolean> {
    this.sessions = this.sessions.filter(s => s.id !== sessionId);
    return true;
  }

  public async getDoctorAccess(): Promise<DoctorAccessAuthorization[]> {
    return [...this.doctorAccess];
  }

  public async revokeDoctorAccess(consultationId: string): Promise<boolean> {
    this.doctorAccess = this.doctorAccess.map(doc => 
      doc.consultationId === consultationId ? { ...doc, isRevoked: true } : doc
    );
    return true;
  }

  public async getNotifications(): Promise<PatientNotification[]> {
    return [...this.notifications];
  }

  public async markNotificationRead(id: string): Promise<void> {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
  }

  public async markAllNotificationsRead(): Promise<void> {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }

  /**
   * Hospital Kiosk -> Phone Session Linking Workflow
   * Handles parsing and linking a kiosk QR payload
   */
  public async linkHospitalKioskSession(qrPayload: string): Promise<QrLinkSessionResult> {
    // Simulated network delay
    await new Promise(r => setTimeout(r, 600));

    const clean = qrPayload.trim();
    if (!clean) {
      return { success: false, message: 'Invalid or empty QR code. Please scan a valid MediKiosk QR.' };
    }

    if (clean.includes('expired') || clean.includes('EXPIRED')) {
      return { success: false, message: 'This QR code has expired. Please refresh the QR screen on the hospital kiosk.' };
    }

    // Parse potential QR patterns:
    // e.g. "MEDIKIOSK:K03:TK-1004:cons_001:General Medicine:Room 204"
    // or standard URL / JSON or demo token
    let token = "TK-1004";
    let kioskId = "Hospital Kiosk #03 (Ground Floor OPD)";
    let department = "General Medicine";
    let room = "Room 204";
    let consultationId = "cons_kiosk_live";

    if (clean.includes(':')) {
      const parts = clean.split(':');
      if (parts.length >= 2) kioskId = parts[1] || kioskId;
      if (parts.length >= 3) token = parts[2] || token;
      if (parts.length >= 4) consultationId = parts[3] || consultationId;
      if (parts.length >= 5) department = parts[4] || department;
      if (parts.length >= 6) room = parts[5] || room;
    }

    // Add session to active devices
    this.sessions.unshift({
      id: `sess_kiosk_linked_${Date.now()}`,
      deviceName: kioskId,
      deviceType: 'KIOSK_TERMINAL',
      ipAddress: '10.12.93.231',
      lastActive: 'Connected just now via QR',
      isCurrent: false
    });

    // Add notification
    this.notifications.unshift({
      id: `notif_qr_${Date.now()}`,
      title: "Hospital Kiosk Session Linked",
      titleHi: "कियोस्क सत्र फोन से जुड़ा",
      message: `Successfully linked your session from ${kioskId}. Your consultation token is ${token}.`,
      messageHi: `${kioskId} से आपका सत्र जुड़ गया है। टोकन: ${token}`,
      timestamp: "Just now",
      read: false,
      type: "SECURITY",
      actionTab: "HOME"
    });

    return {
      success: true,
      kioskId,
      tokenNumber: token,
      consultationId,
      department,
      assignedRoom: room,
      patientName: this.activePatient.name,
      message: `Kiosk session securely connected! Token ${token} is now linked to your phone.`
    };
  }
}

export const patientPortalService = new PatientPortalService();
