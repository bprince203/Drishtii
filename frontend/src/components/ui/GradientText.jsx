/**
 * GradientText — renders children with a CSS gradient clipped to text.
 */
export function GradientText({ children, className = '' }) {
  return (
    <span
      className={`bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
