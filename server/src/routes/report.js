import { Router } from 'express';
import { getAuditById } from '../db.js';
import { renderAuditPdf } from '../lib/pdf.js';

const router = Router();

router.get('/report/:id', (req, res) => {
  const record = getAuditById(Number(req.params.id));
  if (!record) return res.status(404).json({ error: 'Audit not found' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="audit-${record.hostname}-${record.id}.pdf"`);
  renderAuditPdf(record, res);
});

export default router;
