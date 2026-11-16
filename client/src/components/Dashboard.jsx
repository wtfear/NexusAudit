import { motion } from 'framer-motion';
import ScoreRing from './ScoreRing';
import CategoryBars from './CategoryBars';
import AiSummaryCard from './AiSummaryCard';
import StrengthsList from './StrengthsList';
import IssueCard from './IssueCard';
import Sparkline from './Sparkline';
import { reportDownloadUrl } from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard({ result, onNewAudit }) {
  const { t } = useLanguage();
  const { url, hostname, overall, categories, issues, scan, ai, aiError, history, id } = result;
  const highIssues = issues.filter((i) => i.severity === 'high');
  const otherIssues = issues.filter((i) => i.severity !== 'high');
  const trend = (history || []).map((h) => h.overall);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-faint">{t('dashboard.websiteAudit')}</p>
          <a href={url} target="_blank" rel="noreferrer" className="font-display text-xl font-bold text-text hover:text-gradient">
            {hostname}
          </a>
        </div>
        <div className="flex items-center gap-3">
          {trend.length > 1 && (
            <div className="hidden items-center gap-2 sm:flex">
              <Sparkline data={history} />
              <span className="text-xs text-text-dim">{trend.join(' → ')}</span>
            </div>
          )}
          <a
            href={reportDownloadUrl(id)}
            className="flex items-center gap-2 rounded-lg border border-border bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-border-strong hover:bg-white/[0.06]"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v9m0 0l-3-3m3 3l3-3M2 12v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('dashboard.downloadReport')}
          </a>
          <button
            onClick={onNewAudit}
            className="rounded-lg bg-gradient-to-r from-accent-from via-accent-via to-accent-to px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25"
          >
            {t('dashboard.newAudit')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass flex flex-col items-center justify-center rounded-2xl p-8">
          <ScoreRing score={overall} />
          <p className="mt-4 text-sm text-text-dim">{t('dashboard.overallScore')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="lg:col-span-2">
          <CategoryBars categories={categories} />
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6">
        <AiSummaryCard ai={ai} aiError={aiError} />
      </motion.div>

      {scan?.technologies?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mt-6 glass rounded-2xl p-6">
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-text-dim">{t('dashboard.technologyDetection')}</h3>
          <div className="flex flex-wrap gap-2">
            {scan.technologies.map((tech) => (
              <span key={tech} className="rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-text">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-bold">{t('dashboard.criticalIssues')}</h2>
          {highIssues.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-sm text-text-dim">{t('dashboard.noCriticalIssues')}</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {highIssues.map((issue, i) => (
                <IssueCard key={i} issue={issue} />
              ))}
            </div>
          )}

          {otherIssues.length > 0 && (
            <>
              <h2 className="mb-4 mt-10 font-display text-lg font-bold">{t('dashboard.additionalFindings')}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {otherIssues.map((issue, i) => (
                  <IssueCard key={i} issue={issue} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          {ai?.priorities?.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-text-dim">{t('dashboard.recommendations')}</h3>
              <ol className="space-y-2.5">
                {ai.priorities.map((p, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-text/90">
                    <span className="font-bold text-accent-to">{i + 1}.</span>
                    {p}
                  </li>
                ))}
              </ol>
            </div>
          )}
          <StrengthsList strengths={ai?.strengths} />
        </div>
      </div>
    </div>
  );
}
