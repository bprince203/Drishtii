/**
 * Builds a safe, structured prompt for Gemini recommendation generation.
 * Only sends compact analysis summaries — never raw genome data.
 */

function buildRecommendationPrompt(results) {
  const traitSummaries = results.map((r) => {
    return [
      `- Trait: ${r.title}`,
      `  Status: ${r.status}`,
      `  Summary: ${r.summary}`,
      `  Confidence: ${r.confidence}`,
      r.evidenceNote ? `  Evidence: ${r.evidenceNote}` : '',
      r.limitationNote ? `  Limitation: ${r.limitationNote}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  });

  const prompt = `You are a health wellness advisor AI for a product called "Dhristi — DNA Health Analyzer".

The user has received the following genetic predisposition analysis results. These results are based on selected SNP markers only and are NOT a clinical diagnosis.

=== ANALYSIS RESULTS ===
${traitSummaries.join('\n\n')}
=== END RESULTS ===

Based on these results, generate wellness guidance. Follow these rules STRICTLY:

1. NEVER claim to diagnose, treat, or cure any condition.
2. NEVER recommend specific medications or emergency procedures.
3. Frame everything as informational wellness guidance.
4. If evidence is limited or confidence is low, explicitly state uncertainty.
5. If no strong predispositions are detected, provide general balanced wellness advice.
6. Keep language simple, friendly, and non-alarmist.
7. Genetics is only one factor — always note that environment, lifestyle, and other factors matter.

Return ONLY a valid JSON object with this exact structure (no markdown, no code fences, just raw JSON):
{
  "overview": "A 2-3 sentence summary of the overall wellness picture based on these results",
  "precautions": ["list of 3-5 concise health precautions relevant to the findings"],
  "balancedDiet": ["list of 4-6 balanced diet suggestions that support overall wellness"],
  "lifestyleTips": ["list of 3-5 practical lifestyle recommendations"],
  "whenToConsultDoctor": ["list of 2-4 scenarios when the user should seek professional medical advice"]
}`;

  return prompt;
}

module.exports = { buildRecommendationPrompt };
