/**
 * Blood Bank Dataset — Curated from Indian National Health Portal / eRaktKosh public data.
 * Static dataset for development; will be replaced with real API later.
 *
 * Each entry has: id, name, city, state, address, phone, bloodGroups, lat, lng, timing
 */

const bloodBanks = [
  // ─── Delhi NCR (6) ────────────────────────────────────────
  { id: 'bb-001', name: 'Indian Red Cross Society - Delhi', city: 'New Delhi', state: 'Delhi', address: '1, Red Cross Road, New Delhi - 110001', phone: '011-23711551', lat: 28.6129, lng: 77.2295, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-002', name: 'Rotary Blood Bank', city: 'New Delhi', state: 'Delhi', address: '56-57, Tughlakabad Institutional Area, New Delhi - 110062', phone: '011-29956484', lat: 28.5177, lng: 77.2590, timing: '9AM–6PM', bloodGroups: ['A+', 'B+', 'O+', 'AB+', 'O-'] },
  { id: 'bb-003', name: 'AIIMS Blood Centre', city: 'New Delhi', state: 'Delhi', address: 'AIIMS Campus, Ansari Nagar, New Delhi - 110029', phone: '011-26588700', lat: 28.5672, lng: 77.2100, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-004', name: 'Sir Ganga Ram Hospital Blood Bank', city: 'New Delhi', state: 'Delhi', address: 'Rajinder Nagar, New Delhi - 110060', phone: '011-25750000', lat: 28.6377, lng: 77.1895, timing: '24/7', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+'] },
  { id: 'bb-005', name: 'Safdarjung Hospital Blood Bank', city: 'New Delhi', state: 'Delhi', address: 'Ansari Nagar West, New Delhi - 110029', phone: '011-26165060', lat: 28.5685, lng: 77.2066, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-006', name: 'Ram Manohar Lohia Hospital Blood Bank', city: 'New Delhi', state: 'Delhi', address: 'Baba Kharak Singh Marg, New Delhi - 110001', phone: '011-23365525', lat: 28.6274, lng: 77.2099, timing: '9AM–8PM', bloodGroups: ['A+', 'B+', 'O+', 'AB+', 'B-'] },

  // ─── Mumbai (6) ───────────────────────────────────────────
  { id: 'bb-007', name: 'Tata Memorial Hospital Blood Bank', city: 'Mumbai', state: 'Maharashtra', address: 'Dr E Borges Road, Parel, Mumbai - 400012', phone: '022-24177000', lat: 19.0044, lng: 72.8432, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-008', name: 'KEM Hospital Blood Bank', city: 'Mumbai', state: 'Maharashtra', address: 'Acharya Donde Marg, Parel, Mumbai - 400012', phone: '022-24107000', lat: 19.0003, lng: 72.8416, timing: '24/7', bloodGroups: ['A+', 'B+', 'O+', 'AB+', 'B-'] },
  { id: 'bb-009', name: 'Jaslok Hospital Blood Bank', city: 'Mumbai', state: 'Maharashtra', address: '15, Dr G Deshmukh Marg, Mumbai - 400026', phone: '022-66573333', lat: 18.9714, lng: 72.8117, timing: '9AM–9PM', bloodGroups: ['A+', 'A-', 'B+', 'O+', 'O-'] },
  { id: 'bb-010', name: 'Sion Hospital Blood Bank', city: 'Mumbai', state: 'Maharashtra', address: 'Dr Ambedkar Road, Sion, Mumbai - 400022', phone: '022-24076381', lat: 19.0402, lng: 72.8620, timing: '24/7', bloodGroups: ['A+', 'B+', 'B-', 'O+', 'O-', 'AB+'] },
  { id: 'bb-011', name: 'Lilavati Hospital Blood Bank', city: 'Mumbai', state: 'Maharashtra', address: 'A-791, Bandra Reclamation, Mumbai - 400050', phone: '022-26751000', lat: 19.0509, lng: 72.8294, timing: '9AM–7PM', bloodGroups: ['A+', 'A-', 'B+', 'O+', 'AB+', 'AB-'] },
  { id: 'bb-012', name: 'Hinduja Hospital Blood Bank', city: 'Mumbai', state: 'Maharashtra', address: 'Veer Savarkar Marg, Mahim, Mumbai - 400016', phone: '022-24451515', lat: 19.0373, lng: 72.8403, timing: '24/7', bloodGroups: ['A+', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },

  // ─── Bangalore (5) ────────────────────────────────────────
  { id: 'bb-013', name: 'Sankalp India Foundation', city: 'Bangalore', state: 'Karnataka', address: '#1, Wheeler Road, Cox Town, Bangalore - 560005', phone: '080-25480440', lat: 12.9900, lng: 77.6100, timing: '9AM–6PM', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-014', name: 'Narayana Health Blood Bank', city: 'Bangalore', state: 'Karnataka', address: 'Hosur Road, Bommasandra, Bangalore - 560099', phone: '080-71222222', lat: 12.8015, lng: 77.6528, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-015', name: 'St Johns Medical College Blood Bank', city: 'Bangalore', state: 'Karnataka', address: 'Koramangala, Bangalore - 560034', phone: '080-22065000', lat: 12.9304, lng: 77.6190, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'O+', 'O-', 'AB+'] },
  { id: 'bb-016', name: 'Manipal Hospital Blood Bank', city: 'Bangalore', state: 'Karnataka', address: '98, HAL Airport Road, Bangalore - 560017', phone: '080-25024444', lat: 12.9592, lng: 77.6474, timing: '24/7', bloodGroups: ['A+', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-017', name: 'Bangalore Medical College Blood Bank', city: 'Bangalore', state: 'Karnataka', address: 'Fort, K R Road, Bangalore - 560002', phone: '080-26701150', lat: 12.9616, lng: 77.5729, timing: '9AM–5PM', bloodGroups: ['A+', 'B+', 'O+', 'AB+'] },

  // ─── Chennai (4) ──────────────────────────────────────────
  { id: 'bb-018', name: 'Apollo Hospital Blood Bank', city: 'Chennai', state: 'Tamil Nadu', address: '21, Greams Lane, Chennai - 600006', phone: '044-28290200', lat: 13.0630, lng: 80.2560, timing: '24/7', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+'] },
  { id: 'bb-019', name: 'Government General Hospital Blood Bank', city: 'Chennai', state: 'Tamil Nadu', address: 'Park Town, Chennai - 600003', phone: '044-25305000', lat: 13.0827, lng: 80.2785, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-020', name: 'MIOT International Blood Bank', city: 'Chennai', state: 'Tamil Nadu', address: '4/112 Mount Poonamallee Road, Chennai - 600089', phone: '044-42002288', lat: 13.0340, lng: 80.1570, timing: '9AM–8PM', bloodGroups: ['A+', 'A-', 'B+', 'O+', 'O-', 'AB+'] },
  { id: 'bb-021', name: 'Sri Ramachandra Blood Bank', city: 'Chennai', state: 'Tamil Nadu', address: 'Porur, Chennai - 600116', phone: '044-24768027', lat: 13.0347, lng: 80.1426, timing: '24/7', bloodGroups: ['A+', 'B+', 'B-', 'O+', 'AB+', 'AB-'] },

  // ─── Kolkata (4) ──────────────────────────────────────────
  { id: 'bb-022', name: 'NRS Medical College Blood Bank', city: 'Kolkata', state: 'West Bengal', address: '138, AJC Bose Road, Kolkata - 700014', phone: '033-22650966', lat: 22.5485, lng: 88.3520, timing: '24/7', bloodGroups: ['A+', 'B+', 'O+', 'AB+', 'O-'] },
  { id: 'bb-023', name: 'Association of Voluntary Blood Donors', city: 'Kolkata', state: 'West Bengal', address: '16A, Elgin Road, Kolkata - 700020', phone: '033-22803626', lat: 22.5363, lng: 88.3500, timing: '10AM–6PM', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-024', name: 'SSKM Hospital Blood Bank', city: 'Kolkata', state: 'West Bengal', address: '244, AJC Bose Road, Kolkata - 700020', phone: '033-22041101', lat: 22.5375, lng: 88.3448, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-025', name: 'RN Tagore Hospital Blood Bank', city: 'Kolkata', state: 'West Bengal', address: 'Mukundapur, EM Bypass, Kolkata - 700099', phone: '033-66250000', lat: 22.5075, lng: 88.3963, timing: '24/7', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+'] },

  // ─── Hyderabad (4) ────────────────────────────────────────
  { id: 'bb-026', name: 'NIMS Blood Bank', city: 'Hyderabad', state: 'Telangana', address: 'Panjagutta, Hyderabad - 500082', phone: '040-23489000', lat: 17.3950, lng: 78.4550, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-027', name: 'Yashoda Hospital Blood Bank', city: 'Hyderabad', state: 'Telangana', address: 'Raj Bhavan Road, Somajiguda, Hyderabad - 500082', phone: '040-45674567', lat: 17.4065, lng: 78.4550, timing: '9AM–9PM', bloodGroups: ['A+', 'B+', 'O+', 'AB+'] },
  { id: 'bb-028', name: 'Gandhi Hospital Blood Bank', city: 'Hyderabad', state: 'Telangana', address: 'Musheerabad, Hyderabad - 500003', phone: '040-23818330', lat: 17.3992, lng: 78.4983, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+'] },
  { id: 'bb-029', name: 'Care Hospital Blood Bank', city: 'Hyderabad', state: 'Telangana', address: 'Road No 1, Banjara Hills, Hyderabad - 500034', phone: '040-30418888', lat: 17.4135, lng: 78.4427, timing: '24/7', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+', 'AB-'] },

  // ─── Pune (4) ─────────────────────────────────────────────
  { id: 'bb-030', name: 'Sassoon General Hospital Blood Bank', city: 'Pune', state: 'Maharashtra', address: 'Near Pune Station, Pune - 411001', phone: '020-26126000', lat: 18.5260, lng: 73.8721, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-031', name: 'Jankalyan Blood Bank', city: 'Pune', state: 'Maharashtra', address: 'Sadashiv Peth, Pune - 411030', phone: '020-24471313', lat: 18.5100, lng: 73.8550, timing: '10AM–5PM', bloodGroups: ['A+', 'B+', 'O+', 'O-'] },
  { id: 'bb-032', name: 'Ruby Hall Clinic Blood Bank', city: 'Pune', state: 'Maharashtra', address: '40, Sassoon Road, Pune - 411001', phone: '020-26163391', lat: 18.5276, lng: 73.8749, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-033', name: 'Sahyadri Hospital Blood Bank', city: 'Pune', state: 'Maharashtra', address: 'Plot 30-C, Karve Road, Pune - 411004', phone: '020-67213000', lat: 18.5071, lng: 73.8346, timing: '9AM–7PM', bloodGroups: ['A+', 'B+', 'O+', 'AB+', 'O-'] },

  // ─── Ahmedabad (3) ────────────────────────────────────────
  { id: 'bb-034', name: 'Red Cross Blood Bank Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', address: 'Lal Darwaja, Ahmedabad - 380001', phone: '079-25506232', lat: 23.0225, lng: 72.5714, timing: '9AM–6PM', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-035', name: 'Civil Hospital Blood Bank', city: 'Ahmedabad', state: 'Gujarat', address: 'Asarwa, Ahmedabad - 380016', phone: '079-22683721', lat: 23.0464, lng: 72.6062, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-036', name: 'Sola Civil Hospital Blood Bank', city: 'Ahmedabad', state: 'Gujarat', address: 'Sola Road, Ahmedabad - 380060', phone: '079-27432500', lat: 23.0634, lng: 72.5178, timing: '24/7', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+'] },

  // ─── Jaipur (3) ───────────────────────────────────────────
  { id: 'bb-037', name: 'SMS Hospital Blood Bank', city: 'Jaipur', state: 'Rajasthan', address: 'JLN Marg, Jaipur - 302004', phone: '0141-2518380', lat: 26.9124, lng: 75.7873, timing: '24/7', bloodGroups: ['A+', 'B+', 'B-', 'O+', 'O-', 'AB+'] },
  { id: 'bb-038', name: 'Fortis Escorts Hospital Blood Bank', city: 'Jaipur', state: 'Rajasthan', address: 'JLN Marg, Malviya Nagar, Jaipur - 302017', phone: '0141-2547000', lat: 26.8660, lng: 75.8072, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-039', name: 'Mahatma Gandhi Hospital Blood Bank', city: 'Jaipur', state: 'Rajasthan', address: 'RIICO Industrial Area, Sitapura, Jaipur - 302022', phone: '0141-2771001', lat: 26.7843, lng: 75.8458, timing: '9AM–6PM', bloodGroups: ['A+', 'B+', 'O+', 'AB+'] },

  // ─── Lucknow (3) ──────────────────────────────────────────
  { id: 'bb-040', name: 'KGMU Blood Bank', city: 'Lucknow', state: 'Uttar Pradesh', address: 'Shah Mina Road, Lucknow - 226003', phone: '0522-2257540', lat: 26.8467, lng: 80.9462, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-041', name: 'SGPGI Blood Bank', city: 'Lucknow', state: 'Uttar Pradesh', address: 'Raibareli Road, Lucknow - 226014', phone: '0522-2495225', lat: 26.8105, lng: 80.9525, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-042', name: 'Balrampur Hospital Blood Bank', city: 'Lucknow', state: 'Uttar Pradesh', address: 'Kaiserbagh, Lucknow - 226001', phone: '0522-2212312', lat: 26.8508, lng: 80.9370, timing: '9AM–5PM', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+'] },

  // ─── Chandigarh (2) ───────────────────────────────────────
  { id: 'bb-043', name: 'PGI Blood Bank', city: 'Chandigarh', state: 'Chandigarh', address: 'PGIMER, Sector 12, Chandigarh - 160012', phone: '0172-2747585', lat: 30.7649, lng: 76.7757, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-044', name: 'GMCH Blood Bank', city: 'Chandigarh', state: 'Chandigarh', address: 'Sector 32, Chandigarh - 160030', phone: '0172-2665253', lat: 30.7333, lng: 76.7794, timing: '24/7', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+'] },

  // ─── Bhopal (2) ───────────────────────────────────────────
  { id: 'bb-045', name: 'Hamidia Hospital Blood Bank', city: 'Bhopal', state: 'Madhya Pradesh', address: 'Royal Market, Bhopal - 462001', phone: '0755-2540222', lat: 23.2599, lng: 77.4126, timing: '24/7', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+'] },
  { id: 'bb-046', name: 'AIIMS Bhopal Blood Bank', city: 'Bhopal', state: 'Madhya Pradesh', address: 'Saket Nagar, Bhopal - 462020', phone: '0755-2672355', lat: 23.2044, lng: 77.4366, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },

  // ─── Kerala (3) ───────────────────────────────────────────
  { id: 'bb-047', name: 'MCH Blood Bank Trivandrum', city: 'Thiruvananthapuram', state: 'Kerala', address: 'Medical College, Thiruvananthapuram - 695011', phone: '0471-2528386', lat: 8.5241, lng: 76.9366, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-048', name: 'Amrita Hospital Blood Bank', city: 'Kochi', state: 'Kerala', address: 'AIMS Ponekkara, Kochi - 682041', phone: '0484-2851234', lat: 10.0260, lng: 76.3125, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-049', name: 'Calicut Medical College Blood Bank', city: 'Kozhikode', state: 'Kerala', address: 'Medical College Road, Kozhikode - 673008', phone: '0495-2357010', lat: 11.2588, lng: 75.7804, timing: '24/7', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+'] },

  // ─── Other Major Cities (8) ───────────────────────────────
  { id: 'bb-050', name: 'PMCH Blood Bank', city: 'Patna', state: 'Bihar', address: 'Ashok Rajpath, Patna - 800004', phone: '0612-2300343', lat: 25.6093, lng: 85.1376, timing: '24/7', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+'] },
  { id: 'bb-051', name: 'GMCH Blood Bank Guwahati', city: 'Guwahati', state: 'Assam', address: 'Bhangagarh, Guwahati - 781032', phone: '0361-2529457', lat: 26.1445, lng: 91.7362, timing: '9AM–5PM', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+'] },
  { id: 'bb-052', name: 'SCB Medical College Blood Bank', city: 'Cuttack', state: 'Odisha', address: 'Manglabag, Cuttack - 753007', phone: '0671-2414080', lat: 20.4625, lng: 85.8830, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-053', name: 'CMC Vellore Blood Bank', city: 'Vellore', state: 'Tamil Nadu', address: 'Ida Scudder Road, Vellore - 632004', phone: '0416-2281000', lat: 12.9249, lng: 79.1325, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-054', name: 'JIPMER Blood Bank', city: 'Puducherry', state: 'Puducherry', address: 'Dhanvantri Nagar, Puducherry - 605006', phone: '0413-2296000', lat: 11.9570, lng: 79.7876, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-055', name: 'Command Hospital Blood Bank', city: 'Pune', state: 'Maharashtra', address: 'Southern Command, Wanowrie, Pune - 411040', phone: '020-26834000', lat: 18.4901, lng: 73.9014, timing: '9AM–5PM', bloodGroups: ['A+', 'B+', 'O+', 'O-'] },
  { id: 'bb-056', name: 'PGIMS Blood Bank', city: 'Rohtak', state: 'Haryana', address: 'Medical Road, Rohtak - 124001', phone: '01262-281307', lat: 28.8925, lng: 76.6061, timing: '24/7', bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  { id: 'bb-057', name: 'IGMC Blood Bank Shimla', city: 'Shimla', state: 'Himachal Pradesh', address: 'The Ridge, Shimla - 171001', phone: '0177-2804251', lat: 31.1048, lng: 77.1734, timing: '9AM–5PM', bloodGroups: ['A+', 'B+', 'O+', 'O-', 'AB+'] },
];

/**
 * Calculate distance between two lat/lng points in km (Haversine formula)
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Search blood banks by location and optional blood group.
 * @param {{ lat?: number, lng?: number, city?: string, bloodGroup?: string, limit?: number }}
 * @returns {Array} Sorted by distance (if lat/lng provided)
 */
function searchBloodBanks({ lat, lng, city, bloodGroup, limit = 50 }) {
  let results = [...bloodBanks];

  // Filter by blood group if specified
  if (bloodGroup) {
    results = results.filter((bb) => bb.bloodGroups.includes(bloodGroup));
  }

  // Filter by city (case-insensitive partial match on city, state, or name)
  if (city) {
    const q = city.toLowerCase();
    results = results.filter(
      (bb) =>
        bb.city.toLowerCase().includes(q) ||
        bb.state.toLowerCase().includes(q) ||
        bb.name.toLowerCase().includes(q) ||
        bb.address.toLowerCase().includes(q)
    );
  }

  // If coordinates provided, sort by distance
  if (lat != null && lng != null) {
    results = results.map((bb) => ({
      ...bb,
      distance: Math.round(haversineDistance(lat, lng, bb.lat, bb.lng) * 10) / 10,
    }));
    results.sort((a, b) => a.distance - b.distance);
  }

  return results.slice(0, limit);
}

module.exports = { bloodBanks, searchBloodBanks };
