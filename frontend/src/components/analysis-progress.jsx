import { motion } from 'motion/react';
import { CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  { key: 'uploading', label: 'Uploading file' },
  { key: 'parsing', label: 'Parsing genome data' },
  { key: 'analyzing', label: 'Analyzing markers' },
];

export function AnalysisProgress({ status, uploadProgress = 0 }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status);
  return (
    <div className="py-8">
      <div className="flex flex-col gap-6">
        {STEPS.map((step, i) => {
          const isComplete = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <motion.div key={step.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="flex items-center gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isComplete ? 'bg-emerald-100 text-emerald-600' : isCurrent ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {isComplete ? <CheckCircle2 className="h-5 w-5" /> : isCurrent ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="text-sm font-medium">{i + 1}</span>}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isComplete ? 'text-emerald-700' : isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</p>
                {isCurrent && step.key === 'uploading' && (
                  <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} transition={{ duration: 0.3 }} />
                  </div>
                )}
                {isCurrent && step.key === 'parsing' && (
                  <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-shimmer" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
