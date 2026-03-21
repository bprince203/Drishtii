/**
 * Donor Routes — Prajnaa Blood Bank
 * All routes require Clerk authentication.
 */

const { Router } = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const {
  registerDonor,
  getMyDonorProfile,
  updateAvailability,
  createEmergencyRequest,
  getEmergencyRequests,
} = require('../controllers/donorController');

const router = Router();

// POST   /api/bloodbank/register       → Register or update donor profile
router.post('/register', requireAuth, registerDonor);

// GET    /api/bloodbank/me             → Get authenticated user's donor profile
router.get('/me', requireAuth, getMyDonorProfile);

// PATCH  /api/bloodbank/availability   → Toggle availability
router.patch('/availability', requireAuth, updateAvailability);

// POST   /api/bloodbank/emergency      → Create emergency request + notify donors
router.post('/emergency', requireAuth, createEmergencyRequest);

// GET    /api/bloodbank/emergency      → List OPEN emergency requests (paginated, public)
router.get('/emergency', getEmergencyRequests);

module.exports = router;
