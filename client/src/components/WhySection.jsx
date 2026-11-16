import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function WhySection() {
  const { t } = useLanguage();
  const points = t('why.points');

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-xl text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('why.heading')}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {points.map((point, i) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="flex gap-4 rounded-2xl border border-border bg-white/[0.02] p-6"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-accent-to">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <h3 className="mb-1 font-display text-sm font-semibold text-text">{point.title}</h3>
              <p className="text-sm text-text-dim">{point.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
