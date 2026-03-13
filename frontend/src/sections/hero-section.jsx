import { motion } from 'motion/react';
import { ArrowDown, Shield, Zap, Lock, Dna } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';

const FEATURES = [
  { icon: Dna, title: 'SNP Analysis', desc: 'Parse real 23andMe raw DNA data files for health-related genetic markers' },
  { icon: Shield, title: 'Privacy First', desc: 'Your genome data is never stored — processed in memory and auto-deleted' },
  { icon: Zap, title: 'Instant Insights', desc: 'Get predisposition analysis for metabolic health, inherited markers, and more' },
  { icon: Lock, title: 'Safe & Transparent', desc: 'Every result includes evidence notes, confidence levels, and disclaimers' },
];

export function HeroSection({ onCtaClick }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-600">
              Dhristi — DNA Health Analyzer
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-slate-800">Decode Your </span>
            <br />
            <span className="gradient-text">Health Genetics</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload your 23andMe raw DNA data to discover health-related genetic predispositions.
            Analyze metabolic health markers, inherited predisposition indicators, and more —
            <span className="text-emerald-600 font-medium"> safely and privately</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onCtaClick}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all duration-300 text-lg"
            >
              Analyze My DNA
            </motion.button>
            <p className="text-xs text-slate-400 max-w-xs">
              🔒 Your data is never stored. Processed in memory only.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-5 text-left hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-xl w-fit mb-3">
                <feature.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-sm text-slate-800 mb-1">{feature.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown className="h-5 w-5 text-slate-400 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
