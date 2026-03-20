/**
 * Blood Bank API service — Prajnaa Blood Bank Locator
 */

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

/**
 * Search blood banks by location and/or blood group.
 * @param {{ lat?: number, lng?: number, city?: string, bloodGroup?: string }}
 * @returns {Promise<{ success: boolean, count: number, results: Array }>}
 */
export async function searchBloodBanks({ lat, lng, city, bloodGroup }) {
  const params = new URLSearchParams();
  if (lat != null) params.set('lat', String(lat));
  if (lng != null) params.set('lng', String(lng));
  if (city) params.set('city', city);
  if (bloodGroup) params.set('bloodGroup', bloodGroup);
  params.set('limit', '50');

  const response = await fetch(`${API_BASE}/blood-bank/search?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || `Request failed with status ${response.status}`);
  }

  return data;
}
