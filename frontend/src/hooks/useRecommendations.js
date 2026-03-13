import { useState, useCallback } from 'react';
import { fetchRecommendations } from '@/services/recommendationApi';

/**
 * Hook to manage the recommendation generation flow.
 * @returns {{ status, data, error, generate, reset }}
 */
export function useRecommendations() {
  const [status, setStatus] = useState('idle'); // idle | loading | complete | error
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const generate = useCallback(async (analysisId, results) => {
    setStatus('loading');
    setError(null);
    try {
      const response = await fetchRecommendations({ analysisId, results });
      setData(response);
      setStatus('complete');
    } catch (err) {
      setError(err.message || 'Failed to generate recommendations.');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, generate, reset };
}
