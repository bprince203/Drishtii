/**
 * Recommendation API service — Prajnaa
 * In production calls Render backend directly via VITE_API_URL.
 */

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

/**
 * Fetch AI-generated recommendations based on analysis results.
 * @param {{ analysisId: string, results: Array }} payload
 * @returns {Promise<Object>}
 */
export async function fetchRecommendations({ analysisId, results }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000); // 90s for cold starts

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
      throw new Error('Request timed out. The server may be waking up — please try again in 30 seconds.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
