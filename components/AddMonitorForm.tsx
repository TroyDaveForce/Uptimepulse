'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Lock } from 'lucide-react';
import { addMonitor, getPlan, PlanLimitError } from '@/lib/store';
import { toast } from './Toast';

const INTERVALS = [1, 5, 15, 60];
const field = 'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm';

export default function AddMonitorForm({ onAdded }: { onAdded?: (id: string) => void }) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'HEAD'>('GET');
  const [expected, setExpected] = useState('200');
  const [interval, setIv] = useState(5);
  const [ak, setAk] = useState<'none' | 'keyword' | 'json'>('none');
  const [av, setAv] = useState('');
  const [err, setErr] = useState<Record<string, string>>({});
  const [upg, setUpg] = useState('');
  const plan = getPlan();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const x: Record<string, string> = {};
    const full = /^https?:\/\//i.test(url.trim()) ? url.trim() : 'https://' + url.trim();
    try { const u = new URL(full); if (!u.hostname.includes('.')) throw new Error('bad'); }
    catch { x.url = 'Enter a valid URL, e.g. https://example.com/health'; }
    const code = Number(expected);
    if (!Number.isInteger(code) || code < 100 || code > 599) x.expected = 'Use a status code from 100 to 599';
    if (ak !== 'none' && !av.trim()) x.av = ak === 'keyword' ? 'Enter the keyword that must appear' : 'Use path=value, e.g. data.status=ok';
    if (ak === 'json' && av.trim() && !av.includes('=')) x.av = 'Use path=value, e.g. data.status=ok';
    setErr(x); setUpg('');
    if (Object.keys(x).length) return;
    try {
      const m = await addMonitor({ url: full, name: name.trim() || new URL(full).hostname, method, expected: code, interval, assertKind: ak, assertValue: av.trim() });
      toast(`Now monitoring ${m.name}`);
      setUrl(''); setName(''); setAv('');
      onAdded?.(m.id);
    } catch (er) {
      if (er instanceof PlanLimitError) setUpg(er.message); else toast('Could not add monitor', 'err');
    }
  }

  return (
    <form onSubmit={submit} noValidate aria-label="Add monitor" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="monitor-url" className="sr-only">URL or API endpoint</label>
          <input id="monitor-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-site.com or https://api.your-site.com/health" aria-invalid={!!err.url} className={field + ' py-3'} />
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"><Plus className="h-4 w-4" aria-hidden="true" />Add monitor</button>
      </div>
      {err.url && <p role="alert" className="mt-2 text-sm text-red-400">{err.url}</p>}
      {upg && (
        <p role="alert" className="mt-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
          {upg} <Link href="/pricing" className="font-semibold underline">See plans</Link>
        </p>
      )}
      <details className="mt-3">
        <summary className="cursor-pointer text-sm text-zinc-400 hover:text-zinc-200">More options</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><label htmlFor="mn" className="mb-1 block text-xs text-zinc-400">Friendly name</label><input id="mn" value={name} onChange={(e) => setName(e.target.value)} placeholder="Marketing site" className={field} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label htmlFor="mm" className="mb-1 block text-xs text-zinc-400">Method</label>
              <select id="mm" value={method} onChange={(e) => setMethod(e.target.value as 'GET' | 'POST' | 'HEAD')} className={field}><option>GET</option><option>POST</option><option>HEAD</option></select></div>
            <div><label htmlFor="me" className="mb-1 block text-xs text-zinc-400">Expected status</label>
              <input id="me" inputMode="numeric" value={expected} onChange={(e) => setExpected(e.target.value)} aria-invalid={!!err.expected} className={field} />{err.expected && <p role="alert" className="mt-1 text-xs text-red-400">{err.expected}</p>}</div>
          </div>
          <fieldset className="sm:col-span-2"><legend className="mb-1 text-xs text-zinc-400">Check interval</legend>
            <div className="flex flex-wrap gap-2">
              {INTERVALS.map((i) => {
                const locked = i < plan.minInterval;
                return (
                  <button type="button" key={i} disabled={locked} aria-pressed={interval === i} onClick={() => setIv(i)} title={locked ? 'Upgrade your plan to unlock' : ''}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm ${interval === i ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-zinc-700'} ${locked ? 'cursor-not-allowed opacity-50' : 'hover:bg-zinc-800'}`}>
                    {locked && <Lock className="h-3 w-3" aria-hidden="true" />}{i} min{locked && <span className="text-xs text-amber-400">Upgrade</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div><label htmlFor="ak" className="mb-1 block text-xs text-zinc-400">Assertion (optional)</label>
            <select id="ak" value={ak} onChange={(e) => setAk(e.target.value as 'none' | 'keyword' | 'json')} className={field}><option value="none">None</option><option value="keyword">Keyword must appear</option><option value="json">JSON path equals value</option></select></div>
          {ak !== 'none' && (
            <div><label htmlFor="av" className="mb-1 block text-xs text-zinc-400">{ak === 'keyword' ? 'Keyword' : 'path=value'}</label>
              <input id="av" value={av} onChange={(e) => setAv(e.target.value)} placeholder={ak === 'keyword' ? 'OK' : 'data.status=ok'} aria-invalid={!!err.av} className={field} />{err.av && <p role="alert" className="mt-1 text-xs text-red-400">{err.av}</p>}</div>
          )}
        </div>
      </details>
    </form>
  );
}