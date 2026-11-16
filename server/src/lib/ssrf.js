import net from 'node:net';
import dns from 'node:dns/promises';
import ipaddr from 'ipaddr.js';

function codedError(code, message) {
  const e = new Error(message);
  e.code = code;
  return e;
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'ip6-localhost',
  'ip6-loopback',
  'metadata.google.internal',
]);

/**
 * Returns true if the IP must NOT be contacted (loopback, private, link-local,
 * multicast, reserved, cloud metadata range, etc). Only plain public unicast
 * addresses are allowed through.
 */
export function isBlockedIp(ip) {
  try {
    const addr = ipaddr.parse(ip);

    if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress()) {
      return isBlockedIp(addr.toIPv4Address().toString());
    }

    // AWS/GCP/Azure metadata endpoint
    if (ip === '169.254.169.254') return true;

    const range = addr.range();
    return range !== 'unicast';
  } catch {
    // Unparseable address -> fail closed
    return true;
  }
}

export function validateUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw codedError('INVALID_URL', 'Invalid URL');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw codedError('UNSUPPORTED_PROTOCOL', 'Only http:// and https:// URLs are allowed');
  }

  if (url.username || url.password) {
    throw codedError('CREDENTIALS_IN_URL', 'URLs with embedded credentials are not allowed');
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    throw codedError('BLOCKED_HOST', 'This host is not allowed to be audited');
  }

  return url;
}

/**
 * Resolves a hostname and validates every returned address is public.
 * Returns the IP to connect to, so the caller can pin the connection to it
 * (prevents DNS-rebinding between the check and the actual request).
 */
export async function resolveAndValidateHost(hostname) {
  if (net.isIP(hostname)) {
    if (isBlockedIp(hostname)) {
      throw codedError('PRIVATE_IP', 'Refusing to audit a private/internal IP address');
    }
    return { ip: hostname, family: net.isIPv6(hostname) ? 6 : 4 };
  }

  let records;
  try {
    records = await dns.lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw codedError('DNS_FAILED', 'Could not resolve this domain name');
  }

  if (!records.length) {
    throw codedError('DNS_FAILED', 'Could not resolve this domain name');
  }

  for (const record of records) {
    if (isBlockedIp(record.address)) {
      throw codedError('PRIVATE_IP', 'This domain resolves to a private/internal IP address and cannot be audited');
    }
  }

  const chosen = records.find((r) => r.family === 4) || records[0];
  return { ip: chosen.address, family: chosen.family };
}
