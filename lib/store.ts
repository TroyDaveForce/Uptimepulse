import type { Monitor, Check, Incident, Range, PlanKey, Status, NewMonitor } from './types';

export const PLANS: Record<PlanKey, { name: string; limit: number; minInterval: number }> = {
  starter: { name: 'Starter', limit: 10, minInterval: 5 },
  pro: { name: 'Pro', limit: 50, minInterval: 1 },
  business: { name: 'Business', limit: 200, minInterval: 0.5 },
};
export class PlanLimitError extends Error {
  constructor(m: string) { super(m); this.name = 'PlanLimitError'; }
}

let seedN = 7;
const rnd = () => { seedN = (seedN * 16807) % 2147483647; return (seedN - 1) / 2147483646; };
const H = 36e5;

function gen(n: number, step: number, base: number, down: number[]): Check[] {
  const t = Date.now();
  return Array.from({ length: n }, (_, i) => {
    const d = down.includes(i);
    return { t: t - (n - i) * step, ms: d ? 0 : Math.round(base * (0.8 + rnd() * 0.5 + (rnd() > 0.97 ? 1.2 : 0))), up: !d, code: d ? 503 : 200 };
  });
}
function mk(id: string, name: string, url: string, base: number, x: Partial<Monitor>): Monitor {
  return {
    id, name, url, method: 'GET', expected: 200, interval: 5, assertKind: 'none', assertValue: '', paused: false,
    slackUrl: '', slackOn: false, emails: '', emailOn: false, isUp: true, sslDays: 60, issuer: "Let's Encrypt R11",
    lastMs: base, baseMs: base, lastChecked: Date.now(), ...x,
  };
}
const history = (b: number, flaky: boolean) => ({
  '24h': gen(288, 3e5, b, flaky ? [200, 201] : []),
  '7d': gen(168, H, b, flaky ? [40, 41, 120] : []),
  '30d': gen(120, 6 * H, b, flaky ? [16, 76] : []),
});

const defs: [Monitor, boolean][] = [
  [mk('m1', 'Payments API', 'https://pay.example.com/v1/ping', 130, { slackOn: true, slackUrl: 'https://hooks.slack.com/services/T000/B000/DEMO0000', emails: 'oncall@example.com', emailOn: true, sslDays: 77, issuer: 'DigiCert TLS RSA SHA256 2020 CA1' }), true],
  [mk('m2', 'Marketing Site', 'https://example.com', 180, { sslDays: 62 }), false],
  [mk('m3', 'Customer API', 'https://api.example.com/health', 95, { assertKind: 'keyword', assertValue: '"status":"ok"', sslDays: 41, emails: 'dev@example.com', emailOn: true }), false],
  [mk('m4', 'Checkout Service', 'https://shop.example.com', 640, { sslDays: 9, issuer: 'Sectigo RSA DV' }), false],
  [mk('m5', 'Docs Portal', 'https://docs.example.com', 210, { paused: true, sslDays: 120 }), false],
];
const T0 = Date.now();
let db = {
  plan: 'starter' as PlanKey,
  monitors: defs.map((d) => d[0]),
  checks: Object.fromEntries(defs.map(([m, f]) => [m.id, history(m.baseMs, f)])) as Record<string, Record<Range, Check[]>>,
  incidents: [
    { id: 'i1', monitorId: 'm1', start: T0 - 7 * H, end: T0 - 7 * H + 9 * 6e4, cause: 'HTTP 503 (expected 200)' },
    { id: 'i2', monitorId: 'm1', start: T0 - 52 * H, end: T0 - 52 * H + 25 * 6e4, cause: 'Timeout / connection failed' },
    { id: 'i3', monitorId: 'm4', start: T0 - 120 * H, end: T0 - 120 * H + 4 * 6e4, cause: 'HTTP 502 (expected 200)' },
  ] as Incident[],
};

const L = new Set<() => void>();
const emit = () => L.forEach((f) => f());
export const subscribe = (f: () => void) => { L.add(f); return () => { L.delete(f); }; };
export const getPlan = () => PLANS[db.plan];

export async function listMonitors(): Promise<Monitor[]> { return [...db.monitors]; }

