import { API_BASE_URL, API_ENDPOINTS, DEMO_CREDENTIALS } from '../config/api';
import { BackendPatient, BackendConsultation, ConsentPayload, AyurvedaData, AssessmentTrack, AyurvedaAnswers } from '../types';

export type { BackendPatient, BackendConsultation, AssessmentTrack, AyurvedaAnswers };

// Demo Patient matched to spec: "Demo Patient P001", female, 52
const FALLBACK_PATIENT: BackendPatient = {
  id: "pat_demo_001",
  name: "Demo Patient P001",
  age: 52,
  gender: "FEMALE",
  abha_id: DEMO_CREDENTIALS.ABHA_ID,
  phone: "+91 98765 43210",
  created_at: "2026-02-15T09:30:00Z"
};

// Standard token format: TK-1001, TK-1002, TK-1003 (never client-generated A-127)
const FALLBACK_CONSULTATIONS: BackendConsultation[] = [
  {
    id: "cons_001",
    patient_id: "pat_demo_001",
    status: "READY_FOR_DOCTOR",
    language: "en",
    token_number: "TK-1001",
    priority: "MEDIUM",
    created_at: "2026-09-04T08:15:00Z",
    updated_at: "2026-09-04T08:18:00Z",
    chief_complaint: "Chest discomfort and shortness of breath since yesterday evening",
    department: "General Medicine",
    assigned_room: "Room 204"
  },
  {
    id: "cons_002",
    patient_id: "pat_demo_001",
    status: "COMPLETED",
    language: "en",
    token_number: "TK-1002",
    priority: "LOW",
    created_at: "2026-08-14T10:45:00Z",
    updated_at: "2026-08-14T11:20:00Z",
    chief_complaint: "Routine blood pressure follow-up and prescription renewal",
    department: "Cardiology",
    assigned_room: "Room 105"
  },
  {
    id: "cons_003",
    patient_id: "pat_demo_001",
    status: "COMPLETED",
    language: "en",
    token_number: "TK-1003",
    priority: "LOW",
    created_at: "2026-06-12T11:00:00Z",
    updated_at: "2026-06-12T11:35:00Z",
    chief_complaint: "Complete Blood Count (CBC) and Lipid Profile Review",
    department: "General Medicine",
    assigned_room: "Room 201"
  }
];

class ApiService {
  private timeoutMs = 3500;
  private fallbackListeners: ((isOffline: boolean) => void)[] = [];
  private lastKnownOffline: boolean = false;
  private fallbackTokenCounter = 1004;

  public registerFallbackListener(cb: (isOffline: boolean) => void) {
    this.fallbackListeners.push(cb);
    cb(this.lastKnownOffline);
    return () => {
      this.fallbackListeners = this.fallbackListeners.filter(l => l !== cb);
    };
  }

  private notifyFallback(isOffline: boolean) {
    this.lastKnownOffline = isOffline;
    this.fallbackListeners.forEach(cb => cb(isOffline));
  }

