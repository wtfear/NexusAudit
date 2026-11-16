const BASE = '/api';

async function handle(res) {
  if (!res.ok) {
    let body = {};
    try {
      body = await res.json();
    } catch {
      /* non-JSON error body */
    }
    const err = new Error(body.error || `Request failed with status ${res.status}`);
    err.details = body.details;
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function runAudit(url, lang) {
  const res = await fetch(`${BASE}/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, lang }),
  });
  return handle(res);
}

export async function fetchHistory(hostname) {
  const qs = hostname ? `?hostname=${encodeURIComponent(hostname)}` : '';
  const res = await fetch(`${BASE}/history${qs}`);
  return handle(res);
}

export async function fetchAuditById(id) {
  const res = await fetch(`${BASE}/history/${id}`);
  return handle(res);
}

export async function requestCodeFix({ problem, code, language, lang }) {
  const res = await fetch(`${BASE}/fix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem, code, language, lang }),
  });
  return handle(res);
}

export function reportDownloadUrl(id) {
  return `${BASE}/report/${id}`;
}
