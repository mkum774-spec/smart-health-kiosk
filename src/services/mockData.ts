import { ABHAPatient, Department, EmergencyRequest, HistoricalDocument, PatientRegistration, ScannedDocument } from '../types';

export const PRESET_PATIENTS: ABHAPatient[] = [
  {
    abhaNumber: "14-2394-8192-3041",
    abhaAddress: "demo.patient.p001@abdm",
    name: "Demo Patient P001",
    nameHi: "डेमो पेशेंट P001",
    age: 52,
    gender: "FEMALE",
    phone: "+91 98765 43210",
    district: "South Delhi",
    state: "Delhi",
  },
  {
    abhaNumber: "14-9842-1209-7741",
    abhaAddress: "priya.sharma@abdm",
    name: "Priya Sharma",
    nameHi: "प्रिया शर्मा",
    age: 29,
    gender: "FEMALE",
    phone: "+91 98112 34567",
    district: "Jaipur",
    state: "Rajasthan",
  },
  {
    abhaNumber: "14-5561-9023-4122",
    abhaAddress: "amit.verma@abdm",
    name: "Amit Verma",
    nameHi: "अमित वर्मा",
    age: 58,
    gender: "MALE",
    phone: "+91 94150 99887",
    district: "Lucknow",
    state: "Uttar Pradesh",
  },
  {
    abhaNumber: "14-3312-8874-9090",
    abhaAddress: "neha.singh@abdm",
    name: "Neha Singh",
    nameHi: "नेहा सिंह",
    age: 24,
    gender: "FEMALE",
    phone: "+91 97711 22334",
    district: "Patna",
    state: "Bihar",
  }
];

