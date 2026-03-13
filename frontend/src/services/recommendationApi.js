/**
 * Recommendation API service — Dhristi
 * Calls the backend to generate AI-powered recommendations.
 */

const API_BASE = '/api';

/**
 * Fetch AI-generated recommendations based on analysis results.
 * @param {{ analysisId: string, results: Array }} payload
 * @returns {Promise<Object>}
 */
export async function fetchRecommendations({ analysisId, results }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch(`${API_BASE}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisId,
        results: results.map((r) => ({
          traitKey: r.traitKey,
          title: r.title,
          status: r.status,
          summary: r.summary,
          confidence: r.confidence,
          evidenceNote: r.evidenceNote || '',
          limitationNote: r.limitationNote || '',
        })),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody?.error?.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
