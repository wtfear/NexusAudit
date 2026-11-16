function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Picks the English or Turkish variant of a string based on the request language. */
function tx(lang, en, tr) {
  return lang === 'tr' ? tr : en;
}

function pushIssue(list, severity, title, explanation, recommendation, codeSample) {
  list.push({ severity, title, explanation, recommendation, ...(codeSample ? { codeSample } : {}) });
}

/**
 * Every deduction below is triggered by a real, observed condition from the
 * scan result — nothing here is randomized or estimated. `lang` only
 * controls which language the human-readable text is written in.
 */
export function scoreSeo(scan, lang = 'en') {
  const { html, robots, sitemap } = scan;
  let score = 100;
  const issues = [];
  const checks = [];

  if (!html.title) {
    score -= 20;
    pushIssue(
      issues,
      'high',
      tx(lang, 'Missing page title', 'Sayfa başlığı eksik'),
      tx(lang, 'No <title> tag was found on the page.', 'Sayfada <title> etiketi bulunamadı.'),
      tx(lang, 'Add a unique, descriptive <title> tag (50-60 characters).', 'Benzersiz ve açıklayıcı bir <title> etiketi ekleyin (50-60 karakter).'),
      '<head>\n  <!-- no <title> tag present -->\n</head>'
    );
    checks.push({ ok: false, label: tx(lang, 'Title detected', 'Başlık tespit edildi') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Title detected', 'Başlık tespit edildi') });
    if (html.titleLength > 60 || html.titleLength < 10) {
      score -= 5;
      pushIssue(
        issues,
        'low',
        tx(lang, 'Title length is not optimal', 'Başlık uzunluğu ideal değil'),
        tx(lang, `The title is ${html.titleLength} characters long.`, `Başlık ${html.titleLength} karakter uzunluğunda.`),
        tx(lang, 'Keep titles between roughly 10 and 60 characters.', 'Başlıkları yaklaşık 10-60 karakter arasında tutun.')
      );
    }
  }

  if (!html.metaDescription) {
    score -= 15;
    pushIssue(
      issues,
      'high',
      tx(lang, 'Missing meta description', 'Meta açıklaması eksik'),
      tx(lang, 'No meta description tag was found.', 'Meta açıklama etiketi bulunamadı.'),
      tx(lang, 'Add a meta description between 50-160 characters summarizing the page.', 'Sayfayı özetleyen 50-160 karakter arası bir meta açıklama ekleyin.'),
      `<head>\n  <title>${scan.html.title || 'Page title'}</title>\n  <!-- no meta description present -->\n</head>`
    );
    checks.push({ ok: false, label: tx(lang, 'Meta description detected', 'Meta açıklaması tespit edildi') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Meta description detected', 'Meta açıklaması tespit edildi') });
    if (html.metaDescriptionLength > 160 || html.metaDescriptionLength < 50) {
      score -= 5;
      pushIssue(
        issues,
        'low',
        tx(lang, 'Meta description length is not optimal', 'Meta açıklama uzunluğu ideal değil'),
        tx(lang, `The meta description is ${html.metaDescriptionLength} characters long.`, `Meta açıklama ${html.metaDescriptionLength} karakter uzunluğunda.`),
        tx(lang, 'Aim for 50-160 characters.', '50-160 karakter aralığını hedefleyin.')
      );
    }
  }

  if (html.h1.length === 0) {
    score -= 15;
    pushIssue(
      issues,
      'high',
      tx(lang, 'Missing H1 heading', 'H1 başlığı eksik'),
      tx(lang, 'No <h1> element was found on the page.', 'Sayfada <h1> elementi bulunamadı.'),
      tx(lang, 'Add exactly one <h1> describing the main topic of the page.', 'Sayfanın ana konusunu açıklayan tek bir <h1> ekleyin.')
    );
    checks.push({ ok: false, label: tx(lang, 'H1 detected', 'H1 tespit edildi') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'H1 detected', 'H1 tespit edildi') });
    if (html.h1.length > 1) {
      score -= 5;
      pushIssue(
        issues,
        'medium',
        tx(lang, 'Multiple H1 headings', 'Birden fazla H1 başlığı'),
        tx(lang, `Found ${html.h1.length} <h1> elements.`, `${html.h1.length} adet <h1> elementi bulundu.`),
        tx(lang, 'Use a single <h1> per page for a clear content hierarchy.', 'Net bir içerik hiyerarşisi için sayfa başına tek bir <h1> kullanın.')
      );
    }
  }

  if (!html.canonical) {
    score -= 10;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'Missing canonical tag', 'Canonical etiketi eksik'),
      tx(lang, 'No <link rel="canonical"> tag was found.', '<link rel="canonical"> etiketi bulunamadı.'),
      tx(lang, 'Add a canonical URL to avoid duplicate-content issues.', 'Yinelenen içerik sorunlarını önlemek için canonical URL ekleyin.'),
      `<head>\n  <!-- no <link rel="canonical"> tag present -->\n  <!-- page URL: ${scan.finalUrl} -->\n</head>`
    );
    checks.push({ ok: false, label: tx(lang, 'Canonical tag detected', 'Canonical etiketi tespit edildi') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Canonical tag detected', 'Canonical etiketi tespit edildi') });
  }

  if (!robots.found) {
    score -= 10;
    pushIssue(
      issues,
      'high',
      tx(lang, 'robots.txt not found', 'robots.txt bulunamadı'),
      tx(lang, 'No robots.txt file was found at /robots.txt.', '/robots.txt adresinde bir robots.txt dosyası bulunamadı.'),
      tx(lang, 'Add a robots.txt file to guide search engine crawlers.', 'Arama motoru botlarına yol göstermek için bir robots.txt dosyası ekleyin.')
    );
    checks.push({ ok: false, label: tx(lang, 'robots.txt detected', 'robots.txt tespit edildi') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'robots.txt detected', 'robots.txt tespit edildi') });
  }

  if (!sitemap.found) {
    score -= 10;
    pushIssue(
      issues,
      'high',
      tx(lang, 'Sitemap not found', 'Site haritası bulunamadı'),
      tx(lang, 'No XML sitemap was found at /sitemap.xml or referenced from robots.txt.', '/sitemap.xml adresinde ya da robots.txt içinde referans verilen bir XML site haritası bulunamadı.'),
      tx(lang, 'Create and submit an XML sitemap to search engines.', 'Bir XML site haritası oluşturup arama motorlarına gönderin.')
    );
    checks.push({ ok: false, label: tx(lang, 'Sitemap detected', 'Site haritası tespit edildi') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Sitemap detected', 'Site haritası tespit edildi') });
  }

  const hasOg = Boolean(html.openGraph.title || html.openGraph.description);
  if (!hasOg) {
    score -= 10;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'Missing Open Graph tags', 'Open Graph etiketleri eksik'),
      tx(lang, 'No og:title or og:description meta tags were found.', 'og:title veya og:description meta etiketleri bulunamadı.'),
      tx(lang, 'Add Open Graph tags so links render well when shared on social media.', 'Sosyal medyada paylaşıldığında bağlantıların düzgün görünmesi için Open Graph etiketleri ekleyin.')
    );
    checks.push({ ok: false, label: tx(lang, 'Open Graph tags detected', 'Open Graph etiketleri tespit edildi') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Open Graph tags detected', 'Open Graph etiketleri tespit edildi') });
  }

  if (!html.structuredData.present) {
    score -= 5;
    pushIssue(
      issues,
      'low',
      tx(lang, 'No structured data found', 'Yapılandırılmış veri bulunamadı'),
      tx(lang, 'No JSON-LD structured data was detected.', 'JSON-LD yapılandırılmış verisi tespit edilmedi.'),
      tx(lang, 'Add relevant Schema.org structured data to improve rich-result eligibility.', 'Zengin sonuç uygunluğunu artırmak için ilgili Schema.org yapılandırılmış verisini ekleyin.')
    );
    checks.push({ ok: false, label: tx(lang, 'Structured data detected', 'Yapılandırılmış veri tespit edildi') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Structured data detected', 'Yapılandırılmış veri tespit edildi') });
  }

  if (html.images.total > 0) {
    const missingRatio = html.images.missingAlt / html.images.total;
    if (html.images.missingAlt > 0) {
      const penalty = Math.round(missingRatio * 15);
      score -= penalty;
      const example = html.images.sample.find((img) => !img.hasAlt);
      pushIssue(
        issues,
        missingRatio > 0.5 ? 'high' : 'medium',
        tx(lang, 'Images missing alt text', 'Görsellerde alt metni eksik'),
        tx(
          lang,
          `${html.images.missingAlt} of ${html.images.total} images are missing alt attributes.`,
          `${html.images.total} görselden ${html.images.missingAlt} tanesinde alt niteliği eksik.`
        ),
        tx(lang, 'Add descriptive alt attributes to all meaningful images.', 'Anlamlı tüm görsellere açıklayıcı alt nitelikleri ekleyin.'),
        example ? `<img src="${example.src || ''}">` : undefined
      );
      checks.push({ ok: false, label: tx(lang, `${html.images.missingAlt} images missing alt text`, `${html.images.missingAlt} görselde alt metni eksik`) });
    } else {
      checks.push({ ok: true, label: tx(lang, 'All images have alt text', 'Tüm görsellerde alt metni var') });
    }
  }

  return { score: clamp(score), issues, checks };
}

export function scoreSecurity(scan, lang = 'en') {
  const { security } = scan;
  let score = 100;
  const issues = [];
  const checks = [];

  if (!security.https) {
    score -= 40;
    pushIssue(
      issues,
      'high',
      tx(lang, 'HTTPS not in use', 'HTTPS kullanılmıyor'),
      tx(lang, 'The site was reached over an insecure HTTP connection.', 'Siteye güvensiz bir HTTP bağlantısı üzerinden ulaşıldı.'),
      tx(lang, 'Serve the site over HTTPS with a valid TLS certificate.', 'Siteyi geçerli bir TLS sertifikasıyla HTTPS üzerinden sunun.')
    );
    checks.push({ ok: false, label: tx(lang, 'HTTPS enabled', 'HTTPS etkin') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'HTTPS enabled', 'HTTPS etkin') });
  }

  if (!security.hsts) {
    score -= 15;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'Missing HSTS header', 'HSTS başlığı eksik'),
      tx(lang, 'No Strict-Transport-Security header was found.', 'Strict-Transport-Security başlığı bulunamadı.'),
      tx(lang, 'Add a Strict-Transport-Security header to enforce HTTPS in browsers.', 'Tarayıcılarda HTTPS zorunluluğu için Strict-Transport-Security başlığı ekleyin.')
    );
    checks.push({ ok: false, label: tx(lang, 'HSTS header present', 'HSTS başlığı mevcut') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'HSTS header present', 'HSTS başlığı mevcut') });
  }

  if (!security.csp) {
    score -= 15;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'Missing Content-Security-Policy', 'Content-Security-Policy eksik'),
      tx(lang, 'No Content-Security-Policy header was found.', 'Content-Security-Policy başlığı bulunamadı.'),
      tx(lang, 'Configure a Content-Security-Policy header to mitigate XSS risks.', 'XSS risklerini azaltmak için bir Content-Security-Policy başlığı yapılandırın.')
    );
    checks.push({ ok: false, label: tx(lang, 'Content-Security-Policy present', 'Content-Security-Policy mevcut') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Content-Security-Policy present', 'Content-Security-Policy mevcut') });
  }

  if (!security.xFrameOptions && !(security.csp || '').includes('frame-ancestors')) {
    score -= 10;
    pushIssue(
      issues,
      'low',
      tx(lang, 'Missing clickjacking protection', 'Clickjacking koruması eksik'),
      tx(lang, 'No X-Frame-Options header or CSP frame-ancestors directive was found.', 'X-Frame-Options başlığı veya CSP frame-ancestors direktifi bulunamadı.'),
      tx(lang, 'Add X-Frame-Options or a CSP frame-ancestors directive.', 'X-Frame-Options başlığı veya CSP frame-ancestors direktifi ekleyin.')
    );
    checks.push({ ok: false, label: tx(lang, 'Clickjacking protection present', 'Clickjacking koruması mevcut') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Clickjacking protection present', 'Clickjacking koruması mevcut') });
  }

  if (!security.xContentTypeOptions) {
    score -= 10;
    pushIssue(
      issues,
      'low',
      tx(lang, 'Missing X-Content-Type-Options', 'X-Content-Type-Options eksik'),
      tx(lang, 'The X-Content-Type-Options: nosniff header was not found.', 'X-Content-Type-Options: nosniff başlığı bulunamadı.'),
      tx(lang, 'Add the X-Content-Type-Options: nosniff header.', 'X-Content-Type-Options: nosniff başlığını ekleyin.')
    );
    checks.push({ ok: false, label: tx(lang, 'X-Content-Type-Options present', 'X-Content-Type-Options mevcut') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'X-Content-Type-Options present', 'X-Content-Type-Options mevcut') });
  }

  if (!security.referrerPolicy) {
    score -= 5;
    pushIssue(
      issues,
      'low',
      tx(lang, 'Missing Referrer-Policy', 'Referrer-Policy eksik'),
      tx(lang, 'No Referrer-Policy header was found.', 'Referrer-Policy başlığı bulunamadı.'),
      tx(lang, 'Add a Referrer-Policy header to control referrer information leakage.', 'Referrer bilgisi sızıntısını kontrol etmek için bir Referrer-Policy başlığı ekleyin.')
    );
    checks.push({ ok: false, label: tx(lang, 'Referrer-Policy present', 'Referrer-Policy mevcut') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Referrer-Policy present', 'Referrer-Policy mevcut') });
  }

  if (security.serverHeader || security.poweredByHeader) {
    score -= 5;
    const exposed = [security.serverHeader, security.poweredByHeader].filter(Boolean).join(', ');
    pushIssue(
      issues,
      'low',
      tx(lang, 'Server information exposed', 'Sunucu bilgisi açığa çıkıyor'),
      tx(lang, `The server exposes identifying headers (${exposed}).`, `Sunucu, kimliğini ifşa eden başlıklar gönderiyor (${exposed}).`),
      tx(lang, 'Suppress or generalize the Server and X-Powered-By headers.', 'Server ve X-Powered-By başlıklarını gizleyin veya genelleştirin.')
    );
    checks.push({ ok: false, label: tx(lang, 'Server details hidden', 'Sunucu ayrıntıları gizli') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Server details hidden', 'Sunucu ayrıntıları gizli') });
  }

  return { score: clamp(score), issues, checks };
}

export function scoreAccessibility(scan, lang = 'en') {
  const { html } = scan;
  let score = 100;
  const issues = [];
  const checks = [];

  if (html.images.total > 0 && html.images.missingAlt > 0) {
    const ratio = html.images.missingAlt / html.images.total;
    score -= Math.round(ratio * 25);
    const example = html.images.sample.find((img) => !img.hasAlt);
    pushIssue(
      issues,
      ratio > 0.5 ? 'high' : 'medium',
      tx(lang, 'Images missing alt attributes', 'Görsellerde alt niteliği eksik'),
      tx(
        lang,
        `${html.images.missingAlt} of ${html.images.total} images have no alt attribute.`,
        `${html.images.total} görselden ${html.images.missingAlt} tanesinde alt niteliği yok.`
      ),
      tx(lang, 'Add descriptive alt text (or alt="" for purely decorative images).', 'Açıklayıcı alt metni ekleyin (tamamen dekoratif görseller için alt="").'),
      example ? `<img src="${example.src || ''}">` : undefined
    );
    checks.push({ ok: false, label: tx(lang, 'Image alt attributes', 'Görsel alt nitelikleri') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Image alt attributes', 'Görsel alt nitelikleri') });
  }

  if (html.forms.inputsWithoutLabel > 0) {
    score -= Math.min(20, html.forms.inputsWithoutLabel * 4);
    pushIssue(
      issues,
      'high',
      tx(lang, 'Form fields without labels', 'Etiketsiz form alanları'),
      tx(
        lang,
        `${html.forms.inputsWithoutLabel} form field(s) have no associated <label> or aria-label.`,
        `${html.forms.inputsWithoutLabel} form alanının ilişkili bir <label> veya aria-label'ı yok.`
      ),
      tx(lang, 'Associate every form field with a <label> or aria-label/aria-labelledby.', 'Her form alanını bir <label> veya aria-label/aria-labelledby ile ilişkilendirin.')
    );
    checks.push({ ok: false, label: tx(lang, 'Form labels present', 'Form etiketleri mevcut') });
  } else if (html.forms.total > 0) {
    checks.push({ ok: true, label: tx(lang, 'Form labels present', 'Form etiketleri mevcut') });
  }

  if (html.buttons.withoutAccessibleName > 0) {
    score -= Math.min(15, html.buttons.withoutAccessibleName * 3);
    pushIssue(
      issues,
      'medium',
      tx(lang, 'Buttons without accessible names', 'Erişilebilir adı olmayan butonlar'),
      tx(lang, `${html.buttons.withoutAccessibleName} button(s) have no visible text or aria-label.`, `${html.buttons.withoutAccessibleName} butonun görünür metni veya aria-label'ı yok.`),
      tx(lang, 'Give every button visible text or an aria-label.', 'Her butona görünür bir metin veya aria-label verin.')
    );
    checks.push({ ok: false, label: tx(lang, 'Button labels present', 'Buton etiketleri mevcut') });
  } else if (html.buttons.total > 0) {
    checks.push({ ok: true, label: tx(lang, 'Button labels present', 'Buton etiketleri mevcut') });
  }

  if (!html.lang) {
    score -= 10;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'Missing lang attribute', 'lang niteliği eksik'),
      tx(lang, 'The <html> element has no lang attribute.', '<html> elementinde lang niteliği yok.'),
      tx(lang, 'Add a lang attribute (e.g. lang="en") to the <html> element.', '<html> elementine bir lang niteliği ekleyin (örn. lang="tr").'),
      '<html>\n  <!-- no lang attribute -->\n  ...\n</html>'
    );
    checks.push({ ok: false, label: tx(lang, 'Page language declared', 'Sayfa dili belirtilmiş') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Page language declared', 'Sayfa dili belirtilmiş') });
  }

  const semanticCount = Object.values(html.semanticTags).filter(Boolean).length;
  if (semanticCount <= 1) {
    score -= 15;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'Little to no semantic HTML', 'Neredeyse hiç semantik HTML yok'),
      tx(
        lang,
        'The page makes little use of semantic elements (header, nav, main, footer, article, section).',
        'Sayfa, semantik elementleri (header, nav, main, footer, article, section) neredeyse hiç kullanmıyor.'
      ),
      tx(lang, 'Use semantic HTML elements to improve screen-reader navigation.', 'Ekran okuyucu gezinimini iyileştirmek için semantik HTML elementleri kullanın.')
    );
    checks.push({ ok: false, label: tx(lang, 'Semantic HTML structure', 'Semantik HTML yapısı') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Semantic HTML structure', 'Semantik HTML yapısı') });
  }

  if (html.h1.length === 0) {
    score -= 10;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'No H1 for screen readers', 'Ekran okuyucular için H1 yok'),
      tx(
        lang,
        'No <h1> was found, which screen reader users rely on to identify the page topic.',
        'Ekran okuyucu kullanıcılarının sayfa konusunu anlamak için kullandığı <h1> bulunamadı.'
      ),
      tx(lang, 'Add a single, descriptive <h1>.', 'Tek ve açıklayıcı bir <h1> ekleyin.')
    );
  }

  return { score: clamp(score), issues, checks };
}

export function scoreMobile(scan, lang = 'en') {
  const { mobile } = scan;
  let score = 100;
  const issues = [];
  const checks = [];

  if (!mobile.viewportPresent) {
    score -= 40;
    pushIssue(
      issues,
      'high',
      tx(lang, 'Missing viewport meta tag', 'Viewport meta etiketi eksik'),
      tx(lang, 'No <meta name="viewport"> tag was found.', '<meta name="viewport"> etiketi bulunamadı.'),
      tx(lang, 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.', '<meta name="viewport" content="width=device-width, initial-scale=1"> ekleyin.'),
      '<head>\n  <!-- no <meta name="viewport"> tag present -->\n</head>'
    );
    checks.push({ ok: false, label: tx(lang, 'Viewport meta tag present', 'Viewport meta etiketi mevcut') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Viewport meta tag present', 'Viewport meta etiketi mevcut') });
    if (!mobile.viewportHasWidthDevice) {
      score -= 20;
      pushIssue(
        issues,
        'medium',
        tx(lang, 'Viewport not set to device width', 'Viewport cihaz genişliğine ayarlanmamış'),
        tx(lang, 'The viewport tag does not set width=device-width.', 'Viewport etiketi width=device-width değerini ayarlamıyor.'),
        tx(lang, 'Set the viewport content to "width=device-width, initial-scale=1".', 'Viewport içeriğini "width=device-width, initial-scale=1" olarak ayarlayın.')
      );
      checks.push({ ok: false, label: tx(lang, 'Viewport uses device width', 'Viewport cihaz genişliğini kullanıyor') });
    } else {
      checks.push({ ok: true, label: tx(lang, 'Viewport uses device width', 'Viewport cihaz genişliğini kullanıyor') });
    }
  }

  if (mobile.fixedWidthElementCount > 0) {
    score -= Math.min(15, mobile.fixedWidthElementCount * 3);
    pushIssue(
      issues,
      'low',
      tx(lang, 'Fixed-width elements detected', 'Sabit genişlikte elementler tespit edildi'),
      tx(lang, `${mobile.fixedWidthElementCount} element(s) use a fixed width attribute over 600px.`, `${mobile.fixedWidthElementCount} element 600px üzeri sabit bir genişlik niteliği kullanıyor.`),
      tx(lang, 'Use responsive/relative widths instead of large fixed pixel widths.', 'Büyük sabit piksel genişlikleri yerine duyarlı/göreceli genişlikler kullanın.')
    );
    checks.push({ ok: false, label: tx(lang, 'No large fixed-width elements', 'Büyük sabit genişlikte element yok') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'No large fixed-width elements', 'Büyük sabit genişlikte element yok') });
  }

  if (mobile.inlineFixedWidthStyleCount > 0) {
    score -= Math.min(10, mobile.inlineFixedWidthStyleCount * 2);
    pushIssue(
      issues,
      'low',
      tx(lang, 'Fixed-width inline styles detected', 'Sabit genişlikte satır içi stiller tespit edildi'),
      tx(
        lang,
        `${mobile.inlineFixedWidthStyleCount} element(s) use inline styles with a fixed pixel width.`,
        `${mobile.inlineFixedWidthStyleCount} element sabit piksel genişlikli satır içi stil kullanıyor.`
      ),
      tx(lang, 'Prefer responsive CSS (max-width, %, rem) over fixed pixel widths.', 'Sabit piksel genişlikleri yerine duyarlı CSS (max-width, %, rem) tercih edin.')
    );
  }

  return { score: clamp(score), issues, checks };
}

export function scorePerformance(scan, lang = 'en') {
  const { performance: perf } = scan;
  let score = 100;
  const issues = [];
  const checks = [];

  if (perf.loadTimeMs <= 800) {
    checks.push({ ok: true, label: tx(lang, 'Fast server response time', 'Hızlı sunucu yanıt süresi') });
  } else if (perf.loadTimeMs <= 2000) {
    score -= 10;
    checks.push({ ok: true, label: tx(lang, 'Acceptable server response time', 'Kabul edilebilir sunucu yanıt süresi') });
  } else if (perf.loadTimeMs <= 4000) {
    score -= 25;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'Slow server response time', 'Yavaş sunucu yanıt süresi'),
      tx(lang, `The page took ${perf.loadTimeMs}ms to load.`, `Sayfa yüklenmesi ${perf.loadTimeMs}ms sürdü.`),
      tx(lang, 'Investigate server-side rendering time, caching, and hosting location.', 'Sunucu taraflı render süresini, önbelleklemeyi ve barındırma konumunu inceleyin.')
    );
    checks.push({ ok: false, label: tx(lang, 'Server response time', 'Sunucu yanıt süresi') });
  } else {
    score -= 40;
    pushIssue(
      issues,
      'high',
      tx(lang, 'Very slow server response time', 'Çok yavaş sunucu yanıt süresi'),
      tx(lang, `The page took ${perf.loadTimeMs}ms to load.`, `Sayfa yüklenmesi ${perf.loadTimeMs}ms sürdü.`),
      tx(lang, 'Improve backend response time, enable caching/CDN, and reduce server-side work.', 'Backend yanıt süresini iyileştirin, önbellekleme/CDN etkinleştirin ve sunucu taraflı işi azaltın.')
    );
    checks.push({ ok: false, label: tx(lang, 'Server response time', 'Sunucu yanıt süresi') });
  }

  const sizeKb = perf.pageSizeBytes / 1024;
  if (sizeKb <= 500) {
    checks.push({ ok: true, label: tx(lang, 'Lean page size', 'Az yer kaplayan sayfa boyutu') });
  } else if (sizeKb <= 2000) {
    score -= 10;
    checks.push({ ok: true, label: tx(lang, 'Moderate page size', 'Orta seviye sayfa boyutu') });
  } else {
    score -= 25;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'Large page size', 'Büyük sayfa boyutu'),
      tx(lang, `The HTML document is ${Math.round(sizeKb)}KB.`, `HTML belgesi ${Math.round(sizeKb)}KB boyutunda.`),
      tx(lang, 'Reduce markup size, remove unused code, and enable compression (gzip/brotli).', 'İşaretleme boyutunu azaltın, kullanılmayan kodu kaldırın ve sıkıştırma (gzip/brotli) etkinleştirin.')
    );
    checks.push({ ok: false, label: tx(lang, 'Page size', 'Sayfa boyutu') });
  }

  if (perf.requestCountEstimate <= 20) {
    checks.push({ ok: true, label: tx(lang, 'Low resource count', 'Düşük kaynak sayısı') });
  } else if (perf.requestCountEstimate <= 50) {
    score -= 10;
    checks.push({ ok: true, label: tx(lang, 'Moderate resource count', 'Orta seviye kaynak sayısı') });
  } else {
    score -= 20;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'High number of page resources', 'Yüksek sayıda sayfa kaynağı'),
      tx(
        lang,
        `Approximately ${perf.requestCountEstimate} scripts/stylesheets/images were referenced.`,
        `Yaklaşık ${perf.requestCountEstimate} script/stil dosyası/görsel referans verildi.`
      ),
      tx(lang, 'Bundle and lazy-load assets to reduce the number of requests.', 'İstek sayısını azaltmak için varlıkları paketleyin ve tembel yükleyin (lazy-load).')
    );
    checks.push({ ok: false, label: tx(lang, 'Resource count', 'Kaynak sayısı') });
  }

  return { score: clamp(score), issues, checks, unavailableMetrics: ['lcp', 'cls', 'inp', 'fcp', 'tbt'] };
}

export function scoreCodeQuality(scan, lang = 'en') {
  const { html } = scan;
  let score = 100;
  const issues = [];
  const checks = [];

  if (!html.doctypePresent) {
    score -= 15;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'Missing DOCTYPE declaration', 'DOCTYPE bildirimi eksik'),
      tx(lang, 'No <!DOCTYPE html> declaration was found.', '<!DOCTYPE html> bildirimi bulunamadı.'),
      tx(lang, 'Add <!DOCTYPE html> as the first line of the document.', 'Belgenin ilk satırına <!DOCTYPE html> ekleyin.')
    );
    checks.push({ ok: false, label: tx(lang, 'DOCTYPE declared', 'DOCTYPE bildirilmiş') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'DOCTYPE declared', 'DOCTYPE bildirilmiş') });
  }

  if (!html.charsetPresent) {
    score -= 10;
    pushIssue(
      issues,
      'medium',
      tx(lang, 'Missing charset declaration', 'Charset bildirimi eksik'),
      tx(lang, 'No <meta charset> tag was found.', '<meta charset> etiketi bulunamadı.'),
      tx(lang, 'Add <meta charset="UTF-8"> near the top of <head>.', '<head> başında <meta charset="UTF-8"> ekleyin.')
    );
    checks.push({ ok: false, label: tx(lang, 'Charset declared', 'Charset bildirilmiş') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Charset declared', 'Charset bildirilmiş') });
  }

  if (!html.lang) {
    score -= 10;
    checks.push({ ok: false, label: tx(lang, 'HTML lang attribute set', 'HTML lang niteliği ayarlı') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'HTML lang attribute set', 'HTML lang niteliği ayarlı') });
  }

  if (html.deprecatedTags.length > 0) {
    score -= Math.min(15, html.deprecatedTags.length * 5);
    pushIssue(
      issues,
      'low',
      tx(lang, 'Deprecated HTML tags in use', 'Kullanımdan kaldırılmış HTML etiketleri kullanılıyor'),
      tx(lang, `Found deprecated tag(s): ${html.deprecatedTags.join(', ')}.`, `Kullanımdan kaldırılmış etiket(ler) bulundu: ${html.deprecatedTags.join(', ')}.`),
      tx(lang, 'Replace deprecated tags with modern semantic HTML and CSS.', 'Kullanımdan kaldırılmış etiketleri modern semantik HTML ve CSS ile değiştirin.'),
      `<${html.deprecatedTags[0]}>...</${html.deprecatedTags[0]}>`
    );
    checks.push({ ok: false, label: tx(lang, 'No deprecated HTML tags', 'Kullanımdan kaldırılmış etiket yok') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'No deprecated HTML tags', 'Kullanımdan kaldırılmış etiket yok') });
  }

  if (html.inlineStyleElementCount > 20) {
    score -= 10;
    pushIssue(
      issues,
      'low',
      tx(lang, 'Heavy use of inline styles', 'Yoğun satır içi stil kullanımı'),
      tx(lang, `${html.inlineStyleElementCount} elements use inline style attributes.`, `${html.inlineStyleElementCount} element satır içi style niteliği kullanıyor.`),
      tx(lang, 'Move styling into external stylesheets for maintainability and caching.', 'Sürdürülebilirlik ve önbellekleme için stilleri harici stil dosyalarına taşıyın.')
    );
    checks.push({ ok: false, label: tx(lang, 'Minimal inline styling', 'Minimal satır içi stil') });
  } else {
    checks.push({ ok: true, label: tx(lang, 'Minimal inline styling', 'Minimal satır içi stil') });
  }

  return { score: clamp(score), issues, checks };
}

