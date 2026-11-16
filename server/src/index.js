import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { generalRateLimiter } from './middleware/rateLimit.js';
import auditRouter from './routes/audit.js';
import historyRouter from './routes/history.js';
import reportRouter from './routes/report.js';
import fixRouter from './routes/fix.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, '../../client/dist');

const app = express();

app.use(cors({ origin: config.clientOrigin === '*' ? true : config.clientOrigin }));
app.use(express.json({ limit: '100kb' }));
app.use('/api', generalRateLimiter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api', auditRouter);
app.use('/api', historyRouter);
app.use('/api', reportRouter);
app.use('/api', fixRouter);

// Serve frontend static build if present
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`NexusAudit AI API listening on http://localhost:${config.port}`);
});
