/**
 * Health Controller — Prajnaa Medical Report Analyzer
 * Validates the uploaded file and delegates analysis to the AI service proxy.
 * Accepts PDF, JPG, PNG, WEBP, DOCX (matching multer fileFilter and FastAPI route).
 */

const { analyzeReport } = require('../services/aiService');

/**
 * POST /api/health/analyze
 * Expects a single file under the "file" field (via multer memoryStorage).
 */
async function analyzeHealthReport(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No file was uploaded. Please attach a document or image.' },
      });
    }

    // Proxy to AI service — multer already validated the MIME type
    const analysis = await analyzeReport(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    return res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeHealthReport };
