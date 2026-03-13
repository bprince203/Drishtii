/**
 * Express Application Setup — Dhristi DNA Health Analyzer
 * Production-ready configuration.
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

// Trust Render/Vercel proxy
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS — allow the configured origin (or all origins if not set)
const allowedOrigins = ENV.CORS_ORIGIN
  ? ENV.CORS_ORIGIN.split(',').map((o) => o.trim())
  : true; // Allow all if not configured

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);

// Handle preflight
app.options('*', cors());

// Rate limiting
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
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
    },
  })
);

// Logging (plain JSON — works in production without pino-pretty)
app.use(
  pinoHttp({
    level: ENV.NODE_ENV === 'production' ? 'info' : 'debug',
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', product: 'Dhristi', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', analyzeRoutes);
app.use('/api', recommendationRoutes);

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
