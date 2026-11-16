import * as cheerio from 'cheerio';
import { safeFetchOptional } from './safeFetch.js';

const MAX_LIST_SAMPLE = 25;

function abs(base, maybeRelative) {
  try {
    return new URL(maybeRelative, base).toString();
  } catch {
    return null;
  }
}

function analyzeHtml($, finalUrl) {
  const title = $('title').first().text().trim() || null;
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || null;
  const canonical = $('link[rel="canonical"]').attr('href') || null;
  const viewport = $('meta[name="viewport"]').attr('content') || null;
  const lang = $('html').attr('lang') || null;

  const h1 = $('h1').map((_, el) => $(el).text().trim()).get().filter(Boolean);
  const h2 = $('h2').map((_, el) => $(el).text().trim()).get().filter(Boolean);
  const headingOutline = $('h1, h2, h3, h4, h5, h6')
    .map((_, el) => ({ level: el.tagName.toLowerCase(), text: $(el).text().trim() }))
    .get()
    .filter((h) => h.text)
    .slice(0, 100);

  const openGraph = {};
  $('meta[property^="og:"]').each((_, el) => {
    const prop = $(el).attr('property');
    const content = $(el).attr('content');
    if (prop && content) openGraph[prop.replace('og:', '')] = content;
  });

  const structuredDataTypes = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).contents().text());
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      for (const entry of entries) {
        if (entry && entry['@type']) {
          structuredDataTypes.push(String(entry['@type']));
        }
      }
    } catch {
      // malformed JSON-LD, ignore this block
    }
  });

  const imgEls = $('img');
  const images = { total: imgEls.length, missingAlt: 0, sample: [] };
  imgEls.each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || null;
    const altAttr = $(el).attr('alt');
    const hasAlt = typeof altAttr === 'string' && altAttr.trim().length > 0;
    if (!hasAlt) images.missingAlt += 1;
    if (images.sample.length < MAX_LIST_SAMPLE) {
      images.sample.push({ src, hasAlt, alt: altAttr || null });
    }
  });

  const anchorEls = $('a[href]');
  let internal = 0;
  let external = 0;
  let nofollow = 0;
  const linkSample = [];
  anchorEls.each((_, el) => {
    const href = $(el).attr('href');
    const rel = $(el).attr('rel') || '';
    if (rel.includes('nofollow')) nofollow += 1;
    const resolved = abs(finalUrl, href);
    if (resolved) {
      try {
        const isInternal = new URL(resolved).hostname === new URL(finalUrl).hostname;
        isInternal ? (internal += 1) : (external += 1);
      } catch {
        /* skip unparsable */
      }
    }
    if (linkSample.length < MAX_LIST_SAMPLE && href) {
      linkSample.push({ href, text: $(el).text().trim().slice(0, 80) });
    }
  });

  const formEls = $('form');
  let inputsWithoutLabel = 0;
  $('input, textarea, select').each((_, el) => {
    const $el = $(el);
    const type = ($el.attr('type') || '').toLowerCase();
    if (['hidden', 'submit', 'button'].includes(type)) return;
    const id = $el.attr('id');
    const hasLabelFor = id ? $(`label[for="${id}"]`).length > 0 : false;
    const wrappedInLabel = $el.closest('label').length > 0;
    const hasAriaLabel = Boolean($el.attr('aria-label') || $el.attr('aria-labelledby'));
    if (!hasLabelFor && !wrappedInLabel && !hasAriaLabel) inputsWithoutLabel += 1;
  });

  const buttonEls = $('button, [role="button"]');
  let buttonsWithoutAccessibleName = 0;
  buttonEls.each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    const hasAriaLabel = Boolean($el.attr('aria-label') || $el.attr('aria-labelledby'));
    if (!text && !hasAriaLabel) buttonsWithoutAccessibleName += 1;
  });

  const ariaUsageCount = $('[aria-label], [aria-labelledby], [aria-describedby], [role]').length;

  const semanticTags = {
    header: $('header').length > 0,
    nav: $('nav').length > 0,
    main: $('main').length > 0,
    footer: $('footer').length > 0,
    article: $('article').length > 0,
    section: $('section').length > 0,
  };

  const scripts = $('script[src]')
    .map((_, el) => $(el).attr('src'))
    .get();
  const stylesheets = $('link[rel="stylesheet"]')
    .map((_, el) => $(el).attr('href'))
    .get();

  const charsetPresent = $('meta[charset]').length > 0 || /charset\s*=/i.test($('meta[http-equiv="Content-Type"]').attr('content') || '');
  const deprecatedTags = [...new Set($('font, center, marquee, blink, frame, frameset')
    .map((_, el) => el.tagName.toLowerCase())
    .get())];
  const inlineStyleElementCount = $('[style]').length;

  return {
    title,
    titleLength: title ? title.length : 0,
    metaDescription,
    metaDescriptionLength: metaDescription ? metaDescription.length : 0,
    canonical,
    viewport,
    lang,
    h1,
    h2,
    headingOutline,
    openGraph,
    structuredData: { present: structuredDataTypes.length > 0, types: [...new Set(structuredDataTypes)] },
    images,
    links: { total: anchorEls.length, internal, external, nofollow, sample: linkSample },
    forms: { total: formEls.length, inputsWithoutLabel },
    buttons: { total: buttonEls.length, withoutAccessibleName: buttonsWithoutAccessibleName },
    ariaUsageCount,
    semanticTags,
    scriptSrcs: scripts,
    stylesheetHrefs: stylesheets,
    charsetPresent,
    deprecatedTags,
    inlineStyleElementCount,
  };
}

