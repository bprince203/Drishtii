/**
 * Blood Bank Proxy Routes — Prajnaa
 * Serves blood bank directory data from in-memory dummy data.
 * Public endpoints — no auth required.
 */

const { Router } = require('express');
const { getBanks, getBankById } = require('../controllers/bloodbankProxyController');

const router = Router();

// GET /api/bloodbank/locator/banks         → Search blood banks
router.get('/banks', getBanks);

// GET /api/bloodbank/locator/banks/:id     → Get single blood bank detail
router.get('/banks/:id', getBankById);

module.exports = router;
