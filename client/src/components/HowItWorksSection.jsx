import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function HowItWorksSection() {
  const { t } = useLanguage();
  const steps = t('how.steps');

  return (
    <section className="border-t border-border/60 bg-gradient-to-b from-transparent to-white/[0.015]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('how.heading')}</h2>
          <p className="mt-3 text-text-dim">{t('how.sub')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-2xl border border-border bg-white/[0.02] p-6"
            >
              <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-from via-accent-via to-accent-to font-display text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mb-1.5 font-display text-base font-semibold text-text">{step.title}</h3>
              <p className="text-sm text-text-dim">{step.desc}</p>
              {i < steps.length - 1 && (
                <span className="absolute top-10 -right-3 hidden text-border-strong lg:block">
                  <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                    <path d="M0 5h17M13 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
