// In production, calls go directly to the Render backend.
// Set VITE_API_URL in Vercel project settings to: https://drishtii-746h.onrender.com
// In development the Vite proxy handles /api -> localhost:3001
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

/**
 * Uploads a genome file and returns analysis results.
 * @param {File} file - The genome file to analyze
 * @param {(progress: number) => void} [onProgress] - Upload progress callback
 * @returns {Promise<Object>} Analysis response
 */
export async function analyzeGenomeFile(file, onProgress) {
  const formData = new FormData();
  formData.append('genomeFile', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/analyze`);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.success) {
          resolve(data);
        } else {
          reject(new Error(data.error?.message || `Request failed with status ${xhr.status}`));
        }
      } catch {
        reject(new Error('Failed to parse response from server.'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error. Please check your connection and try again.'));
    });

    xhr.addEventListener('timeout', () => {
      reject(new Error('Request timed out. The file may be too large or the server is slow to start (free tier may need ~30s to wake up).'));
    });

    xhr.timeout = 90000; // 90s — allow time for Render free tier cold start
    xhr.send(formData);
  });
}

/**
 * Health check
 */
export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
