/**
 * Analyze Routes
 */

const { Router } = require('express');
const { upload } = require('../middleware/upload.middleware');
const { analyzeGenome } = require('../controllers/analyze.controller');

const router = Router();

// POST /api/analyze - Upload and analyze genome file
router.post('/analyze', upload.single('genomeFile'), analyzeGenome);

module.exports = router;
