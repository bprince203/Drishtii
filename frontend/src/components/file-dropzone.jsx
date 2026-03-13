import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACCEPTED_EXTENSIONS = ['.txt', '.zip'];
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function FileDropzone({ onFileSelected, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const validateFile = useCallback((file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) return `Unsupported file type (${ext}). Please upload a .txt or .zip raw DNA data file.`;
    if (file.size > MAX_FILE_SIZE) return `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 50MB.`;
    return null;
  }, []);

  const handleFile = useCallback((file) => {
    const error = validateFile(file);
    if (error) { setFileError(error); setSelectedFile(null); return; }
    setFileError(null);
    setSelectedFile(file);
  }, [validateFile]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }, [handleFile]);
  const handleInputChange = useCallback((e) => { const file = e.target.files[0]; if (file) handleFile(file); }, [handleFile]);
  const clearFile = useCallback(() => { setSelectedFile(null); setFileError(null); }, []);
  const handleSubmit = useCallback(() => { if (selectedFile && onFileSelected) onFileSelected(selectedFile); }, [selectedFile, onFileSelected]);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <motion.label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        className={cn(
          'relative flex flex-col items-center justify-center w-full min-h-[200px] p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300',
          isDragging
            ? 'border-emerald-400 bg-emerald-50/50 scale-[1.02]'
            : 'border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/30',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
      >
        <input type="file" accept=".txt,.zip" onChange={handleInputChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={disabled} />
        <motion.div animate={isDragging ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300 }} className="mb-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100">
            <Upload className="h-8 w-8 text-emerald-600" />
          </div>
        </motion.div>
        <p className="text-base font-semibold text-slate-700 mb-1">{isDragging ? 'Drop your file here' : 'Drag & drop your DNA data file'}</p>
        <p className="text-sm text-slate-500">or <span className="text-emerald-600 font-medium">browse files</span></p>
        <p className="text-xs text-slate-400 mt-2">Supports .zip and .txt raw DNA files up to 50 MB</p>
      </motion.label>

      <AnimatePresence>
        {fileError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{fileError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFile && !fileError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">{formatSize(selectedFile.size)} • {selectedFile.name.endsWith('.zip') ? 'ZIP Archive' : 'Text File'}</p>
                </div>
              </div>
              <button onClick={(e) => { e.preventDefault(); clearFile(); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={disabled} className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50">
              Analyze My DNA
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
