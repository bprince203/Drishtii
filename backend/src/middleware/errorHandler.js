/**
 * Central Error Handler — Prajnaa DNA Health Analyzer
 * Consistent JSON error responses for all error types.
 */

function errorHandler(err, _req, res, _next) {
  // Determine status code
  let statusCode = err.statusCode || err.status || 500;
  let code = 'INTERNAL_ERROR';
  let message = err.message || 'An internal server error occurred.';

  // Handle Multer-specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    code = 'FILE_TOO_LARGE';
    message = 'File too large. Maximum upload size is 50 MB.';
  } else if (err.code === 'LIMIT_FILE_COUNT') {
    statusCode = 400;
    code = 'TOO_MANY_FILES';
    message = 'Only one file can be uploaded at a time.';
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    code = 'INVALID_FIELD';
    message = 'File must be uploaded using the "genomeFile" field.';
  } else if (statusCode === 400) {
    code = 'BAD_REQUEST';
  } else if (statusCode === 413) {
    code = 'FILE_TOO_LARGE';
  }

  // Never expose internal errors in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'An internal server error occurred. Please try again later.';
  }

  res.status(statusCode).json({
    success: false,
    product: 'Prajnaa',
    error: {
      code,
      message,
    },
  });
}

module.exports = { errorHandler };
