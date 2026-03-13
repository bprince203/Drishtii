import { motion } from 'motion/react';
import { ShieldAlert, AlertTriangle, Apple, Heart, Stethoscope, Sparkles, Lightbulb, RotateCcw } from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/motion-variants';
import { RecommendationSkeleton } from './recommendation-skeleton';
import { DisclaimerBanner } from './disclaimer-banner';

const SECTION_CONFIG = {
  precautions: { icon: AlertTriangle, title: 'Health Precautions', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', bullet: '⚠️' },
  balancedDiet: { icon: Apple, title: 'Balanced Diet Suggestions', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', bullet: '🥗' },
  lifestyleTips: { icon: Lightbulb, title: 'Lifestyle Tips', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600', bullet: '💡' },
  whenToConsultDoctor: { icon: Stethoscope, title: 'When to Consult a Doctor', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', bullet: '🩺' },
};

function ListSection({ sectionKey, items }) {
  if (!items || items.length === 0) return null;
  const config = SECTION_CONFIG[sectionKey];
  const Icon = config.icon;

  return (
    <motion.div variants={staggerItem} className="glass rounded-2xl p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${config.iconBg}`}>
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <h3 className="font-semibold text-slate-800 text-lg">{config.title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
          >
            <span className="mt-0.5 flex-shrink-0">{config.bullet}</span>
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export function RecommendationPanel({ status, data, error, onRetry }) {
  if (status === 'idle') return null;

  if (status === 'loading') {
    return (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <RecommendationSkeleton />
        </div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-8 text-center border border-red-200">
            <div className="inline-flex p-4 bg-red-50 rounded-2xl mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Recommendation Generation Failed</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              {error || "We couldn't generate AI recommendations right now. Your health analysis results are still available."}
            </p>
            {onRetry && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onRetry} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">
                <RotateCcw className="h-4 w-4" /> Try Again
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  if (status !== 'complete' || !data) return null;

  const { content, disclaimer, safetyNote } = data;

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center mb-10">
          <div className="inline-flex p-3 bg-gradient-to-br from-violet-100 to-cyan-100 rounded-2xl mb-4">
            <Sparkles className="h-7 w-7 text-violet-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Precautions & <span className="gradient-text">Balanced Diet</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            AI-generated wellness guidance based on your supported genetic analysis.
          </p>
        </motion.div>

        {/* Overview */}
        {content?.overview && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="glass rounded-2xl p-6 mb-6 border border-violet-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-violet-100 rounded-xl flex-shrink-0">
                <Heart className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Overview</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{content.overview}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Sections */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          <ListSection sectionKey="precautions" items={content?.precautions} />
          <ListSection sectionKey="balancedDiet" items={content?.balancedDiet} />
          <ListSection sectionKey="lifestyleTips" items={content?.lifestyleTips} />
          <ListSection sectionKey="whenToConsultDoctor" items={content?.whenToConsultDoctor} />
        </motion.div>

        {/* Safety Note */}
        {safetyNote && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mt-6 flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <ShieldAlert className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">{safetyNote}</p>
          </motion.div>
        )}

        {/* Disclaimer */}
        <div className="mt-6">
          <DisclaimerBanner text={disclaimer} />
        </div>
      </div>
    </section>
  );
}
