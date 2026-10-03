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
  ABHAPatient
} from '../types';

export const PATIENT_PRIYA_SHARMA: ABHAPatient = {
  abhaNumber: "14-9842-1209-7741",
  abhaAddress: "priya.sharma@abdm",
  name: "Priya Sharma",
  nameHi: "प्रिया शर्मा",
  age: 29,
  gender: "FEMALE",
  phone: "+91 98112 34567",
  district: "Jaipur",
  state: "Rajasthan",
};

export const MOCK_APPOINTMENTS: PatientAppointment[] = [
  {
    id: "apt-101",
    doctorName: "Dr. R. Mehta",
    doctorSpecialty: "General Physician",
    department: "General Medicine",
    hospitalName: "District Civil Hospital",
    date: "10 Oct 2026",
    time: "11:30 AM",
    room: "Room 204",
    status: "UPCOMING",
    consultationType: "OPD_VISIT",
    preparationNotes: "Please bring your recent blood test report and previous prescription slip.",
    tokenNumber: "TK-1004"
  },
  {
    id: "apt-102",
    doctorName: "Dr. S. K. Aggarwal",
    doctorSpecialty: "Consultant Cardiologist",
    department: "Cardiology",
    hospitalName: "District Civil Hospital",
    date: "18 June 2026",
    time: "10:15 AM",
    room: "Room 105",
    status: "COMPLETED",
    consultationType: "FOLLOW_UP",
    preparationNotes: "Blood pressure evaluation and review of 12-lead ECG.",
    tokenNumber: "TK-1002"
  },
  {
    id: "apt-103",
    doctorName: "Dr. K. S. Murthy",
    doctorSpecialty: "Senior Physician",
    department: "General Medicine",
    hospitalName: "Community Health Center",
    date: "05 June 2026",
    time: "09:45 AM",
    room: "Room 201",
    status: "COMPLETED",
    consultationType: "OPD_VISIT",
    tokenNumber: "TK-1001"
  }
];

