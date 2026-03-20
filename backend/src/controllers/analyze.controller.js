/**
 * Analyze Controller — Prajnaa DNA Health Analyzer
 * Handles the genome analysis request lifecycle:
 * 1. Receive uploaded file
 * 2. Extract if zip
 * 3. Parse genome data
 * 4. Run trait engine
 * 5. Return results
 * 6. Clean up temp files
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { parseGenomeFile } = require('../services/genomeParser.service');
const { evaluateAllTraits } = require('../services/traitEngine.service');
const { extractGenomeFromZip } = require('../services/fileExtraction.service');

const GLOBAL_DISCLAIMER =
  'Informational only. Not medical advice. Not for diagnosis, treatment, or emergency use. Genetic predispositions do not guarantee outcomes. Always consult qualified healthcare professionals for medical decisions.';

/**
 * POST /api/analyze
 * Accepts a 23andMe genome file, parses it, and returns health predisposition analysis.
 */
async function analyzeGenome(req, res, next) {
  let tempFilePath = null;

  try {
    if (!req.file) {
      const err = new Error('No file uploaded. Please upload a 23andMe raw DNA data file (.txt or .zip).');
      err.statusCode = 400;
      throw err;
    }

    tempFilePath = req.file.path;
    const originalName = req.file.originalname;
    const fileSize = req.file.size;
    const ext = path.extname(originalName).toLowerCase();

    let content;
    let fileName;
    let sourceType;

    // Handle zip vs text
    if (ext === '.zip') {
      const extracted = extractGenomeFromZip(tempFilePath);
      content = extracted.content;
      fileName = extracted.fileName;
      sourceType = 'zip';
    } else {
      content = fs.readFileSync(tempFilePath, 'utf-8');
      fileName = originalName;
      sourceType = 'text';
    }

    // Parse genome data
    const parsed = parseGenomeFile(content, fileName, sourceType);

    // Validate we got some data
    if (parsed.meta.parsedRows === 0) {
      const err = new Error(
        'No valid SNP data found in the uploaded file. Please ensure this is a 23andMe raw DNA data file.'
      );
      err.statusCode = 400;
      throw err;
    }

    // Run trait analysis
    const traitResults = evaluateAllTraits(parsed.snps);

    // Build warnings
    const warnings = [];
    const notFoundTraits = traitResults.filter((t) => t.status === 'not_found');
    if (notFoundTraits.length > 0) {
      warnings.push(
        `${notFoundTraits.length} trait(s) could not be evaluated because the required SNP markers were not found in your data.`
      );
    }
    if (parsed.meta.skippedRows > 0) {
      warnings.push(
        `${parsed.meta.skippedRows} row(s) in the file were skipped due to unexpected formatting.`
      );
    }

    // Build response
    const response = {
      success: true,
      product: 'Prajnaa',
      analysisId: uuidv4(),
      uploadedAt: new Date().toISOString(),
      meta: {
        ...parsed.meta,
        fileSize,
      },
      results: traitResults,
      warnings,
      globalDisclaimer: GLOBAL_DISCLAIMER,
    };

    res.json(response);
  } catch (err) {
    next(err);
  } finally {
    // Always clean up temp files
    if (tempFilePath) {
      fs.unlink(tempFilePath, (unlinkErr) => {
        if (unlinkErr) console.error('Failed to delete temp file:', unlinkErr.message);
      });
    }
  }
}

module.exports = { analyzeGenome };
