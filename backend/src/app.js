/**
 * Express Application Setup — Dhristi DNA Health Analyzer
 * Production-ready: CORS open, trust proxy, preflight, logging, error handling.
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

const app = express();

// Trust proxy (required for Render + rate limiting behind proxy)
app.set('trust proxy', 1);

// ── CORS ──────────────────────────────────────────────────────────────
// Public API — allow all origins. No credentials/cookies are used.
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: false,
};

// Handle OPTIONS preflight BEFORE anything else
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ── Security headers ──────────────────────────────────────────────────
// Relax CSP for API server (no HTML pages served)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

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
      product: 'Dhristi',
      error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' },
    },
  })
);

// ── Logging ───────────────────────────────────────────────────────────
app.use(pinoHttp({ level: ENV.NODE_ENV === 'production' ? 'info' : 'debug' }));

// ── Body parsers ──────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ── Health check ──────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', product: 'Dhristi', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────
app.use('/api', analyzeRoutes);
app.use('/api', recommendationRoutes);

// ── 404 ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } });
});

// ── Error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
