/**
 * Health Twin — Prajnaa DNA Analysis. Modern animated page.
 * Correctly wires into the existing UploadSection / ResultsSection / RecommendationPanel components.
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Dna, Shield, Download, Activity, FileText, Heart } from 'lucide-react';
import { UploadSection } from '../sections/upload-section';
import { ResultsSection } from '../sections/results-section';
import { RecommendationPanel } from '../components/recommendation-panel';
import { useAnalyzeGenome } from '../hooks/useAnalyzeGenome';
import { useRecommendations } from '../hooks/useRecommendations';

const STEPS = [
  { icon: FileText, label: 'Upload', desc: '23andMe raw data' },
  { icon: Activity, label: 'Analyze', desc: 'SNP trait mapping' },
  { icon: Heart, label: 'Results', desc: 'Personalized insights' },
];

export default function HealthTwin() {
  const genome = useAnalyzeGenome();
  const recs = useRecommendations();

  function handleGetRecommendations() {
    if (genome.results) {
      recs.generate(genome.results.analysisId, genome.results.results);
    }
  }

  function handleResetAll() {
    genome.reset();
    recs.reset();
  }

  function downloadReport() {
    const lines = ['═══ PRAJNAA — Health Twin Report ═══\n'];
    lines.push(`Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}\n`);

    if (genome.results?.meta) {
      const m = genome.results.meta;
      lines.push(`File: ${m.fileName || 'N/A'}`);
      lines.push(`SNPs Parsed: ${m.parsedRows || 'N/A'}`);
      lines.push(`Traits Evaluated: ${genome.results.results?.length || 'N/A'}\n`);
    }

    if (genome.results?.results) {
      lines.push('─── TRAITS ───');
      genome.results.results.forEach((t) => {
        lines.push(`\n${t.traitName || t.traitKey} [${t.riskLevel}]`);
        lines.push(`  ${t.description || ''}`);
        if (t.snpResults?.length) {
          t.snpResults.forEach((s) => {
            lines.push(`    ${s.rsid}: ${s.genotype} → ${s.interpretation}`);
          });
        }
      });
      lines.push('');
    }

    if (recs.data) {
      const r = recs.data;
      ['precautions', 'balancedDiet', 'lifestyleTips'].forEach((key) => {
        if (r[key]?.length) {
          lines.push(`─── ${key.replace(/([A-Z])/g, ' $1').toUpperCase()} ───`);
          r[key].forEach((p) => lines.push(`  • ${p}`));
          lines.push('');
        }
      });
    }

    lines.push('\nDisclaimer: NOT a clinical diagnosis. Consult a physician.');
    lines.push('© 2026 Prajnaa — AI Health Platform');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `prajnaa-health-twin-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const isComplete = genome.status === 'complete' && genome.results;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors mb-8">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Prajnaa
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 mb-4">
            <Dna className="h-3 w-3 text-teal-500" />
            <span className="text-[11px] font-semibold text-teal-600">DNA Analysis</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Health <span className="gradient-text">Twin</span>
          </h1>
          <p className="text-slate-500 leading-relaxed max-w-lg">
            Upload your 23andMe raw data. Get genetic trait analysis, diet plans, and wellness recommendations — all powered by AI.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-6 flex-wrap"
        >
          {STEPS.map(({ icon: Icon, label, desc }, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                <Icon className="h-3.5 w-3.5 text-teal-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-700">{label}</p>
                  <p className="text-[10px] text-slate-400">{desc}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && <div className="w-4 h-px bg-slate-200" />}
            </div>
          ))}
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-2"
        >
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          <p className="text-xs text-slate-500">Your DNA data is processed in memory — never stored on servers.</p>
        </motion.div>

        {/* Upload — uses existing UploadSection with correct props */}
        {!isComplete && (
          <UploadSection
            status={genome.status}
            uploadProgress={genome.uploadProgress}
            error={genome.error}
            onFileSelected={genome.analyze}
            onReset={handleResetAll}
          />
        )}

        {/* Results — uses existing ResultsSection with correct props */}
        {isComplete && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ResultsSection
              data={genome.results}
              onReset={handleResetAll}
              onGetRecommendations={handleGetRecommendations}
              recommendationStatus={recs.status}
            />

            {/* Recommendations */}
            {recs.status === 'complete' && recs.data && (
              <div className="rounded-2xl bg-white border border-slate-200/60 p-6 sm:p-8 shadow-sm mb-6">
                <RecommendationPanel
                  recommendations={recs.data}
                  isLoading={false}
                  error={recs.error}
                />
              </div>
            )}

            {recs.status === 'error' && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-6">
                <p className="text-sm text-red-700">{recs.error || 'Failed to generate recommendations.'}</p>
              </div>
            )}

            {/* Download */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={downloadReport}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl hover:shadow-lg hover:shadow-teal-500/20 transition-all"
              >
                <Download className="h-4 w-4" />
                Download Report
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
