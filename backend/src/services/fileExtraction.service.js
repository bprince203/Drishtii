/**
 * File Extraction Service
 * Handles .zip file extraction to find genome text files.
 */

const AdmZip = require('adm-zip');
const path = require('path');

const ALLOWED_EXTENSIONS = ['.txt', '.csv', '.tsv'];
const MAX_EXTRACTED_SIZE = 100 * 1024 * 1024; // 100MB safety limit

/**
 * Extracts a genome text file from a zip archive.
 * @param {string} zipFilePath - Path to the uploaded zip file
 * @returns {{ content: string, fileName: string }} Extracted file content and name
 * @throws {Error} If no valid genome file found or extraction fails
 */
function extractGenomeFromZip(zipFilePath) {
  const zip = new AdmZip(zipFilePath);
  const entries = zip.getEntries();

  // Find the first text-like file (ignore directories and hidden files)
  const genomeEntry = entries.find((entry) => {
    if (entry.isDirectory) return false;
    const name = entry.entryName;
    // Skip macOS resource forks and hidden files
    if (name.startsWith('__MACOSX') || name.startsWith('.')) return false;
    const ext = path.extname(name).toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext);
  });

  if (!genomeEntry) {
    throw Object.assign(
      new Error('No valid genome text file found inside the zip archive. Expected a .txt, .csv, or .tsv file.'),
      { statusCode: 400 }
    );
  }

  if (genomeEntry.header.size > MAX_EXTRACTED_SIZE) {
    throw Object.assign(
      new Error('Extracted file exceeds the maximum allowed size (100MB).'),
      { statusCode: 400 }
    );
  }

  const content = zip.readAsText(genomeEntry);
  return {
    content,
    fileName: path.basename(genomeEntry.entryName),
  };
}

module.exports = { extractGenomeFromZip };