export const MOCK_HISTORICAL_RECORDS: HistoricalDocument[] = [
  // June 2026
  {
    id: "hist-1",
    title: "Complete Blood Count (CBC) Report",
    titleHi: "सीबीसी (CBC) रक्त जांच रिपोर्ट",
    category: "Blood Test Reports",
    categoryHi: "रक्त परीक्षण रिपोर्ट",
    monthYear: "June 2026",
    dateFormatted: "12 June 2026",
    doctorOrLab: "Central Diagnostic Lab",
    summary: "Hemoglobin 14.2 g/dL, WBC count normal, Platelets 240,000 /mcL"
  },
  {
    id: "hist-2",
    title: "Lipid Profile Test",
    titleHi: "लिपिड प्रोफाइल परीक्षण",
    category: "Blood Test Reports",
    categoryHi: "रक्त परीक्षण रिपोर्ट",
    monthYear: "June 2026",
    dateFormatted: "12 June 2026",
    doctorOrLab: "Central Diagnostic Lab",
    summary: "Total Cholesterol 185 mg/dL, Triglycerides 142 mg/dL, HDL 48 mg/dL"
  },
  {
    id: "hist-3",
    title: "Fasting Blood Glucose",
    titleHi: "फास्टिंग ब्लड ग्लूकोज",
    category: "Blood Test Reports",
    categoryHi: "रक्त परीक्षण रिपोर्ट",
    monthYear: "June 2026",
    dateFormatted: "20 June 2026",
    doctorOrLab: "Community Health Center",
    summary: "Fasting blood sugar 98 mg/dL (Normal reference range)"
  },
  {
    id: "hist-4",
    title: "General OPD Prescription",
    titleHi: "सामान्य ओपीडी पर्चा",
    category: "Prescriptions",
    categoryHi: "चिकित्सकीय पर्चे",
    monthYear: "June 2026",
    dateFormatted: "05 June 2026",
    doctorOrLab: "Dr. K. S. Murthy (Internal Medicine)",
    summary: "Tab Pantoprazole 40mg OD, Tab Paracetamol 650mg SOS"
  },
  {
    id: "hist-5",
    title: "Cardiology Consultation Prescription",
    titleHi: "हृदय रोग परामर्श पर्चा",
    category: "Prescriptions",
    categoryHi: "चिकित्सकीय पर्चे",
    monthYear: "June 2026",
    dateFormatted: "18 June 2026",
    doctorOrLab: "Dr. S. K. Aggarwal (Cardiology)",
    summary: "Tab Telmisartan 40mg OD, Lifestyle modification advice"
  },
  {
    id: "hist-6",
    title: "Chest X-Ray PA View",
    titleHi: "छाती का एक्स-रे (PA View)",
    category: "Diagnostic Reports",
    categoryHi: "डायग्नोस्टिक रिपोर्ट",
    monthYear: "June 2026",
    dateFormatted: "10 June 2026",
    doctorOrLab: "District Hospital Radiology Dept",
    summary: "Bilateral lung fields clear. Normal cardiac contour."
  },
  {
    id: "hist-7",
    title: "12-Lead Electrocardiogram (ECG)",
    titleHi: "ईसीजी (12-Lead ECG)",
    category: "Diagnostic Reports",
    categoryHi: "डायग्नोस्टिक रिपोर्ट",
    monthYear: "June 2026",
    dateFormatted: "10 June 2026",
    doctorOrLab: "District Hospital Emergency",
    summary: "Normal sinus rhythm. No acute ST-T changes observed."
  },

  // July 2026
  {
    id: "hist-8",
    title: "Hypertension Follow-Up Prescription",
    titleHi: "उच्च रक्तचाप फॉलो-अप पर्चा",
    category: "Prescriptions",
    categoryHi: "चिकित्सकीय पर्चे",
    monthYear: "July 2026",
    dateFormatted: "22 July 2026",
    doctorOrLab: "Dr. K. S. Murthy (Internal Medicine)",
    summary: "Continue Tab Telmisartan 40mg. Blood pressure well-controlled at 124/82 mmHg."
  },

  // August 2026
  {
    id: "hist-9",
    title: "HbA1c & Serum Creatinine Panel",
    titleHi: "एचबीए1सी (HbA1c) एवं सीरम क्रिएटिनिन",
    category: "Lab Reports",
    categoryHi: "प्रयोगशाला रिपोर्ट",
    monthYear: "August 2026",
    dateFormatted: "15 August 2026",
    doctorOrLab: "National Pathology Center",
    summary: "HbA1c: 5.8% (Non-diabetic range), Serum Creatinine: 0.92 mg/dL"
  },
  {
    id: "hist-10",
    title: "Thyroid Stimulating Hormone (TSH)",
    titleHi: "थायराइड जांच (TSH)",
    category: "Lab Reports",
    categoryHi: "प्रयोगशाला रिपोर्ट",
    monthYear: "August 2026",
    dateFormatted: "28 August 2026",
    doctorOrLab: "National Pathology Center",
    summary: "TSH: 2.45 µIU/mL (Euthyroid baseline)"
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: "dep-casualty",
    name: "Casualty / Emergency",
    nameHi: "आपातकालीन वार्ड (कैजुअल्टी)",
    code: "CAS",
    totalCapacity: 25,
    currentActive: 8,
    rooms: [
      { roomNumber: "Room C-01", doctorName: "Dr. Vikram Seth (Casualty Lead)", status: "ACTIVE", currentQueueCount: 2 },
      { roomNumber: "Room C-02", doctorName: "Dr. Sunita Rao (Emergency Trauma)", status: "ACTIVE", currentQueueCount: 3 }
    ]
  },
  {
    id: "dep-medicine",
    name: "General Medicine",
    nameHi: "सामान्य चिकित्सा (General Medicine)",
    code: "MED",
    totalCapacity: 80,
    currentActive: 34,
    rooms: [
      { roomNumber: "Room 201", doctorName: "Dr. R. K. Choudhary", status: "ACTIVE", currentQueueCount: 8 },
      { roomNumber: "Room 202", doctorName: "Dr. Ananya Sen", status: "ACTIVE", currentQueueCount: 5 },
      { roomNumber: "Room 204", doctorName: "Dr. Rajesh Gupta", status: "ACTIVE", currentQueueCount: 6 }
    ]
  },
  {
    id: "dep-priority-opd",
    name: "Priority OPD",
    nameHi: "प्राथमिकता ओपीडी (Priority OPD)",
    code: "PRI",
    totalCapacity: 40,
    currentActive: 12,
    rooms: [
      { roomNumber: "Room 105", doctorName: "Dr. Meenakshi Joshi", status: "ACTIVE", currentQueueCount: 4 },
      { roomNumber: "Room 106", doctorName: "Dr. Alok Verma", status: "ACTIVE", currentQueueCount: 3 }
    ]
  },
  {
    id: "dep-ent",
    name: "ENT & Head-Neck",
    nameHi: "कान, नाक एवं गला विभाग (ENT)",
    code: "ENT",
    totalCapacity: 45,
    currentActive: 19,
    rooms: [
      { roomNumber: "Room 108", doctorName: "Dr. Sandeep Nair", status: "ACTIVE", currentQueueCount: 7 }
    ]
  },
  {
    id: "dep-ortho",
    name: "Orthopedics",
    nameHi: "हड्डी रोग विभाग (Orthopedics)",
    code: "ORT",
    totalCapacity: 50,
    currentActive: 21,
    rooms: [
      { roomNumber: "Room 302", doctorName: "Dr. Harpreet Singh", status: "ACTIVE", currentQueueCount: 8 }
    ]
  },
  {
    id: "dep-peds",
    name: "Pediatrics",
    nameHi: "बाल रोग विभाग (Pediatrics)",
    code: "PED",
    totalCapacity: 40,
    currentActive: 14,
    rooms: [
      { roomNumber: "Room 112", doctorName: "Dr. Vandana Saxena", status: "ACTIVE", currentQueueCount: 5 }
    ]
  }
];

