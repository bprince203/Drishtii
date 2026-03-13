/** @type {import('dotenv')} */
require('dotenv').config();

const ENV = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '20', 10),
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
};

ENV.MAX_FILE_SIZE_BYTES = ENV.MAX_FILE_SIZE_MB * 1024 * 1024;

// Startup validation
if (!ENV.GROQ_API_KEY) {
  console.warn('⚠️  GROQ_API_KEY is not set. AI recommendation endpoint will be unavailable.');
}

module.exports = { ENV };
