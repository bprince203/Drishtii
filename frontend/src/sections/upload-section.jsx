import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/file-dropzone';
import { AnalysisProgress } from '@/components/analysis-progress';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { fadeInUp } from '@/lib/motion-variants';

export function UploadSection({ status, uploadProgress, error, onFileSelected, onReset }) {
  const isProcessing = ['uploading', 'parsing', 'analyzing'].includes(status);
  return (
    <section id="upload" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">Upload & <span className="gradient-text">Analyze</span></h2>
          <p className="text-slate-500">Upload your 23andMe raw DNA data file to get started</p>
        </motion.div>
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <FileDropzone onFileSelected={onFileSelected} />
              </motion.div>
            )}
            {isProcessing && (
              <motion.div key="progress" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <AnalysisProgress status={status} uploadProgress={uploadProgress} />
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                <div className="inline-flex p-4 bg-red-50 rounded-2xl mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Analysis Failed</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">{error || 'An unexpected error occurred. Please try again.'}</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onReset} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">
                  <RotateCcw className="h-4 w-4" /> Try Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
