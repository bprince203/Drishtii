/**
 * Health API service — Prajnaa Medical Report Analyzer
 * Posts a PDF file to the Express backend and returns the structured analysis.
 */

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

/**
 * Uploads a PDF medical report and returns the AI analysis.
 *
 * @param {File} file - The PDF file selected by the user
 * @returns {Promise<import('../types/health').ReportAnalysisResponse>}
 * @throws {Error} With a user-friendly message on failure
 */
export async function analyzeReport(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/health/analyze`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    // Surface the error message from the Express/FastAPI error shape
    const message =
      data?.error?.message ||
      data?.detail ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data.data;
}