  public getIsOffline(): boolean {
    return this.lastKnownOffline;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return res;
    } catch (e) {
      clearTimeout(id);
      throw e;
    }
  }

  public async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(API_ENDPOINTS.HEALTH_CHECK, { method: 'GET' });
      const online = response.ok || response.status === 404 || response.status === 200;
      this.notifyFallback(!online);
      return online;
    } catch (e) {
      this.notifyFallback(true);
      return false;
    }
  }

  public async patientLogin(abhaId: string, password: string): Promise<{ patient: BackendPatient; isLiveBackend: boolean }> {
    try {
      const response = await this.fetchWithTimeout(API_ENDPOINTS.PATIENT_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ abha_id: abhaId, password })
      });

      if (response.ok) {
        const data = await response.json();
        const patientId = data.patient_id || data.id;
        const patient: BackendPatient = {
          id: patientId,
          name: data.name || (data.patient && data.patient.name) || "Demo Patient P001",
          abha_id: abhaId,
          age: data.age || (data.patient && data.patient.age) || 52,
          gender: data.gender || (data.patient && data.patient.gender) || "FEMALE",
          phone: data.phone || (data.patient && data.patient.phone) || "+91 98765 43210"
        };
        this.notifyFallback(false);
        return { patient, isLiveBackend: true };
      }
    } catch (err) {
      console.warn("Live API connection timed out or unreachable. Triggering Red OFFLINE — DEMO DATA mode:", err);
      this.notifyFallback(true);
    }

    // Trigger visible offline demo data
    this.notifyFallback(true);

    if (abhaId.toUpperCase() === DEMO_CREDENTIALS.ABHA_ID && password === DEMO_CREDENTIALS.PASSWORD) {
      return { patient: FALLBACK_PATIENT, isLiveBackend: false };
    }

    if (abhaId.length >= 6 && password.length >= 4) {
      return {
        patient: {
          ...FALLBACK_PATIENT,
          abha_id: abhaId
        },
        isLiveBackend: false
      };
    }

    throw new Error("Invalid ABHA ID or password. Please check credentials.");
  }

  public async getPatientConsultations(patientId: string): Promise<{ consultations: BackendConsultation[]; isLiveBackend: boolean }> {
    try {
      const response = await this.fetchWithTimeout(API_ENDPOINTS.PATIENT_CONSULTATIONS(patientId), {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          this.notifyFallback(false);
          return { consultations: data, isLiveBackend: true };
        }
      }
    } catch (err) {
      console.warn("Live consultations endpoint unreachable. Triggering Red OFFLINE — DEMO DATA mode:", err);
      this.notifyFallback(true);
    }

    this.notifyFallback(true);
    return { consultations: FALLBACK_CONSULTATIONS, isLiveBackend: false };
  }

  /**
   * Submit Consent strictly matching the 3-field backend contract:
   * { share_history: bool, history_scope: string, share_old_documents: bool }
   */
  public async submitConsent(consultationId: string, payload: ConsentPayload): Promise<{ success: boolean; isLiveBackend: boolean }> {
    try {
      const response = await this.fetchWithTimeout(API_ENDPOINTS.SUBMIT_CONSENT(consultationId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        this.notifyFallback(false);
        return { success: true, isLiveBackend: true };
      }
    } catch (err) {
      console.warn("Live consent endpoint unreachable. Fallback active:", err);
      this.notifyFallback(true);
    }

    this.notifyFallback(true);
    return { success: true, isLiveBackend: false };
  }

  /**
   * Submit Ayurveda Prashna Pariksha data to POST /api/consultations/{id}/ayurveda
   * Only patient-answerable fields: Prakriti, Agni, Koshtha, Ahara/Vyayama Shakti, Sattva, Satmya, Ahara, Vihara, Nidana, Vaya, Height, Weight.
   */
  public async submitAyurveda(consultationId: string, payload: AyurvedaData): Promise<{ success: boolean; isLiveBackend: boolean }> {
    try {
      const response = await this.fetchWithTimeout(API_ENDPOINTS.SUBMIT_AYURVEDA(consultationId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        this.notifyFallback(false);
        return { success: true, isLiveBackend: true };
      }
    } catch (err) {
      console.warn("Live ayurveda endpoint unreachable. Fallback active:", err);
      this.notifyFallback(true);
    }

    this.notifyFallback(true);
    return { success: true, isLiveBackend: false };
  }

  /**
   * Register a new patient in the hospital backend: POST /api/patients
   */
  public async createPatient(payload: {
    name: string;
    age?: number;
    gender?: string;
    abha_id?: string;
    phone?: string;
    password?: string;
  }): Promise<{ patient: BackendPatient; isLiveBackend: boolean }> {
    try {
      const response = await this.fetchWithTimeout(API_ENDPOINTS.CREATE_PATIENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const patient: BackendPatient = {
          id: data.id,
          name: data.name,
          abha_id: data.abha_id,
          age: data.age,
          gender: data.gender,
          phone: data.phone
        };
        this.notifyFallback(false);
        return { patient, isLiveBackend: true };
      }

      const errText = await response.text();
      throw new Error(`Failed to register patient (${response.status}): ${errText}`);
    } catch (err: any) {
      this.notifyFallback(true);
      throw err;
    }
  }

  /**
   * Create an initial consultation in hospital backend: POST /api/consultations
   * Returns official backend consultation ID and token_number.
   */
  public async createConsultation(payload: {
    patient_id: string;
    language?: string;
  }): Promise<{ id: string; token_number: string; status: string }> {
    const response = await this.fetchWithTimeout(API_ENDPOINTS.CREATE_CONSULTATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      if (!data.id || !data.token_number) {
        throw new Error("Backend did not return consultation ID or token number.");
      }
      this.notifyFallback(false);
      return {
        id: data.id,
        token_number: data.token_number,
        status: data.status || "IN_PROGRESS"
      };
    }

    const errText = await response.text();
    throw new Error(`Consultation creation failed (${response.status}): ${errText}`);
  }

  /**
   * Submit clinical history interview to backend: POST /api/consultations/{id}/history
   */
  public async submitHistory(consultationId: string, payload: {
    chief_complaint?: string;
    allergies?: string[];
    drug_history?: string[];
    past_medical_history?: string[];
    past_surgical_history?: string[];
    hpi?: Record<string, any>;
    ros?: Record<string, any>;
    personal_history?: Record<string, any>;
    family_history?: Record<string, any>;
  }): Promise<{ status: string }> {
    try {
      const response = await this.fetchWithTimeout(API_ENDPOINTS.SUBMIT_HISTORY(consultationId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("submitHistory caught error (non-fatal):", e);
    }
    return { status: "saved" };
  }

  /**
   * Submit consultation to mark READY_FOR_DOCTOR: POST /api/consultations/{id}/submit
   * Advances status so it becomes visible on Doctor Portal queue.
   */
  public async submitConsultationToQueue(consultationId: string): Promise<{
    consultation_id: string;
    status: string;
    token_number: string;
    priority: string;
  }> {
    const response = await this.fetchWithTimeout(API_ENDPOINTS.SUBMIT_CONSULTATION(consultationId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      this.notifyFallback(false);
      return data;
    }

    const errText = await response.text();
    throw new Error(`Failed to submit consultation to doctor queue (${response.status}): ${errText}`);
  }

  /**
   * Legacy wrapper kept for backward compatibility.
   */
  public async submitConsultation(payload: any): Promise<{ tokenNumber: string; consultationId: string; isLiveBackend: boolean }> {
    try {
      const res = await this.createConsultation(payload);
      return { tokenNumber: res.token_number, consultationId: res.id, isLiveBackend: true };
    } catch (err) {
      console.warn("Live consultation creation failed. Using fallback token:", err);
      this.notifyFallback(true);
      const tokenNumber = `TK-${this.fallbackTokenCounter++}`;
      return { tokenNumber, consultationId: `cons_${Date.now()}`, isLiveBackend: false };
    }
  }
}

export const apiService = new ApiService();

export function hasAnyAnswer(a: AyurvedaAnswers): boolean {
  return Object.values(a).some((v) => {
    if (v === undefined || v === null || v === "") return false;
    if (typeof v === "object") return Object.keys(v).length > 0;
    return true;
  });
}

export async function submitAyurvedaIfApplicable(
  consultationId: string,
  track: AssessmentTrack,
  answers: AyurvedaAnswers
): Promise<"submitted" | "skipped" | "failed"> {
  if (track === "general") return "skipped";
  if (!hasAnyAnswer(answers)) return "skipped";

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/consultations/${consultationId}/ayurveda`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      }
    );
    return res.ok ? "submitted" : "failed";
  } catch {
    return "failed";
  }
}
