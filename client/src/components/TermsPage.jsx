import { useLanguage } from '../context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();
  const content = t('terms');

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent-to">{content.eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-text sm:text-6xl">{content.title}</h1>
      <p className="mt-6 text-lg leading-8 text-text-dim">{content.intro}</p>

      <div className="mt-12 space-y-8">
        {content.sections.map((section) => (
          <section key={section.title} className="border-t border-border/60 pt-6">
            <h2 className="font-display text-2xl font-semibold text-text">{section.title}</h2>
            <p className="mt-3 leading-7 text-text-dim">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
