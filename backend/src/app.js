/**
 * Express Application Setup — Dhristi DNA Health Analyzer
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

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

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

// Logging
app.use(
  pinoHttp({
    level: ENV.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      ENV.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  })
);

// Body parsers
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', product: 'Dhristi', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', analyzeRoutes);
app.use('/api', recommendationRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
