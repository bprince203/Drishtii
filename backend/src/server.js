/**
 * Server Entry Point — Dhristi DNA Health Analyzer
 */

const app = require('./app');
const { ENV } = require('./config/env');

app.listen(ENV.PORT, () => {
  console.log(`🧬 Dhristi DNA Health Analyzer running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
  console.log(`   Health check: http://localhost:${ENV.PORT}/api/health`);
});