export const MOCK_PATIENT_REPORTS: PatientReport[] = [
  {
    id: "rep-001",
    title: "Complete Blood Count (CBC) Panel",
    titleHi: "सीबीसी (CBC) रक्त जांच रिपोर्ट",
    category: "Lab Reports",
    date: "12 June 2026",
    hospitalOrLab: "Central Diagnostic Lab, Civil Hospital",
    doctorName: "Dr. K. S. Murthy",
    summary: "Hemoglobin 14.2 g/dL (Normal). Platelets and white cell differential count within healthy physiological limits.",
    originalDocumentUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800' fill='none'><rect width='600' height='800' fill='%23ffffff'/><rect x='30' y='30' width='540' height='740' rx='8' stroke='%23cbd5e1' stroke-width='2' fill='%23fafafa'/><rect x='50' y='50' width='500' height='70' rx='4' fill='%230f766e'/><text x='70' y='85' fill='%23ffffff' font-family='sans-serif' font-size='20' font-weight='bold'>CENTRAL DIAGNOSTIC PATHOLOGY LAB</text><text x='70' y='105' fill='%23ccfbf1' font-family='sans-serif' font-size='12'>NABL Accredited • Civil Hospital Campus • Ph: 0141-2567890</text><line x1='50' y1='140' x2='550' y2='140' stroke='%2394a3b8' stroke-width='1'/><text x='50' y='165' fill='%23334155' font-family='sans-serif' font-size='12' font-weight='bold'>Patient Name: Priya Sharma</text><text x='350' y='165' fill='%23334155' font-family='sans-serif' font-size='12'>Age / Gender: 29 Y / Female</text><text x='50' y='185' fill='%23334155' font-family='sans-serif' font-size='12'>ABHA ID: 14-9842-1209-7741</text><text x='350' y='185' fill='%23334155' font-family='sans-serif' font-size='12'>Date: 12-Jun-2026</text><text x='50' y='205' fill='%23334155' font-family='sans-serif' font-size='12'>Ref. Doctor: Dr. K. S. Murthy</text><text x='350' y='205' fill='%23334155' font-family='sans-serif' font-size='12'>Sample: Whole Blood EDTA</text><rect x='50' y='230' width='500' height='32' fill='%23e2e8f0'/><text x='65' y='251' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>TEST NAME</text><text x='250' y='251' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>RESULT</text><text x='370' y='251' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>UNITS</text><text x='460' y='251' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>REFERENCE</text><text x='65' y='290' fill='%23334155' font-family='sans-serif' font-size='12'>Hemoglobin (Hb)</text><text x='250' y='290' fill='%230f766e' font-family='sans-serif' font-size='12' font-weight='bold'>14.2</text><text x='370' y='290' fill='%2364748b' font-family='sans-serif' font-size='12'>g/dL</text><text x='460' y='290' fill='%2364748b' font-family='sans-serif' font-size='12'>12.0 - 15.5</text><line x1='50' y1='305' x2='550' y2='305' stroke='%23e2e8f0'/><text x='65' y='330' fill='%23334155' font-family='sans-serif' font-size='12'>Total Leucocyte Count (TLC)</text><text x='250' y='330' fill='%230f766e' font-family='sans-serif' font-size='12' font-weight='bold'>7,200</text><text x='370' y='330' fill='%2364748b' font-family='sans-serif' font-size='12'>/mcL</text><text x='460' y='330' fill='%2364748b' font-family='sans-serif' font-size='12'>4,000 - 11,000</text><line x1='50' y1='345' x2='550' y2='345' stroke='%23e2e8f0'/><text x='65' y='370' fill='%23334155' font-family='sans-serif' font-size='12'>Platelet Count</text><text x='250' y='370' fill='%230f766e' font-family='sans-serif' font-size='12' font-weight='bold'>2,40,000</text><text x='370' y='370' fill='%2364748b' font-family='sans-serif' font-size='12'>/mcL</text><text x='460' y='370' fill='%2364748b' font-family='sans-serif' font-size='12'>1,50,000 - 4,50,000</text><line x1='50' y1='385' x2='550' y2='385' stroke='%23e2e8f0'/><text x='65' y='410' fill='%23334155' font-family='sans-serif' font-size='12'>RBC Count</text><text x='250' y='410' fill='%230f766e' font-family='sans-serif' font-size='12' font-weight='bold'>4.7</text><text x='370' y='410' fill='%2364748b' font-family='sans-serif' font-size='12'>mill/mcL</text><text x='460' y='410' fill='%2364748b' font-family='sans-serif' font-size='12'>3.8 - 5.2</text><rect x='50' y='460' width='500' height='70' rx='4' fill='%23f0fdf4' stroke='%23bbf7d0'/><text x='65' y='485' fill='%23166534' font-family='sans-serif' font-size='12' font-weight='bold'>IMPRESSION:</text><text x='65' y='505' fill='%2315803d' font-family='sans-serif' font-size='11'>Normocytic normochromic blood picture. All key indices within standard physiological limits.</text><text x='400' y='720' fill='%23334155' font-family='sans-serif' font-size='11' font-weight='bold'>Dr. N. K. Mathur</text><text x='400' y='735' fill='%2364748b' font-family='sans-serif' font-size='10'>Consultant Pathologist (MD)</text></svg>",
    extractedValues: [
      { name: "Hemoglobin", value: "14.2", unit: "g/dL", referenceRange: "12.0 - 15.5", status: "NORMAL" },
      { name: "Total Leucocyte Count (WBC)", value: "7,200", unit: "/mcL", referenceRange: "4,000 - 11,000", status: "NORMAL" },
      { name: "Platelet Count", value: "2,40,000", unit: "/mcL", referenceRange: "1,50,000 - 4,50,000", status: "NORMAL" },
      { name: "RBC Count", value: "4.7", unit: "mill/mcL", referenceRange: "3.8 - 5.2", status: "NORMAL" }
    ],
    aiExplanation: "Your blood count results are completely within normal, healthy limits. Your hemoglobin level (14.2 g/dL) indicates adequate oxygen-carrying capacity and no evidence of anemia. White blood cell count reflects a normal immune response without active acute infection.",
    aiExplanationHi: "आपकी रक्त जांच (सीबीसी) के सभी परिणाम सामान्य और स्वस्थ सीमा में हैं। हीमोग्लोबिन स्तर (14.2 g/dL) बिल्कुल ठीक है और एनीमिया का कोई संकेत नहीं है।",
    processingStatus: "PROCESSED",
    aiClassification: "Lab Reports",
    aiConfidence: "HIGH",
    isSharedForConsultation: false,
    fileName: "CBC_Panel_Jun2026.pdf",
    fileSize: "1.4 MB",
    documentDate: "12 June 2026",
    uploadDate: "12 June 2026"
  },
  {
    id: "rep-002",
    title: "Lipid Profile Panel",
    titleHi: "लिपिड प्रोफाइल परीक्षण",
    category: "Lab Reports",
    date: "12 June 2026",
    hospitalOrLab: "Central Diagnostic Lab, Civil Hospital",
    doctorName: "Dr. S. K. Aggarwal",
    summary: "Total Cholesterol 185 mg/dL (Desirable), Triglycerides 142 mg/dL (Normal), HDL Cholesterol 48 mg/dL.",
    originalDocumentUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800' fill='none'><rect width='600' height='800' fill='%23ffffff'/><rect x='30' y='30' width='540' height='740' rx='8' stroke='%23cbd5e1' stroke-width='2' fill='%23fafafa'/><rect x='50' y='50' width='500' height='70' rx='4' fill='%230f766e'/><text x='70' y='85' fill='%23ffffff' font-family='sans-serif' font-size='20' font-weight='bold'>BIOCHEMISTRY &amp; LIPID LAB</text><text x='70' y='105' fill='%23ccfbf1' font-family='sans-serif' font-size='12'>NABL Accredited • Civil Hospital Campus</text><text x='50' y='165' fill='%23334155' font-family='sans-serif' font-size='12' font-weight='bold'>Patient: Priya Sharma (29 Y/F)</text><text x='350' y='165' fill='%23334155' font-family='sans-serif' font-size='12'>Date: 12-Jun-2026</text><rect x='50' y='200' width='500' height='32' fill='%23e2e8f0'/><text x='65' y='221' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>PARAMETER</text><text x='250' y='221' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>VALUE</text><text x='350' y='221' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>UNITS</text><text x='450' y='221' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>TARGET</text><text x='65' y='260' fill='%23334155' font-family='sans-serif' font-size='12'>Total Cholesterol</text><text x='250' y='260' fill='%230f766e' font-family='sans-serif' font-size='12' font-weight='bold'>185</text><text x='350' y='260' fill='%2364748b' font-family='sans-serif' font-size='12'>mg/dL</text><text x='450' y='260' fill='%2364748b' font-family='sans-serif' font-size='12'>&lt; 200</text><text x='65' y='300' fill='%23334155' font-family='sans-serif' font-size='12'>Triglycerides</text><text x='250' y='300' fill='%230f766e' font-family='sans-serif' font-size='12' font-weight='bold'>142</text><text x='350' y='300' fill='%2364748b' font-family='sans-serif' font-size='12'>mg/dL</text><text x='450' y='300' fill='%2364748b' font-family='sans-serif' font-size='12'>&lt; 150</text><text x='65' y='340' fill='%23334155' font-family='sans-serif' font-size='12'>HDL Cholesterol (Good)</text><text x='250' y='340' fill='%230f766e' font-family='sans-serif' font-size='12' font-weight='bold'>48</text><text x='350' y='340' fill='%2364748b' font-family='sans-serif' font-size='12'>mg/dL</text><text x='450' y='340' fill='%2364748b' font-family='sans-serif' font-size='12'>&gt; 40</text><text x='65' y='380' fill='%23334155' font-family='sans-serif' font-size='12'>LDL Cholesterol (Calculated)</text><text x='250' y='380' fill='%230f766e' font-family='sans-serif' font-size='12' font-weight='bold'>108</text><text x='350' y='380' fill='%2364748b' font-family='sans-serif' font-size='12'>mg/dL</text><text x='450' y='380' fill='%2364748b' font-family='sans-serif' font-size='12'>&lt; 130</text></svg>",
    extractedValues: [
      { name: "Total Cholesterol", value: "185", unit: "mg/dL", referenceRange: "< 200", status: "NORMAL" },
      { name: "Triglycerides", value: "142", unit: "mg/dL", referenceRange: "< 150", status: "NORMAL" },
      { name: "HDL Cholesterol", value: "48", unit: "mg/dL", referenceRange: "> 40", status: "NORMAL" },
      { name: "LDL Cholesterol", value: "108", unit: "mg/dL", referenceRange: "< 130", status: "NORMAL" }
    ],
    aiExplanation: "Your cholesterol and blood fats are well balanced and in the healthy, desirable range. Continue your balanced dietary routine and regular light exercise.",
    aiExplanationHi: "आपका कोलेस्ट्रॉल और ट्राइग्लिसराइड्स बिल्कुल संतुलित और सुरक्षित स्तर में हैं। नियमित व्यायाम और संतुलित आहार जारी रखें।",
    processingStatus: "PROCESSED",
    aiClassification: "Lab Reports",
    aiConfidence: "HIGH",
    isSharedForConsultation: false,
    fileName: "Lipid_Profile_Jun2026.pdf",
    fileSize: "980 KB",
    documentDate: "12 June 2026",
    uploadDate: "12 June 2026"
  },
  {
    id: "rep-003",
    title: "Chest X-Ray (PA View)",
    titleHi: "छाती का डिजिटल एक्स-रे",
    category: "Imaging",
    date: "10 June 2026",
    hospitalOrLab: "Department of Radiodiagnosis, Civil Hospital",
    doctorName: "Dr. Sandeep Nair",
    summary: "Clear lung parenchyma bilaterally. Normal cardiac contour and cardiothoracic ratio. No pleural effusion or consolidation.",
    originalDocumentUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800' fill='none'><rect width='600' height='800' fill='%23020617'/><rect x='30' y='30' width='540' height='740' rx='8' stroke='%23334155' stroke-width='2' fill='%23090d16'/><text x='50' y='75' fill='%23f8fafc' font-family='sans-serif' font-size='18' font-weight='bold'>DIGITAL RADIOLOGY DEPT — CHEST X-RAY PA</text><text x='50' y='100' fill='%2394a3b8' font-family='sans-serif' font-size='12'>Civil Hospital • Patient: Priya Sharma (29Y/F) • Date: 10-Jun-2026</text><rect x='100' y='140' width='400' height='460' rx='12' fill='%231e293b' stroke='%23475569'/><path d='M 200 200 Q 180 320 220 450 Q 260 480 300 480 Q 340 480 380 450 Q 420 320 400 200 Z' fill='%230f172a' stroke='%2364748b' stroke-width='2'/><circle cx='285' cy='360' r='55' fill='%23334155' opacity='0.7'/><text x='255' y='550' fill='%2338bdf8' font-family='sans-serif' font-size='14' font-weight='bold'>LUNGS CLEAR</text><rect x='50' y='630' width='500' height='100' rx='6' fill='%230f172a' stroke='%23334155'/><text x='65' y='655' fill='%23f1f5f9' font-family='sans-serif' font-size='12' font-weight='bold'>FINDINGS &amp; CONCLUSION:</text><text x='65' y='675' fill='%23cbd5e1' font-family='sans-serif' font-size='11'>Trachea central. Bilateral lung fields normal without focal lesion.</text><text x='65' y='695' fill='%23cbd5e1' font-family='sans-serif' font-size='11'>Costophrenic angles and hemidiaphragms clear. Normal cardiac size.</text></svg>",
    extractedValues: [
      { name: "Lung Fields", value: "Clear bilaterally", status: "NORMAL" },
      { name: "Cardiac Shadow", value: "Normal size & contour", status: "NORMAL" },
      { name: "Pleural Spaces", value: "Free, no effusion", status: "NORMAL" },
      { name: "Bony Cage", value: "Intact ribs, normal ribs", status: "NORMAL" }
    ],
    aiExplanation: "The X-Ray demonstrates clear lungs with no signs of pneumonia, fluid accumulation, or enlargement of the heart silhouette.",
    aiExplanationHi: "एक्स-रे में फेफड़े पूरी तरह साफ दिखे हैं। कोई संक्रमण, कफ का जमाव या हृदय में असामान्यता नहीं पाई गई है।",
    processingStatus: "PROCESSED",
    aiClassification: "Imaging",
    aiConfidence: "HIGH",
    isSharedForConsultation: false,
    fileName: "Chest_XRay_PA_Jun2026.dcm.png",
    fileSize: "3.2 MB",
    documentDate: "10 June 2026",
    uploadDate: "10 June 2026"
  },
  {
    id: "rep-004",
    title: "Thyroid Stimulating Hormone (TSH)",
    titleHi: "थायराइड उत्तेजक हार्मोन (TSH)",
    category: "Lab Reports",
    date: "28 August 2026",
    hospitalOrLab: "National Pathology Center",
    doctorName: "Dr. K. S. Murthy",
    summary: "TSH level: 2.45 µIU/mL (Normal Reference Range: 0.4 - 4.5 µIU/mL).",
    extractedValues: [
      { name: "Serum TSH", value: "2.45", unit: "µIU/mL", referenceRange: "0.40 - 4.50", status: "NORMAL" }
    ],
    aiExplanation: "Your thyroid function test is strictly within the normal healthy range, indicating well-regulated metabolic function.",
    aiExplanationHi: "आपकी थायराइड ग्रंथि सामान्य रूप से काम कर रही है।",
    processingStatus: "PROCESSED",
    aiClassification: "Lab Reports",
    aiConfidence: "HIGH",
    isSharedForConsultation: false,
    fileName: "TSH_Report_Aug2026.pdf",
    fileSize: "720 KB",
    documentDate: "28 August 2026",
    uploadDate: "28 August 2026"
  },
  {
    id: "rep-005",
    title: "HbA1c Glycated Hemoglobin Test",
    titleHi: "ग्लाइकेटेड हीमोग्लोबिन (HbA1c) रिपोर्ट",
    category: "Lab Reports",
    date: "14 September 2026",
    hospitalOrLab: "District Hospital Pathology Lab",
    doctorName: "Dr. R. Mehta",
    summary: "HbA1c level: 6.4% (Target: < 6.5%). Optimal glycemic control maintained on current therapy.",
    originalDocumentUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750' fill='none'><rect width='600' height='750' fill='%23ffffff'/><rect x='30' y='30' width='540' height='690' rx='8' stroke='%23cbd5e1' stroke-width='2' fill='%23f8fafc'/><text x='60' y='75' fill='%230f766e' font-family='sans-serif' font-size='20' font-weight='bold'>DISTRICT CIVIL HOSPITAL — DIABETES CLINIC</text><text x='60' y='95' fill='%2364748b' font-family='sans-serif' font-size='12'>NABL Accredited • Patient: Priya Sharma (29Y/F) • Date: 14-Sep-2026</text><rect x='50' y='140' width='500' height='32' fill='%23e2e8f0'/><text x='65' y='161' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>TEST</text><text x='250' y='161' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>RESULT</text><text x='370' y='161' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>TARGET</text><text x='65' y='200' fill='%23334155' font-family='sans-serif' font-size='13'>HbA1c (Glycated Hb)</text><text x='250' y='200' fill='%230f766e' font-family='sans-serif' font-size='14' font-weight='bold'>6.4 %</text><text x='370' y='200' fill='%2364748b' font-family='sans-serif' font-size='13'>&lt; 6.5 %</text><text x='65' y='240' fill='%23334155' font-family='sans-serif' font-size='13'>Estimated Avg Glucose</text><text x='250' y='240' fill='%230f766e' font-family='sans-serif' font-size='14' font-weight='bold'>137 mg/dL</text><text x='370' y='240' fill='%2364748b' font-family='sans-serif' font-size='13'>&lt; 140 mg/dL</text><rect x='50' y='300' width='500' height='70' rx='6' fill='%23ecfdf5' stroke='%23a7f3d0'/><text x='65' y='325' fill='%23065f46' font-family='sans-serif' font-size='12' font-weight='bold'>CLINICAL IMPRESSION:</text><text x='65' y='345' fill='%23047857' font-family='sans-serif' font-size='11'>Optimal glycemic management. Continue lifestyle measures and Metformin 500mg OD.</text></svg>",
    extractedValues: [
      { name: "HbA1c", value: "6.4", unit: "%", referenceRange: "< 6.5", status: "NORMAL" },
      { name: "Estimated Avg Glucose", value: "137", unit: "mg/dL", referenceRange: "< 140", status: "NORMAL" }
    ],
    aiExplanation: "Your 3-month blood sugar average (HbA1c) is 6.4%, which reflects good metabolic control without acute risk.",
    aiExplanationHi: "आपकी तीन महीने की औसत शुगर (HbA1c) 6.4% है जो सुरक्षित और नियंत्रित है।",
    processingStatus: "PROCESSED",
    aiClassification: "Lab Reports",
    aiConfidence: "HIGH",
    isAiRecommended: true,
    isSharedForConsultation: true,
    fileName: "HbA1c_Panel_Sep2026.pdf",
    fileSize: "1.2 MB",
    documentDate: "14 September 2026",
    uploadDate: "14 September 2026"
  },
  {
    id: "rep-006",
    title: "Diabetes Management OPD Prescription",
    titleHi: "मधुमेह प्रबंधन ओपीडी पर्चा",
    category: "Prescriptions",
    date: "14 September 2026",
    hospitalOrLab: "District Civil Hospital",
    doctorName: "Dr. R. Mehta",
    summary: "Tab Metformin 500mg OD after dinner. Dietary moderation and quarterly HbA1c review.",
    originalDocumentUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='700' viewBox='0 0 600 700' fill='none'><rect width='600' height='700' fill='%23ffffff'/><rect x='30' y='30' width='540' height='640' rx='6' stroke='%23cbd5e1' stroke-width='2' fill='%23fefefe'/><text x='60' y='75' fill='%230f766e' font-family='serif' font-size='22' font-weight='bold'>DISTRICT CIVIL HOSPITAL — OPD</text><text x='60' y='95' fill='%2364748b' font-family='sans-serif' font-size='12'>Dept of Endocrinology &amp; Medicine</text><line x1='50' y1='115' x2='550' y2='115' stroke='%230f766e' stroke-width='2'/><text x='60' y='145' fill='%231e293b' font-family='sans-serif' font-size='13'>Rx Date: 14-Sep-2026 • Patient: Priya Sharma (29 Y/F)</text><text x='60' y='190' fill='%230f766e' font-family='serif' font-size='28' font-style='italic' font-weight='bold'>Rx</text><text x='95' y='230' fill='%230f172a' font-family='sans-serif' font-size='14' font-weight='bold'>1. Tab Metformin 500 mg (SR)</text><text x='110' y='250' fill='%23475569' font-family='sans-serif' font-size='12'>Sig: 1 Tab Once Daily after dinner x 90 Days</text><text x='400' y='580' fill='%231e293b' font-family='sans-serif' font-size='12' font-weight='bold'>Dr. R. Mehta</text><text x='400' y='598' fill='%2364748b' font-family='sans-serif' font-size='11'>MD (Medicine), Reg: RMC-39102</text></svg>",
    processingStatus: "PROCESSED",
    aiClassification: "Prescriptions",
    aiConfidence: "HIGH",
    isAiRecommended: true,
    isSharedForConsultation: true,
    fileName: "Prescription_Metformin_Sep2026.pdf",
    fileSize: "840 KB",
    documentDate: "14 September 2026",
    uploadDate: "14 September 2026"
  },
  {
    id: "rep-007",
    title: "Discharge Summary — Day Care Procedure",
    titleHi: "डिस्चार्ज सारांश — डे-केयर प्रक्रिया",
    category: "Discharge Summaries",
    date: "20 January 2026",
    hospitalOrLab: "Apex Multi-Speciality Hospital",
    doctorName: "Dr. Vikram Seth",
    summary: "Diagnostic Nasal Endoscopy performed. Mild allergic mucosal hypertrophy noted. Uneventful recovery and discharged in stable condition.",
    originalDocumentUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750' fill='none'><rect width='600' height='750' fill='%23ffffff'/><rect x='30' y='30' width='540' height='690' rx='8' stroke='%23cbd5e1' stroke-width='2' fill='%23fafafa'/><text x='60' y='75' fill='%230f766e' font-family='sans-serif' font-size='20' font-weight='bold'>APEX MULTI-SPECIALITY HOSPITAL</text><text x='60' y='95' fill='%2364748b' font-family='sans-serif' font-size='12'>Day Care ENT Unit • Patient: Priya Sharma • 20-Jan-2026</text><rect x='50' y='130' width='500' height='30' fill='%23e2e8f0'/><text x='65' y='151' fill='%230f172a' font-family='sans-serif' font-size='12' font-weight='bold'>DISCHARGE SUMMARY</text><text x='65' y='190' fill='%23334155' font-family='sans-serif' font-size='12'>Diagnosis: Mild Allergic Rhinitis &amp; Turbinate Hypertrophy</text><text x='65' y='215' fill='%23334155' font-family='sans-serif' font-size='12'>Procedure: Diagnostic Nasal Endoscopy (Day Care)</text><text x='65' y='240' fill='%23334155' font-family='sans-serif' font-size='12'>Condition at Discharge: Hemodynamically stable, afebrile, alert</text></svg>",
    processingStatus: "PROCESSED",
    aiClassification: "Discharge Summaries",
    aiConfidence: "HIGH",
    isAiRecommended: false,
    isSharedForConsultation: false,
    fileName: "Discharge_Summary_Apex_Jan2026.pdf",
    fileSize: "2.1 MB",
    documentDate: "20 January 2026",
    uploadDate: "22 January 2026"
  }
];

