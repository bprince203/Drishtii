require('dotenv').config();

const ENV = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  // In production set to your Vercel URL (comma-separated for multiple)
  // Example: https://drishtii.vercel.app,https://drishtii-git-main.vercel.app
  CORS_ORIGIN: process.env.CORS_ORIGIN || '',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '20', 10),
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  // URL of the FastAPI Medical Report Analyzer microservice
  AI_SERVICE_BASE_URL: process.env.AI_SERVICE_BASE_URL || 'http://localhost:8000',
};

ENV.MAX_FILE_SIZE_BYTES = ENV.MAX_FILE_SIZE_MB * 1024 * 1024;

if (!ENV.GROQ_API_KEY) {
  console.warn('⚠️  GROQ_API_KEY is not set — AI recommendations unavailable.');
}

if (!process.env.AI_SERVICE_BASE_URL) {
  console.warn('⚠️  AI_SERVICE_BASE_URL is not set — Medical Report Analyzer will target http://localhost:8000.');
}

if (ENV.NODE_ENV === 'production' && !ENV.CORS_ORIGIN) {
  console.warn('⚠️  CORS_ORIGIN is not set — all origins will be allowed in production. Set it to your Vercel URL.');
}

module.exports = { ENV };
