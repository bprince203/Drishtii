import { Dna, Shield, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-1.5 rounded-lg">
                <Dna className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold gradient-text">Dhristi</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Understanding your health-related genetic predispositions through accessible, privacy-first DNA analysis.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold text-sm text-slate-700">Privacy First</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your genome data is processed in memory and automatically deleted after analysis. We do not store your DNA data.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4 text-rose-400" />
              <span className="font-semibold text-sm text-slate-700">Important Notice</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Informational only. Not medical advice. Not for diagnosis, treatment, or emergency use. Always consult qualified healthcare professionals.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Dhristi. Informational use only. Not medical advice.
          </p>
          <p className="text-xs text-slate-400">
            Built with 🧬 for hackathon demonstration
          </p>
        </div>
      </div>
    </footer>
  );
}
