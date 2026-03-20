/**
 * Footer — Prajnaa. Modern with subtle gradient border.
 */
export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-slate-500">Prajnaa</span> © 2026 — Built for Bharat 🇮🇳
        </p>
        <p className="text-[11px] text-slate-400">
          Informational only · Not medical advice
        </p>
      </div>
    </footer>
  );
}
