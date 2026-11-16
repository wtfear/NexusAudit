import { useLanguage } from '../context/LanguageContext';

export default function StrengthsList({ strengths }) {
  const { t } = useLanguage();
  if (!strengths || strengths.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-text-dim">{t('dashboard.strengths')}</h3>
      <ul className="space-y-2.5">
        {strengths.map((s, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-text/90">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-good">
              <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
