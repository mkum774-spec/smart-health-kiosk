// Global API Configuration
// All backend endpoints use this single config constant for a one-line fix.

export const API_BASE_URL = "https://sih26047-backend.onrender.com";

export const API_ENDPOINTS = {
  PATIENT_LOGIN: `${API_BASE_URL}/api/patients/login`,
  CREATE_PATIENT: `${API_BASE_URL}/api/patients`,
  PATIENT_CONSULTATIONS: (patientId: string) => `${API_BASE_URL}/api/patients/${patientId}/consultations`,
  PATIENT_BY_ID: (patientId: string) => `${API_BASE_URL}/api/patients/${patientId}`,
  CREATE_CONSULTATION: `${API_BASE_URL}/api/consultations`,
  GET_CONSULTATION: (consultationId: string) => `${API_BASE_URL}/api/consultations/${consultationId}`,
  SUBMIT_CONSULTATION: (consultationId: string) => `${API_BASE_URL}/api/consultations/${consultationId}/submit`,
  CONSULTATION_TIMELINE: (consultationId: string) => `${API_BASE_URL}/api/consultations/${consultationId}/timeline`,
  SUBMIT_HISTORY: (consultationId: string) => `${API_BASE_URL}/api/consultations/${consultationId}/history`,
  SUBMIT_CONSENT: (consultationId: string) => `${API_BASE_URL}/api/consultations/${consultationId}/consent`,
  SUBMIT_AYURVEDA: (consultationId: string) => `${API_BASE_URL}/api/consultations/${consultationId}/ayurveda`,
  DOCTOR_CONSULTATIONS: `${API_BASE_URL}/api/doctor/consultations`,
  UPLOAD_DOCUMENT: (consultationId: string) => `${API_BASE_URL}/api/consultations/${consultationId}/documents`,
  MOCK_ABHA: (abhaId: string) => `${API_BASE_URL}/api/mock/abha/${abhaId}`,
  HEALTH_CHECK: `${API_BASE_URL}/docs`,
};

export const DEMO_CREDENTIALS = {
  ABHA_ID: "DEMO-ABHA-P001",
  PASSWORD: "demo123"
};
