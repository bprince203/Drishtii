/**
 * StatusBadge — "Live" (green pulse) or "Coming Soon" (grey)
 */
import { motion } from 'motion/react';

export function StatusBadge({ status }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
        <motion.span
          className="inline-block h-2 w-2 rounded-full bg-emerald-500"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        Live
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
      <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
      Coming Soon
    </span>
  );
}
