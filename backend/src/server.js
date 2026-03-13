/**
 * Server Entry Point — Dhristi DNA Health Analyzer
 * Reads PORT from process.env — required for Render deployment.
 */

const app = require('./app');
const { ENV } = require('./config/env');

// Render assigns PORT dynamically — always read from process.env.PORT
const PORT = parseInt(process.env.PORT || ENV.PORT || '3001', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧬 Dhristi DNA Health Analyzer running on port ${PORT} [${ENV.NODE_ENV}]`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