export const MOCK_PRESCRIPTIONS: PatientPrescription[] = [
  {
    id: "rx-201",
    consultationId: "cons_001",
    doctorName: "Dr. K. S. Murthy",
    department: "General Medicine",
    hospitalName: "District Civil Hospital",
    date: "05 June 2026",
    diagnosisSummary: "Mild seasonal upper respiratory discomfort & transient gastritis.",
    medicines: [
      {
        name: "Tab Pantoprazole 40mg",
        dosage: "1 Tablet",
        frequency: "Once Daily (Morning)",
        frequencyHi: "सुबह खाली पेट",
        instructions: "Take 30 minutes before breakfast with plain water",
        instructionsHi: "नाश्ते से आधा घंटा पहले सादे पानी से लें",
        duration: "14 days"
      },
      {
        name: "Tab Paracetamol 650mg",
        dosage: "1 Tablet",
        frequency: "SOS (When needed)",
        frequencyHi: "जरूरत पड़ने पर",
        instructions: "Take after meals if body ache or mild fever develops",
        instructionsHi: "दर्द या हल्का बुखार होने पर भोजन के बाद लें",
        duration: "5 days as needed"
      }
    ],
    originalDocumentUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='700' viewBox='0 0 600 700' fill='none'><rect width='600' height='700' fill='%23ffffff'/><rect x='30' y='30' width='540' height='640' rx='6' stroke='%23cbd5e1' stroke-width='2' fill='%23fefefe'/><text x='60' y='75' fill='%230f766e' font-family='serif' font-size='22' font-weight='bold'>GOVT. DISTRICT CIVIL HOSPITAL</text><text x='60' y='95' fill='%2364748b' font-family='sans-serif' font-size='12'>Outpatient Prescription • Dept of General Medicine</text><line x1='50' y1='115' x2='550' y2='115' stroke='%230f766e' stroke-width='2'/><text x='60' y='140' fill='%231e293b' font-family='sans-serif' font-size='13'>Rx Date: 05-Jun-2026 • Patient: Priya Sharma (29 Y/F)</text><text x='60' y='190' fill='%230f766e' font-family='serif' font-size='28' font-style='italic' font-weight='bold'>Rx</text><text x='95' y='230' fill='%230f172a' font-family='sans-serif' font-size='14' font-weight='bold'>1. Tab Pantoprazole 40 mg</text><text x='110' y='250' fill='%23475569' font-family='sans-serif' font-size='12'>Sig: 1 Tab OD x 14 Days (Before breakfast)</text><text x='95' y='290' fill='%230f172a' font-family='sans-serif' font-size='14' font-weight='bold'>2. Tab Paracetamol 650 mg</text><text x='110' y='310' fill='%23475569' font-family='sans-serif' font-size='12'>Sig: 1 Tab SOS after meals</text><text x='400' y='600' fill='%231e293b' font-family='sans-serif' font-size='12' font-weight='bold'>Dr. K. S. Murthy</text><text x='400' y='618' fill='%2364748b' font-family='sans-serif' font-size='11'>Reg No: RMC-48219</text></svg>",
    followUpDate: "As needed"
  },
  {
    id: "rx-202",
    consultationId: "cons_002",
    doctorName: "Dr. S. K. Aggarwal",
    department: "Cardiology",
    hospitalName: "District Civil Hospital",
    date: "18 June 2026",
    diagnosisSummary: "Cardiovascular baseline assessment. Mild stress-induced BP fluctuation.",
    medicines: [
      {
        name: "Tab Telmisartan 40mg",
        dosage: "1 Tablet",
        frequency: "Once Daily (Morning)",
        frequencyHi: "सुबह एक बार",
        instructions: "Take in the morning after breakfast. Monitor home BP weekly.",
        instructionsHi: "सुबह नाश्ते के बाद लें। सप्ताह में एक बार बीपी नापें।",
        duration: "30 days"
      }
    ],
    followUpDate: "10 Oct 2026"
  }
];

