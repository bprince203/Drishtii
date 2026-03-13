/**
 * Recommendation Controller — Dhristi DNA Health Analyzer
 */

const { v4: uuidv4 } = require('uuid');
const { z } = require('zod');
const { generateRecommendations } = require('../services/geminiRecommendation.service');

const AI_DISCLAIMER =
  'AI-generated informational guidance only. Not medical advice. Not for diagnosis or treatment. Consult a qualified healthcare professional for personal medical decisions.';

// Zod schema for request validation
const recommendationRequestSchema = z.object({
  analysisId: z.string().min(1),
  results: z
    .array(
      z.object({
        traitKey: z.string(),
        title: z.string(),
        status: z.string(),
        summary: z.string(),
        confidence: z.string(),
        evidenceNote: z.string().optional().default(''),
        limitationNote: z.string().optional().default(''),
      })
    )
    .min(1, 'At least one trait result is required'),
});

/**
 * POST /api/recommendations
 * Generates AI-powered precautions and balanced diet recommendations.
 */
async function getRecommendations(req, res, next) {
  try {
    // Validate request body
    const parseResult = recommendationRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const err = new Error(
        `Invalid request: ${parseResult.error.errors.map((e) => e.message).join(', ')}`
      );
      err.statusCode = 400;
      throw err;
    }

    const { analysisId, results } = parseResult.data;

    // Generate recommendations via Gemini
    const content = await generateRecommendations(results);

    res.json({
      success: true,
      product: 'Dhristi',
      recommendationId: `rec_${uuidv4().slice(0, 12)}`,
      generatedAt: new Date().toISOString(),
      disclaimer: AI_DISCLAIMER,
      safetyNote:
        'Genetics is only one factor in health outcomes. Recommendations may not apply to all users. Environmental, lifestyle, dietary, and medical history factors also play significant roles.',
      content,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRecommendations };
