import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchHistory } from '../api';
import Sparkline from './Sparkline';
import { useLanguage } from '../context/LanguageContext';

function scoreColor(score) {
  if (score >= 80) return 'text-good';
  if (score >= 50) return 'text-warn';
  return 'text-bad';
}

export default function HistoryPage({ onOpenAudit }) {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory()
      .then((res) => setItems(res.items))
      .catch((err) => setError(err.message));
  }, []);

  const groups = useMemo(() => {
    if (!items) return [];
    const byHost = new Map();
    for (const item of items) {
      if (!byHost.has(item.hostname)) byHost.set(item.hostname, []);
      byHost.get(item.hostname).push(item);
    }
    const list = [...byHost.entries()].map(([hostname, runs]) => {
      const sorted = [...runs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return { hostname, runs: sorted, latest: sorted[sorted.length - 1] };
    });
    list.sort((a, b) => new Date(b.latest.createdAt) - new Date(a.latest.createdAt));
    return list;
  }, [items]);

  const localeTag = lang === 'tr' ? 'tr-TR' : 'en-US';

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 font-display text-2xl font-bold">{t('history.heading')}</h1>

      {error && (
        <div className="glass rounded-2xl p-6 text-sm text-bad">
          {t('history.loadFailed')}: {error}
        </div>
      )}

      {!error && items === null && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass h-24 animate-pulse rounded-2xl" />
          ))}
        </div>
      )}

      {items !== null && groups.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-sm text-text-dim">{t('history.empty')}</div>
      )}

      <div className="space-y-4">
        {groups.map((group, i) => (
          <motion.div
            key={group.hostname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass glass-hover flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-white/[0.03] font-display text-xl font-bold ${scoreColor(group.latest.overall)}`}>
                {group.latest.overall}
              </div>
              <div>
                <p className="font-display text-base font-semibold text-text">{group.hostname}</p>
                <p className="text-xs text-text-faint">
                  {new Date(group.latest.createdAt).toLocaleString(localeTag)} · {group.runs.length}{' '}
                  {group.runs.length > 1 ? t('history.audits') : t('history.audit')}
                </p>
                <p className="mt-1 text-xs text-text-dim">
                  {t('categories.performance')} {group.latest.categories.performance} · {t('categories.seo')} {group.latest.categories.seo} ·{' '}
                  {t('categories.security')} {group.latest.categories.security}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {group.runs.length > 1 && (
                <div className="hidden items-center gap-2 sm:flex">
                  <Sparkline data={group.runs} />
                  <span className="text-xs text-text-dim">{group.runs.map((r) => r.overall).join(' → ')}</span>
                </div>
              )}
              <button
                onClick={() => onOpenAudit(group.latest.id)}
                className="shrink-0 rounded-lg border border-border bg-white/[0.03] px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-border-strong hover:bg-white/[0.06]"
              >
                {t('history.view')}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
