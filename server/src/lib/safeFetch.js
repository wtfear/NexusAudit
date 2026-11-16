import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { config } from '../config.js';
import { validateUrl, resolveAndValidateHost } from './ssrf.js';

const USER_AGENT = 'AI-Website-Auditor/1.0 (+automated audit bot)';

function codedError(code, message) {
  const e = new Error(message);
  e.code = code;
  return e;
}

function fetchOnce(urlObj, pinnedIp, pinnedFamily) {
  const lib = urlObj.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const req = lib.request(
      {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        lookup: (_hostname, opts, callback) => {
          if (opts && opts.all) {
            callback(null, [{ address: pinnedIp, family: pinnedFamily }]);
          } else {
            callback(null, pinnedIp, pinnedFamily);
          }
        },
        autoSelectFamily: false,
        servername: urlObj.protocol === 'https:' ? urlObj.hostname : undefined,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: config.audit.requestTimeoutMs,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
        },
      },
      (res) => {
        const status = res.statusCode || 0;
        const headers = res.headers;

        if (status >= 300 && status < 400 && headers.location) {
          res.resume();
          resolve({ redirectTo: new URL(headers.location, urlObj) });
          return;
        }

        let bytes = 0;
        const chunks = [];
        res.on('data', (chunk) => {
          bytes += chunk.length;
          if (bytes > config.audit.maxBodyBytes) {
            req.destroy(codedError('RESPONSE_TOO_LARGE', 'Response exceeded maximum allowed size'));
            return;
          }
          chunks.push(chunk);
        });
        res.on('end', () => {
          resolve({
            status,
            headers,
            body: Buffer.concat(chunks).toString('utf-8'),
            sizeBytes: bytes,
            finalUrl: urlObj.toString(),
          });
        });
      }
    );

    req.on('timeout', () => req.destroy(codedError('TIMEOUT', 'Request timed out')));
    req.on('error', reject);
    req.end();
  });
}

/**
 * Fetches a URL with full SSRF protection: scheme/hostname validation,
 * DNS-pinned connections, private-IP blocking on every redirect hop,
 * a response size cap, and a request timeout.
 */
export async function safeFetch(rawUrl) {
  let current = validateUrl(rawUrl);
  const start = Date.now();

  for (let hop = 0; hop <= config.audit.maxRedirects; hop++) {
    const { ip, family } = await resolveAndValidateHost(current.hostname);
    const result = await fetchOnce(current, ip, family);

    if (result.redirectTo) {
      current = validateUrl(result.redirectTo.toString());
      continue;
    }

    return { ...result, timeMs: Date.now() - start, requestedUrl: rawUrl };
  }

  throw codedError('TOO_MANY_REDIRECTS', 'Too many redirects');
}

/** Best-effort fetch used for optional resources (robots.txt, sitemap.xml). Never throws. */
export async function safeFetchOptional(rawUrl) {
  try {
    return await safeFetch(rawUrl);
  } catch {
    return null;
  }
}
