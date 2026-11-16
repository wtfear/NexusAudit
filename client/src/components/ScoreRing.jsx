import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

function bandInfo(score, t) {
  if (score >= 80) return { stroke: '#34d399', label: t('band.good'), text: 'text-good' };
  if (score >= 50) return { stroke: '#fbbf24', label: t('band.fair'), text: 'text-warn' };
  return { stroke: '#f87171', label: t('band.poor'), text: 'text-bad' };
}

export default function ScoreRing({ score, size = 200, label }) {
  const { t } = useLanguage();
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const band = bandInfo(score, t);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={band.stroke}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
            style={{ filter: `drop-shadow(0 0 10px ${band.stroke}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-5xl font-extrabold tracking-tight"
          >
            {score}
          </motion.span>
          <span className="text-xs text-text-faint">/ 100</span>
        </div>
      </div>
      {label !== false && (
        <span className={`mt-3 rounded-full border border-border px-3 py-1 text-xs font-bold tracking-widest ${band.text}`}>
          {band.label}
        </span>
      )}
    </div>
  );
}
