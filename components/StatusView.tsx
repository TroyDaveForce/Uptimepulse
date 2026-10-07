'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Monitor, Incident } from '@/lib/types';
import { listMonitors, getIncidents, getStats, getBars, statusOf, subscribe, tick } from '@/lib/store';
import { StatusPill } from './MonitorCard';
import UptimeBarStrip from './UptimeBarStrip';
import IncidentLog from './IncidentLog';
import EmptyState from './EmptyState';
import SkeletonCard from './SkeletonCard';

const headline = { up: 'All systems operational', down: 'Service is down', degraded: 'Degraded performance', paused: 'Monitoring paused' };

export default function StatusView({ id }: { id: string }) {
  const [m, setM] = useState<Monitor | null | undefined>(undefined);
  const [inc, setInc] = useState<Incident[]>([]);
  useEffect(() => {
    const l = async () => { setM((await listMonitors()).find((x) => x.id === id) ?? null); setInc(await getIncidents(id)); };
    l();
    const u = subscribe(l);
    const t = setInterval(() => { tick(); }, 4000);
    return () => { u(); clearInterval(t); };
  }, [id]);

  if (m === undefined) return <SkeletonCard />;
  if (m === null) return <EmptyState title="Status page not found" body="This monitor does not exist or was deleted." cta="Go to dashboard" href="/" />;
  const s = statusOf(m);
  const st = getStats(m.id);
  return (
    <div>
      <h1 className="text-3xl font-bold">{m.name}</h1>
      <p className="mt-1 text-sm text-zinc-500">{m.url}</p>
      <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <p className="text-lg font-semibold">{headline[s]}</p><StatusPill s={s} />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        {([['24h uptime', st.u24 + '%'], ['7d uptime', st.u7 + '%'], ['30d uptime', st.u30 + '%']] as [string, string][]).map(([k, v]) => (
          <div key={k} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"><dt className="text-zinc-500">{k}</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{v}</dd></div>
        ))}
      </dl>
      <h2 className="mb-2 mt-8 text-sm font-semibold text-zinc-300">Uptime, last 90 intervals</h2>
      <UptimeBarStrip bars={getBars(m.id)} />
      <h2 className="mb-2 mt-8 text-sm font-semibold text-zinc-300">Past incidents</h2>
      <IncidentLog items={inc} />
      <p className="mt-8 text-sm text-zinc-500">Powered by <Link href="/" className="text-emerald-400 hover:underline">UptimePulse</Link></p>
    </div>
  );
}