export const translations = {
  en: {
    header: {
      brandShort: 'NexusAudit AI',
      brandFull: 'NexusAudit AI',
      navAudit: 'Audit',
      navHistory: 'History',
      navAbout: 'About',
      navTerms: 'Terms',
    },
    hero: {
      badge: 'Powered by real technical scans + Groq AI',
      titleA: "Know exactly what's",
      titleB: 'holding your website back',
      subtitle:
        'Enter a URL to get a real technical audit — performance, SEO, security, accessibility and mobile — explained and prioritized by AI.',
      placeholder: 'https://example.com',
      cta: 'Analyze Website',
    },
    features: {
      heading: 'What we check',
      sub: 'Six categories, all scored from real scan data — never guessed.',
      performance: { title: 'Performance', desc: 'Real load time, page size and resource count from an actual fetch of your site.' },
      seo: { title: 'SEO', desc: 'Title, meta description, headings, canonical, sitemap, robots.txt, Open Graph and structured data.' },
      security: { title: 'Security', desc: 'HTTPS, HSTS, CSP, clickjacking protection and other response headers, checked live.' },
      accessibility: { title: 'Accessibility', desc: 'Alt text, form labels, button names, semantic HTML and language declarations.' },
      mobile: { title: 'Mobile', desc: 'Viewport configuration and fixed-width elements that break small screens.' },
      codeQuality: { title: 'Code Quality', desc: 'DOCTYPE, charset, deprecated tags and inline-style hygiene.' },
    },
    how: {
      heading: 'How it works',
      sub: 'From URL to a full report in under a minute.',
      steps: [
        { title: 'Analyze', desc: 'We validate the URL and make sure it can be safely audited.' },
        { title: 'Scan', desc: 'Your page, headers, robots.txt and sitemap are fetched for real.' },
        { title: 'AI Analysis', desc: 'Groq reads the technical results and explains what matters.' },
        { title: 'Report', desc: 'You get a scored dashboard — and a PDF you can keep or share.' },
      ],
    },
    why: {
      heading: 'Why NexusAudit AI',
      points: [
        { title: 'Real data only', desc: 'Every score comes from an actual scan. Nothing is estimated or faked.' },
        { title: 'Groq-powered analysis', desc: "AI explains and prioritizes issues — it never invents facts that aren't in the data." },
        { title: 'SSRF-safe scanning', desc: 'Private networks, localhost and internal IPs are always blocked.' },
        { title: 'Free PDF reports', desc: 'Download a shareable report for any audit, any time.' },
      ],
    },
    footer: {
      tagline: 'Real technical audits. Real AI analysis. Nothing fabricated.',
      product: 'Product',
      poweredBy: 'Powered by Groq AI',
      rights: 'All rights reserved.',
    },
    about: {
      eyebrow: 'About us',
      title: 'About NexusAudit AI',
      intro: 'NexusAudit AI helps you understand the technical health of your website with clear, actionable information.',
      sections: [
        { title: 'Our purpose', body: 'We turn technical website checks into a report that is easy to understand and useful for your next step.' },
        { title: 'Real scan data', body: 'Performance, SEO, security, accessibility and mobile findings come from a live scan of the URL you provide.' },
        { title: 'AI-assisted insights', body: 'Groq AI explains and prioritizes the findings. The underlying technical results remain visible so you can make informed decisions.' },
      ],
    },
    terms: {
      eyebrow: 'Legal',
      title: 'Terms of Use',
      intro: 'By using NexusAudit AI, you agree to use the service responsibly and in accordance with these terms.',
      sections: [
        { title: 'Use of the service', body: 'Only submit URLs that you are authorized to inspect. Do not use the service to access private systems, bypass security controls or conduct harmful activity.' },
        { title: 'Results and availability', body: 'Audit results are provided for informational purposes. We do not guarantee that every finding is complete or that the service will always be available.' },
        { title: 'Responsible use', body: 'You are responsible for the URLs you submit and for any actions you take based on an audit report. Use the service in compliance with applicable laws.' },
      ],
    },
    scan: {
      auditing: 'Auditing',
      steps: [
        { label: 'Analyze', detail: 'Validating URL and preparing scan' },
        { label: 'Scan', detail: 'Fetching page, headers, robots.txt & sitemap' },
        { label: 'AI Analysis', detail: 'Groq is interpreting the technical results' },
        { label: 'Report', detail: 'Assembling your dashboard' },
      ],
    },
    categories: {
      performance: 'Performance',
      seo: 'SEO',
      accessibility: 'Accessibility',
      security: 'Security',
      mobile: 'Mobile',
      codeQuality: 'Code Quality',
    },
    categoryBadge: {
      SEO: 'SEO',
      Security: 'Security',
      Accessibility: 'Accessibility',
      Mobile: 'Mobile',
      Performance: 'Performance',
      'Code Quality': 'Code Quality',
    },
    band: { good: 'GOOD', fair: 'FAIR', poor: 'POOR' },
    assessment: { Excellent: 'Excellent', Good: 'Good', Fair: 'Fair', Poor: 'Poor' },
    severity: { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' },
    dashboard: {
      websiteAudit: 'Website Audit',
      overallScore: 'Overall Score',
      categoryScores: 'Category Scores',
      aiSummaryHeading: 'AI Website Summary',
      aiUnavailable: 'AI analysis is currently unavailable',
      aiUnavailableFallback:
        'The technical scores and findings below were still computed directly from real scan data.',
      technologyDetection: 'Technology Detection',
      criticalIssues: 'Critical Issues',
      noCriticalIssues: 'No critical issues were found. Nice work.',
      additionalFindings: 'Additional Findings',
      recommendations: 'Recommendations',
      strengths: 'Strengths',
      downloadReport: 'Download Report',
      newAudit: 'New Audit',
      whyItMatters: 'Why it matters',
      howToFix: 'How to fix',
      fixWithAI: 'Fix with AI',
    },
    fixModal: {
      title: 'Fix with AI',
      before: 'Before',
      after: 'After',
      generating: 'Groq is generating a fix...',
      failed: 'Fix generation failed',
    },
    history: {
      heading: 'Audit History',
      loadFailed: 'Failed to load history',
      empty: 'No audits yet. Run your first audit to see it appear here.',
      audits: 'audits',
      audit: 'audit',
      view: 'View',
      notEnough: 'Not enough history yet',
      score: 'Score',
    },
    errors: {
      generic: 'Something went wrong. Please try again.',
    },
  },

  tr: {
    header: {
      brandShort: 'NexusAudit AI',
      brandFull: 'NexusAudit AI',
      navAudit: 'Denetim',
      navHistory: 'Geçmiş',
      navAbout: 'Hakkımda',
      navTerms: 'Kullanım Şartları',
    },
    hero: {
      badge: 'Gerçek teknik taramalar + Groq AI ile çalışır',
      titleA: 'Web sitenizi',
      titleB: 'neyin geride tuttuğunu tam olarak öğrenin',
      subtitle:
        'Bir URL girin, performans, SEO, güvenlik, erişilebilirlik ve mobil uyumluluk için gerçek bir teknik denetim alın — AI tarafından açıklanır ve önceliklendirilir.',
      placeholder: 'https://example.com',
      cta: 'Siteyi Analiz Et',
    },
    features: {
      heading: 'Neleri kontrol ediyoruz',
      sub: 'Altı kategori, tamamı gerçek tarama verisinden puanlanır — asla tahmin edilmez.',
      performance: { title: 'Performans', desc: 'Sitenizin gerçek isteğinden elde edilen yüklenme süresi, sayfa boyutu ve kaynak sayısı.' },
      seo: { title: 'SEO', desc: 'Başlık, meta açıklama, başlıklar, canonical, site haritası, robots.txt, Open Graph ve yapılandırılmış veri.' },
      security: { title: 'Güvenlik', desc: 'HTTPS, HSTS, CSP, clickjacking koruması ve diğer yanıt başlıkları, canlı olarak kontrol edilir.' },
      accessibility: { title: 'Erişilebilirlik', desc: 'Alt metinler, form etiketleri, buton adları, semantik HTML ve dil bildirimleri.' },
      mobile: { title: 'Mobil', desc: 'Viewport yapılandırması ve küçük ekranları bozan sabit genişlikli elementler.' },
      codeQuality: { title: 'Kod Kalitesi', desc: 'DOCTYPE, charset, kullanımdan kaldırılmış etiketler ve satır içi stil hijyeni.' },
    },
    how: {
      heading: 'Nasıl çalışır',
      sub: 'URL girmekten tam rapora bir dakikadan kısa sürede ulaşın.',
      steps: [
        { title: 'Analiz', desc: 'URL doğrulanır ve güvenli şekilde denetlenebileceğinden emin olunur.' },
        { title: 'Tarama', desc: 'Sayfanız, başlıklarınız, robots.txt ve site haritanız gerçekten alınır.' },
        { title: 'AI Analizi', desc: 'Groq, teknik sonuçları okur ve neyin önemli olduğunu açıklar.' },
        { title: 'Rapor', desc: 'Puanlanmış bir panel ve saklayıp paylaşabileceğiniz bir PDF elde edersiniz.' },
      ],
    },
    why: {
      heading: 'Neden NexusAudit AI',
      points: [
        { title: 'Sadece gerçek veri', desc: 'Her puan gerçek bir taramadan gelir. Hiçbir şey tahmin edilmez veya uydurulmaz.' },
        { title: 'Groq destekli analiz', desc: 'AI sorunları açıklar ve önceliklendirir — verilerde olmayan hiçbir şeyi uydurmaz.' },
        { title: 'SSRF korumalı tarama', desc: 'Özel ağlar, localhost ve dahili IP adresleri her zaman engellenir.' },
        { title: 'Ücretsiz PDF raporları', desc: 'Herhangi bir denetim için istediğiniz zaman paylaşılabilir bir rapor indirin.' },
      ],
    },
    footer: {
      tagline: 'Gerçek teknik denetimler. Gerçek AI analizi. Hiçbir şey uydurma değil.',
      product: 'Ürün',
      poweredBy: 'Groq AI ile çalışır',
      rights: 'Tüm hakları saklıdır.',
    },
    about: {
      eyebrow: 'Hakkımızda',
      title: 'NexusAudit AI hakkında',
      intro: 'NexusAudit AI, web sitenizin teknik durumunu anlaşılır ve uygulanabilir bilgilerle görmenize yardımcı olur.',
      sections: [
        { title: 'Amacımız', body: 'Teknik web sitesi kontrollerini, sonraki adımınızı kolayca belirleyebileceğiniz anlaşılır bir rapora dönüştürüyoruz.' },
        { title: 'Gerçek tarama verisi', body: 'Performans, SEO, güvenlik, erişilebilirlik ve mobil bulguları gönderdiğiniz URL üzerinde yapılan canlı taramadan gelir.' },
        { title: 'AI destekli içgörüler', body: 'Groq AI bulguları açıklar ve önceliklendirir. Bilinçli karar verebilmeniz için temel teknik sonuçlar görünür kalır.' },
      ],
    },
    terms: {
      eyebrow: 'Yasal',
      title: 'Kullanım Şartları',
      intro: 'NexusAudit AI’yi kullanarak hizmeti sorumlu şekilde ve bu şartlara uygun kullanmayı kabul etmiş olursunuz.',
      sections: [
        { title: 'Hizmetin kullanımı', body: 'Yalnızca inceleme yetkinizin olduğu URL’leri gönderin. Hizmeti özel sistemlere erişmek, güvenlik kontrollerini aşmak veya zararlı faaliyet yürütmek için kullanmayın.' },
        { title: 'Sonuçlar ve kullanılabilirlik', body: 'Denetim sonuçları bilgilendirme amacıyla sunulur. Her bulgunun eksiksiz olacağını veya hizmetin her zaman kullanılabilir olacağını garanti etmiyoruz.' },
        { title: 'Sorumlu kullanım', body: 'Gönderdiğiniz URL’lerden ve denetim raporuna dayanarak aldığınız kararlardan siz sorumlusunuz. Hizmeti yürürlükteki yasalara uygun kullanın.' },
      ],
    },
    scan: {
      auditing: 'Denetleniyor',
      steps: [
        { label: 'Analiz', detail: 'URL doğrulanıyor ve tarama hazırlanıyor' },
        { label: 'Tarama', detail: 'Sayfa, başlıklar, robots.txt ve site haritası alınıyor' },
        { label: 'AI Analizi', detail: 'Groq teknik sonuçları yorumluyor' },
        { label: 'Rapor', detail: 'Paneliniz hazırlanıyor' },
      ],
    },
    categories: {
      performance: 'Performans',
      seo: 'SEO',
      accessibility: 'Erişilebilirlik',
      security: 'Güvenlik',
      mobile: 'Mobil',
      codeQuality: 'Kod Kalitesi',
    },
    categoryBadge: {
      SEO: 'SEO',
      Security: 'Güvenlik',
      Accessibility: 'Erişilebilirlik',
      Mobile: 'Mobil',
      Performance: 'Performans',
      'Code Quality': 'Kod Kalitesi',
    },
    band: { good: 'İYİ', fair: 'ORTA', poor: 'ZAYIF' },
    assessment: { Excellent: 'Mükemmel', Good: 'İyi', Fair: 'Orta', Poor: 'Zayıf' },
    severity: { high: 'YÜKSEK', medium: 'ORTA', low: 'DÜŞÜK' },
    dashboard: {
      websiteAudit: 'Web Sitesi Denetimi',
      overallScore: 'Genel Puan',
      categoryScores: 'Kategori Puanları',
      aiSummaryHeading: 'AI Web Sitesi Özeti',
      aiUnavailable: 'AI analizi şu anda kullanılamıyor',
      aiUnavailableFallback:
        'Aşağıdaki teknik puanlar ve bulgular yine de doğrudan gerçek tarama verisinden hesaplandı.',
      technologyDetection: 'Tespit Edilen Teknolojiler',
      criticalIssues: 'Kritik Sorunlar',
      noCriticalIssues: 'Kritik sorun bulunamadı. Harika iş!',
      additionalFindings: 'Diğer Bulgular',
      recommendations: 'Öneriler',
      strengths: 'Güçlü Yönler',
      downloadReport: 'Raporu İndir',
      newAudit: 'Yeni Denetim',
      whyItMatters: 'Neden önemli',
      howToFix: 'Nasıl düzeltilir',
      fixWithAI: 'AI ile Düzelt',
    },
    fixModal: {
      title: 'AI ile Düzelt',
      before: 'Önce',
      after: 'Sonra',
      generating: 'Groq düzeltme oluşturuyor...',
      failed: 'Düzeltme oluşturulamadı',
    },
    history: {
      heading: 'Denetim Geçmişi',
      loadFailed: 'Geçmiş yüklenemedi',
      empty: 'Henüz denetim yok. İlk denetimini çalıştırdığında burada görünecek.',
      audits: 'denetim',
      audit: 'denetim',
      view: 'Görüntüle',
      notEnough: 'Henüz yeterli geçmiş yok',
      score: 'Puan',
    },
    errors: {
      generic: 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
    },
  },
};

export function getTranslator(lang) {
  const dict = translations[lang] || translations.en;
  const fallback = translations.en;
  return function t(path) {
    const parts = path.split('.');
    let node = dict;
    let fallbackNode = fallback;
    for (const part of parts) {
      node = node?.[part];
      fallbackNode = fallbackNode?.[part];
    }
    return node !== undefined ? node : fallbackNode;
  };
}
