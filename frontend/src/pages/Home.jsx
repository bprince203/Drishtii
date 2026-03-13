import { useRef, useCallback } from 'react';
import { HeroSection } from '@/sections/hero-section';
import { UploadSection } from '@/sections/upload-section';
import { ResultsSection } from '@/sections/results-section';
import { RecommendationPanel } from '@/components/recommendation-panel';
import { useAnalyzeGenome } from '@/hooks/useAnalyzeGenome';
import { useRecommendations } from '@/hooks/useRecommendations';

export default function Home() {
  const uploadRef = useRef(null);
  const { status, uploadProgress, results, error, analyze, reset } = useAnalyzeGenome();
  const recommendations = useRecommendations();

  const scrollToUpload = useCallback(() => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleFileSelected = useCallback(
    (file) => {
      analyze(file);
    },
    [analyze]
  );

  const handleReset = useCallback(() => {
    reset();
    recommendations.reset();
    setTimeout(() => {
      uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [reset, recommendations]);

  const handleGetRecommendations = useCallback(() => {
    if (results) {
      recommendations.generate(results.analysisId, results.results);
    }
  }, [results, recommendations]);

  return (
    <main className="relative">
      <HeroSection onCtaClick={scrollToUpload} />

      <div ref={uploadRef}>
        {status !== 'complete' && (
          <UploadSection
            status={status}
            uploadProgress={uploadProgress}
            error={error}
            onFileSelected={handleFileSelected}
            onReset={handleReset}
          />
        )}
      </div>

      {status === 'complete' && results && (
        <>
          <ResultsSection
            data={results}
            onReset={handleReset}
            onGetRecommendations={handleGetRecommendations}
            recommendationStatus={recommendations.status}
          />
          <RecommendationPanel
            status={recommendations.status}
            data={recommendations.data}
            error={recommendations.error}
            onRetry={handleGetRecommendations}
          />
        </>
      )}
    </main>
  );
}
