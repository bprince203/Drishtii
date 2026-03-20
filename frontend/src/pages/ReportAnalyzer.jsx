/**
 * Report Analyzer — Prajnaa. Modern, animated, engaging.
 */
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText, Image, Shield } from 'lucide-react';
import { ReportAnalyzerPanel } from '../components/health/ReportAnalyzerPanel';

const FORMATS = [
  { icon: FileText, label: 'PDF', desc: 'Text & scanned' },
  { icon: Image, label: 'Images', desc: 'JPG, PNG, WEBP' },
  { icon: FileText, label: 'DOCX', desc: 'Word documents' },
];

export default function ReportAnalyzer() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors mb-8">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Prajnaa
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 mb-4">
            <Sparkles className="h-3 w-3 text-violet-500" />
            <span className="text-[11px] font-semibold text-violet-600">Gemini Vision AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Report <span className="gradient-text">Analyzer</span>
          </h1>
          <p className="text-slate-500 leading-relaxed max-w-lg">
            Upload any medical report and get a thorough AI breakdown — conditions, medications, vital signs, lifestyle advice, and next steps.
          </p>
        </motion.div>

        {/* Format badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-6"
        >
          {FORMATS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-100 shadow-sm">
              <Icon className="h-3.5 w-3.5 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-700">{label}</p>
                <p className="text-[10px] text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-white border border-slate-200/60 p-6 sm:p-8 shadow-sm"
        >
          <ReportAnalyzerPanel />
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mt-5"
        >
          <Shield className="h-3.5 w-3.5 text-slate-300" />
          <p className="text-[11px] text-slate-400">Your files are analyzed in-memory and never stored.</p>
        </motion.div>
      </div>
    </div>
  );
}
