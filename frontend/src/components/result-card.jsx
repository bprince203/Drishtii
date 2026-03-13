import { motion } from 'motion/react';
import { Milk, Wine, Coffee, Wheat, AlertTriangle, CheckCircle2, HelpCircle, Search, FlaskConical, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SnpAccordion } from './snp-accordion';
import { cardHover } from '@/lib/motion-variants';

const ICON_MAP = { milk: Milk, wine: Wine, coffee: Coffee, wheat: Wheat };

const STATUS_CONFIG = {
  predisposition_detected: { label: 'Higher Predisposition Detected', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500' },
  typical: { label: 'No Relevant Marker Detected', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2, iconColor: 'text-emerald-500' },
  insufficient_data: { label: 'Insufficient Data', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', icon: HelpCircle, iconColor: 'text-slate-400' },
  not_found: { label: 'Marker Not Found', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: Search, iconColor: 'text-slate-400' },
  limited_evidence: { label: 'Limited Evidence', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', icon: FlaskConical, iconColor: 'text-violet-500' },
};

const CONFIDENCE_CONFIG = {
  high: { label: 'High Confidence', color: 'bg-emerald-100 text-emerald-700' },
  moderate: { label: 'Moderate', color: 'bg-cyan-100 text-cyan-700' },
  low: { label: 'Low', color: 'bg-amber-100 text-amber-700' },
  placeholder: { label: 'Placeholder', color: 'bg-slate-100 text-slate-500' },
  none: { label: 'N/A', color: 'bg-slate-100 text-slate-500' },
};

export function ResultCard({ result, index = 0 }) {
  const statusConfig = STATUS_CONFIG[result.status] || STATUS_CONFIG.insufficient_data;
  const confidenceConfig = CONFIDENCE_CONFIG[result.confidence] || CONFIDENCE_CONFIG.none;
  const CategoryIcon = ICON_MAP[result.icon] || FlaskConical;
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div variants={cardHover} initial="rest" whileHover="hover" className={cn('glass rounded-2xl p-6 border transition-all duration-300', statusConfig.border)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2.5 rounded-xl', statusConfig.bg)}>
            <CategoryIcon className={cn('h-5 w-5', statusConfig.iconColor)} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{result.title}</h3>
            <p className="text-xs text-slate-500">{result.category}</p>
          </div>
        </div>
        <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full', confidenceConfig.color)}>{confidenceConfig.label}</span>
      </div>
      <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium mb-3', statusConfig.bg, statusConfig.color)}>
        <StatusIcon className="h-4 w-4" />
        {statusConfig.label}
      </div>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">{result.summary}</p>
      {result.evidenceNote && (
        <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl mb-2">
          <Info className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed"><span className="font-medium">Evidence:</span> {result.evidenceNote}</p>
        </div>
      )}
      {result.limitationNote && (
        <div className="flex items-start gap-2 p-3 bg-amber-50/60 rounded-xl mb-3">
          <TriangleAlert className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed"><span className="font-medium">Limitation:</span> {result.limitationNote}</p>
        </div>
      )}
      <SnpAccordion matchedSnps={result.matchedSnps} />
      <div className="mt-3 pt-3 border-t border-slate-100">
        <p className="text-[11px] text-slate-400 italic leading-relaxed">⚕️ {result.disclaimer}</p>
      </div>
    </motion.div>
  );
}
