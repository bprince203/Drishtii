/**
 * Error Handler Middleware — Prajnaa AI Health Platform
 * Catches unhandled errors and returns structured JSON responses.
 */
const { ENV } = require('../config/env');

function errorHandler(err, _req, res, _next) {
  console.error(`[ERROR] ${err.name || 'Error'}: ${err.message}`);
  if (ENV.NODE_ENV !== 'production') console.error(err.stack);

  // ── Validation Errors (Zod or custom) ────────────────────────────
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Invalid request data.', details: err.errors || err.issues },
    });
  }

  if (err.name === 'ValidationError' || err.statusCode === 400) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: err.message || 'Invalid request data.' },
    });
  }

  // ── Auth Errors ──────────────────────────────────────────────────
  if (err.status === 401 || err.statusCode === 401) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
    });
  }

  // ── Custom status code ───────────────────────────────────────────
  const statusCode = err.statusCode || err.status || 500;
  if (statusCode !== 500) {
    return res.status(statusCode).json({
      error: { code: err.code || 'REQUEST_ERROR', message: err.message },
    });
  }

  // ── Generic 500 ─────────────────────────────────────────────────
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: ENV.NODE_ENV === 'production'
        ? 'An unexpected error occurred. Please try again later.'
        : err.message,
    },
  });
}

module.exports = { errorHandler };
