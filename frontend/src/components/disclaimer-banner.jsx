import { motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';
import { fadeInUp } from '@/lib/motion-variants';

export function DisclaimerBanner({ text }) {
  return (
    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass rounded-2xl p-6 border border-amber-200">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h4 className="font-semibold text-amber-800 mb-1 text-sm">Important Disclaimer</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            {text || 'Informational only. Not medical advice. Not for diagnosis, treatment, or emergency use. Always consult qualified healthcare professionals.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
