/**
 * Blood Group Mapper — Prajnaa
 * Converts between display format (A+, B−) and DB format (A_POS, B_NEG).
 * Handles both directions and validates either format.
 */

const DISPLAY_TO_DB = {
    'A+': 'A_POS', 'A-': 'A_NEG',
    'B+': 'B_POS', 'B-': 'B_NEG',
    'AB+': 'AB_POS', 'AB-': 'AB_NEG',
    'O+': 'O_POS', 'O-': 'O_NEG',
    // Also handle unicode minus sign (−)
    'A−': 'A_NEG', 'B−': 'B_NEG', 'AB−': 'AB_NEG', 'O−': 'O_NEG',
};

const DB_TO_DISPLAY = {
    A_POS: 'A+', A_NEG: 'A-',
    B_POS: 'B+', B_NEG: 'B-',
    AB_POS: 'AB+', AB_NEG: 'AB-',
    O_POS: 'O+', O_NEG: 'O-',
};

const ALL_DB_VALUES = new Set(Object.keys(DB_TO_DISPLAY));
const ALL_DISPLAY_VALUES = new Set(Object.keys(DISPLAY_TO_DB));

/**
 * Convert display format to DB format.
 * If already in DB format, returns as-is.
 * @param {string} display - e.g. "A+", "O-", or "A_POS"
 * @returns {string} DB format, e.g. "A_POS"
 */
function toDBFormat(display) {
    if (!display) return display;
    const trimmed = display.trim();
    // Already in DB format
    if (ALL_DB_VALUES.has(trimmed)) return trimmed;
    // Convert from display
    return DISPLAY_TO_DB[trimmed] || trimmed;
}

/**
 * Convert DB format to display format.
 * If already in display format, returns as-is.
 * @param {string} db - e.g. "A_POS", "O_NEG"
 * @returns {string} Display format, e.g. "A+", "O-"
 */
function toDisplayFormat(db) {
    if (!db) return db;
    const trimmed = db.trim();
    // Already in display format
    if (ALL_DISPLAY_VALUES.has(trimmed)) return trimmed;
    // Convert from DB
    return DB_TO_DISPLAY[trimmed] || trimmed;
}

/**
 * Check if a value is a valid blood group in either format.
 * @param {string} value - Blood group string
 * @returns {boolean}
 */
function isValidBloodGroup(value) {
    if (!value) return false;
    const trimmed = value.trim();
    return ALL_DB_VALUES.has(trimmed) || ALL_DISPLAY_VALUES.has(trimmed);
}

module.exports = { toDBFormat, toDisplayFormat, isValidBloodGroup, DISPLAY_TO_DB, DB_TO_DISPLAY };