export const MOCK_ACTIVE_MEDICATIONS: StructuredMedication[] = [
  {
    id: "med-01",
    name: "Telmisartan 40mg",
    dosage: "1 tablet",
    frequency: "Once daily (Morning)",
    frequencyHi: "सुबह नाश्ते के बाद (दिन में एक बार)",
    duration: "Ongoing management",
    instructions: "Take regularly after breakfast with water. Keep a weekly blood pressure log.",
    instructionsHi: "सुबह नाश्ते के बाद पानी के साथ लें। बीपी का रिकॉर्ड रखें।",
    status: "ACTIVE",
    prescribedBy: "Dr. S. K. Aggarwal (Cardiology)"
  },
  {
    id: "med-02",
    name: "Pantoprazole 40mg",
    dosage: "1 tablet",
    frequency: "Once daily (Before Breakfast)",
    frequencyHi: "सुबह खाली पेट",
    duration: "14 days course (As needed)",
    instructions: "Take 30 minutes before meal with fresh water if acidity develops.",
    instructionsHi: "भोजन से 30 मिनट पूर्व सादे पानी के साथ लें।",
    status: "PAUSED",
    prescribedBy: "Dr. K. S. Murthy (General Medicine)"
  }
];

export const MOCK_ILLNESS_TIMELINE: IllnessRecord[] = [
  {
    id: "ill-01",
    title: "Essential Hypertension & Cardiovascular Wellness",
    titleHi: "उच्च रक्तचाप एवं हृदय स्वास्थ्य देखभाल",
    yearOrDate: "2026 (Under Active Management)",
    status: "UNDER_TREATMENT",
    summary: "Routine monitoring and single-agent antihypertensive management. Blood pressure is well-controlled (124/82 mmHg). Regular follow-up at General OPD.",
    relatedMedications: ["Telmisartan 40mg"],
    relatedReports: ["rep-002", "rep-003"]
  },
  {
    id: "ill-02",
    title: "Transient Acid Peptic Discomfort",
    titleHi: "एसिडिटी एवं गैस्ट्रिक परेशानी",
    yearOrDate: "June 2026",
    status: "RESOLVED",
    summary: "Episodic hyperacidity following irregular meal schedules. Fully resolved with brief course of oral proton pump inhibitor.",
    relatedMedications: ["Pantoprazole 40mg"],
    relatedReports: ["rep-001"]
  },
  {
    id: "ill-03",
    title: "Seasonal Allergy & Dry Cough",
    titleHi: "मौसमी खांसी एवं एलर्जी",
    yearOrDate: "2025",
    status: "RESOLVED",
    summary: "Dry irritating cough during autumn weather transition. Chest X-Ray confirmed normal lung fields.",
    relatedReports: ["rep-003"]
  }
];

