import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Building, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Info,
  MapPin,
  ChevronRight, 
  FileText,
  Phone,
  Plus,
  Stethoscope,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Language, PatientAppointment } from '../../../types';
import { BookConsultationModal } from './BookConsultationModal';

interface AppointmentsViewProps {
  language: Language;
  appointments: PatientAppointment[];
  onAppointmentBooked?: (newApt: PatientAppointment) => void;
}

interface DoctorCardData {
  id: string;
  name: string;
  specialty: string;
  specialtyHi?: string;
  department: string;
  hospitalName: string;
  phone: string;
  experienceYears: number;
  availableDays: string;
  room: string;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  language,
  appointments,
  onAppointmentBooked
}) => {
  const [tab, setTab] = useState<'UPCOMING' | 'PAST' | 'DOCTORS'>('UPCOMING');
  const [localAppointments, setLocalAppointments] = useState<PatientAppointment[]>(appointments);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<DoctorCardData | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Sync if parent updates
  React.useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  // Verified Hospital OPD Doctors
  const availableDoctors: DoctorCardData[] = [
    {
      id: 'doc-1',
      name: 'Dr. R. Mehta',
      specialty: 'General Physician',
      specialtyHi: 'सामान्य चिकित्सक',
      department: 'General Medicine',
      hospitalName: 'District Civil Hospital',
      phone: '0141-2567890',
      experienceYears: 14,
      availableDays: 'Mon - Sat (09:00 AM - 01:00 PM)',
      room: 'Room 204'
    },
    {
      id: 'doc-2',
      name: 'Dr. S. K. Aggarwal',
      specialty: 'Consultant Cardiologist',
      specialtyHi: 'हृदय रोग विशेषज्ञ',
      department: 'Cardiology',
      hospitalName: 'District Civil Hospital',
      phone: '0141-2567891',
      experienceYears: 20,
      availableDays: 'Mon, Wed, Fri (10:00 AM - 02:00 PM)',
      room: 'Room 105'
    },
    {
      id: 'doc-3',
      name: 'Dr. Priya Nair',
      specialty: 'Gynecologist & Obstetrician',
      specialtyHi: 'स्त्री एवं प्रसूति रोग विशेषज्ञ',
      department: "Women's Health",
      hospitalName: 'CHC Shanti Nagar',
      phone: '0141-2567892',
      experienceYears: 11,
      availableDays: 'Mon - Fri (09:30 AM - 01:30 PM)',
      room: 'Room 102'
    },
    {
      id: 'doc-4',
      name: 'Dr. K. S. Murthy',
      specialty: 'Senior Physician',
      specialtyHi: 'वरिष्ठ चिकित्सक',
      department: 'General Medicine',
      hospitalName: 'Community Health Center',
      phone: '0141-2567893',
      experienceYears: 18,
      availableDays: 'Tue, Thu, Sat (09:00 AM - 12:30 PM)',
      room: 'Room 201'
    },
    {
      id: 'doc-5',
      name: 'Dr. Rajesh Sharma',
      specialty: 'Ayurvedic Specialist (Vaidya)',
      specialtyHi: 'आयुर्वेदिक चिकित्सक (वैद्य)',
      department: 'Ayush & Wellness',
      hospitalName: 'National AYUSH Clinic',
      phone: '0141-2567894',
      experienceYears: 16,
      availableDays: 'Daily (08:30 AM - 01:00 PM)',
      room: 'OPD-AY-1'
    }
  ];

  const upcomingList = localAppointments.filter(a => a.status === 'UPCOMING');
  const pastList = localAppointments.filter(a => a.status !== 'UPCOMING');

  const handleOpenBooking = (doc?: DoctorCardData) => {
    setSelectedDoctorForBooking(doc || availableDoctors[0]);
    setIsBookingModalOpen(true);
  };

  const handleAppointmentCreated = (newApt: PatientAppointment) => {
    setLocalAppointments(prev => [newApt, ...prev]);
    if (onAppointmentBooked) {
      onAppointmentBooked(newApt);
    }
  };

  const handleDownloadSlip = (apt: PatientAppointment) => {
    const slipText = `
GOVT. DISTRICT CIVIL HOSPITAL — OPD APPOINTMENT SLIP
===================================================
Token Number: ${apt.tokenNumber || 'TK-1004'}
Patient: Priya Sharma (ABHA: 14-9842-1209-7741)
Doctor: ${apt.doctorName} (${apt.doctorSpecialty})
Department: ${apt.department}
Room Assigned: ${apt.room}
Scheduled Date: ${apt.date} at ${apt.time}
Hospital: ${apt.hospitalName}
Status: ${apt.status}
Instructions: ${apt.preparationNotes || 'Bring previous prescription and reports.'}
===================================================
Generated via MediKiosk Patient Portal
    `.trim();

    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Appointment_Slip_${apt.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12 select-none">
      
      {/* Header & Primary Booking Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'चिकित्सकीय परामर्श एवं अपॉइंटमेंट' : 'Doctor Consultations & Appointments'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {language === 'hi'
              ? 'आगामी परामर्श, टोकन पर्ची और अस्पताल के डॉक्टरों से नया परामर्श बुक करें।'
              : 'Track scheduled OPD visits, download tokens, and book consultations with hospital doctors.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenBooking()}
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'hi' ? '+ नया परामर्श बुक करें' : '+ Book Consultation'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setTab('UPCOMING')}
          className={`pb-3 px-3 sm:px-4 font-bold text-xs sm:text-sm transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
            tab === 'UPCOMING'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {language === 'hi' ? 'आगामी परामर्श' : 'Upcoming Consultations'} ({upcomingList.length})
        </button>

        <button
          type="button"
          onClick={() => setTab('PAST')}
          className={`pb-3 px-3 sm:px-4 font-bold text-xs sm:text-sm transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
            tab === 'PAST'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {language === 'hi' ? 'पूर्व परामर्श' : 'Past Consultations'} ({pastList.length})
        </button>

        <button
          type="button"
          onClick={() => setTab('DOCTORS')}
          className={`pb-3 px-3 sm:px-4 font-bold text-xs sm:text-sm transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
            tab === 'DOCTORS'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {language === 'hi' ? 'उपलब्ध डॉक्टर एवं अपॉइंटमेंट' : 'Available OPD Doctors'} ({availableDoctors.length})
        </button>
      </div>

      {/* 1. UPCOMING & PAST CONSULTATIONS TAB */}
      {(tab === 'UPCOMING' || tab === 'PAST') && (
        <div className="space-y-4">
          {(tab === 'UPCOMING' ? upcomingList : pastList).length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Stethoscope className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                {language === 'hi' ? 'कोई अपॉइंटमेंट दर्ज नहीं है।' : 'No consultations in this category.'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'hi'
                  ? 'आप अस्पताल के किसी भी उपलब्ध डॉक्टर के साथ नया परामर्श बुक कर सकते हैं।'
                  : 'You can easily schedule a consultation with our hospital physicians.'}
              </p>
              <button
                type="button"
                onClick={() => setTab('DOCTORS')}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                {language === 'hi' ? 'डॉक्टर देखें एवं बुक करें' : 'Browse Available Doctors'}
              </button>
            </div>
          ) : (
            (tab === 'UPCOMING' ? upcomingList : pastList).map(apt => (
              <div
                key={apt.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-teal-500/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-base shadow-inner">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {apt.doctorName}
                      </h3>
                      <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">
                        {apt.doctorSpecialty} • {apt.department}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span><strong>{apt.date}</strong> at {apt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{apt.hospitalName} ({apt.room})</span>
                    </div>
                  </div>

                  {apt.preparationNotes && (
                    <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      ℹ️ {apt.preparationNotes}
                    </p>
                  )}
                </div>

                {/* Status and Action Buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    apt.status === 'UPCOMING'
                      ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                  }`}>
                    {apt.status === 'UPCOMING' ? (language === 'hi' ? 'आगामी' : 'Confirmed Visit') : (language === 'hi' ? 'पूर्ण' : 'Completed')}
                  </span>

                  {apt.tokenNumber && (
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Token: <strong className="text-teal-700 dark:text-teal-300">{apt.tokenNumber}</strong>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDownloadSlip(apt)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'पर्ची डाउनलोड करें' : 'Download Slip'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. AVAILABLE DOCTORS TAB: Clean cards with [ Call ] and [ Book Appointment ] */}
      {tab === 'DOCTORS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>
                {language === 'hi'
                  ? 'सभी डॉक्टर राष्ट्रीय स्वास्थ्य प्राधिकरण एवं मेडिकल काउंसिल द्वारा सत्यापित हैं।'
                  : 'All physicians are verified on the National Health Facility & Professional Registry.'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 hidden sm:inline">
              ABDM Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableDoctors.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/40 transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-100/60 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-base shadow-inner">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">
                          {language === 'hi' && doc.specialtyHi ? doc.specialtyHi : doc.specialty}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {doc.experienceYears} Y Exp
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{doc.hospitalName} ({doc.room})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{doc.availableDays}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Actions: [ Call ] and [ Book Appointment ] (NO "Show Direction" on doctor card!) */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${doc.phone}`}
                    className="px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{language === 'hi' ? 'कॉल करें' : 'Call'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenBooking(doc)}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Consultation Modal with ROS Questionnaire */}
      {selectedDoctorForBooking && (
        <BookConsultationModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedDoctorForBooking(null);
          }}
          language={language}
          doctor={selectedDoctorForBooking}
          onAppointmentBooked={handleAppointmentCreated}
        />
      )}

    </div>
  );
};
