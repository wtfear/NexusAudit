import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { requestCodeFix } from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function FixModal({ issue, onClose }) {
  const { t, lang } = useLanguage();
  const [state, setState] = useState('loading'); // loading | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    requestCodeFix({ problem: `${issue.title}. ${issue.explanation}`, code: issue.codeSample, language: 'html', lang })
      .then((res) => {
        if (cancelled) return;
        setResult(res);
        setState('done');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [issue, lang]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="glass max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6"
        >
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">{t('fixModal.title')}</h3>
            <button onClick={onClose} className="rounded-lg p-1.5 text-text-dim hover:bg-white/5 hover:text-text">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="mb-5 text-sm text-text-dim">{issue.title}</p>

          <div className="mb-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-faint">{t('fixModal.before')}</p>
            <pre className="overflow-x-auto rounded-xl border border-border bg-black/40 p-3.5 text-xs text-red-300">
              <code>{issue.codeSample}</code>
            </pre>
          </div>

          {state === 'loading' && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] p-4 text-sm text-text-dim">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-accent-to" />
              {t('fixModal.generating')}
            </div>
          )}

          {state === 'error' && (
            <div className="rounded-xl border border-bad/30 bg-bad/10 p-4 text-sm text-bad">
              {t('fixModal.failed')}: {error}
            </div>
          )}

          {state === 'done' && result && (
            <>
              <div className="mb-4">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-good">{t('fixModal.after')}</p>
                <pre className="overflow-x-auto rounded-xl border border-good/25 bg-good/[0.06] p-3.5 text-xs text-emerald-200">
                  <code>{result.fixedCode}</code>
                </pre>
              </div>
              {result.explanation && <p className="text-sm leading-relaxed text-text-dim">{result.explanation}</p>}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
