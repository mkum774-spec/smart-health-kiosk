import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Bell, 
  Globe, 
  Smartphone, 
  Lock, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  Save, 
  X, 
  AlertTriangle, 
  AlertCircle, 
  Edit3, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Language, ABHAPatient, PatientPortalTab } from '../../../types';
import { patientPortalService } from '../../../services/patientPortalService';

interface PatientProfileViewProps {
  language: Language;
  patient: ABHAPatient;
  onUpdatePatient: (updated: ABHAPatient) => void;
  onLogout: () => void;
  onSelectTab?: (tab: PatientPortalTab) => void;
}

type ProfileSectionKey = 
  | 'personal'
  | 'contact'
  | 'emergency'
  | 'health'
  | 'accessibility'
  | 'notifications'
  | 'devices'
  | 'privacy'
  | 'help';

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  language,
  patient,
  onUpdatePatient,
  onLogout,
  onSelectTab
}) => {
  // Expanded section state
  const [expandedSection, setExpandedSection] = useState<ProfileSectionKey | null>('personal');

  // Personal state
  const [name, setName] = useState(patient.name);
  const [gender, setGender] = useState(patient.gender);
  const [age, setAge] = useState(patient.age);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  // Contact state
  const [phone, setPhone] = useState(patient.phone);
  const [email, setEmail] = useState('priya.sharma@example.com');
  const [streetAddress, setStreetAddress] = useState('House #42, Shanti Nagar, Tonk Road');
  const [district, setDistrict] = useState(patient.district);
  const [state, setState] = useState(patient.state);
  const [pincode, setPincode] = useState('302018');
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Emergency contact state
  const [emergencyName, setEmergencyName] = useState('Rajesh Sharma');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98112 00000');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse / Family');
  const [isEditingEmergency, setIsEditingEmergency] = useState(false);

  // Accessibility state
  const [fontSizePref, setFontSizePref] = useState<'normal' | 'compact' | 'large'>('normal');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundFeedback, setSoundFeedback] = useState(true);

  // Notifications state
  const [notifAppointments, setNotifAppointments] = useState(true);
  const [notifReports, setNotifReports] = useState(true);
  const [notifMeds, setNotifMeds] = useState(true);

  // Sessions state
  const [revokedNotice, setRevokedNotice] = useState<string | null>(null);

  // General feedback
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleSection = (section: ProfileSectionKey) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  const showNotification = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = patientPortalService.updatePatientProfile({
      name,
      age: Number(age)
    });
    onUpdatePatient(updated);
    setIsEditingPersonal(false);
    showNotification(language === 'hi' ? 'व्यक्तिगत जानकारी सुरक्षित की गई।' : 'Personal information updated successfully.');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = patientPortalService.updatePatientProfile({
      phone,
      district,
      state
    });
    onUpdatePatient(updated);
    setIsEditingContact(false);
    showNotification(language === 'hi' ? 'संपर्क विवरण सुरक्षित किया गया।' : 'Contact information updated successfully.');
  };

  const handleSaveEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingEmergency(false);
    showNotification(language === 'hi' ? 'आपातकालीन संपर्क सुरक्षित किया गया।' : 'Emergency contact updated successfully.');
  };

  const handleRevokeSession = (sessionId: string, deviceName: string) => {
    patientPortalService.revokeSession(sessionId);
    setRevokedNotice(language === 'hi' ? `${deviceName} का सत्र समाप्त किया गया` : `Access revoked for ${deviceName}`);
    setTimeout(() => setRevokedNotice(null), 3000);
  };

  const rows: {
    key: ProfileSectionKey;
    titleEn: string;
    titleHi: string;
    descEn: string;
    descHi: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'personal',
      titleEn: 'Personal Information',
      titleHi: 'व्यक्तिगत जानकारी',
      descEn: 'Name, date of birth, gender, and verified ABHA credentials',
      descHi: 'नाम, जन्म तिथि, लिंग एवं प्रमाणित आभा विवरण',
      icon: <User className="w-5 h-5 text-teal-600" />
    },
    {
      key: 'contact',
      titleEn: 'Contact Information',
      titleHi: 'संपर्क विवरण',
      descEn: 'Phone number, email, and residential postal address',
      descHi: 'फोन नंबर, ईमेल और निवास का डाक पता',
      icon: <MapPin className="w-5 h-5 text-sky-600" />
    },
    {
      key: 'emergency',
      titleEn: 'Emergency Contact',
      titleHi: 'आपातकालीन संपर्क',
      descEn: 'Primary contact for medical emergency hospital notifications',
      descHi: 'चिकित्सा आपातकाल अस्पताल सूचना हेतु प्राथमिक संपर्क',
      icon: <Phone className="w-5 h-5 text-rose-600" />
    },
    {
      key: 'health',
      titleEn: 'Health Information',
      titleHi: 'स्वास्थ्य जानकारी',
      descEn: 'Blood group, known allergies, chronic conditions, and Prakriti',
      descHi: 'रक्त समूह, ज्ञात एलर्जी, पुरानी बीमारियां एवं प्रकृति प्रोफाइल',
      icon: <Heart className="w-5 h-5 text-red-500" />
    },
    {
      key: 'accessibility',
      titleEn: 'Language & Accessibility',
      titleHi: 'भाषा एवं सुगमता',
      descEn: 'Preferred language, font scaling, and motion preferences',
      descHi: 'प्राथमिक भाषा, फॉन्ट आकार और गति प्राथमिकताएं',
      icon: <Globe className="w-5 h-5 text-emerald-600" />
    },
    {
      key: 'notifications',
      titleEn: 'Notifications',
      titleHi: 'सूचनाएं एवं अलर्ट',
      descEn: 'Reminders for appointments, lab test results, and prescriptions',
      descHi: 'परामर्श, लैब रिपोर्ट एवं दवा रिफिल सूचना प्राथमिकताएं',
      icon: <Bell className="w-5 h-5 text-amber-500" />
    },
    {
      key: 'devices',
      titleEn: 'Devices & Sessions',
      titleHi: 'सक्रिय डिवाइस एवं सत्र',
      descEn: 'Manage logged-in devices and hospital kiosk sync authorizations',
      descHi: 'सक्रिय लॉगिन डिवाइस एवं अस्पताल कियोस्क सिंक्रोनाइजेशन प्रबंधन',
      icon: <Smartphone className="w-5 h-5 text-indigo-600" />
    },
    {
      key: 'privacy',
      titleEn: 'Privacy & Security',
      titleHi: 'गोपनीयता एवं सुरक्षा',
      descEn: 'Account authentication, 2FA status, and data encryption policies',
      descHi: 'खाता प्रमाणीकरण, 2FA स्थिति एवं डेटा एन्क्रिप्शन नीतियां',
      icon: <Lock className="w-5 h-5 text-teal-600" />
    },
    {
      key: 'help',
      titleEn: 'Help & Support',
      titleHi: 'सहायता एवं संपर्क',
      descEn: 'Frequently asked questions, hospital directory, and helplines',
      descHi: 'सामान्य प्रश्न, अस्पताल निर्देशिका एवं हेल्पलाइन नंबर',
      icon: <HelpCircle className="w-5 h-5 text-blue-600" />
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto pb-16">
      
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'मरीज प्रोफाइल एवं सेटिंग्स' : 'Profile & Account Settings'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {language === 'hi'
              ? 'आपकी व्यक्तिगत स्वास्थ्य पहचान, संपर्क एवं खाता प्राथमिकताएं।'
              : 'Manage your verified ABDM identity, communication, and account preferences.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 border border-rose-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>{language === 'hi' ? 'सुरक्षित लॉगआउट' : 'Secure Logout'}</span>
        </button>
      </div>

      {/* Global Success Notification */}
      {saveSuccessNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-teal-600/25 flex-shrink-0">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {patient.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                ABHA Verified
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Patient
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              ABHA ID: {patient.abhaNumber} • {patient.abhaAddress}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              {patient.age} Years • {patient.gender} • Jaipur, Rajasthan
            </p>
          </div>
        </div>
      </div>

      {/* Profile Expandable Rows List */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {rows.map(row => {
          const isExpanded = expandedSection === row.key;
          return (
            <div key={row.key} className="transition-colors">
              {/* Row Header Button */}
              <button
                type="button"
                onClick={() => toggleSection(row.key)}
                className={`w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer transition-colors ${
                  isExpanded ? 'bg-slate-50/80 dark:bg-slate-800/50' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                }`}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    {row.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                      {language === 'hi' ? row.titleHi : row.titleEn}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                      {language === 'hi' ? row.descHi : row.descEn}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 text-slate-400">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-teal-600 transition-transform" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Row Expandable Content */}
              {isExpanded && (
                <div className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                  
                  {/* 1. PERSONAL INFORMATION */}
                  {row.key === 'personal' && (
                    <div className="space-y-4 max-w-2xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {language === 'hi' ? 'आभा प्रमाणित विवरण' : 'ABHA Verified Demographics'}
                        </span>
                        {!isEditingPersonal ? (
                          <button
                            type="button"
                            onClick={() => setIsEditingPersonal(true)}
                            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'संपादित करें' : 'Edit'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsEditingPersonal(false)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                          >
                            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                          </button>
                        )}
                      </div>

                      {isEditingPersonal ? (
                        <form onSubmit={handleSavePersonal} className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                              </label>
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                {language === 'hi' ? 'आयु (वर्ष)' : 'Age (Years)'}
                              </label>
                              <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                                required
                              />
                            </div>
                          </div>
                          <div className="pt-2 flex gap-2">
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{language === 'hi' ? 'सहेजें' : 'Save Changes'}</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'पूरा नाम' : 'Full Name'}</span>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{patient.name}</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'जन्म तिथि / आयु' : 'Date of Birth / Age'}</span>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">14-Aug-1996 ({patient.age} Y)</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'लिंग' : 'Gender'}</span>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{patient.gender}</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">ABHA Number</span>
                            <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">{patient.abhaNumber}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. CONTACT INFORMATION */}
                  {row.key === 'contact' && (
                    <div className="space-y-4 max-w-2xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {language === 'hi' ? 'संचार विवरण' : 'Communication Details'}
                        </span>
                        {!isEditingContact ? (
                          <button
                            type="button"
                            onClick={() => setIsEditingContact(true)}
                            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'संपादित करें' : 'Edit'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsEditingContact(false)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                          >
                            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                          </button>
                        )}
                      </div>

                      {isEditingContact ? (
                        <form onSubmit={handleSaveContact} className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Phone'}</label>
                              <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'ईमेल' : 'Email Address'}</label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'पता' : 'Street Address'}</label>
                            <input
                              type="text"
                              value={streetAddress}
                              onChange={(e) => setStreetAddress(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'जिला' : 'City / District'}</label>
                              <input
                                type="text"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'राज्य' : 'State'}</label>
                              <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">PIN Code</label>
                              <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold"
                              />
                            </div>
                          </div>
                          <div className="pt-2 flex gap-2">
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{language === 'hi' ? 'सहेजें' : 'Save Contact'}</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'मोबाइल फोन' : 'Mobile Phone'}</span>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{phone}</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'ईमेल' : 'Email Address'}</span>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{email}</span>
                          </div>
                          <div className="sm:col-span-2 p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'निवास का पता' : 'Residential Address'}</span>
                            <span className="font-semibold text-slate-900 dark:text-white text-xs">{streetAddress}, {district}, {state} - {pincode}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. EMERGENCY CONTACT */}
                  {row.key === 'emergency' && (
                    <div className="space-y-4 max-w-2xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {language === 'hi' ? 'आपातकालीन व्यक्ति विवरण' : 'Designated Hospital Emergency Contact'}
                        </span>
                        {!isEditingEmergency ? (
                          <button
                            type="button"
                            onClick={() => setIsEditingEmergency(true)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'संपादित करें' : 'Edit'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsEditingEmergency(false)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                          >
                            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                          </button>
                        )}
                      </div>

                      {isEditingEmergency ? (
                        <form onSubmit={handleSaveEmergency} className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'नाम' : 'Contact Name'}</label>
                              <input
                                type="text"
                                value={emergencyName}
                                onChange={(e) => setEmergencyName(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'संबंध' : 'Relationship'}</label>
                              <input
                                type="text"
                                value={emergencyRelation}
                                onChange={(e) => setEmergencyRelation(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'फोन' : 'Phone Number'}</label>
                              <input
                                type="text"
                                value={emergencyPhone}
                                onChange={(e) => setEmergencyPhone(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                              />
                            </div>
                          </div>
                          <div className="pt-2 flex gap-2">
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{language === 'hi' ? 'सहेजें' : 'Save Contact'}</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'नाम' : 'Contact Name'}</span>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{emergencyName}</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'संबंध' : 'Relationship'}</span>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{emergencyRelation}</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'फोन' : 'Emergency Phone'}</span>
                            <span className="font-mono font-bold text-rose-600 text-sm">{emergencyPhone}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. HEALTH INFORMATION */}
                  {row.key === 'health' && (
                    <div className="space-y-4 max-w-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'रक्त समूह' : 'Blood Group'}</span>
                          <span className="font-black text-rose-600 dark:text-rose-400 text-base">O Positive (O+)</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40">
                          <span className="text-rose-700 dark:text-rose-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'ज्ञात दवा एलर्जी' : 'Known Drug Allergy'}</span>
                          <span className="font-bold text-rose-800 dark:text-rose-300 text-xs">Penicillin (Severe: Urticaria)</span>
                          <span className="text-[10px] text-rose-600 block mt-0.5">Mandatory clinical safety alert</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'दीर्घकालिक स्थितियां' : 'Chronic Conditions'}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Type 2 Diabetes Mellitus (E11.9)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block mt-0.5">Essential Hypertension (I10)</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'आयुर्वेदिक प्रकृति एवं आहार' : 'Ayurvedic Prakriti & Diet'}</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs block">Vata-Pitta Prakriti</span>
                          <span className="text-slate-500 text-[11px] block mt-0.5">Vegetarian (Mridu Koshtha)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. LANGUAGE & ACCESSIBILITY */}
                  {row.key === 'accessibility' && (
                    <div className="space-y-4 max-w-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                          <span className="font-bold text-slate-900 dark:text-white block">{language === 'hi' ? 'फॉन्ट आकार प्राथमिकता' : 'Font Size Preference'}</span>
                          <div className="flex gap-2">
                            {(['compact', 'normal', 'large'] as const).map(size => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setFontSizePref(size)}
                                className={`flex-1 py-1.5 rounded-xl border text-xs font-bold capitalize transition-colors cursor-pointer ${
                                  fontSizePref === size
                                    ? 'bg-teal-600 text-white border-teal-600'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{language === 'hi' ? 'कम गति (Reduced Motion)' : 'Reduced Motion'}</span>
                              <span className="text-[11px] text-slate-500">{language === 'hi' ? 'एनिमेशन सीमित करें' : 'Minimize animations'}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={reducedMotion}
                              onChange={(e) => setReducedMotion(e.target.checked)}
                              className="w-4 h-4 accent-teal-600 cursor-pointer"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{language === 'hi' ? 'ध्वनि प्रतिक्रिया' : 'Sound Feedback'}</span>
                              <span className="text-[11px] text-slate-500">{language === 'hi' ? 'चाइम एवं आवाज़' : 'Audio cues & chime'}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={soundFeedback}
                              onChange={(e) => setSoundFeedback(e.target.checked)}
                              className="w-4 h-4 accent-teal-600 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. NOTIFICATIONS */}
                  {row.key === 'notifications' && (
                    <div className="space-y-3 max-w-2xl text-xs">
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{language === 'hi' ? 'अपॉइंटमेंट सूचनाएं' : 'Appointment Reminders'}</span>
                          <span className="text-[11px] text-slate-500">{language === 'hi' ? 'परामर्श से 24 घंटे पहले एसएमएस व पुश अलर्ट' : 'SMS and in-app alerts 24 hours prior'}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifAppointments}
                          onChange={(e) => setNotifAppointments(e.target.checked)}
                          className="w-4 h-4 accent-teal-600 cursor-pointer"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{language === 'hi' ? 'लैब रिपोर्ट उपलब्ध अलर्ट' : 'Lab Report Availability'}</span>
                          <span className="text-[11px] text-slate-500">{language === 'hi' ? 'पैथोलॉजी व एक्स-रे रिपोर्ट जारी होते ही तुरंत सूचना' : 'Immediate notification when results are verified'}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifReports}
                          onChange={(e) => setNotifReports(e.target.checked)}
                          className="w-4 h-4 accent-teal-600 cursor-pointer"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{language === 'hi' ? 'दवा रिफिल अलर्ट' : 'Medication Refill Reminders'}</span>
                          <span className="text-[11px] text-slate-500">{language === 'hi' ? 'दवाओं का कोर्स समाप्त होने से 3 दिन पहले' : 'Notification 3 days before prescription completion'}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifMeds}
                          onChange={(e) => setNotifMeds(e.target.checked)}
                          className="w-4 h-4 accent-teal-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* 7. DEVICES & SESSIONS */}
                  {row.key === 'devices' && (
                    <div className="space-y-3 max-w-2xl text-xs">
                      {revokedNotice && (
                        <div className="p-3 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          <span>{revokedNotice}</span>
                        </div>
                      )}

                      {/* Current Device */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-teal-500/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center font-bold">
                            💻
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">{language === 'hi' ? 'वर्तमान डिवाइस (यह ब्राउज़र)' : 'Current Device (This Browser)'}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">Active Now</span>
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">Chrome on Windows • IP 10.122.43.231</span>
                          </div>
                        </div>
                      </div>

                      {/* Other Session 1 */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                            🏥
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">Hospital Smart Health Kiosk #03 (Ground Floor OPD)</span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">Linked via Kiosk QR • OPD Queue Sync</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRevokeSession('sess-02', 'Hospital Kiosk #03')}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-[11px] font-bold cursor-pointer"
                        >
                          {language === 'hi' ? 'सत्र समाप्त करें' : 'Revoke Sync'}
                        </button>
                      </div>

                      {/* Other Session 2 */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                            📱
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">Safari on iPhone 14</span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">Jaipur, Rajasthan • Active 2 hours ago</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRevokeSession('sess-03', 'iPhone 14 Safari')}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-[11px] font-bold cursor-pointer"
                        >
                          {language === 'hi' ? 'लॉगआउट करें' : 'Sign Out'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 8. PRIVACY & SECURITY */}
                  {row.key === 'privacy' && (
                    <div className="space-y-4 max-w-2xl text-xs">
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{language === 'hi' ? 'दो-चरणीय प्रमाणीकरण (2FA)' : 'Two-Factor Authentication (2FA)'}</span>
                            <span className="text-[11px] text-slate-500">{language === 'hi' ? 'आभा मोबाइल ओटीपी सत्यापन सक्रिय है' : 'ABHA registered mobile OTP verification active'}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Enabled
                          </span>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{language === 'hi' ? 'डेटा एन्क्रिप्शन' : 'Data Encryption Standard'}</span>
                            <span className="text-[11px] text-slate-500">AES-256 (At-rest) & TLS 1.3 (In-transit)</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">ABDM Compliant</span>
                        </div>

                        {onSelectTab && (
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{language === 'hi' ? 'सहमति एवं डेटा शेयरिंग' : 'Consent & Sharing Controls'}</span>
                              <span className="text-[11px] text-slate-500">{language === 'hi' ? 'डॉक्टरों को दिए गए 9 डेटा अनुमति श्रेणियां प्रबंधित करें' : 'Manage granular permissions granted to healthcare providers'}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => onSelectTab('CONSENT')}
                              className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold hover:bg-teal-100 flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>{language === 'hi' ? 'सहमति खोलें' : 'Open Consent Manager'}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 9. HELP & SUPPORT */}
                  {row.key === 'help' && (
                    <div className="space-y-3 max-w-2xl text-xs">
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{language === 'hi' ? 'सामान्य प्रश्न एवं निर्देशिका' : 'Frequently Asked Questions & Guides'}</span>
                          <span className="text-[11px] text-slate-500">{language === 'hi' ? 'कियोस्क कैसे प्रयोग करें, रिपोर्ट कैसे देखें' : 'How to use hospital kiosks, understand lab reports, and manage records'}</span>
                        </div>
                        {onSelectTab && (
                          <button
                            type="button"
                            onClick={() => onSelectTab('HELP')}
                            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer transition-colors shadow-sm"
                          >
                            {language === 'hi' ? 'सहायता केंद्र देखें' : 'View Help Center'}
                          </button>
                        )}
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{language === 'hi' ? 'अस्पताल मरीज हेल्पलाइन' : 'Hospital Patient Helpline'}</span>
                          <span className="text-[11px] text-slate-500">Toll-free 24/7 patient assistance</span>
                        </div>
                        <a
                          href="tel:1800114477"
                          className="font-bold text-teal-600 hover:underline font-mono"
                        >
                          1800-11-4477
                        </a>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prominent Bottom Logout Button */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 border-2 border-rose-200 dark:border-rose-900 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>{language === 'hi' ? 'खाते से सुरक्षित लॉगआउट करें' : 'Log Out from Account'}</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {language === 'hi' ? 'लॉगआउट की पुष्टि करें' : 'Confirm Logout'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'hi' 
                  ? 'क्या आप सुनिश्चित हैं कि आप अपने मरीज पोर्टल से लॉगआउट करना चाहते हैं?' 
                  : 'Are you sure you want to end your patient portal session?'}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                {language === 'hi' ? 'हाँ, लॉगआउट करें' : 'Yes, Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
