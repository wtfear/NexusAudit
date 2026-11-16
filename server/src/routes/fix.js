import { Router } from 'express';
import { getCodeFix } from '../lib/groq.js';
import { msg, normalizeLang } from '../lib/messages.js';

const router = Router();

router.post('/fix', async (req, res) => {
  const { problem, code, language } = req.body || {};
  const lang = normalizeLang(req.body?.lang);

  if (!problem || typeof problem !== 'string' || !code || typeof code !== 'string') {
    return res.status(400).json({ error: msg('FIX_FIELDS_REQUIRED', lang) });
  }
  if (code.length > 4000 || problem.length > 1000) {
    return res.status(400).json({ error: msg('FIX_INPUT_TOO_LARGE', lang) });
  }

  try {
    const fix = await getCodeFix({ problem, code, language: language || 'html', lang });
    res.json(fix);
  } catch (err) {
    res.status(502).json({ error: msg('FIX_FAILED', lang), details: err.message });
  }
});

export default router;