function analyzeSecurityHeaders(headers, isHttps) {
  const get = (name) => headers[name.toLowerCase()] || null;
  return {
    https: isHttps,
    hsts: get('strict-transport-security'),
    csp: get('content-security-policy'),
    xFrameOptions: get('x-frame-options'),
    xContentTypeOptions: get('x-content-type-options'),
    referrerPolicy: get('referrer-policy'),
    permissionsPolicy: get('permissions-policy'),
    serverHeader: get('server'),
    poweredByHeader: get('x-powered-by'),
  };
}

function detectTechnologies({ html, headers, scriptSrcs, stylesheetHrefs, generator }) {
  const found = new Set();
  const lowerHtml = html.toLowerCase();
  const srcs = scriptSrcs.join(' ').toLowerCase();
  const hrefs = stylesheetHrefs.join(' ').toLowerCase();
  const server = (headers['server'] || '').toLowerCase();
  const poweredBy = (headers['x-powered-by'] || '').toLowerCase();
  const setCookie = (headers['set-cookie'] || []).join(' ').toLowerCase();

  if (lowerHtml.includes('__next_data__') || srcs.includes('/_next/')) found.add('Next.js');
  else if (lowerHtml.includes('data-reactroot') || srcs.includes('react-dom') || lowerHtml.includes('react.production')) found.add('React');

  if (lowerHtml.includes('data-v-') || srcs.includes('vue.js') || srcs.includes('vue.min.js') || lowerHtml.includes('__vue__')) found.add('Vue.js');

  if (lowerHtml.includes('ng-version') || srcs.includes('angular')) found.add('Angular');

  if ((generator || '').toLowerCase().includes('wordpress') || lowerHtml.includes('wp-content') || lowerHtml.includes('wp-includes')) found.add('WordPress');

  if (poweredBy.includes('php') || setCookie.includes('phpsessid')) found.add('PHP');

  if (setCookie.includes('laravel_session') || lowerHtml.includes('csrf-token" content=')) found.add('Laravel');

  if (poweredBy.includes('express') || poweredBy.includes('node')) found.add('Node.js');

  const tailwindUtilityHits = (lowerHtml.match(/\b(?:flex|grid|px-\d|py-\d|bg-\w+-\d{2,3}|text-\w+-\d{2,3}|rounded-(?:sm|md|lg|xl|full))\b/g) || []).length;
  if (hrefs.includes('tailwind') || tailwindUtilityHits > 15) found.add('Tailwind CSS');

  if (hrefs.includes('bootstrap') || srcs.includes('bootstrap') || /\bclass="[^"]*\b(container|row|col-\d{1,2})\b/.test(lowerHtml)) found.add('Bootstrap');

  if (server.includes('cloudflare') || headers['cf-ray']) found.add('Cloudflare');

  if (srcs.includes('googletagmanager.com') || srcs.includes('google-analytics.com') || lowerHtml.includes('gtag(')) found.add('Google Analytics');

  if (srcs.includes('firebaseapp.com') || srcs.includes('firebaseio.com') || lowerHtml.includes('firebase-app')) found.add('Firebase');

  return [...found];
}

