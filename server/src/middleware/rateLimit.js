import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { msg, normalizeLang } from '../lib/messages.js';

function langFromRequest(req) {
  return normalizeLang(req.body?.lang || req.query?.lang);
}

export const auditRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: msg('RATE_LIMITED_AUDIT', langFromRequest(req)) }),
});

export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: msg('RATE_LIMITED_GENERAL', langFromRequest(req)) }),
});
