import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const CATEGORY_KEYS = ['performance', 'seo', 'accessibility', 'security', 'mobile', 'codeQuality'];

function barColor(score) {
  if (score >= 80) return 'bg-good';
  if (score >= 50) return 'bg-warn';
  return 'bg-bad';
}

export default function CategoryBars({ categories }) {
  const { t } = useLanguage();

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="mb-5 font-display text-sm font-semibold uppercase tracking-wider text-text-dim">
        {t('dashboard.categoryScores')}
      </h3>
      <div className="space-y-4">
        {CATEGORY_KEYS.map((key, i) => {
          const score = categories[key] ?? 0;
          return (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-text">{t(`categories.${key}`)}</span>
                <span className="font-semibold text-text-dim">{score}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
                  className={`h-full rounded-full ${barColor(score)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
