/**
 * Donor Controller — Prajnaa Blood Bank
 * All handlers use in-memory dummy data (no Prisma dependency).
 * Blood group conversion happens at the controller boundary.
 */

const { donorRegistry, emergencyRequests } = require('../data/dummyBloodData');
const { toDBFormat, toDisplayFormat, isValidBloodGroup } = require('../utils/bloodGroupMapper');

const VALID_URGENCY_LEVELS = ['CRITICAL', 'HIGH', 'MEDIUM'];

/**
 * Validate E.164 phone format: starts with +, 10-15 digits total.
 */
function isValidPhone(phone) {
  return /^\+[1-9]\d{9,14}$/.test(phone);
}

/**
 * POST /api/bloodbank/register
 * Register or update donor profile.
 */
function registerDonor(req, res, next) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    // Sanitize inputs
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const phone = (req.body.phone || '').trim();
    const whatsapp = (req.body.whatsapp || '').trim() || null;
    const bloodGroupRaw = (req.body.bloodGroup || '').trim();
    const city = (req.body.city || '').trim();
    const state = (req.body.state || '').trim();

    // Validate required fields
    if (!name || !email || !phone || !bloodGroupRaw || !city || !state) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'All fields are required: name, email, phone, bloodGroup, city, state.' },
      });
    }

    // Convert blood group to DB format (handles both "A+" and "A_POS" inputs)
    const bloodGroup = toDBFormat(bloodGroupRaw);
    if (!isValidBloodGroup(bloodGroup)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: `Invalid blood group: "${bloodGroupRaw}".` },
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Phone must be in E.164 format (e.g. +919876543210).' },
      });
    }

    if (whatsapp && !isValidPhone(whatsapp)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'WhatsApp number must be in E.164 format.' },
      });
    }

    // Upsert: find existing donor by clerkUserId
    const existingIndex = donorRegistry.findIndex((d) => d.clerkUserId === userId);

    if (existingIndex !== -1) {
      // Update in-place
      Object.assign(donorRegistry[existingIndex], {
        name, email, phone, whatsapp, bloodGroup, city, state,
      });
      return res.status(200).json({ success: true, donor: donorRegistry[existingIndex] });
    }

    // Create new donor
    const newDonor = {
      id: `donor_${Date.now()}`,
      clerkUserId: userId,
      name,
      email,
      phone,
      whatsapp,
      bloodGroup,
      city,
      state,
      isAvailable: true,
      lastDonatedAt: null,
      createdAt: new Date().toISOString(),
    };
    donorRegistry.push(newDonor);

    res.status(200).json({ success: true, donor: newDonor });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/bloodbank/me
 * Get authenticated user's donor profile.
 */
function getMyDonorProfile(req, res, next) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const donor = donorRegistry.find((d) => d.clerkUserId === userId);
    if (!donor) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Not registered as a donor yet.' },
      });
    }

    // Return with display-format blood group
    res.json({
      success: true,
      donor: { ...donor, bloodGroup: donor.bloodGroup },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/bloodbank/availability
 * Update donor availability status.
 */
function updateAvailability(req, res, next) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { isAvailable } = req.body;
    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'isAvailable must be a boolean.' },
      });
    }

    const donor = donorRegistry.find((d) => d.clerkUserId === userId);
    if (!donor) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Donor profile not found.' },
      });
    }

    donor.isAvailable = isAvailable;
    res.json({ success: true, donor });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/bloodbank/emergency
 * Create emergency blood request and notify matched donors.
 * O_NEG donors are ALWAYS included (universal donors), regardless of city.
 */
function createEmergencyRequest(req, res, next) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    // Sanitize inputs
    const bloodGroupRaw = (req.body.bloodGroup || '').trim();
    const city = (req.body.city || '').trim();
    const state = (req.body.state || '').trim();
    const hospitalName = (req.body.hospitalName || '').trim();
    const contactPhone = (req.body.contactPhone || '').trim();
    const urgencyLevel = (req.body.urgencyLevel || '').trim() || 'HIGH';
    const message = (req.body.message || '').trim().slice(0, 500) || null;

    // Validate required fields
    if (!bloodGroupRaw || !city || !state || !hospitalName || !contactPhone) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Required: bloodGroup, city, state, hospitalName, contactPhone.' },
      });
    }

    const bloodGroup = toDBFormat(bloodGroupRaw);
    if (!isValidBloodGroup(bloodGroup)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: `Invalid blood group: "${bloodGroupRaw}".` },
      });
    }

    if (!VALID_URGENCY_LEVELS.includes(urgencyLevel)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: `Invalid urgency level. Must be one of: ${VALID_URGENCY_LEVELS.join(', ')}` },
      });
    }

    // Find matching donors:
    // 1. Same blood group + same city (case-insensitive) + available
    // 2. O_NEG donors (universal) + available (ANY city)
    const cityLower = city.toLowerCase();
    const matchedDonorsMap = new Map();

    for (const donor of donorRegistry) {
      if (!donor.isAvailable) continue;

      const isSameBloodAndCity =
        donor.bloodGroup === bloodGroup &&
        donor.city.toLowerCase() === cityLower;

      const isUniversalDonor = donor.bloodGroup === 'O_NEG';

      if (isSameBloodAndCity || isUniversalDonor) {
        matchedDonorsMap.set(donor.id, donor); // Deduplicate by id
      }
    }

    const matchedDonors = Array.from(matchedDonorsMap.values());

    // Simulate notifications (console log)
    for (const donor of matchedDonors) {
      const displayBG = toDisplayFormat(bloodGroup);
      console.log(`📱 Notifying ${donor.name} via SMS+WhatsApp+Email for ${displayBG} in ${city}`);
    }

    // Create the emergency request
    const request = {
      id: `req_${Date.now()}`,
      requestedBy: userId,
      bloodGroup,
      city,
      state,
      hospitalName,
      contactPhone,
      urgencyLevel,
      message,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      _count: { notifications: matchedDonors.length },
    };

    emergencyRequests.push(request);

    res.status(201).json({
      success: true,
      request,
      matchedDonorsCount: matchedDonors.length,
      message: matchedDonors.length > 0
        ? `Emergency request created. ${matchedDonors.length} donor(s) are being notified via SMS, WhatsApp, and Email.`
        : 'Emergency request created. No matching donors found in this area yet.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/bloodbank/emergency
 * List OPEN emergency requests, paginated.
 * Public endpoint — no auth required.
 */
function getEmergencyRequests(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    // Filter OPEN requests and sort by createdAt DESC
    const openRequests = emergencyRequests
      .filter((r) => r.status === 'OPEN')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = openRequests.length;
    const paginated = openRequests.slice(skip, skip + limit);

    res.json({
      success: true,
      requests: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerDonor,
  getMyDonorProfile,
  updateAvailability,
  createEmergencyRequest,
  getEmergencyRequests,
};
