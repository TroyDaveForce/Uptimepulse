'use client';
import { useState } from 'react';
import Link from 'next/link';

type Kind = 'speed' | 'ssl' | 'links';
const cfg = {
  speed: { label: 'Page URL', btn: 'Run speed test' },
  ssl: { label: 'Domain or URL', btn: 'Check certificate' },
  links: { label: 'Page URL', btn: 'Scan for broken links' },
};

export default function ToolShell({ kind }: { kind: Kind }) {
  const [v, setV] = useState('');
  const [err, setErr] = useState('');
  const [rows, setRows] = useState<string[][] | null>(null);
  const [busy, setBusy] = useState(false);

  function run(e: React.FormEvent) {
    e.preventDefault();
    let host = '';
    try {
      host = new URL(/^https?:\/\//i.test(v) ? v : 'https://' + v).hostname;
      if (!host.includes('.')) throw new Error('bad');
    } catch { setErr('Enter a valid URL or domain, e.g. example.com'); setRows(null); return; }
    setErr(''); setBusy(true); setRows(null);
    let h = 0;
    for (const ch of host) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    setTimeout(() => {
      if (kind === 'speed') {
        const ttfb = 80 + (h % 320), load = ttfb + 400 + (h % 1800);
        setRows([['Host', host], ['Time to first byte', ttfb + ' ms'], ['Full load', load + ' ms'], ['Page weight', 300 + (h % 2400) + ' KB'], ['Verdict', load < 1500 ? 'Fast' : load < 2500 ? 'Needs work' : 'Slow']]);
      } else if (kind === 'ssl') {
        const days = 20 + (h % 300);
        setRows([['Host', host], ['Issuer', ["Let's Encrypt R11", 'DigiCert TLS RSA', 'Sectigo RSA DV'][h % 3]], ['Valid to', new Date(Date.now() + days * 864e5).toLocaleDateString()], ['Days left', String(days)], ['Status', days < 14 ? 'Renew now' : 'Healthy']]);
      } else {
        const broken = h % 4;
        setRows([['Host', host], ['Links scanned', String(20 + (h % 60))], ['Broken links', String(broken)], ...Array.from({ length: broken }, (_, i) => ['/old-page-' + (i + 1), '404 Not Found'])]);
      }
      setBusy(false);
    }, 700);
  }

  return (
    <section aria-label="Tool" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
      <form onSubmit={run} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="tool-url" className="mb-1 block text-sm font-medium">{cfg[kind].label}</label>
          <input id="tool-url" value={v} onChange={(e) => setV(e.target.value)} placeholder="example.com" aria-invalid={!!err}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5" />
        </div>
        <button disabled={busy} className="rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-60">{busy ? 'Working...' : cfg[kind].btn}</button>
      </form>
      {err && <p role="alert" className="mt-2 text-sm text-red-400">{err}</p>}
      {rows && (
        <div className="mt-5">
          <dl className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 text-sm">
            {rows.map((r) => <div key={r[0] + r[1]} className="flex justify-between gap-4 px-3 py-2"><dt className="text-zinc-400">{r[0]}</dt><dd className="font-medium">{r[1]}</dd></div>)}
          </dl>
          <p className="mt-3 text-xs text-zinc-500">Demo estimate for preview purposes. <Link href="/" className="text-emerald-400 hover:underline">Add this URL to the dashboard</Link> for real, continuous checks.</p>
        </div>
      )}
    </section>
  );
}