/**
 * Groq Recommendation Service — Prajnaa DNA Health Analyzer
 * Server-side only. API key is read from environment variables only.
 * Uses Groq Cloud (llama-3.3-70b-versatile) for fast, reliable inference.
 */

const Groq = require('groq-sdk');
const { ENV } = require('../config/env');
const { buildRecommendationPrompt } = require('../utils/buildRecommendationPrompt');
const { parseRecommendationJson } = require('../utils/parseRecommendationJson');

const MAX_RETRIES = 1;

/**
 * Generate health recommendations based on structured analysis results.
 * @param {Array} results - Structured trait analysis results
 * @returns {Promise<Object>} Parsed recommendation content
 */
async function generateRecommendations(results) {
  if (!ENV.GROQ_API_KEY) {
    throw Object.assign(
      new Error('AI recommendation service is not configured. GROQ_API_KEY is missing.'),
      { statusCode: 503 }
    );
  }

  const groq = new Groq({ apiKey: ENV.GROQ_API_KEY });
  const prompt = buildRecommendationPrompt(results);

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful health wellness advisor. Always respond with valid JSON only — no markdown, no explanation, just raw JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      const text = completion.choices?.[0]?.message?.content || '';
      const parsed = parseRecommendationJson(text);

      if (parsed) {
        return parsed;
      }

      // If parsing failed, retry
      if (attempt < MAX_RETRIES) {
        console.warn('Groq returned invalid JSON, retrying...');
        continue;
      }

      // Safe fallback if all retries exhausted
      return _safeFallback();
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        console.warn(`Groq API call failed (attempt ${attempt + 1}), retrying...`, err.message);
        continue;
      }
    }
  }

  const error = new Error(
    `AI recommendation generation failed: ${lastError?.message || 'Unknown error'}`
  );
  error.statusCode = 502;
  throw error;
}

function _safeFallback() {
  return {
    overview:
      'Based on your genetic analysis, here is a set of general wellness recommendations to support your health.',
    precautions: [
      'Discuss any genetic predispositions with your healthcare provider.',
      'Genetic markers represent only one factor in overall health.',
      'Monitor for any symptoms related to your predisposition results.',
    ],
    balancedDiet: [
      'Maintain a varied diet rich in vegetables, fruits, lean proteins, and whole grains.',
      'Stay hydrated with adequate water intake throughout the day.',
      'Limit processed foods and excess sugar.',
      'Consider consulting a registered dietitian for personalized nutrition advice.',
    ],
    lifestyleTips: [
      'Engage in regular physical activity appropriate for your fitness level.',
      'Prioritize sleep quality and stress management.',
      'Schedule regular health checkups with your healthcare provider.',
    ],
    whenToConsultDoctor: [
      'If you experience any symptoms related to the analyzed traits.',
      'Before making significant dietary or lifestyle changes based on genetic results.',
    ],
  };
}

module.exports = { generateRecommendations };
