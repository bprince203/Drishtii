/**
 * Blood Bank Types & Constants — Prajnaa
 * Shared type definitions and display labels.
 */

/** @type {Record<string, string>} Enum → Display label */
export const BLOOD_GROUP_LABELS = {
  A_POS: 'A+', A_NEG: 'A−', B_POS: 'B+', B_NEG: 'B−',
  AB_POS: 'AB+', AB_NEG: 'AB−', O_POS: 'O+', O_NEG: 'O−',
};

/** Blood group options for dropdowns */
export const BLOOD_GROUPS = [
  { value: 'A_POS', label: 'A+' },
  { value: 'A_NEG', label: 'A−' },
  { value: 'B_POS', label: 'B+' },
  { value: 'B_NEG', label: 'B−' },
  { value: 'AB_POS', label: 'AB+' },
  { value: 'AB_NEG', label: 'AB−' },
  { value: 'O_POS', label: 'O+' },
  { value: 'O_NEG', label: 'O−' },
];

/** Urgency level options with colors */
export const URGENCY_LEVELS = [
  { value: 'CRITICAL', label: 'Critical', color: 'text-red-600 bg-red-50 border-red-200' },
  { value: 'HIGH', label: 'High', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
];

/** Indian states for dropdowns */
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Chandigarh', 'Puducherry',
];

/** API base URL */
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
