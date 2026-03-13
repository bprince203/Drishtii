/**
 * Safely parses Gemini's JSON response.
 * Handles markdown code fences, invalid JSON, and missing fields.
 */

const REQUIRED_KEYS = ['overview', 'precautions', 'balancedDiet', 'lifestyleTips', 'whenToConsultDoctor'];

function parseRecommendationJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  // Strip markdown code fences if present
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  try {
    const parsed = JSON.parse(cleaned);

    // Validate shape
    if (typeof parsed !== 'object' || parsed === null) return null;

    // Ensure all required keys exist with fallback
    const result = {
      overview: typeof parsed.overview === 'string' ? parsed.overview : 'General wellness guidance based on your genetic analysis.',
      precautions: Array.isArray(parsed.precautions) ? parsed.precautions.map(String) : [],
      balancedDiet: Array.isArray(parsed.balancedDiet) ? parsed.balancedDiet.map(String) : [],
      lifestyleTips: Array.isArray(parsed.lifestyleTips) ? parsed.lifestyleTips.map(String) : [],
      whenToConsultDoctor: Array.isArray(parsed.whenToConsultDoctor) ? parsed.whenToConsultDoctor.map(String) : [],
    };

    return result;
  } catch (_err) {
    return null;
  }
}

module.exports = { parseRecommendationJson };
