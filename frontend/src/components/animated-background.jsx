import { motion } from 'motion/react';

const blobs = [
  { color: 'from-emerald-200/40 to-cyan-200/40', size: 'w-96 h-96', position: 'top-0 -left-48', delay: 0 },
  { color: 'from-violet-200/30 to-teal-200/30', size: 'w-80 h-80', position: 'top-1/3 -right-40', delay: 2 },
  { color: 'from-cyan-200/30 to-emerald-200/30', size: 'w-72 h-72', position: 'bottom-1/4 left-1/4', delay: 4 },
  { color: 'from-teal-200/20 to-violet-200/20', size: 'w-64 h-64', position: '-bottom-32 right-1/3', delay: 1 },
];

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute inset-0 grid-background" />
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute ${blob.size} ${blob.position} rounded-full bg-gradient-to-br ${blob.color} blur-3xl`}
          animate={{ y: [0, -30, 15, 0], x: [0, 15, -20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: blob.delay }}
        />
      ))}
    </div>
  );
}
