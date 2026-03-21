/**
 * Express Application Setup — Prajnaa AI Health Platform
 * Production-ready: CORS, Clerk auth, logging, error handling.
 * Uses in-memory dummy data for blood bank features (no Prisma dependency).
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const { ENV } = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');
const analyzeRoutes = require('./routes/analyze.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const healthRoutes = require('./routes/health.routes');
const bloodBankRoutes = require('./routes/bloodBank.routes');
const donorRoutes = require('./routes/donor.routes');
const bloodbankProxyRoutes = require('./routes/bloodbankProxy.routes');

const app = express();

// Trust proxy (required for Render + rate limiting behind proxy)
app.set('trust proxy', 1);

// ── CORS ──────────────────────────────────────────────────────────────
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : '*';

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true,
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ── Security headers ──────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ── Clerk middleware (global — parses auth from all requests) ──────────
// Only activate if CLERK_SECRET_KEY is set (graceful degradation)
if (ENV.CLERK_SECRET_KEY) {
  try {
    const { clerkAuth } = require('./middleware/requireAuth');
    app.use(clerkAuth);
    console.log('✅ Clerk authentication middleware loaded.');
  } catch (err) {
    console.warn('⚠️  Failed to load Clerk middleware:', err.message);
  }
}

// ── Rate limiting ─────────────────────────────────────────────────────
app.use(
  '/api/',
  rateLimit({
    windowMs: ENV.RATE_LIMIT_WINDOW_MS,
    max: ENV.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      product: 'Prajnaa',
      error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' },
    },
  })
);

// ── Logging ───────────────────────────────────────────────────────────
app.use(pinoHttp({ level: ENV.NODE_ENV === 'production' ? 'info' : 'debug' }));

// ── Body parsers ──────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', product: 'Prajnaa', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────
// Existing features
app.use('/api', analyzeRoutes);
app.use('/api', recommendationRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/blood-bank', bloodBankRoutes);           // Legacy static locator

// Blood Bank — Donor Registry (auth required — handled inside routes)
app.use('/api/bloodbank', donorRoutes);

// Blood Bank — Locator with dummy data (public — no auth)
app.use('/api/bloodbank/locator', bloodbankProxyRoutes);

// ── 404 ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } });
});

// ── Error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
