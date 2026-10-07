'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Pause, Play, Trash2, X } from 'lucide-react';
import type { Monitor, Check, Incident, Range } from '@/lib/types';
import { getChecks, getIncidents, getBars, updateMonitor, deleteMonitor } from '@/lib/store';
import { toast } from './Toast';
import UptimeBarStrip from './UptimeBarStrip';
import IncidentLog from './IncidentLog';
import SslPanel from './SslPanel';
import AlertSettings from './AlertSettings';

const Chart = dynamic(() => import('./ResponseTimeChart'), { ssr: false, loading: () => <div className="h-full animate-pulse rounded-lg bg-zinc-800/50 motion-reduce:animate-none" /> });
const btn = 'inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-800';
const h3 = 'mb-2 mt-6 text-sm font-semibold text-zinc-300';

export default function MonitorDetail({ m, onClose }: { m: Monitor; onClose: () => void }) {
  const [range, setRange] = useState<Range>('24h');
  const [checks, setChecks] = useState<Check[]>([]);
  const [inc, setInc] = useState<Incident[]>([]);
  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    getChecks(m.id, range).then(setChecks);
    getIncidents(m.id).then(setInc);
  }, [m.id, m.lastChecked, range]);

  return (
    <section aria-label={`${m.name} details`} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-lg shadow-black/20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{m.name}</h2>
          <Link href={`/status/${m.id}`} className="text-sm text-emerald-400 hover:underline">Public status page</Link>
        </div>
        <div className="flex gap-2">
          <button onClick={() => updateMonitor(m.id, { paused: !m.paused })} className={btn}>{m.paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}{m.paused ? 'Resume' : 'Pause'}</button>
          <button onClick={() => setConfirm(true)} className={btn + ' text-red-400'}><Trash2 className="h-4 w-4" aria-hidden="true" />Delete</button>
          <button onClick={onClose} aria-label="Close details" className={btn}><X className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-300">Response time</h3>
        <div className="inline-flex rounded-lg border border-zinc-700 p-0.5" role="group" aria-label="Time range">
          {(['24h', '7d', '30d'] as Range[]).map((r) => (
            <button key={r} aria-pressed={range === r} onClick={() => setRange(r)} className={`rounded-md px-3 py-1 text-xs ${range === r ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-white'}`}>{r}</button>
          ))}
        </div>
      </div>
      <div className="mt-2 h-[240px] w-full"><Chart data={checks} range={range} /></div>

      <h3 className={h3}>Uptime, last 90 intervals</h3>
      <UptimeBarStrip bars={getBars(m.id)} />
      <h3 className={h3}>SSL certificate</h3>
      <SslPanel m={m} />
      <h3 className={h3}>Incident history</h3>
      <IncidentLog items={inc} />
      <h3 className={h3}>Alerting</h3>
      <AlertSettings key={m.id} m={m} />

      {confirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="dlg" className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 id="dlg" className="font-semibold">Delete {m.name}?</h3>
            <p className="mt-2 text-sm text-zinc-400">This removes the monitor, its history, and its incidents. This cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button autoFocus onClick={() => setConfirm(false)} className={btn}>Cancel</button>
              <button onClick={async () => { await deleteMonitor(m.id); toast('Monitor deleted'); onClose(); }} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold hover:bg-red-500">Delete monitor</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}