const CATEGORY_LABELS = {
  seo: { en: 'SEO', tr: 'SEO' },
  security: { en: 'Security', tr: 'Güvenlik' },
  accessibility: { en: 'Accessibility', tr: 'Erişilebilirlik' },
  mobile: { en: 'Mobile', tr: 'Mobil' },
  performance: { en: 'Performance', tr: 'Performans' },
  codeQuality: { en: 'Code Quality', tr: 'Kod Kalitesi' },
};

export function computeAudit(scan, lang = 'en') {
  const l = lang === 'tr' ? 'tr' : 'en';
  const seo = scoreSeo(scan, l);
  const security = scoreSecurity(scan, l);
  const accessibility = scoreAccessibility(scan, l);
  const mobile = scoreMobile(scan, l);
  const performance = scorePerformance(scan, l);
  const codeQuality = scoreCodeQuality(scan, l);

  const weights = { performance: 0.2, seo: 0.2, accessibility: 0.2, security: 0.2, mobile: 0.1, codeQuality: 0.1 };
  const overall = clamp(
    performance.score * weights.performance +
      seo.score * weights.seo +
      accessibility.score * weights.accessibility +
      security.score * weights.security +
      mobile.score * weights.mobile +
      codeQuality.score * weights.codeQuality
  );

  const allIssues = [
    ...seo.issues.map((i) => ({ ...i, category: CATEGORY_LABELS.seo[l] })),
    ...security.issues.map((i) => ({ ...i, category: CATEGORY_LABELS.security[l] })),
    ...accessibility.issues.map((i) => ({ ...i, category: CATEGORY_LABELS.accessibility[l] })),
    ...mobile.issues.map((i) => ({ ...i, category: CATEGORY_LABELS.mobile[l] })),
    ...performance.issues.map((i) => ({ ...i, category: CATEGORY_LABELS.performance[l] })),
    ...codeQuality.issues.map((i) => ({ ...i, category: CATEGORY_LABELS.codeQuality[l] })),
  ];

  const severityRank = { high: 0, medium: 1, low: 2 };
  allIssues.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return {
    overall,
    categories: {
      performance: performance.score,
      seo: seo.score,
      accessibility: accessibility.score,
      security: security.score,
      mobile: mobile.score,
      codeQuality: codeQuality.score,
    },
    details: { seo, security, accessibility, mobile, performance, codeQuality },
    issues: allIssues,
  };
}
