import { Router } from 'express';
import { validateUrl } from '../lib/ssrf.js';
import { safeFetch } from '../lib/safeFetch.js';
import { scanWebsite } from '../lib/scanner.js';
import { computeAudit } from '../lib/scoring.js';
import { getAiAnalysis } from '../lib/groq.js';
import { insertAudit, listAuditsForHostname } from '../db.js';
import { auditRateLimiter } from '../middleware/rateLimit.js';
import { msg, normalizeLang } from '../lib/messages.js';

const router = Router();

function buildGroqPayload(url, scan, audit) {
  return {
    website: url,
    scores: audit.categories,
    performance: {
      loadTimeMs: scan.performance.loadTimeMs,
      pageSizeKB: Math.round(scan.performance.pageSizeBytes / 1024),
      requestCountEstimate: scan.performance.requestCountEstimate,
      lcp: scan.performance.lcp === null ? 'Unable to check' : scan.performance.lcp,
      cls: scan.performance.cls === null ? 'Unable to check' : scan.performance.cls,
      inp: scan.performance.inp === null ? 'Unable to check' : scan.performance.inp,
      fcp: scan.performance.fcp === null ? 'Unable to check' : scan.performance.fcp,
      tbt: scan.performance.tbt === null ? 'Unable to check' : scan.performance.tbt,
    },
    seo: {
      title: Boolean(scan.html.title),
      metaDescription: Boolean(scan.html.metaDescription),
      h1: scan.html.h1.length > 0,
      missingAltImages: scan.html.images.missingAlt,
      totalImages: scan.html.images.total,
      canonical: Boolean(scan.html.canonical),
      sitemap: scan.sitemap.found,
      robotsTxt: scan.robots.found,
      openGraph: Boolean(scan.html.openGraph.title || scan.html.openGraph.description),
      structuredData: scan.html.structuredData.present,
    },
    security: {
      https: scan.security.https,
      hsts: Boolean(scan.security.hsts),
      csp: Boolean(scan.security.csp),
      xFrameOptions: Boolean(scan.security.xFrameOptions),
      xContentTypeOptions: Boolean(scan.security.xContentTypeOptions),
      referrerPolicy: Boolean(scan.security.referrerPolicy),
      serverInfoExposed: Boolean(scan.security.serverHeader || scan.security.poweredByHeader),
    },
    accessibility: {
      formFieldsWithoutLabel: scan.html.forms.inputsWithoutLabel,
      buttonsWithoutAccessibleName: scan.html.buttons.withoutAccessibleName,
      langAttribute: Boolean(scan.html.lang),
      semanticTagsUsed: Object.entries(scan.html.semanticTags).filter(([, v]) => v).map(([k]) => k),
    },
    mobile: {
      viewportPresent: scan.mobile.viewportPresent,
      viewportUsesDeviceWidth: scan.mobile.viewportHasWidthDevice,
      fixedWidthElements: scan.mobile.fixedWidthElementCount,
    },
    technologiesDetected: scan.technologies,
    issues: audit.issues.map((i) => ({ category: i.category, severity: i.severity, title: i.title })),
  };
}

router.post('/audit', auditRateLimiter, async (req, res) => {
  const { url } = req.body || {};
  const lang = normalizeLang(req.body?.lang);

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: msg('URL_REQUIRED', lang) });
  }

  let validated;
  try {
    validated = validateUrl(url);
  } catch (err) {
    return res.status(400).json({ error: msg(err.code, lang) || err.message });
  }

  let fetchResult;
  try {
    fetchResult = await safeFetch(validated.toString());
  } catch (err) {
    return res.status(422).json({
      error: msg('UNREACHABLE', lang),
      details: msg(err.code, lang) || err.message,
    });
  }

  if (fetchResult.status >= 400) {
    return res.status(422).json({
      error: `${msg('BAD_STATUS', lang)} ${fetchResult.status}.`,
      httpStatus: fetchResult.status,
    });
  }

  const scan = await scanWebsite(fetchResult);
  const audit = computeAudit(scan, lang);

  let ai = null;
  let aiError = null;
  try {
    ai = await getAiAnalysis(buildGroqPayload(validated.toString(), scan, audit), lang);
  } catch (err) {
    aiError = err.message;
  }

  const record = {
    url: validated.toString(),
    hostname: validated.hostname,
    createdAt: new Date().toISOString(),
    lang,
    overall: audit.overall,
    categories: audit.categories,
    details: audit.details,
    issues: audit.issues,
    scan,
    ai,
    aiError,
  };

  const id = insertAudit(record);
  const history = listAuditsForHostname(validated.hostname);

  res.json({ id, ...record, history });
});

export default router;
