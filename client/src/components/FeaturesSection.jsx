import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const ICONS = {
  performance: (
    <path d="M12 13l3.5-4.5M4 15a8 8 0 1116 0M6.5 15a5.5 5.5 0 0111 0" strokeLinecap="round" strokeLinejoin="round" />
  ),
  seo: <path d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />,
  security: (
    <path
      d="M12 3l7 2.6V11c0 5-3.3 8.9-7 10.5C8.3 19.9 5 16 5 11V5.6L12 3z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  accessibility: (
    <>
      <circle cx="12" cy="5" r="1.8" />
      <path d="M4.5 8.5L12 10.5l7.5-2M12 10.5V21M8.5 21l3.5-6 3.5 6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  mobile: <path d="M8 3h8a1 1 0 011 1v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1zM11 18h2" strokeLinecap="round" strokeLinejoin="round" />,
  codeQuality: <path d="M8.5 8L4 12.5 8.5 17M15.5 8L20 12.5 15.5 17M13.5 5l-3 14" strokeLinecap="round" strokeLinejoin="round" />,
};

const KEYS = ['performance', 'seo', 'security', 'accessibility', 'mobile', 'codeQuality'];

export default function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-xl text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('features.heading')}</h2>
        <p className="mt-3 text-text-dim">{t('features.sub')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KEYS.map((key, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="glass glass-hover rounded-2xl p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-from via-accent-via to-accent-to text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                {ICONS[key]}
              </svg>
            </div>
            <h3 className="mb-1.5 font-display text-base font-semibold text-text">{t(`features.${key}.title`)}</h3>
            <p className="text-sm text-text-dim">{t(`features.${key}.desc`)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
