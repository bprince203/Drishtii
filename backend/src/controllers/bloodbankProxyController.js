/**
 * Blood Bank Proxy Controller — Prajnaa
 * Serves blood bank directory data from in-memory dummy data.
 * Replaces the external API proxy with local data for demo purposes.
 */

const { DUMMY_BLOOD_BANKS } = require('../data/dummyBloodData');
const { toDBFormat, toDisplayFormat } = require('../utils/bloodGroupMapper');

/**
 * GET /api/bloodbank/locator/banks
 * Search blood banks with optional filters.
 * Query: ?city=&state=&bloodGroup=
 */
function getBanks(req, res, next) {
    try {
        const { city, state, bloodGroup } = req.query;

        let results = [...DUMMY_BLOOD_BANKS];

        // Filter by city (case-insensitive, partial match)
        if (city) {
            const cityLower = city.trim().toLowerCase();
            results = results.filter((b) =>
                b.city.toLowerCase().includes(cityLower)
            );
        }

        // Filter by state (case-insensitive, exact match)
        if (state) {
            const stateLower = state.trim().toLowerCase();
            results = results.filter((b) =>
                b.state.toLowerCase() === stateLower
            );
        }

        // Filter by blood group (check if bank carries this group)
        if (bloodGroup) {
            const bgDB = toDBFormat(bloodGroup);
            results = results.filter((b) =>
                b.bloodGroups.includes(bgDB)
            );
        }

        res.json({
            success: true,
            count: results.length,
            banks: results,
        });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/bloodbank/locator/banks/:id
 * Get a single blood bank by ID.
 */
function getBankById(req, res, next) {
    try {
        const bank = DUMMY_BLOOD_BANKS.find((b) => b.id === req.params.id);

        if (!bank) {
            return res.status(404).json({
                error: { code: 'NOT_FOUND', message: 'Blood bank not found.' },
            });
        }

        res.json({ success: true, bank });
    } catch (err) {
        next(err);
    }
}

module.exports = { getBanks, getBankById };
