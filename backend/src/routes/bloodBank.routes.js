/**
 * Blood Bank Routes — Prajnaa Blood Bank Locator
 */

const { Router } = require('express');
const { searchBloodBankHandler } = require('../controllers/bloodBank.controller');

const router = Router();

// GET /api/blood-bank/search
router.get('/search', searchBloodBankHandler);

module.exports = router;
