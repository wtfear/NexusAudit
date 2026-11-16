import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

export default function UrlHero({ onSubmit, error }) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    onSubmit(normalized);
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="flex items-center justify-center"
      >
        <Logo size={124} className="hero-logo max-w-[92vw] sm:max-w-[620px]" />
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-5 max-w-2xl font-display text-lg font-semibold leading-tight tracking-tight text-text sm:text-3xl"
      >
        {t('hero.titleA')} <span className="text-gradient">{t('hero.titleB')}</span>
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-4 max-w-xl text-balance text-sm text-text-dim sm:mt-5 sm:text-lg"
      >
        {t('hero.subtitle')}
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.22 }}
        onSubmit={handleSubmit}
        className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:mt-10 sm:flex-row"
      >
        <div className="glass flex-1 rounded-xl px-4 py-3.5 text-left focus-within:border-border-strong">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t('hero.placeholder')}
            className="w-full bg-transparent text-base text-text placeholder:text-text-faint focus:outline-none"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="group flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-accent-from via-accent-via to-accent-to px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-red-600/30 transition-transform active:scale-[0.98]"
        >
          {t('hero.cta')}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </motion.form>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-bad">
          {error}
        </motion.p>
      )}
    </div>
  );
}
