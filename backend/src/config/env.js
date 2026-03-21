require('dotenv').config();

const ENV = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '30', 10),
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  AI_SERVICE_BASE_URL: process.env.AI_SERVICE_BASE_URL || 'http://localhost:8000',

  // ── Clerk Auth ─────────────────────
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || '',
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || '',

  // ── Database (Supabase + Prisma) ───
  DATABASE_URL: process.env.DATABASE_URL || '',
  DIRECT_URL: process.env.DIRECT_URL || '',

  // ── Twilio (SMS + WhatsApp) ────────
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
  TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER || '',

  // ── SMTP (Email) ───────────────────
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || '587',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',

  // ── External Blood Bank API ────────
  EXTERNAL_BLOODBANK_API_URL: process.env.EXTERNAL_BLOODBANK_API_URL || '',
  EXTERNAL_BLOODBANK_API_KEY: process.env.EXTERNAL_BLOODBANK_API_KEY || '',
};

ENV.MAX_FILE_SIZE_BYTES = ENV.MAX_FILE_SIZE_MB * 1024 * 1024;

if (!ENV.GROQ_API_KEY) {
  console.warn('⚠️  GROQ_API_KEY is not set — AI recommendations unavailable.');
}

if (!process.env.AI_SERVICE_BASE_URL) {
  console.warn('⚠️  AI_SERVICE_BASE_URL is not set — Medical Report Analyzer will target http://localhost:8000.');
}

if (!ENV.CLERK_SECRET_KEY) {
  console.warn('⚠️  CLERK_SECRET_KEY is not set — Auth-protected routes will fail.');
}

if (!ENV.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL is not set — Database features will fail.');
}

module.exports = { ENV };