function analyzeMobile($, viewport) {
  const viewportPresent = Boolean(viewport);
  const viewportHasWidthDevice = Boolean(viewport && /width\s*=\s*device-width/i.test(viewport));
  const fixedWidthElements = $('[width]')
    .filter((_, el) => {
      const w = $(el).attr('width');
      return /^\d+$/.test(w || '') && parseInt(w, 10) > 600;
    })
    .length;
  const inlineFixedWidthStyles = $('[style*="width"]')
    .filter((_, el) => /width\s*:\s*\d{3,4}px/.test($(el).attr('style') || ''))
    .length;

  return {
    viewportPresent,
    viewportContent: viewport,
    viewportHasWidthDevice,
    fixedWidthElementCount: fixedWidthElements,
    inlineFixedWidthStyleCount: inlineFixedWidthStyles,
  };
}

async function checkRobotsAndSitemap(baseUrl) {
  const robotsUrl = abs(baseUrl, '/robots.txt');
  const robotsRes = robotsUrl ? await safeFetchOptional(robotsUrl) : null;
  const robots = {
    found: Boolean(robotsRes && robotsRes.status === 200),
    content: robotsRes && robotsRes.status === 200 ? robotsRes.body.slice(0, 4000) : null,
  };

  let sitemapUrl = null;
  let sitemapFound = false;
  if (robots.content) {
    const match = robots.content.match(/sitemap:\s*(\S+)/i);
    if (match) sitemapUrl = match[1];
  }
  if (!sitemapUrl) sitemapUrl = abs(baseUrl, '/sitemap.xml');
  if (sitemapUrl) {
    const sitemapRes = await safeFetchOptional(sitemapUrl);
    sitemapFound = Boolean(sitemapRes && sitemapRes.status === 200 && /<urlset|<sitemapindex/i.test(sitemapRes.body || ''));
  }

  return {
    robots,
    sitemap: { found: sitemapFound, url: sitemapFound ? sitemapUrl : null },
  };
}

/**
 * Runs the full technical scan for a fetched page and returns a single
 * structured object. Every field is either a real measured/observed value
 * or explicitly null/"unable to check" — nothing here is guessed.
 */
export async function scanWebsite(fetchResult) {
  const { body, headers, status, finalUrl, sizeBytes, timeMs } = fetchResult;
  const $ = cheerio.load(body || '');
  const isHttps = finalUrl.startsWith('https:');
  const generator = $('meta[name="generator"]').attr('content') || null;

  const html = analyzeHtml($, finalUrl);
  html.doctypePresent = /^\s*<!doctype\s+html/i.test(body || '');
  const security = analyzeSecurityHeaders(headers, isHttps);
  const mobile = analyzeMobile($, html.viewport);
  const technologies = detectTechnologies({
    html: body || '',
    headers,
    scriptSrcs: html.scriptSrcs,
    stylesheetHrefs: html.stylesheetHrefs,
    generator,
  });
  const { robots, sitemap } = await checkRobotsAndSitemap(finalUrl);

  const requestCountEstimate = html.scriptSrcs.length + html.stylesheetHrefs.length + html.images.total;

  return {
    finalUrl,
    httpStatus: status,
    generator,
    fetch: {
      timeMs,
      sizeBytes,
      https: isHttps,
    },
    html,
    security,
    mobile,
    technologies,
    robots,
    sitemap,
    performance: {
      loadTimeMs: timeMs,
      pageSizeBytes: sizeBytes,
      requestCountEstimate,
      scriptCount: html.scriptSrcs.length,
      cssCount: html.stylesheetHrefs.length,
      imageCount: html.images.total,
      // Real-user metrics that require an in-browser measurement (LCP, CLS,
      // INP, FCP, TBT) are not available from a server-side fetch. We do not
      // estimate or fabricate them.
      lcp: null,
      cls: null,
      inp: null,
      fcp: null,
      tbt: null,
    },
  };
}
