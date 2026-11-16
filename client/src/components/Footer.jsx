import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onNavigate }) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center">
              <Logo size={48} className="max-w-[190px]" />
            </div>
            <p className="mt-3 text-sm text-text-dim">{t('footer.tagline')}</p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-faint">{t('footer.product')}</p>
            <div className="flex flex-col gap-2 text-sm text-text-dim">
              <button onClick={() => onNavigate('home')} className="w-fit text-left hover:text-text">
                {t('header.navAudit')}
              </button>
              <button onClick={() => onNavigate('history')} className="w-fit text-left hover:text-text">
                {t('header.navHistory')}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-text-faint sm:flex-row">
          <span>
            © {year} {t('header.brandFull')}. {t('footer.rights')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-to" />
            {t('footer.poweredBy')}
          </span>
        </div>
      </div>
    </footer>
  );
}
