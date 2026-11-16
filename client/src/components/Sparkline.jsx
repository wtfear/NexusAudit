import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { useLanguage } from '../context/LanguageContext';

export default function Sparkline({ data, dataKey = 'overall', color = '#ef4444', height = 44, width = 120 }) {
  const { t } = useLanguage();
  if (!data || data.length < 2) return <span className="text-xs text-text-faint">{t('history.notEnough')}</span>;

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis hide domain={[0, 100]} />
          <Tooltip
            contentStyle={{ background: '#141414', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 12 }}
            labelFormatter={() => ''}
            formatter={(value) => [value, t('history.score')]}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
