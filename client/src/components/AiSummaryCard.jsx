import { useLanguage } from '../context/LanguageContext';

const ASSESSMENT_STYLES = {
  Excellent: 'text-good border-good/30 bg-good/10',
  Good: 'text-good border-good/30 bg-good/10',
  Fair: 'text-warn border-warn/30 bg-warn/10',
  Poor: 'text-bad border-bad/30 bg-bad/10',
};

export default function AiSummaryCard({ ai, aiError }) {
  const { t } = useLanguage();

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-text-dim">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-accent-from to-accent-to text-[10px] font-black text-white">
            AI
          </span>
          {t('dashboard.aiSummaryHeading')}
        </h3>
        {ai?.overallAssessment && (
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${ASSESSMENT_STYLES[ai.overallAssessment] || 'text-text-dim border-border'}`}>
            {t(`assessment.${ai.overallAssessment}`)}
          </span>
        )}
      </div>

      {ai?.summary ? (
        <p className="text-[15px] leading-relaxed text-text/90">{ai.summary}</p>
      ) : (
        <div className="rounded-xl border border-warn/25 bg-warn/5 p-4 text-sm text-warn">
          {t('dashboard.aiUnavailable')}
          {aiError ? `: ${aiError}` : '.'} {t('dashboard.aiUnavailableFallback')}
        </div>
      )}
    </div>
  );
}
