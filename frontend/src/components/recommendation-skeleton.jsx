import { motion } from 'motion/react';

function SkeletonLine({ width = 'w-full', height = 'h-4' }) {
  return (
    <div className={`${width} ${height} bg-slate-200 rounded-lg animate-pulse`} />
  );
}

export function RecommendationSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="glass rounded-2xl p-6 text-center">
        <div className="inline-flex p-3 bg-violet-100 rounded-2xl mb-4">
          <div className="h-6 w-6 bg-violet-300 rounded animate-pulse" />
        </div>
        <SkeletonLine width="w-64 mx-auto" height="h-6" />
        <div className="mt-2"><SkeletonLine width="w-48 mx-auto" height="h-4" /></div>
        <p className="text-sm text-slate-500 mt-4 animate-pulse">Generating personalized precautions...</p>
      </div>

      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass rounded-2xl p-6">
          <SkeletonLine width="w-40" height="h-5" />
          <div className="mt-4 space-y-3">
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-5/6" />
            <SkeletonLine width="w-4/6" />
          </div>
        </div>
      ))}
    </motion.div>
  );
}
