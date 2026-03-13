/**
 * End-to-end API test for /api/analyze
 * Run: node test/api-test.js
 */
const fs = require('fs');
const http = require('http');
const path = require('path');

const filePath = path.join(__dirname, 'sample_genome.txt');
const fileContent = fs.readFileSync(filePath);
const fileName = 'sample_genome.txt';
const boundary = '----TestBoundary' + Date.now();

const bodyParts = [];
bodyParts.push(`--${boundary}\r\n`);
bodyParts.push(`Content-Disposition: form-data; name="genomeFile"; filename="${fileName}"\r\n`);
bodyParts.push('Content-Type: text/plain\r\n\r\n');
const header = Buffer.from(bodyParts.join(''));
const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
const body = Buffer.concat([header, fileContent, footer]);

const req = http.request(
  {
    hostname: 'localhost',
    port: 3001,
    path: '/api/analyze',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': body.length,
    },
  },
  (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('=== API Test Results ===\n');
        console.log('Status Code:', res.statusCode);
        console.log('Success:', json.success);
        console.log('Analysis ID:', json.analysisId?.slice(0, 8) + '...');
        console.log('\n--- File Metadata ---');
        console.log('File:', json.meta?.fileName);
        console.log('Parsed Rows:', json.meta?.parsedRows);
        console.log('Skipped Rows:', json.meta?.skippedRows);
        console.log('Source Type:', json.meta?.sourceType);
        console.log('\n--- Trait Results ---');
        if (json.results) {
          json.results.forEach((r) => {
            const badge =
              r.status === 'predisposition_detected' ? '⚠️' :
              r.status === 'typical' ? '✅' :
              r.status === 'limited_evidence' ? '🔬' : '❓';
            console.log(`${badge} ${r.title}: ${r.status} (${r.confidence})`);
            console.log(`   ${r.summary.slice(0, 90)}...`);
            console.log(`   SNPs: ${r.matchedSnps.map((s) => s.rsid + '=' + (s.genotype || 'N/A')).join(', ')}`);
            console.log('');
          });
        }
        console.log('--- Warnings ---');
        console.log(json.warnings?.length ? json.warnings.join('\n') : 'None');
        console.log('\n✅ API test complete!');
      } catch (e) {
        console.error('Failed to parse response:', e.message);
        console.error('Raw response:', data.slice(0, 500));
      }
    });
  }
);

req.on('error', (err) => {
  console.error('Request failed:', err.message);
});

req.write(body);
req.end();