export const MOCK_AYURVEDA_GROUPS: AyurvedaFactorGroup[] = [
  {
    name: "About You (संवहन एवं प्रकृति)",
    nameHi: "शारीरिक संरचना एवं प्रकृति",
    items: [
      {
        label: "Prakriti (प्रकृति)",
        labelHi: "प्राकृतिक दोष संतुलन",
        value: "Pitta-Vata (पित्त-वात)",
        valueHi: "पित्त-वात प्रधान",
        source: "CLINICAL_DERIVED",
        description: "Predominance of Pitta metabolism with mild Vata nervous sensitivity."
      },
      {
        label: "Samhanana (संहनन)",
        labelHi: "शारीरिक गठन",
        value: "Madhyama (Moderate)",
        valueHi: "मध्यम गठन",
        source: "CLINICAL_DERIVED",
        description: "Balanced musculoskeletal proportionality and posture."
      },
      {
        label: "Pramana (प्रमाण)",
        labelHi: "ऊंचाई एवं वजन",
        value: "Height: 162 cm • Weight: 62 kg (BMI 23.6)",
        valueHi: "ऊंचाई: 162 सेमी • वजन: 62 किग्रा",
        source: "PATIENT_PROVIDED",
        description: "Normal, healthy body mass index range."
      },
      {
        label: "Vaya (वय)",
        labelHi: "आयु वर्ग",
        value: "Madhyama Vaya (Young Adult, 29 Y)",
        valueHi: "मध्यम वय (युवा वयस्क, 29 वर्ष)",
        source: "PATIENT_PROVIDED"
      }
    ]
  },
  {
    name: "Food & Digestion (आहार एवं अग्नि)",
    nameHi: "आहार शक्ति एवं पाचन",
    items: [
      {
        label: "Agni (अग्नि)",
        labelHi: "पाचन क्षमता",
        value: "Vishama to Sama (Variable to Balanced)",
        valueHi: "विषम से सम अग्नि",
        source: "CLINICAL_DERIVED",
        description: "Digestion tends to fluctuate during long working hours; steady on regular meal times."
      },
      {
        label: "Ahara Shakti (आहार शक्ति)",
        labelHi: "भोजन ग्रहण क्षमता",
        value: "Madhyama (Moderate Intake)",
        valueHi: "मध्यम क्षमता",
        source: "PATIENT_PROVIDED",
        description: "Appetite satisfied with light home-cooked meals."
      },
      {
        label: "Koshtha (कोष्ठ)",
        labelHi: "आंत्र प्रवृत्ति",
        value: "Madhyama (Normal bowel movements)",
        valueHi: "मध्यम कोष्ठ (नियमित)",
        source: "PATIENT_PROVIDED"
      },
      {
        label: "Satmya (सात्म्य)",
        labelHi: "अनुकूल आहार",
        value: "Sarva-Rasa Satmya (Balanced seasonal foods)",
        valueHi: "सर्व-रस अनुकूल",
        source: "PATIENT_PROVIDED"
      }
    ]
  },
  {
    name: "Lifestyle & Mind (विहार एवं सत्व)",
    nameHi: "दिनचर्या, मानसिक स्थिति एवं व्यायाम",
    items: [
      {
        label: "Vyayama Shakti (व्यायाम शक्ति)",
        labelHi: "शारीरिक सहनशीलता",
        value: "Madhyama (30 mins brisk walk daily)",
        valueHi: "मध्यम सहनशक्ति (नियमित सैर)",
        source: "PATIENT_PROVIDED"
      },
      {
        label: "Sattva (सत्व)",
        labelHi: "मानसिक धैर्य एवं स्थिरता",
        value: "Pravara to Madhyama (High cognitive resilience)",
        valueHi: "प्रवर से मध्यम सत्व",
        source: "CLINICAL_DERIVED"
      },
      {
        label: "Vihara / Sleep (निद्रा एवं विश्राम)",
        labelHi: "नींद एवं जीवनशैली",
        value: "6.5 - 7 Hours restful nocturnal sleep",
        valueHi: "6.5 - 7 घंटे गहरी रात की नींद",
        source: "PATIENT_PROVIDED"
      }
    ]
  },
  {
    name: "Current Health & Balance (विकृति एवं लक्षण)",
    nameHi: "वर्तमान स्थिति एवं मौसमी परिवर्तन",
    items: [
      {
        label: "Vikriti State (विकृति)",
        labelHi: "वर्तमान दोष स्थिति",
        value: "Mild seasonal Pitta Ushnata (Mild heat sensitivity)",
        valueHi: "हल्की पित्त उष्णता",
        source: "CLINICAL_DERIVED",
        description: "Occasional dryness during seasonal climate shifts; soothing hydration advised."
      },
      {
        label: "Nidana Factors (निदान)",
        labelHi: "प्रभावित करने वाले कारक",
        value: "Irregular lunch timings during busy office work",
        valueHi: "काम के दौरान खान-पान में देरी",
        source: "PATIENT_PROVIDED"
      }
    ]
  }
];

