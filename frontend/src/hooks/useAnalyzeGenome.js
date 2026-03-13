import { useState, useCallback, useRef } from 'react';
import { analyzeGenomeFile } from '@/services/api';

/**
 * @typedef {'idle' | 'uploading' | 'parsing' | 'analyzing' | 'complete' | 'error'} AnalysisStatus
 */

/**
 * Custom hook for genome analysis workflow.
 * Manages upload progress, analysis status, and results.
 */
export function useAnalyzeGenome() {
  const [status, setStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const abortRef = useRef(false);

  const analyze = useCallback(async (file) => {
    abortRef.current = false;
    setError(null);
    setResults(null);
    setStatus('uploading');
    setUploadProgress(0);

    try {
      // Upload phase
      const data = await analyzeGenomeFile(file, (progress) => {
        if (abortRef.current) return;
        setUploadProgress(progress);
        if (progress >= 100) {
          setStatus('parsing');
        }
      });

      if (abortRef.current) return;

      // Simulate brief analyzing animation
      setStatus('analyzing');
      await new Promise((r) => setTimeout(r, 800));

      if (abortRef.current) return;

      setResults(data);
      setStatus('complete');
    } catch (err) {
      if (abortRef.current) return;
      setError(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
    setStatus('idle');
    setUploadProgress(0);
    setResults(null);
    setError(null);
  }, []);

  return {
    status,
    uploadProgress,
    results,
    error,
    analyze,
    reset,
  };
}
