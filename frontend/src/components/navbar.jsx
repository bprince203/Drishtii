import { Dna } from 'lucide-react';
import { motion } from 'motion/react';

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg blur-sm opacity-60" />
              <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 p-2 rounded-lg">
                <Dna className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                <span className="gradient-text">Dhristi</span>
              </h1>
              <p className="text-[10px] text-slate-500 -mt-0.5 tracking-wide">
                DNA Health Analyzer
              </p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
            Beta
          </span>
        </div>
      </div>
    </motion.nav>
  );
}
