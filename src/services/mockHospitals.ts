import { HospitalFacility } from '../types';

export const MOCK_HOSPITALS: HospitalFacility[] = [
  {
    id: 'hosp-01',
    name: 'District Civil Hospital',
    nameHi: 'जिला सिविल अस्पताल',
    type: 'Hospital',
    distanceKm: 2.1,
    address: 'Station Road, Kanti Nagar, Bani Park',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302016',
    coordinates: {
      lat: 26.9220,
      lng: 75.7940
    },
    operatingStatus: '24x7',
    timing: 'Open 24 Hours • Emergency & OPD',
    timingHi: '24 घंटे खुला • आपातकालीन एवं ओपीडी',
    departments: [
      'General Medicine',
      'Cardiology',
      'Orthopedics',
      'Pediatrics',
      'Gynecology',
      'ENT',
      'Ayurveda'
    ],
    departmentsHi: [
      'सामान्य चिकित्सा',
      'हृदय रोग',
      'अस्थि रोग',
      'बाल रोग',
      'स्त्री रोग',
      'ईएनटी',
      'आयुर्वेद'
    ],
    facilities: [
      'ICU',
      'Pharmacy',
      'Digital X-Ray',
      'Diagnostic Pathology',
      'MediKiosk Smart Health Kiosk',
      'Ambulance'
    ],
    facilitiesHi: [
      'आईसीयू',
      'फार्मेसी',
      'डिजिटल एक्स-रे',
      'पैथोलॉजी लैब',
      'स्मार्ट स्वास्थ्य कियोस्क',
      'एम्बुलेंस'
    ],
    phone: '+91 141 220 8910',
    appointmentAvailable: true,
    hasKiosk: true,
    emergencyAvailable: true
  },
  {
    id: 'hosp-02',
    name: 'City Care Multi-Speciality Hospital',
    nameHi: 'सिटी केयर मल्टी-स्पेशियलिटी अस्पताल',
    type: 'Hospital',
    distanceKm: 3.8,
    address: 'Plot 12, Tonk Road, Near Gandhi Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302018',
    coordinates: {
      lat: 26.8850,
      lng: 75.8050
    },
    operatingStatus: '24x7',
    timing: 'Open 24 Hours',
    timingHi: '24 घंटे खुला',
    departments: [
      'General Medicine',
      'Cardiology',
      'Orthopedics',
      'Dermatology',
      'Gynecology'
    ],
    departmentsHi: [
      'सामान्य चिकित्सा',
      'हृदय रोग',
      'हड्डी रोग',
      'त्वचा रोग',
      'स्त्री रोग'
    ],
    facilities: [
      'ICU',
      '24/7 Pharmacy',
      'CT Scan',
      'MediKiosk Smart Health Kiosk',
      'Blood Bank'
    ],
    facilitiesHi: [
      'आईसीयू',
      '24/7 फार्मेसी',
      'सीटी स्कैन',
      'स्मार्ट स्वास्थ्य कियोस्क',
      'ब्लड बैंक'
    ],
    phone: '+91 141 270 4500',
    appointmentAvailable: true,
    hasKiosk: true,
    emergencyAvailable: true
  },
  {
    id: 'hosp-03',
    name: 'Apex Healthcare & Diagnostic Centre',
    nameHi: 'एपेक्स हेल्थकेयर एवं डायग्नोस्टिक सेंटर',
    type: 'Diagnostic Centre',
    distanceKm: 1.4,
    address: 'B-4, Sahakar Marg, Lal Kothi',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302015',
    coordinates: {
      lat: 26.8920,
      lng: 75.7920
    },
    operatingStatus: 'Open Now',
    timing: '07:00 AM - 09:00 PM',
    timingHi: 'सुबह 07:00 - रात 09:00',
    departments: [
      'General Medicine',
      'Diagnostic Pathology',
      'Radiology'
    ],
    departmentsHi: [
      'सामान्य चिकित्सा',
      'पैथोलॉजी जांच',
      'रेडियोलॉजी'
    ],
    facilities: [
      'NABL Accredited Lab',
      'Digital X-Ray',
      'Ultrasound',
      'ECG',
      'Pharmacy'
    ],
    facilitiesHi: [
      'एनएबीएल मान्यता प्राप्त लैब',
      'डिजिटल एक्स-रे',
      'अल्ट्रासाउंड',
      'ईसीजी',
      'फार्मेसी'
    ],
    phone: '+91 141 274 1122',
    appointmentAvailable: true,
    hasKiosk: false,
    emergencyAvailable: false
  },
  {
    id: 'hosp-04',
    name: 'Community Health Centre (CHC) Shanti Nagar',
    nameHi: 'सामुदायिक स्वास्थ्य केंद्र (सीएचसी) शांति नगर',
    type: 'Clinic',
    distanceKm: 0.9,
    address: 'Main Market Road, Shanti Nagar, Tonk Phatak',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302018',
    coordinates: {
      lat: 26.8810,
      lng: 75.7980
    },
    operatingStatus: 'Open Now',
    timing: '08:00 AM - 06:00 PM',
    timingHi: 'सुबह 08:00 - शाम 06:00',
    departments: [
      'General Medicine',
      'Pediatrics',
      'Ayurveda',
      'Immunization'
    ],
    departmentsHi: [
      'सामान्य चिकित्सा',
      'बाल रोग',
      'आयुर्वेद',
      'टीकाकरण'
    ],
    facilities: [
      'Primary OPD',
      'Generic Pharmacy',
      'Basic Pathology Lab',
      'MediKiosk Smart Health Kiosk'
    ],
    facilitiesHi: [
      'प्राथमिक ओपीडी',
      'जेनेरिक दवा केंद्र',
      'बेसिक पैथोलॉजी लैब',
      'स्मार्ट स्वास्थ्य कियोस्क'
    ],
    phone: '+91 141 251 0987',
    appointmentAvailable: false,
    hasKiosk: true,
    emergencyAvailable: false
  },
  {
    id: 'hosp-05',
    name: 'National AYUSH & Integrative Health Clinic',
    nameHi: 'राष्ट्रीय आयुष एवं समग्र स्वास्थ्य केंद्र',
    type: 'Clinic',
    distanceKm: 4.5,
    address: 'Jawahar Circle Link Road, Malviya Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302017',
    coordinates: {
      lat: 26.8520,
      lng: 75.8110
    },
    operatingStatus: 'Open Now',
    timing: '09:00 AM - 07:00 PM',
    timingHi: 'सुबह 09:00 - शाम 07:00',
    departments: [
      'Ayurveda',
      'General Medicine',
      'Panchakarma',
      'Yoga & Wellness'
    ],
    departmentsHi: [
      'आयुर्वेद',
      'सामान्य चिकित्सा',
      'पंचकर्म',
      'योग एवं वेलनेस'
    ],
    facilities: [
      'Herbal Dispensary',
      'Panchakarma Therapy Unit',
      'Ayurvedic Pulse Diagnosis (Nadi Pariksha)',
      'MediKiosk Smart Health Kiosk'
    ],
    facilitiesHi: [
      'औषधालय',
      'पंचकर्म चिकित्सा इकाई',
      'नाड़ी परीक्षा कक्ष',
      'स्मार्ट स्वास्थ्य कियोस्क'
    ],
    phone: '+91 141 272 3344',
    appointmentAvailable: true,
    hasKiosk: true,
    emergencyAvailable: false
  },
  {
    id: 'hosp-06',
    name: 'Sanjeevani Children & Maternity Hospital',
    nameHi: 'संजीवनी बाल एवं मातृ अस्पताल',
    type: 'Hospital',
    distanceKm: 5.2,
    address: 'Sector 3, Pratap Nagar, Sanganer',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302033',
    coordinates: {
      lat: 26.8120,
      lng: 75.8200
    },
    operatingStatus: '24x7',
    timing: 'Open 24 Hours',
    timingHi: '24 घंटे खुला',
    departments: [
      'Pediatrics',
      'Gynecology',
      'General Medicine'
    ],
    departmentsHi: [
      'बाल रोग',
      'स्त्री एवं प्रसूति रोग',
      'सामान्य चिकित्सा'
    ],
    facilities: [
      'NICU',
      '24/7 Maternity Ward',
      'Pharmacy',
      'Pediatric Emergency',
      'MediKiosk Smart Health Kiosk'
    ],
    facilitiesHi: [
      'एनआईसीयू',
      '24/7 प्रसूति वार्ड',
      'फार्मेसी',
      'बाल चिकित्सा कक्ष',
      'स्मार्ट स्वास्थ्य कियोस्क'
    ],
    phone: '+91 141 279 8899',
    appointmentAvailable: true,
    hasKiosk: true,
    emergencyAvailable: true
  }
];
