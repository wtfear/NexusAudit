import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-border bg-white/[0.03] p-0.5 text-xs font-bold">
      <button
        onClick={() => setLang('tr')}
        className={`rounded-full px-2.5 py-1 transition-colors ${lang === 'tr' ? 'bg-gradient-to-r from-accent-from via-accent-via to-accent-to text-white' : 'text-text-dim hover:text-text'}`}
        aria-pressed={lang === 'tr'}
      >
        TR
      </button>
      <button
        onClick={() => setLang('en')}
        className={`rounded-full px-2.5 py-1 transition-colors ${lang === 'en' ? 'bg-gradient-to-r from-accent-from via-accent-via to-accent-to text-white' : 'text-text-dim hover:text-text'}`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );
}
