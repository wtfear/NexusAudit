import { useState } from 'react';
import Background from './components/Background';
import Header from './components/Header';
import UrlHero from './components/UrlHero';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import WhySection from './components/WhySection';
import Footer from './components/Footer';
import ScanProgress from './components/ScanProgress';
import Dashboard from './components/Dashboard';
import HistoryPage from './components/HistoryPage';
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';
import { runAudit, fetchAuditById } from './api';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { lang } = useLanguage();
  const [view, setView] = useState('home'); // home | scanning | dashboard | history | about | terms
  const [pendingUrl, setPendingUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(url) {
    setError(null);
    setPendingUrl(url);
    setView('scanning');
    try {
      const data = await runAudit(url, lang);
      setResult(data);
      setView('dashboard');
    } catch (err) {
      setError(err.details ? `${err.message} (${err.details})` : err.message);
      setView('home');
    }
  }

  async function handleOpenAudit(id) {
    try {
      const record = await fetchAuditById(id);
      setResult({ ...record, history: [] });
      setView('dashboard');
    } catch (err) {
      setError(err.message);
      setView('home');
    }
  }

  function handleNavigate(target) {
    setError(null);
    setView(target);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Background />
      <Header view={view} onNavigate={handleNavigate} />

      <div className="flex-1">
        {view === 'home' && (
          <>
            <UrlHero onSubmit={handleSubmit} error={error} />
            <FeaturesSection />
            <HowItWorksSection />
            <WhySection />
          </>
        )}
        {view === 'scanning' && <ScanProgress url={pendingUrl} />}
        {view === 'dashboard' && result && <Dashboard result={result} onNewAudit={() => setView('home')} />}
        {view === 'history' && <HistoryPage onOpenAudit={handleOpenAudit} />}
        {view === 'about' && <AboutPage />}
        {view === 'terms' && <TermsPage />}
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
