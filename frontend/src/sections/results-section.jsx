import { motion } from 'motion/react';
import { ResultCard } from '@/components/result-card';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import { FileText, AlertTriangle, RotateCcw, Sparkles, BarChart3, Clock, HardDrive } from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/motion-variants';

export function ResultsSection({ data, onReset, onGetRecommendations, recommendationStatus }) {
  if (!data) return null;
  const { meta, results, warnings, globalDisclaimer, analysisId, uploadedAt } = data;

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">Your <span className="gradient-text">Analysis Results</span></h2>
              <p className="text-sm text-slate-500">Analysis ID: <span className="font-mono">{analysisId?.slice(0, 8)}</span></p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onReset} className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">
              <RotateCcw className="h-4 w-4" /> New Analysis
            </motion.button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
            {[
              { icon: FileText, label: 'File', value: meta?.fileName },
              { icon: HardDrive, label: 'Size', value: formatFileSize(meta?.fileSize) },
              { icon: BarChart3, label: 'SNPs Parsed', value: meta?.parsedRows?.toLocaleString() },
              { icon: AlertTriangle, label: 'Skipped', value: meta?.skippedRows?.toLocaleString() },
              { icon: Clock, label: 'Analyzed', value: uploadedAt ? new Date(uploadedAt).toLocaleTimeString() : 'N/A' },
            ].map((stat) => (
              <div key={stat.label} className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700 truncate">{stat.value || 'N/A'}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {warnings?.length > 0 && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8 space-y-2">
            {warnings.map((warning, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">{warning}</p>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {results?.map((result, index) => (
            <motion.div key={result.traitKey} variants={staggerItem}>
              <ResultCard result={result} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {globalDisclaimer && <DisclaimerBanner text={globalDisclaimer} />}

        {/* Recommendation CTA Button */}
        {onGetRecommendations && recommendationStatus !== 'complete' && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 16px 40px rgba(139, 92, 246, 0.25)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onGetRecommendations}
              disabled={recommendationStatus === 'loading'}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-xl shadow-violet-500/20 transition-all duration-300 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-5 w-5" />
              {recommendationStatus === 'loading' ? 'Generating personalized precautions...' : 'See Precautions & Balanced Diet'}
            </motion.button>
            <p className="text-xs text-slate-400 mt-3">AI-generated wellness guidance based on your analysis</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
