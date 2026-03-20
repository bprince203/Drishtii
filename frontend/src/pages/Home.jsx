/**
 * Home — Prajnaa Landing Page
 * Modern, animated, engaging. Dark hero with orbital animation + feature cards with hover effects.
 */

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Dna, FileText, Droplets, ArrowRight, Sparkles, Shield, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    title: 'Health Twin',
    subtitle: 'DNA Analysis',
    description: 'Upload your 23andMe data and discover genetic predispositions, get a balanced diet plan, and personalized wellness recommendations.',
    icon: Dna,
    href: '/health-twin',
    gradient: 'from-teal-500 to-cyan-500',
    glow: 'group-hover:shadow-teal-500/20',
    iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-500',
  },
  {
    title: 'Report Analyzer',
    subtitle: 'AI Medical Analysis',
    description: 'Upload any medical report — PDF, scanned image, or DOCX — and get detailed findings, conditions, medications, and follow-up actions.',
    icon: FileText,
    href: '/report-analyzer',
    gradient: 'from-violet-500 to-indigo-500',
    glow: 'group-hover:shadow-violet-500/20',
    iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-500',
  },
  {
    title: 'Blood Bank Locator',
    subtitle: 'Find Nearby',
    description: 'Search 50+ blood banks across India by GPS or city. Filter by blood group and get instant contact details and availability.',
    icon: Droplets,
    href: '/blood-bank',
    gradient: 'from-rose-500 to-pink-500',
    glow: 'group-hover:shadow-rose-500/20',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500',
  },
];

const STATS = [
  { label: 'AI Models', value: 'Gemini 2.0', icon: Sparkles },
  { label: 'Privacy', value: 'In-Memory Only', icon: Shield },
  { label: 'Speed', value: '<10s Analysis', icon: Zap },
  { label: 'Coverage', value: '50+ Blood Banks', icon: Globe },
];

function OrbitalAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[500px] h-[500px] rounded-full border border-white/[0.04]"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-400/60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
      </motion.div>
      {/* Inner ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[300px] h-[300px] rounded-full border border-white/[0.06]"
      >
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-400/50" />
      </motion.div>
      {/* Core glow */}
      <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-violet-600/10 to-cyan-500/10 blur-3xl" />
    </div>
  );
}

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <Link to={feature.href} className="group block h-full">
        <div className={`relative h-full rounded-2xl bg-white border border-slate-200/60 p-7 card-hover ${feature.glow} group-hover:shadow-xl overflow-hidden`}>
          {/* Shimmer line on hover */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Icon */}
          <div className={`${feature.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
            <feature.icon className="h-5 w-5 text-white" />
          </div>

          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1.5">{feature.subtitle}</p>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">{feature.description}</p>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:gap-3 transition-all duration-300">
            Try it now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-60px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-40px' });

  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Background layers */}
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-violet-600/8 via-cyan-500/5 to-transparent rounded-full blur-3xl" />

        <OrbitalAnimation />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">AI-Powered Health Intelligence</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-6"
          >
            <span className="text-white">Praj</span>
            <span className="gradient-text">naa</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg sm:text-xl text-slate-400 max-w-lg mx-auto leading-relaxed mb-10"
          >
            Understand your health with AI.
            <br />
            <span className="text-slate-300">DNA analysis · Report interpretation · Blood bank search</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-4"
          >
            <Link
              to="/report-analyzer"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors shadow-lg shadow-white/10"
            >
              Upload a Report
            </Link>
            <Link
              to="/health-twin"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:border-white/25 hover:text-white transition-all"
            >
              Analyze DNA →
            </Link>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#fafbfd] to-transparent" />
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section ref={statsRef} className="max-w-4xl mx-auto px-6 -mt-6 relative z-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border border-slate-100 shadow-sm"
            >
              <stat.icon className="h-4 w-4 text-violet-500 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">{stat.label}</p>
                <p className="text-sm font-bold text-slate-800">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section ref={featuresRef} className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold text-violet-500 uppercase tracking-[0.2em] mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Three tools, one platform.
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Each built to give you clear, actionable health insights — powered by Google's Gemini AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
