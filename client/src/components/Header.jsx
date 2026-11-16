import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ view, onNavigate }) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex min-w-0 max-w-6xl flex-wrap items-center justify-between gap-2 px-3 py-3 sm:flex-nowrap sm:gap-3 sm:px-6 sm:py-4">
        <button
          onClick={() => onNavigate('home')}
          className="flex min-w-0 shrink items-center whitespace-nowrap"
          aria-label={t('header.brandFull')}
        >
          <Logo size={38} className="max-w-[112px] sm:h-[48px] sm:max-w-[200px]" />
        </button>

        <div className="flex w-full items-center justify-end gap-1 sm:w-auto sm:gap-3">
          <nav className="flex shrink-0 items-center gap-0 sm:gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`rounded-lg px-1.5 py-2 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm ${
                view === 'home' || view === 'scanning' || view === 'dashboard'
                  ? 'text-text'
                  : 'text-text-dim hover:text-text'
              }`}
            >
              {t('header.navAudit')}
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`rounded-lg px-1.5 py-2 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm ${
                view === 'about' ? 'text-text' : 'text-text-dim hover:text-text'
              }`}
            >
              {t('header.navAbout')}
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className={`rounded-lg px-1.5 py-2 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm ${
                view === 'terms' ? 'text-text' : 'text-text-dim hover:text-text'
              }`}
            >
              {t('header.navTerms')}
            </button>
            <button
              onClick={() => onNavigate('history')}
              className={`rounded-lg px-1.5 py-2 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm ${
                view === 'history' ? 'text-text' : 'text-text-dim hover:text-text'
              }`}
            >
              {t('header.navHistory')}
            </button>
          </nav>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
