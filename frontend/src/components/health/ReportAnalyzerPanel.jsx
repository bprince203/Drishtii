/**
 * ReportAnalyzerPanel — Prajnaa Medical Report Analyzer
 * Drag-and-drop dropzone with multi-format support, animated loading ticker,
 * and image thumbnail preview. Uses the existing light-theme design system.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, AlertTriangle, Loader2, FileText, Image, FileSpreadsheet, X } from 'lucide-react';
import { analyzeReport } from '../../services/healthApi';
import { AnalysisResult } from './AnalysisResult';

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

const ACCEPTED_EXTENSIONS = '.pdf,.jpg,.jpeg,.png,.webp,.docx,.doc';
const ACCEPTED_MIMES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const LOADING_STEPS = [
  'Reading your document...',
  'Extracting medical data...',
  'Running AI analysis...',
  'Preparing your report...',
];

function getFileIcon(file) {
  if (!file) return Upload;
  if (file.type === 'application/pdf') return FileText;
  if (file.type.startsWith('image/')) return Image;
  return FileSpreadsheet;
}

function LoadingTicker() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="p-4 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100"
      >
        <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-medium text-slate-600"
        >
          {LOADING_STEPS[stepIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function ReportAnalyzerPanel() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  function validateFile(selectedFile) {
    if (!selectedFile) return 'Please select a file.';
    if (!ACCEPTED_MIMES.includes(selectedFile.type))
      return 'Unsupported format. Accepted: PDF, JPG, PNG, WEBP, DOCX';
    if (selectedFile.size > MAX_FILE_BYTES) return 'File must be under 20 MB.';
    return null;
  }

  function handleFileSelect(selectedFile) {
    setError(null);
    setResult(null);

    if (!selectedFile) return;

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);

    // Generate preview for image files
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    handleFileSelect(droppedFile);
  }, []);

  function handleInputChange(e) {
    handleFileSelect(e.target.files?.[0] ?? null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateFile(file);
    if (validationError) { setError(validationError); return; }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeReport(file);
      setResult(analysis);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setPreview(null);
    setError(null);
    setResult(null);
    setIsLoading(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  const FileIcon = getFileIcon(file);

  return (
    <div>
      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 mb-5">
        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 leading-relaxed">
          <span className="font-semibold">Important:</span> This tool does not provide medical
          advice, diagnoses, or treatment recommendations. Always consult a licensed physician.
        </p>
      </div>

      {/* Loading state */}
      {isLoading && <LoadingTicker />}

      {/* Upload form — hidden when loading or result shown */}
      {!result && !isLoading && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drag-and-drop area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center w-full min-h-[160px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              isDragOver
                ? 'border-violet-400 bg-violet-50/80 shadow-lg shadow-violet-100'
                : file
                ? 'border-violet-300 bg-violet-50/60'
                : 'border-slate-200 bg-slate-50/60 hover:border-violet-300 hover:bg-violet-50/40'
            }`}
          >
            {/* Pulse glow on drag */}
            {isDragOver && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-violet-400"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {file ? (
              <div className="text-center p-4">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-20 w-auto mx-auto mb-2 rounded-lg object-cover" />
                ) : (
                  <FileIcon className="h-8 w-8 text-violet-500 mx-auto mb-2" />
                )}
                <p className="text-sm font-semibold text-violet-700">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleReset(); }}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              </div>
            ) : (
              <div className="text-center p-4">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">
                  Drag & drop or click to select a file
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PDF, JPG, PNG, WEBP, DOCX • Max 20 MB
                </p>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!file}
            className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-md shadow-violet-200 flex items-center justify-center gap-2"
          >
            Analyze Report
          </button>
        </form>
      )}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnalysisResult result={result} fileName={file?.name ?? 'report'} />
          <div className="mt-5 flex justify-center">
            <button
              onClick={handleReset}
              className="text-sm text-violet-500 hover:text-violet-700 font-medium underline underline-offset-2 transition-colors"
            >
              ← Start Over
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
