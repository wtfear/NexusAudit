import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function ScanProgress({ url }) {
  const { t } = useLanguage();
  const steps = t('scan.steps');
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Purely cosmetic pacing — the real request resolves independently
    // and the parent swaps this view out once the response arrives.
    const timers = [
      setTimeout(() => setStepIndex(1), 700),
      setTimeout(() => setStepIndex(2), 2200),
      setTimeout(() => setStepIndex(3), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6">
      <div className="glass w-full max-w-md rounded-2xl p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-text-faint">{t('scan.auditing')}</p>
        <p className="mt-1 truncate font-display text-lg font-semibold text-text">{url}</p>

        <div className="mt-8 space-y-5">
          {steps.map((step, i) => {
            const state = i < stepIndex ? 'done' : i === stepIndex ? 'active' : 'pending';
            return (
              <div key={step.label} className="flex items-start gap-3.5">
                <div className="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                  {state === 'done' && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-good/20 text-good">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  {state === 'active' && (
                    <span className="relative flex h-6 w-6 items-center justify-center">
                      <span className="absolute h-6 w-6 animate-ping rounded-full bg-red-600/30" />
                      <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-accent-from to-accent-to" />
                    </span>
                  )}
                  {state === 'pending' && <span className="h-2 w-2 rounded-full bg-border-strong" />}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${state === 'pending' ? 'text-text-faint' : 'text-text'}`}>{step.label}</p>
                  <AnimatePresence>
                    {state === 'active' && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-text-dim"
                      >
                        {step.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
