/**
 * AI Service proxy — Prajnaa Medical Report Analyzer
 * Forwards file buffers to the FastAPI microservice and returns structured JSON.
 * Supports: PDF, JPG, PNG, WEBP, DOCX via Gemini Vision multimodal.
 */

const axios = require('axios');
const FormData = require('form-data');

const AI_SERVICE_BASE_URL = process.env.AI_SERVICE_BASE_URL || 'http://localhost:8000';

/**
 * Forwards a file buffer to the FastAPI microservice and returns the analysis.
 *
 * @param {Buffer} fileBuffer      - Raw file bytes from multer memoryStorage
 * @param {string} originalName    - Original filename
 * @param {string} mimeType        - MIME type (PDF, image, or DOCX)
 * @returns {Promise<Object>}      - ReportAnalysisResponse JSON
 */
async function analyzeReport(fileBuffer, originalName, mimeType) {
  const form = new FormData();
  form.append('file', fileBuffer, {
    filename: originalName,
    contentType: mimeType,
  });

  try {
    const response = await axios.post(`${AI_SERVICE_BASE_URL}/analyze/report`, form, {
      headers: form.getHeaders(),
      // 90s timeout — Gemini Vision on multi-page scanned PDFs can take longer
      timeout: 90_000,
      validateStatus: null,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    const message = response.data?.detail || 'AI service returned an error.';
    const err = new Error(message);
    err.statusCode = response.status;
    err.code = 'AI_SERVICE_ERROR';
    throw err;
  } catch (axiosErr) {
    if (!axiosErr.statusCode) {
      const err = new Error('AI service is temporarily unavailable. Please try again later.');
      err.statusCode = 503;
      err.code = 'AI_SERVICE_UNAVAILABLE';
      throw err;
    }
    throw axiosErr;
  }
}

module.exports = { analyzeReport };
