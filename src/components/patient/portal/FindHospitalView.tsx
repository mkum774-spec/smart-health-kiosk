import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Navigation, 
  Clock, 
  Phone, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  SlidersHorizontal, 
  Map as MapIcon, 
  List, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  QrCode,
  User,
  Calendar
} from 'lucide-react';
import { Language, HospitalFacility, HospitalFilters, HospitalType } from '../../../types';
import { hospitalService } from '../../../services/hospitalService';
import { BookConsultationModal } from './BookConsultationModal';

interface FindHospitalViewProps {
  language: Language;
}

export const FindHospitalView: React.FC<FindHospitalViewProps> = ({ language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitals, setHospitals] = useState<HospitalFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<HospitalFacility | null>(null);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<{
    name: string;
    specialty: string;
    department: string;
    hospitalName: string;
    phone?: string;
    room?: string;
  } | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [locationErrorNotice, setLocationErrorNotice] = useState<string | null>(null);

  // Filters state
  const [maxDistance, setMaxDistance] = useState<number>(0); // 0 means all
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | HospitalType>('ALL');
  const [openOnly, setOpenOnly] = useState(false);
  const [twentyFourSevenOnly, setTwentyFourSevenOnly] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const specialties = [
    { id: 'ALL', en: 'All Specialties', hi: 'सभी विभाग' },
    { id: 'General Medicine', en: 'General Medicine', hi: 'सामान्य चिकित्सा' },
    { id: 'Cardiology', en: 'Cardiology', hi: 'हृदय रोग' },
    { id: 'Orthopedics', en: 'Orthopedics', hi: 'हड्डी रोग' },
    { id: 'Pediatrics', en: 'Pediatrics', hi: 'बाल रोग' },
    { id: 'Gynecology', en: 'Gynecology', hi: 'स्त्री रोग' },
    { id: 'Ayurveda', en: 'Ayurveda', hi: 'आयुर्वेद' },
    { id: 'Dermatology', en: 'Dermatology', hi: 'त्वचा रोग' }
  ];

  // Fetch hospitals
  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const filters: HospitalFilters = {
        maxDistanceKm: maxDistance > 0 ? maxDistance : undefined,
        specialty: selectedSpecialty !== 'ALL' ? selectedSpecialty : undefined,
        facilityType: selectedType !== 'ALL' ? selectedType : undefined,
        openOnly,
        twentyFourSevenOnly
      };

      const result = await hospitalService.getHospitals({
        query: searchQuery,
        filters,
        userLocation: userLocation || undefined
      });
      setHospitals(result);
    } catch {
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [searchQuery, maxDistance, selectedSpecialty, selectedType, openOnly, twentyFourSevenOnly, userLocation]);

  // Request location explicitly only when patient clicks "Use My Current Location"
  const handleUseCurrentLocation = () => {
    setLocationErrorNotice(null);
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setLocationErrorNotice(
        language === 'hi'
          ? 'आपके ब्राउज़र में स्थान (Geolocation) सुविधा समर्थित नहीं है।'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationStatus('granted');
      },
      (err) => {
        setLocationStatus('denied');
        setLocationErrorNotice(
          language === 'hi'
            ? 'स्थान अनुमति नहीं मिली। आप नीचे शहर या पिन कोड द्वारा खोज सकते हैं।'
            : 'Location access was not allowed. You can still search by city or PIN code below.'
        );
      },
      { timeout: 8000 }
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setMaxDistance(0);
    setSelectedSpecialty('ALL');
    setSelectedType('ALL');
    setOpenOnly(false);
    setTwentyFourSevenOnly(false);
    setLocationErrorNotice(null);
  };

  const hasActiveFilters = 
    maxDistance > 0 || 
    selectedSpecialty !== 'ALL' || 
    selectedType !== 'ALL' || 
    openOnly || 
    twentyFourSevenOnly || 
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>{language === 'hi' ? 'स्वास्थ्य सुविधा खोज' : 'Healthcare Facility Discovery'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'अस्पताल खोजें' : 'Find a Hospital'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {language === 'hi'
              ? 'अपने नजदीकी अस्पताल, क्लीनिक एवं डायग्नोस्टिक सेंटर खोजें व तुलना करें।'
              : 'Find healthcare facilities near you, compare services, and plan your visit.'}
          </p>
        </div>

        {/* View Mode Switcher (List vs Map) */}
        <div className="inline-flex rounded-2xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सूची दृश्य' : 'List View'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'मानचित्र दृश्य' : 'Map View'}</span>
          </button>
        </div>
      </div>

      {/* 2. Location Permission / Search Banner Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Explicit GPS Location Trigger Button */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locationStatus === 'requesting'}
              className="w-full md:w-auto px-4 py-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-60"
            >
              <Navigation className={`w-4 h-4 text-teal-600 ${locationStatus === 'requesting' ? 'animate-spin' : ''}`} />
              <span>
                {locationStatus === 'requesting'
                  ? (language === 'hi' ? 'स्थान खोजा जा रहा है...' : 'Detecting Location...')
                  : locationStatus === 'granted'
                  ? (language === 'hi' ? '✓ वर्तमान स्थान सक्रिय' : '✓ Location Detected')
                  : (language === 'hi' ? '📍 मेरे वर्तमान स्थान का उपयोग करें' : '📍 Use My Current Location')}
              </span>
            </button>
          </div>

          <div className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? '— अथवा —' : '— OR —'}
          </div>

          {/* Search Input for City / PIN code / Hospital Name */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'अस्पताल का नाम, शहर या पिन कोड दर्ज करें (उदा. 302018)...'
                  : 'Search hospitals, city, or PIN code (e.g. Jaipur, 302018)...'
              }
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Location Denied or Notice Banner */}
        {locationErrorNotice && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-medium flex items-center justify-between gap-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{locationErrorNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setLocationErrorNotice(null)}
              className="text-amber-700 hover:text-amber-900 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter Quick Pills */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          
          {/* Distance Filter */}
          <select
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none text-xs cursor-pointer"
          >
            <option value={0}>{language === 'hi' ? 'दूरी: सभी' : 'Distance: Any'}</option>
            <option value={2}>{language === 'hi' ? '2 किमी के भीतर' : 'Within 2 km'}</option>
            <option value={5}>{language === 'hi' ? '5 किमी के भीतर' : 'Within 5 km'}</option>
            <option value={10}>{language === 'hi' ? '10 किमी के भीतर' : 'Within 10 km'}</option>
            <option value={25}>{language === 'hi' ? '25 किमी के भीतर' : 'Within 25 km'}</option>
          </select>

          {/* Specialty Filter */}
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none text-xs cursor-pointer"
          >
            {specialties.map(s => (
              <option key={s.id} value={s.id}>
                {language === 'hi' ? s.hi : s.en}
              </option>
            ))}
          </select>

          {/* Facility Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none text-xs cursor-pointer"
          >
            <option value="ALL">{language === 'hi' ? 'प्रकार: सभी' : 'Type: All'}</option>
            <option value="Hospital">{language === 'hi' ? 'अस्पताल' : 'Hospital'}</option>
            <option value="Clinic">{language === 'hi' ? 'क्लीनिक' : 'Clinic'}</option>
            <option value="Diagnostic Centre">{language === 'hi' ? 'डायग्नोस्टिक सेंटर' : 'Diagnostic Centre'}</option>
          </select>

          {/* 24x7 Quick Toggle */}
          <button
            type="button"
            onClick={() => setTwentyFourSevenOnly(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl font-semibold border transition-colors cursor-pointer ${
              twentyFourSevenOnly
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            24×7
          </button>

          {/* Open Now Quick Toggle */}
          <button
            type="button"
            onClick={() => setOpenOnly(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl font-semibold border transition-colors cursor-pointer ${
              openOnly
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {language === 'hi' ? 'अभी खुला है' : 'Open Now'}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-rose-600 font-bold hover:underline ml-auto cursor-pointer"
            >
              {language === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Filters'}
            </button>
          )}

        </div>

      </div>

      {/* 3. Main Results Display Area */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-2/3" />
            </div>
          ))}
        </div>
      ) : hospitals.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl font-bold">
            🏥
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {language === 'hi'
                ? 'इस स्थान के लिए कोई स्वास्थ्य सुविधा नहीं मिली।'
                : 'No healthcare facilities were found for this location.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              {language === 'hi'
                ? 'कृपया अपने फ़िल्टर समायोजित करें या कोई अन्य पिन कोड अथवा शहर खोजें।'
                : 'Please try another location, increase distance, or reset active filters.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer shadow-sm"
          >
            {language === 'hi' ? 'सभी सुविधाएं देखें' : 'View All Facilities'}
          </button>
        </div>
      ) : (
        /* Content Display (List vs Map) */
        <div className={viewMode === 'map' ? 'grid grid-cols-1 lg:grid-cols-12 gap-6' : 'space-y-4'}>
          
          {/* MAP SCHEMATIC VIEW (Interactive Pin Display) */}
          {viewMode === 'map' && (
            <div className="lg:col-span-5 rounded-3xl bg-slate-900 text-white p-5 border-2 border-slate-800 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    {language === 'hi' ? 'सुविधा मानचित्र' : 'Facility Map View'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Jaipur Region</span>
                </div>
                <p className="text-xs text-slate-300">
                  {language === 'hi' ? 'अस्पताल पिन पर क्लिक करके विवरण देखें:' : 'Click any hospital pin to view details:'}
                </p>
              </div>

              {/* Visual Map Coordinates Schematic */}
              <div className="relative z-10 my-4 h-64 border border-slate-700 rounded-2xl bg-slate-950/60 p-4 relative overflow-hidden flex items-center justify-center">
                {/* Distance concentric radar circles */}
                <div className="absolute w-56 h-56 rounded-full border border-teal-500/10" />
                <div className="absolute w-40 h-40 rounded-full border border-teal-500/15" />
                <div className="absolute w-24 h-24 rounded-full border border-teal-500/20" />
                <div className="absolute w-3 h-3 rounded-full bg-teal-400 ring-4 ring-teal-400/20" title="Your Center / Location" />

                {/* Facility Pins */}
                {hospitals.map((h, idx) => {
                  const offsets = [
                    { top: '25%', left: '30%' },
                    { top: '40%', left: '70%' },
                    { top: '65%', left: '45%' },
                    { top: '20%', left: '60%' },
                    { top: '75%', left: '75%' },
                    { top: '55%', left: '20%' }
                  ];
                  const pos = offsets[idx % offsets.length];
                  const isSelected = selectedHospital?.id === h.id;

                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setSelectedHospital(h)}
                      style={{ top: pos.top, left: pos.left }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full flex items-center gap-1 shadow-lg transition-transform cursor-pointer hover:scale-110 ${
                        isSelected 
                          ? 'bg-rose-500 text-white ring-4 ring-rose-500/30 z-20 scale-110' 
                          : 'bg-teal-600 text-white ring-2 ring-teal-400/40 z-10'
                      }`}
                      title={h.name}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold pr-1 hidden sm:inline">{h.distanceKm} km</span>
                    </button>
                  );
                })}
              </div>

              {/* Map Footer Note */}
              <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{hospitals.length} {language === 'hi' ? 'सुविधाएं उपलब्ध' : 'facilities shown'}</span>
                <span className="text-teal-400 font-mono">📍 GPS Radius ~10km</span>
              </div>
            </div>
          )}

          {/* HOSPITAL CARDS LIST */}
          <div className={viewMode === 'map' ? 'lg:col-span-7 space-y-4' : 'space-y-4'}>
            {hospitals.map(h => {
              const isSelected = selectedHospital?.id === h.id;
              return (
                <div
                  key={h.id}
                  className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all shadow-sm space-y-4 ${
                    isSelected
                      ? 'border-teal-500 shadow-md shadow-teal-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar: Name, Type, and Distance */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {h.type}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-teal-600" />
                          {h.distanceKm} km away
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          h.operatingStatus === '24x7'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {h.operatingStatus}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {language === 'hi' && h.nameHi ? h.nameHi : h.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span>{h.address}, {h.city} - {h.pincode}</span>
                      </p>
                    </div>

                    {/* MediKiosk Kiosk Enabled Tag */}
                    {h.hasKiosk && (
                      <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-[11px] font-bold flex items-center gap-1.5 self-start">
                        <QrCode className="w-3.5 h-3.5 text-teal-600" />
                        <span>Smart Health Kiosk</span>
                      </span>
                    )}
                  </div>

                  {/* Specialties & Departments */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      {language === 'hi' ? 'विशेषज्ञता एवं विभाग:' : 'Specialties & Departments:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {h.departments.map(dept => (
                        <span
                          key={dept}
                          className="px-2.5 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${h.phone}`}
                        className="font-bold text-slate-700 dark:text-slate-300 hover:text-teal-600 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        <span className="font-mono">{h.phone}</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedHospital(h)}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                      >
                        <span>{language === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 4. Hospital Detail Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-800/50">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    {selectedHospital.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    📍 {selectedHospital.distanceKm} km away
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {language === 'hi' && selectedHospital.nameHi ? selectedHospital.nameHi : selectedHospital.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{selectedHospital.address}, {selectedHospital.city}, {selectedHospital.state} - {selectedHospital.pincode}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedHospital(null)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* Operating Status & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'कार्य समय' : 'Operating Timing'}</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">{selectedHospital.timing}</span>
                  <span className="text-[11px] text-teal-600 font-semibold">{selectedHospital.operatingStatus}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'फोन हेल्पलाइन' : 'Contact Phone'}</span>
                  <a href={`tel:${selectedHospital.phone}`} className="font-mono font-bold text-teal-600 text-sm block mt-0.5 hover:underline">
                    {selectedHospital.phone}
                  </a>
                  <span className="text-[11px] text-slate-500">Reception & Information</span>
                </div>
              </div>

              {/* MediKiosk Kiosk Feature Note */}
              {selectedHospital.hasKiosk && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-2 border-teal-500/30 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wide">
                      {language === 'hi' ? 'मेडीकियोस्क स्मार्ट हेल्थ कियोस्क उपलब्ध' : 'MediKiosk Smart Health Kiosk Installed'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {language === 'hi'
                        ? 'इस अस्पताल में आगमन पर कियोस्क स्क्रीन पर क्यूआर स्कैन करके अपनी डिजिटल यात्रा तुरंत जारी रख सकते हैं।'
                        : 'On arrival at this facility, scan the screen QR code with your phone to instantly link your intake summary and OPD token.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Departments */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {language === 'hi' ? 'उपलब्ध चिकित्सा विभाग' : 'Available Medical Departments'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedHospital.departments.map(dept => (
                    <span
                      key={dept}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 text-xs font-semibold border border-teal-200 dark:border-teal-800"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {language === 'hi' ? 'परिसर सुविधाएं एवं सेवाएं' : 'Campus Facilities & Amenities'}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedHospital.facilities.map(fac => (
                    <div key={fac} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* OPD Doctors on Duty with Call and Book Appointment */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {language === 'hi' ? 'ऑन-ड्यूटी ओपीडी चिकित्सक' : 'On-Duty OPD Physicians'}
                </h4>
                <div className="space-y-2.5">
                  {[
                    { name: 'Dr. R. Mehta', specialty: 'General Physician', dept: 'General Medicine', phone: selectedHospital.phone, room: 'Room 204' },
                    { name: 'Dr. S. K. Aggarwal', specialty: 'Consultant Cardiologist', dept: 'Cardiology', phone: selectedHospital.phone, room: 'Room 105' }
                  ].map(doc => (
                    <div key={doc.name} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100/60 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shadow-inner">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{doc.name}</p>
                          <p className="text-[11px] text-teal-600 font-bold">{doc.specialty} • {doc.room}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <a
                          href={`tel:${doc.phone}`}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-teal-600" />
                          <span>{language === 'hi' ? 'कॉल' : 'Call'}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDoctorForBooking({
                              name: doc.name,
                              specialty: doc.specialty,
                              department: doc.dept,
                              hospitalName: selectedHospital.name,
                              phone: doc.phone,
                              room: doc.room
                            });
                            setIsBookingModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'परामर्श बुक करें' : 'Book Appointment'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  selectedHospital.name + ' ' + selectedHospital.address + ' ' + selectedHospital.city
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>{language === 'hi' ? 'दिशा-निर्देश प्राप्त करें (Google Maps)' : 'Get Directions (Google Maps)'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${selectedHospital.phone}`}
                className="px-5 py-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-600" />
                <span>{language === 'hi' ? 'अस्पताल को कॉल करें' : 'Call Hospital'}</span>
              </a>
            </div>

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
          onAppointmentBooked={(newApt) => {
            // New appointment booked from hospital view
          }}
        />
      )}

    </div>
  );
};
