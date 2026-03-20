/**
 * Recommendation Routes — Prajnaa DNA Health Analyzer
 */

const { Router } = require('express');
const { getRecommendations } = require('../controllers/recommendation.controller');

const router = Router();

router.post('/recommendations', getRecommendations);

module.exports = router;