export const MOCK_ACTIVE_SESSIONS: UserSession[] = [
  {
    id: "sess_web_current",
    deviceName: "Mobile Web Portal (Chrome on Android)",
    deviceType: "MOBILE",
    ipAddress: "192.168.1.108",
    lastActive: "Active Now",
    isCurrent: true
  },
  {
    id: "sess_kiosk_03",
    deviceName: "Hospital Smart Health Kiosk #03 (Ground Floor OPD)",
    deviceType: "KIOSK_TERMINAL",
    ipAddress: "10.12.93.231",
    lastActive: "Today, 10:15 AM",
    isCurrent: false
  },
  {
    id: "sess_desk_04",
    deviceName: "MacBook Air (Safari on macOS)",
    deviceType: "DESKTOP",
    ipAddress: "192.168.1.45",
    lastActive: "3 days ago",
    isCurrent: false
  }
];

export const MOCK_DOCTOR_ACCESS: DoctorAccessAuthorization[] = [
  {
    consultationId: "cons_001",
    doctorName: "Dr. R. Mehta",
    department: "General Medicine",
    hospitalName: "District Civil Hospital",
    grantedAt: "Today, 10:30 AM",
    isRevoked: false
  },
  {
    consultationId: "cons_002",
    doctorName: "Dr. S. K. Aggarwal",
    department: "Cardiology",
    hospitalName: "District Civil Hospital",
    grantedAt: "18 June 2026",
    isRevoked: false
  }
];

