/**
 * Blood Bank Controller — Prajnaa Blood Bank Locator
 */

const { searchBloodBanks } = require('../data/bloodBanks');

/**
 * GET /api/blood-bank/search?lat=X&lng=Y&city=X&bloodGroup=O+&limit=10
 */
async function searchBloodBankHandler(req, res, next) {
  try {
    const { lat, lng, city, bloodGroup, limit } = req.query;

    if (!lat && !lng && !city) {
      const err = new Error('Please provide either coordinates (lat, lng) or a city name.');
      err.statusCode = 400;
      throw err;
    }

    const results = searchBloodBanks({
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      city: city || undefined,
      bloodGroup: bloodGroup || undefined,
      limit: limit ? parseInt(limit, 10) : 10,
    });

    res.json({
      success: true,
      product: 'Prajnaa',
      count: results.length,
      results,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { searchBloodBankHandler };