export const INITIAL_EMERGENCY_REQUESTS: EmergencyRequest[] = [
  {
    id: "emg-101",
    tokenNumber: "E-101",
    kioskId: "Kiosk 01",
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    timeFormatted: "10:28 AM",
    status: "ACCEPTED_CASUALTY",
    patientName: "Manoj Tiwari",
    reportedSymptoms: "Acute respiratory distress & sweating",
    assignedRoom: "Casualty Room C-01",
    respondedBy: "Dr. Vikram Seth",
    responseTime: "10:30 AM"
  },
  {
    id: "emg-102",
    tokenNumber: "E-102",
    kioskId: "Kiosk 02",
    timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    timeFormatted: "10:36 AM",
    status: "REDIRECTED_PRIORITY",
    patientName: "Kamlesh Devi",
    reportedSymptoms: "Severe migraine and vomiting (vitals stable)",
    assignedRoom: "Priority OPD Room 105",
    respondedBy: "Nurse Incharge Rashmi",
    responseTime: "10:38 AM"
  }
];

export const INITIAL_QUEUE: PatientRegistration[] = [
  {
    id: "reg-1",
    tokenNumber: "TK-1001",
    patient: {
      abhaNumber: "14-8899-7711-2233",
      abhaAddress: "surendra.m@abdm",
      name: "Surendra Mishra",
      nameHi: "सुरेंद्र मिश्रा",
      age: 61,
      gender: "MALE",
      phone: "+91 99100 88221",
      district: "East Delhi",
      state: "Delhi"
    },
    symptomsText: "High blood pressure follow-up and intermittent headaches for 4 days.",
    symptomsDuration: "1 - 3 days",
    vitals: {
      heightCm: 168,
      weightKg: 78,
      bmi: 27.6,
    },
    history: {
      allergies: ["Sulfa Drugs"],
      chronicConditions: ["Hypertension (High BP)"],
      currentMedications: ["Amlodipine 5mg OD"],
      hasNoKnownAllergies: false
    },
    documents: [],
    triageLevel: "MODERATE",
    departmentId: "dep-medicine",
    departmentName: "General Medicine",
    assignedRoom: "Room 204",
    queuePosition: 1,
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    status: "IN_CONSULTATION"
  },
  {
    id: "reg-2",
    tokenNumber: "TK-1002",
    patient: {
      abhaNumber: "14-1122-3344-5566",
      abhaAddress: "savita.d@abdm",
      name: "Savita Devi",
      nameHi: "सविता देवी",
      age: 52,
      gender: "FEMALE",
      phone: "+91 98711 00223",
      district: "Ghaziabad",
      state: "Uttar Pradesh"
    },
    symptomsText: "Joint pain in both knees, difficulty walking upstairs.",
    symptomsDuration: "More than a week",
    vitals: {
      heightCm: 155,
      weightKg: 64,
      bmi: 26.6,
    },
    history: {
      allergies: [],
      chronicConditions: ["Type 2 Diabetes"],
      currentMedications: ["Metformin 500mg BD"],
      hasNoKnownAllergies: true
    },
    documents: [],
    triageLevel: "ROUTINE",
    departmentId: "dep-ortho",
    departmentName: "Orthopedics",
    assignedRoom: "Room 302",
    queuePosition: 2,
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    status: "CALLED"
  },
  {
    id: "reg-3",
    tokenNumber: "TK-1003",
    patient: {
      abhaNumber: "14-4455-6677-8899",
      abhaAddress: "mohd.arif@abdm",
      name: "Mohd. Arif",
      nameHi: "मोहम्मद आरिफ़",
      age: 36,
      gender: "MALE",
      phone: "+91 98102 33445",
      district: "Noida",
      state: "Uttar Pradesh"
    },
    symptomsText: "Throat irritation, ear pain radiating to jaw.",
    symptomsDuration: "1 - 3 days",
    vitals: {
      heightCm: 172,
      weightKg: 70,
      bmi: 23.7,
    },
    history: {
      allergies: ["Penicillin"],
      chronicConditions: [],
      currentMedications: [],
      hasNoKnownAllergies: false
    },
    documents: [],
    triageLevel: "ROUTINE",
    departmentId: "dep-ent",
    departmentName: "ENT & Head-Neck",
    assignedRoom: "Room 108",
    queuePosition: 3,
    timestamp: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
    status: "WAITING"
  }
];

export const MOCK_OCR_PRESETS: ScannedDocument[] = [
  {
    id: "ocr-doc-1",
    type: "Prescription",
    date: "2026-02-18",
    doctorName: "Dr. K. S. Murthy (Internal Medicine)",
    medicinesExtracted: [
      { name: "Tab Telmisartan", dosage: "40 mg", frequency: "Once Daily (Morning)" },
      { name: "Tab Metformin HCl", dosage: "500 mg", frequency: "Twice Daily with meals" },
      { name: "Tab Pantoprazole", dosage: "40 mg", frequency: "Once Daily Before Breakfast" }
    ],
    summary: "Follow-up advice for essential hypertension and glycemic management."
  },
  {
    id: "ocr-doc-2",
    type: "Lab Report",
    date: "12 June 2026",
    doctorName: "Central Diagnostic Lab",
    medicinesExtracted: [
      { name: "Complete Blood Count", dosage: "Hb 14.2 g/dL", frequency: "Normal Range" },
      { name: "Platelet Count", dosage: "240,000 /mcL", frequency: "Adequate" }
    ],
    summary: "Complete Blood Count (CBC) Report — June 2026"
  }
];