export const MOCK_NOTIFICATIONS: PatientNotification[] = [
  {
    id: "notif-01",
    title: "Upcoming Appointment Reminder",
    titleHi: "आगामी परामर्श अनुस्मारक",
    message: "Your OPD appointment with Dr. R. Mehta is scheduled for 10 Oct 2026 at 11:30 AM (Room 204).",
    messageHi: "डॉ. आर. मेहता के साथ आपका परामर्श 10 अक्टूबर 2026 को सुबह 11:30 बजे निर्धारित है।",
    timestamp: "10 mins ago",
    read: false,
    type: "APPOINTMENT",
    actionTab: "APPOINTMENTS"
  },
  {
    id: "notif-02",
    title: "Lab Report Available",
    titleHi: "नई जांच रिपोर्ट उपलब्ध",
    message: "Your Thyroid Stimulating Hormone (TSH) report has been verified by the pathology laboratory.",
    messageHi: "आपकी थायराइड जांच रिपोर्ट प्रयोगशाला द्वारा प्रमाणित कर दी गई है।",
    timestamp: "2 hours ago",
    read: true,
    type: "REPORT",
    actionTab: "REPORTS"
  },
  {
    id: "notif-03",
    title: "Hospital Kiosk Session Linked",
    titleHi: "कियोस्क सत्र फोन से जुड़ा",
    message: "Kiosk #03 session has been securely linked to your phone.",
    messageHi: "कियोस्क #03 सत्र आपके फोन से सफलतापूर्वक जुड़ गया है।",
    timestamp: "Yesterday",
    read: true,
    type: "SECURITY",
    actionTab: "HOME"
  }
];
