import tls from 'tls';
import type { Monitor } from './types';

export interface Result { statusCode: number; responseTimeMs: number; isUp: boolean; checkedAt: number; sslExpiryDays: number | null }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function once(m: Monitor) {
  const ctl = new AbortController();
  const to = setTimeout(() => ctl.abort(), 10000);
  const t0 = Date.now();
  try {
    const r = await fetch(m.url, { method: m.method, signal: ctl.signal, redirect: 'follow', cache: 'no-store' });
    let ok = r.status === m.expected;
    if (ok && m.assertKind !== 'none' && m.method !== 'HEAD') {
      const body = await r.text();
      if (m.assertKind === 'keyword') ok = body.includes(m.assertValue);
      else {
        const [path, expected = ''] = m.assertValue.split('=');
        try {
          let v: unknown = JSON.parse(body);
          for (const k of path.trim().split('.')) v = (v as Record<string, unknown> | undefined)?.[k];
          ok = String(v) === expected.trim();
        } catch { ok = false; }
      }
    }
    return { statusCode: r.status, responseTimeMs: Date.now() - t0, isUp: ok };
  } catch {
    return { statusCode: 0, responseTimeMs: Date.now() - t0, isUp: false };
  } finally {
    clearTimeout(to);
  }
}

export function sslDays(url: string): Promise<number | null> {
  return new Promise((res) => {
    let u: URL;
    try { u = new URL(url); } catch { return res(null); }
    if (u.protocol !== 'https:') return res(null);
    const s = tls.connect({ host: u.hostname, port: Number(u.port) || 443, servername: u.hostname, timeout: 5000 }, () => {
      const c = s.getPeerCertificate();
      s.end();
      res(c && c.valid_to ? Math.floor((new Date(c.valid_to).getTime() - Date.now()) / 864e5) : null);
    });
    s.on('error', () => res(null));
    s.on('timeout', () => { s.destroy(); res(null); });
  });
}

/** One check with a 10s timeout and up to 3 attempts before reporting DOWN. */
export async function checkMonitor(m: Monitor): Promise<Result> {
  let r = await once(m);
  for (let i = 0; i < 2 && !r.isUp; i++) { await sleep(1500); r = await once(m); }
  return { ...r, checkedAt: Date.now(), sslExpiryDays: await sslDays(m.url) };
}