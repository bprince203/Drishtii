import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Dna } from 'lucide-react';

export function SnpAccordion({ matchedSnps }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!matchedSnps || matchedSnps.length === 0) return null;
  return (
    <div className="mt-3">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors">
        <Dna className="h-3.5 w-3.5" />
        {isOpen ? 'Hide' : 'Show'} SNP Details ({matchedSnps.length})
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="mt-2 space-y-1.5">
              {matchedSnps.map((snp) => (
                <div key={snp.rsid} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-xs font-mono text-slate-600">{snp.rsid}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${snp.found ? 'text-emerald-600' : 'text-slate-400'}`}>{snp.found ? snp.genotype : 'Not found'}</span>
                    <span className={`w-2 h-2 rounded-full ${snp.found ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
