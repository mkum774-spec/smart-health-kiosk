import { HospitalFacility, HospitalFilters } from '../types';
import { MOCK_HOSPITALS } from './mockHospitals';

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 */
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

class HospitalService {
  private hospitals: HospitalFacility[] = [...MOCK_HOSPITALS];

  /**
   * Search and filter healthcare facilities with optional coordinates
   */
  public async getHospitals(options?: {
    query?: string;
    filters?: HospitalFilters;
    userLocation?: { lat: number; lng: number };
  }): Promise<HospitalFacility[]> {
    // Simulate brief network latency for authentic feel
    await new Promise(r => setTimeout(r, 150));

    let list = this.hospitals.map(h => {
      if (options?.userLocation) {
        const computedDist = calculateDistanceKm(
          options.userLocation.lat,
          options.userLocation.lng,
          h.coordinates.lat,
          h.coordinates.lng
        );
        return { ...h, distanceKm: computedDist };
      }
      return h;
    });

    // 1. Text Query Filter (Name, City, PIN code, Address, Department)
    if (options?.query && options.query.trim()) {
      const q = options.query.toLowerCase().trim();
      list = list.filter(h => 
        h.name.toLowerCase().includes(q) ||
        (h.nameHi && h.nameHi.includes(q)) ||
        h.city.toLowerCase().includes(q) ||
        h.pincode.includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.departments.some(d => d.toLowerCase().includes(q)) ||
        h.facilities.some(f => f.toLowerCase().includes(q))
      );
    }

    // 2. Specialty Filter
    if (options?.filters?.specialty && options.filters.specialty !== 'ALL') {
      const spec = options.filters.specialty.toLowerCase();
      list = list.filter(h => 
        h.departments.some(d => d.toLowerCase().includes(spec))
      );
    }

    // 3. Facility Type Filter
    if (options?.filters?.facilityType && options.filters.facilityType !== 'ALL') {
      list = list.filter(h => h.type === options.filters?.facilityType);
    }

    // 4. Distance Filter
    if (options?.filters?.maxDistanceKm && options.filters.maxDistanceKm > 0) {
      list = list.filter(h => h.distanceKm <= (options.filters?.maxDistanceKm || 999));
    }

    // 5. Open Only Filter
    if (options?.filters?.openOnly) {
      list = list.filter(h => h.operatingStatus === 'Open Now' || h.operatingStatus === '24x7');
    }

    // 6. 24x7 Filter
    if (options?.filters?.twentyFourSevenOnly) {
      list = list.filter(h => h.operatingStatus === '24x7');
    }

    // 7. Appointment Available Filter
    if (options?.filters?.appointmentOnly) {
      list = list.filter(h => h.appointmentAvailable);
    }

    // Sort by proximity
    list.sort((a, b) => a.distanceKm - b.distanceKm);

    return list;
  }

  /**
   * Get facility details by ID
   */
  public async getHospitalById(id: string): Promise<HospitalFacility | null> {
    const found = this.hospitals.find(h => h.id === id);
    return found ? { ...found } : null;
  }
}

export const hospitalService = new HospitalService();