export async function addMonitor(i: NewMonitor): Promise<Monitor> {
  const p = PLANS[db.plan];
  if (db.monitors.length >= p.limit) throw new PlanLimitError(`${p.name} allows ${p.limit} monitors. Upgrade to add more.`);
  if ((i.interval ?? 5) < p.minInterval) throw new PlanLimitError(`${i.interval}-minute checks need a higher plan.`);
  const id = 'm' + Date.now().toString(36) + Math.floor(rnd() * 99);
  const m = mk(id, i.name, i.url, 200, { ...i });
  db.monitors = [m, ...db.monitors];
  db.checks[id] = history(200, false);
  emit();
  return m;
}
export async function updateMonitor(id: string, patch: Partial<Monitor>) {
  db.monitors = db.monitors.map((m) => (m.id === id ? { ...m, ...patch } : m));
  emit();
}
export async function deleteMonitor(id: string) {
  db.monitors = db.monitors.filter((m) => m.id !== id);
  db.incidents = db.incidents.filter((i) => i.monitorId !== id);
  delete db.checks[id];
  emit();
}
export async function getChecks(id: string, r: Range): Promise<Check[]> { return db.checks[id]?.[r] ?? []; }
export async function getIncidents(id?: string): Promise<Incident[]> {
  return db.incidents.filter((i) => !id || i.monitorId === id).sort((a, b) => b.start - a.start);
}
export async function addAlertChannel(id: string, c: { type: 'slack' | 'email'; value: string }) {
  const m = db.monitors.find((x) => x.id === id);
  if (!m) return;
  await updateMonitor(id, c.type === 'slack'
    ? { slackUrl: c.value, slackOn: m.slackOn || !!c.value }
    : { emails: c.value, emailOn: m.emailOn || !!c.value });
}
export async function sendTestAlert(id: string): Promise<{ ok: boolean; message: string }> {
  await new Promise((r) => setTimeout(r, 700));
  const m = db.monitors.find((x) => x.id === id);
  if (!m) return { ok: false, message: 'Monitor not found' };
  const out: string[] = [];
  let bad = '';
  if (m.slackOn) {
    if (/^https:\/\/hooks\.slack\.com\/services\/[\w/]+$/.test(m.slackUrl)) out.push('Slack (200 ok)');
    else bad = 'Slack webhook URL is invalid';
  }
  if (m.emailOn) {
    const ok = m.emails.split(',').map((x) => x.trim()).filter((x) => /^\S+@\S+\.\S+$/.test(x));
    if (ok.length) out.push(`Email (${ok.length})`); else bad = bad || 'No valid email recipients';
  }
  if (bad) return { ok: false, message: bad };
  if (!out.length) return { ok: false, message: 'Enable at least one alert channel first' };
  return { ok: true, message: 'Test alert delivered via ' + out.join(' + ') };
}

function rec(id: string, c: Check, ssl?: number | null): 'down' | 'up' | null {
  const m = db.monitors.find((x) => x.id === id);
  if (!m) return null;
  const h = db.checks[id]['24h'];
  h.push(c);
  if (h.length > 288) h.shift();
  const ev = c.up === m.isUp ? null : c.up ? 'up' : 'down';
  if (ev === 'down') {
    db.incidents = [{ id: 'i' + c.t + id, monitorId: id, start: c.t, cause: c.code ? `HTTP ${c.code} (expected ${m.expected}) after 3 retries` : 'Timeout / connection failed after 3 retries' }, ...db.incidents];
  }
  if (ev === 'up') db.incidents = db.incidents.map((i) => (i.monitorId === id && !i.end ? { ...i, end: c.t } : i));
  db.monitors = db.monitors.map((x) => (x.id === id ? { ...x, isUp: c.up, lastMs: c.up ? c.ms : x.lastMs, lastChecked: c.t, sslDays: ssl ?? x.sslDays } : x));
  return ev;
}
export async function recordCheck(id: string, c: Check, ssl?: number | null) {
  const e = rec(id, c, ssl);
  emit();
  return e;
}

let n = 0;
export function tick() {
  n++;
  const ev: { type: 'down' | 'up'; monitor: Monitor }[] = [];
  for (const m of [...db.monitors]) {
    if (m.paused) continue;
    const forced = m.id === 'm1' && n % 16 >= 4 && n % 16 < 8;
    const c: Check = forced
      ? { t: Date.now(), ms: 0, up: false, code: 503 }
      : { t: Date.now(), ms: Math.round(m.baseMs * (0.8 + rnd() * 0.5)), up: true, code: 200 };
    const e = rec(m.id, c);
    const cur = db.monitors.find((x) => x.id === m.id);
    if (e && cur) ev.push({ type: e, monitor: cur });
  }
  emit();
  return ev;
}

export function statusOf(m: Monitor): Status {
  return m.paused ? 'paused' : !m.isUp ? 'down' : m.lastMs > 500 ? 'degraded' : 'up';
}
export function ago(t: number) {
  const d = Math.max(0, Math.round((Date.now() - t) / 1000));
  return d < 60 ? `${d}s ago` : d < 3600 ? `${Math.floor(d / 60)}m ago` : `${Math.floor(d / 3600)}h ago`;
}
export function getStats(id: string) {
  const c = db.checks[id];
  if (!c) return { u24: 100, u7: 100, u30: 100, avg: 0, p95: 0 };
  const up = (a: Check[]) => +((a.filter((x) => x.up).length / Math.max(a.length, 1)) * 100).toFixed(2);
  const ms = c['24h'].filter((x) => x.up).map((x) => x.ms).sort((a, b) => a - b);
  return {
    u24: up(c['24h']), u7: up(c['7d']), u30: up(c['30d']),
    avg: ms.length ? Math.round(ms.reduce((a, b) => a + b, 0) / ms.length) : 0,
    p95: ms.length ? ms[Math.floor(ms.length * 0.95)] : 0,
  };
}
export function getBars(id: string): ('up' | 'slow' | 'down')[] {
  const c = db.checks[id]?.['30d'] ?? [];
  return Array.from({ length: 90 }, (_, i) => {
    const x = c[Math.floor((i * c.length) / 90)];
    return !x ? 'up' : !x.up ? 'down' : x.ms > 500 ? 'slow' : 'up';
  });
}