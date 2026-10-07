'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Monitor } from '@/lib/types';
import { listMonitors, subscribe, tick } from '@/lib/store';
import AddMonitorForm from './AddMonitorForm';
import MonitorTable from './MonitorTable';
import MonitorDetail from './MonitorDetail';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import { toast } from './Toast';

export default function Dashboard() {
  const [ms, setMs] = useState<Monitor[] | null>(null);
  const [err, setErr] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const detail = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try { setMs(await listMonitors()); setErr(false); } catch { setErr(true); }
  }, []);

  useEffect(() => {
    const first = setTimeout(load, 500);
    const un = subscribe(load);
    const t = setInterval(() => {
      for (const e of tick()) {
        const ch = [e.monitor.slackOn && 'Slack', e.monitor.emailOn && 'email'].filter(Boolean).join(' + ') || 'dashboard';
        toast(e.type === 'down' ? `${e.monitor.name} is DOWN. Alert sent via ${ch}.` : `${e.monitor.name} recovered. Alert sent via ${ch}.`, e.type === 'down' ? 'err' : 'ok');
      }
    }, 4000);
    return () => { clearTimeout(first); un(); clearInterval(t); };
  }, [load]);

  const open = (id: string) => { setSel(id); setTimeout(() => detail.current?.scrollIntoView({ block: 'nearest' }), 60); };
  const current = sel ? ms?.find((x) => x.id === sel) : undefined;

  return (
    <section aria-label="Monitor dashboard" className="space-y-5">
      <AddMonitorForm />
      {err ? (
        <EmptyState title="We could not load your monitors" body="Something went wrong while fetching your data. Please try again." cta="Retry" onCta={load} />
      ) : ms === null ? (
        <div className="grid gap-3" aria-busy="true" aria-label="Loading monitors"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
      ) : ms.length === 0 ? (
        <EmptyState title={'No monitors yet \u2014 add your first URL above'} body="Paste a website or API endpoint and we will start checking it right away." cta="Add your first monitor" onCta={() => document.getElementById('monitor-url')?.focus()} />
      ) : (
        <MonitorTable monitors={ms} sel={sel} onSelect={open} />
      )}
      {current && <div ref={detail}><MonitorDetail m={current} onClose={() => setSel(null)} /></div>}
    </section>
  );
}