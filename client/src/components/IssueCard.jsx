import { useState } from 'react';
import FixModal from './FixModal';
import { useLanguage } from '../context/LanguageContext';

const SEVERITY_STYLE = {
  high: 'text-bad border-bad/30 bg-bad/10',
  medium: 'text-warn border-warn/30 bg-warn/10',
  low: 'text-text-dim border-border bg-white/5',
};

export default function IssueCard({ issue }) {
  const { t } = useLanguage();
  const [showFix, setShowFix] = useState(false);
  const sevClass = SEVERITY_STYLE[issue.severity] || SEVERITY_STYLE.low;

  return (
    <div className="glass glass-hover rounded-xl p-5">
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${sevClass}`}>
          {t(`severity.${issue.severity}`)}
        </span>
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-text-dim">{issue.category}</span>
      </div>

      <h4 className="mb-2 font-display text-[15px] font-semibold text-text">{issue.title}</h4>

      <div className="space-y-2 text-sm text-text-dim">
        <p>
          <span className="font-semibold text-text/80">{t('dashboard.whyItMatters')}: </span>
          {issue.explanation}
        </p>
        <p>
          <span className="font-semibold text-text/80">{t('dashboard.howToFix')}: </span>
          {issue.recommendation}
        </p>
      </div>

      {issue.codeSample && (
        <button
          onClick={() => setShowFix(true)}
          className="mt-4 flex items-center gap-1.5 rounded-lg border border-border bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-text transition-colors hover:border-border-strong hover:bg-white/[0.06]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l1.7 3.9L14 6.5l-3.5 2.6L11.5 13 8 10.6 4.5 13l1-3.9L2 6.5l4.3-1.6L8 1z" fill="currentColor" opacity="0.9" />
          </svg>
          {t('dashboard.fixWithAI')}
        </button>
      )}

      {showFix && <FixModal issue={issue} onClose={() => setShowFix(false)} />}
    </div>
  );
}
