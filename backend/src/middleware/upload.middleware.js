/**
 * Upload Middleware — Prajnaa DNA Health Analyzer
 * Configures multer for genome file uploads with validation.
 * Supports up to 50MB files with disk storage for memory safety.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { ENV } = require('../config/env');

const ALLOWED_MIME_TYPES = [
  'text/plain',
  'text/csv',
  'text/tab-separated-values',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
];

const ALLOWED_EXTENSIONS = ['.txt', '.csv', '.tsv', '.zip'];

// Ensure temp upload directory exists
const UPLOAD_DIR = path.join(os.tmpdir(), 'dhristi-uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Sanitize filename: remove path traversal, keep only safe chars
    const sanitized = file.originalname
      .replace(/[^a-zA-Z0-9.\-_]/g, '_')
      .substring(0, 100);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `dhristi-${uniqueSuffix}-${sanitized}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  if (mimeOk || extOk) {
    cb(null, true);
  } else {
    cb(
      Object.assign(
        new Error(
          `Unsupported file type: ${file.mimetype} (${ext}). Please upload a .txt or .zip raw DNA data file.`
        ),
        { statusCode: 400 }
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: ENV.MAX_FILE_SIZE_BYTES,
    files: 1,
  },
});

module.exports = { upload };
