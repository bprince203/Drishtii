/**
 * FeatureCard — Glassmorphism card with framer-motion animations.
 * Used on both the root page and /health page.
 */
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';

export function FeatureCard({
  title,
  description,
  icon: Icon,
  accentGradient = 'from-emerald-400 to-cyan-400',
  status = 'coming-soon',
  href,
  onClick,
  isActive,
}) {
  const isLive = status === 'live';

  const cardContent = (
    <motion.div
      whileHover={isLive ? { scale: 1.03 } : {}}
      whileTap={isLive ? { scale: 0.98 } : {}}
      className={`relative flex flex-col items-start gap-4 p-6 rounded-2xl border text-left w-full transition-all duration-300 ${
        isActive
          ? 'glass border-violet-300 shadow-lg shadow-violet-100/50'
          : 'glass border-slate-200 hover:shadow-lg hover:border-slate-300'
      } ${!isLive ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {/* Icon with accent gradient */}
      <motion.div
        whileHover={isLive ? { rotate: 5 } : {}}
        className={`p-3 rounded-xl bg-gradient-to-br ${accentGradient}`}
      >
        <Icon className="h-6 w-6 text-white" />
      </motion.div>

      {/* Status badge */}
      <StatusBadge status={status} />

      {/* Text */}
      <div className="flex-1">
        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
      </div>

      {/* CTA or disabled footer */}
      <div className="flex items-center justify-between w-full mt-auto">
        {isLive ? (
          <motion.span
            className="flex items-center gap-1 text-sm font-semibold text-emerald-600"
            whileHover={{ x: 4 }}
          >
            Try now <ArrowRight className="h-4 w-4" />
          </motion.span>
        ) : (
          <span className="text-xs text-slate-400 italic">Stay tuned!</span>
        )}
      </div>
    </motion.div>
  );

  // Live cards link to /health or trigger onClick
  if (isLive && href) {
    return <Link to={href} className="block">{cardContent}</Link>;
  }

  if (isLive && onClick) {
    return <button type="button" onClick={onClick} className="block w-full text-left">{cardContent}</button>;
  }

  return cardContent;
}
