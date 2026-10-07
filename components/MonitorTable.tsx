'use client';
import { useState } from 'react';
import type { Monitor, Status } from '@/lib/types';
import { statusOf } from '@/lib/store';
import MonitorCard from './MonitorCard';

export default function MonitorTable({ monitors, sel, onSelect }: { monitors: Monitor[]; sel: string | null; onSelect: (id: string) => void }) {
  const [q, setQ] = useState('');
  const [f, setF] = useState<'all' | Status>('all');
  const [so, setSo] = useState<'default' | 'name' | 'status'>('default');
  const order: Status[] = ['down', 'degraded', 'up', 'paused'];
  const list = monitors
    .filter((m) => (f === 'all' || statusOf(m) === f) && m.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (so === 'name' ? a.name.localeCompare(b.name) : so === 'status' ? order.indexOf(statusOf(a)) - order.indexOf(statusOf(b)) : 0));
  const ctl = 'rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm';
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name" aria-label="Search monitors by name" className={`${ctl} min-w-0 flex-1`} />
        <select value={f} onChange={(e) => setF(e.target.value as 'all' | Status)} aria-label="Filter by status" className={ctl}>
          <option value="all">All statuses</option><option value="up">Up</option><option value="degraded">Degraded</option><option value="down">Down</option><option value="paused">Paused</option>
        </select>
        <select value={so} onChange={(e) => setSo(e.target.value as 'default' | 'name' | 'status')} aria-label="Sort monitors" className={ctl}>
          <option value="default">Newest first</option><option value="name">Name</option><option value="status">Status</option>
        </select>
      </div>
      <div className="grid gap-3">
        {list.map((m) => <MonitorCard key={m.id} m={m} selected={sel === m.id} onSelect={() => onSelect(m.id)} />)}
        {!list.length && <p className="rounded-xl border border-zinc-800 p-6 text-center text-sm text-zinc-400">No monitors match your filters.</p>}
      </div>
    </div>
  );
}