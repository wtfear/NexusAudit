import { Router } from 'express';
import { listAllAudits, listAuditsForHostname, getAuditById } from '../db.js';

const router = Router();

router.get('/history', (req, res) => {
  const { hostname } = req.query;
  if (hostname) {
    return res.json({ items: listAuditsForHostname(String(hostname), 50) });
  }
  res.json({ items: listAllAudits(50) });
});

router.get('/history/:id', (req, res) => {
  const record = getAuditById(Number(req.params.id));
  if (!record) return res.status(404).json({ error: 'Audit not found' });
  res.json(record);
});

export default router;
