import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'audits.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS audits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    hostname TEXT NOT NULL,
    created_at TEXT NOT NULL,
    overall INTEGER NOT NULL,
    performance INTEGER NOT NULL,
    seo INTEGER NOT NULL,
    accessibility INTEGER NOT NULL,
    security INTEGER NOT NULL,
    mobile INTEGER NOT NULL,
    code_quality INTEGER NOT NULL,
    data TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_audits_hostname ON audits(hostname);
`);

export function insertAudit(record) {
  const stmt = db.prepare(`
    INSERT INTO audits (url, hostname, created_at, overall, performance, seo, accessibility, security, mobile, code_quality, data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    record.url,
    record.hostname,
    record.createdAt,
    record.overall,
    record.categories.performance,
    record.categories.seo,
    record.categories.accessibility,
    record.categories.security,
    record.categories.mobile,
    record.categories.codeQuality,
    JSON.stringify(record)
  );
  return Number(info.lastInsertRowid);
}

export function getAuditById(id) {
  const row = db.prepare('SELECT * FROM audits WHERE id = ?').get(id);
  if (!row) return null;
  return { ...JSON.parse(row.data), id: row.id };
}

export function listAuditsForHostname(hostname, limit = 20) {
  const rows = db
    .prepare('SELECT id, url, hostname, created_at, overall, performance, seo, accessibility, security, mobile, code_quality FROM audits WHERE hostname = ? ORDER BY created_at ASC LIMIT ?')
    .all(hostname, limit);
  return rows.map((r) => ({
    id: r.id,
    url: r.url,
    hostname: r.hostname,
    createdAt: r.created_at,
    overall: r.overall,
    categories: {
      performance: r.performance,
      seo: r.seo,
      accessibility: r.accessibility,
      security: r.security,
      mobile: r.mobile,
      codeQuality: r.code_quality,
    },
  }));
}

export function listAllAudits(limit = 50) {
  const rows = db
    .prepare('SELECT id, url, hostname, created_at, overall, performance, seo, accessibility, security, mobile, code_quality FROM audits ORDER BY created_at DESC LIMIT ?')
    .all(limit);
  return rows.map((r) => ({
    id: r.id,
    url: r.url,
    hostname: r.hostname,
    createdAt: r.created_at,
    overall: r.overall,
    categories: {
      performance: r.performance,
      seo: r.seo,
      accessibility: r.accessibility,
      security: r.security,
      mobile: r.mobile,
      codeQuality: r.code_quality,
    },
  }));
}

export default db;
