/**
 * Health routes — Prajnaa Medical Report Analyzer
 * Uses multer memoryStorage so uploaded files are never written to disk.
 * Accepts: PDF, JPG, PNG, WEBP, DOCX
 */

const { Router } = require('express');
const multer = require('multer');
const { analyzeHealthReport } = require('../controllers/healthController');

const router = Router();

const ALLOWED_MIMETYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

// ── Multi-format in-memory upload ────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB — matches FastAPI route limit
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error(
        'Unsupported file type. Accepted: PDF, JPG, PNG, WEBP, DOCX'
      );
      err.statusCode = 400;
      err.code = 'INVALID_FILE_TYPE';
      cb(err, false);
    }
  },
});

// POST /api/health/analyze
router.post('/analyze', upload.single('file'), analyzeHealthReport);

module.exports = router;
