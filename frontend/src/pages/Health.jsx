/**
 * Health Page — Prajnaa AI Health Dashboard
 * Shows all 4 feature cards (using shared FeatureCard), with the Report Analyzer
 * panel expanding via AnimatePresence when clicked.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FileText, Droplets, BedDouble, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeatureCard } from '../components/ui/FeatureCard';
import { GradientText } from '../components/ui/GradientText';
import { ReportAnalyzerPanel } from '../components/health/ReportAnalyzerPanel';

const FEATURES = [
  {
    key: 'twin',
    title: 'Health Twin',
    description: 'Build a personalized health profile based on your genetic and lifestyle data.',
    icon: Sparkles,
    accentGradient: 'from-teal-400 to-cyan-400',
    status: 'coming-soon',
  },
  {
    key: 'report',
    title: 'Report Analyzer',
    description: 'Upload any medical report — PDF, image, or doc — and get a structured AI-powered breakdown.',
    icon: FileText,
    accentGradient: 'from-violet-500 to-purple-500',
    status: 'live',
  },
  {
    key: 'blood',
    title: 'Blood Bank Locator',
    description: 'Find the nearest blood bank with real-time availability and contact info.',
    icon: Droplets,
    accentGradient: 'from-rose-400 to-red-400',
    status: 'coming-soon',
  },
  {
    key: 'bed',
    title: 'Hospital Bed Finder',
    description: 'Check live hospital bed availability in your city during emergencies.',
    icon: BedDouble,
    accentGradient: 'from-sky-400 to-blue-400',
    status: 'coming-soon',
  },
];

export default function Health() {
  const [activePanel, setActivePanel] = useState(null);

  function togglePanel(name) {
    setActivePanel((prev) => (prev === name ? null : name));
  }

  return (
    <main className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Prajnaa
        </Link>
      </motion.div>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full mb-4">
          <Sparkles className="h-3.5 w-3.5 text-violet-500" />
          <span className="text-xs font-medium text-slate-600">AI-Powered Health Tools</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          <GradientText>Prajnaa</GradientText>{' '}
          <span className="text-slate-800">Health Dashboard</span>
        </h1>
        <p className="mt-2 text-slate-500 text-base leading-relaxed max-w-lg">
          AI-powered tools to help you understand your health data in plain language.
        </p>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
      >
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature.key}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            accentGradient={feature.accentGradient}
            status={feature.status}
            onClick={feature.status === 'live' ? () => togglePanel(feature.key) : undefined}
            isActive={activePanel === feature.key}
          />
        ))}
      </motion.div>

      {/* Report Analyzer Panel — AnimatePresence for smooth open/close */}
      <AnimatePresence>
        {activePanel === 'report' && (
          <motion.div
            key="report-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="glass rounded-2xl border border-violet-200 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Medical Report Analyzer</h2>
                  <p className="text-xs text-slate-500">Upload a PDF, image, or DOCX for a plain-English AI summary</p>
                </div>
              </div>

              <div className="mt-1 pt-5 border-t border-slate-100">
                <ReportAnalyzerPanel />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
