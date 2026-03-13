/**
 * Genome Parser Service
 * Parses 23andMe raw data text format into a structured SNP map.
 *
 * 23andMe format:
 *   - Lines starting with # are comments/headers
 *   - Data lines are tab-separated: rsid  chromosome  position  genotype
 *   - Genotype may be single (X/Y/MT chromosomes) or double letter
 */

/**
 * @typedef {Object} ParsedSnp
 * @property {string} rsid
 * @property {string} chromosome
 * @property {string} position
 * @property {string} genotype
 */

/**
 * @typedef {Object} ParseResult
 * @property {{ totalRows: number, parsedRows: number, skippedRows: number, sourceType: string, fileName: string }} meta
 * @property {Record<string, ParsedSnp>} snps
 */

const VALID_RSID_PATTERN = /^rs\d+$/i;
const VALID_CHROMOSOMES = new Set([
  '1','2','3','4','5','6','7','8','9','10','11','12',
  '13','14','15','16','17','18','19','20','21','22',
  'X','Y','MT',
]);
const VALID_GENOTYPE_PATTERN = /^[ACGTDI\-]{1,2}$/i;

/**
 * Parses a single line of 23andMe data.
 * @param {string} line - A single line from the raw file
 * @returns {ParsedSnp | null} Parsed SNP or null if invalid/comment
 */
function parseLine(line) {
  const trimmed = line.trim();

  // Skip empty lines and comments
  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  const parts = trimmed.split('\t');
  if (parts.length < 4) {
    return null;
  }

  const [rsid, chromosome, position, genotype] = parts;

  // Validate rsid format
  if (!VALID_RSID_PATTERN.test(rsid)) {
    return null;
  }

  // Validate chromosome
  if (!VALID_CHROMOSOMES.has(chromosome.toUpperCase())) {
    return null;
  }

  // Validate position is numeric
  if (!/^\d+$/.test(position)) {
    return null;
  }

  // Validate and normalize genotype
  const normalizedGenotype = genotype.toUpperCase().replace('--', '-');
  if (normalizedGenotype !== '-' && !VALID_GENOTYPE_PATTERN.test(normalizedGenotype)) {
    return null;
  }

  return {
    rsid: rsid.toLowerCase(),
    chromosome: chromosome.toUpperCase(),
    position,
    genotype: normalizedGenotype,
  };
}

/**
 * Parses full 23andMe raw text content into structured output.
 * @param {string} content - Full text content of the 23andMe file
 * @param {string} fileName - Original file name
 * @param {string} [sourceType='text'] - Source type (text or zip)
 * @returns {ParseResult}
 */
function parseGenomeFile(content, fileName, sourceType = 'text') {
  const lines = content.split(/\r?\n/);
  const snps = {};
  let parsedRows = 0;
  let skippedRows = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    // Don't count empty lines or comments as "skipped data rows"
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const parsed = parseLine(line);
    if (parsed) {
      snps[parsed.rsid] = parsed;
      parsedRows++;
    } else {
      skippedRows++;
    }
  }

  return {
    meta: {
      totalRows: parsedRows + skippedRows,
      parsedRows,
      skippedRows,
      sourceType,
      fileName,
    },
    snps,
  };
}

module.exports = { parseGenomeFile, parseLine };
