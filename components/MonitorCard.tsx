import type { Monitor, Status } from '@/lib/types';
import { getStats, statusOf, ago } from '@/lib/store';

const pill: Record<Status, string> = {
  up: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30',
  down: 'bg-red-500/10 text-red-400 ring-red-500/30',
  degraded: 'bg-amber-500/10 text-amber-400 ring-amber-500/30',
  paused: 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/30',
};
const label: Record<Status, string> = { up: 'Up', down: 'Down', degraded: 'Degraded', paused: 'Paused' };
const dotc: Record<Status, string> = { up: 'bg-emerald-400', down: 'bg-red-400', degraded: 'bg-amber-400', paused: 'bg-zinc-500' };

export function StatusPill({ s }: { s: Status }) {
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${pill[s]}`}>{label[s]}</span>;
}

export default function MonitorCard({ m, selected, onSelect }: { m: Monitor; selected: boolean; onSelect: () => void }) {
  const s = statusOf(m);
  const st = getStats(m.id);
  const stats: [string, string][] = [['24h', st.u24 + '%'], ['7d', st.u7 + '%'], ['30d', st.u30 + '%'], ['Avg', st.avg + ' ms'], ['p95', st.p95 + ' ms'], ['SSL', m.sslDays + ' d']];
  return (
    <article className={`rounded-xl border bg-zinc-900/60 p-4 shadow-lg shadow-black/20 ${selected ? 'border-emerald-500/50' : 'border-zinc-800'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <button onClick={onSelect} aria-expanded={selected} aria-label={`Open details for ${m.name}`} className="flex max-w-full items-center gap-2 rounded text-left font-semibold hover:underline">
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
              {s !== 'paused' && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:animate-none ${dotc[s]}`} />}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotc[s]}`} />
            </span>
            <span className="truncate">{m.name}</span>
          </button>
          <p className="mt-0.5 truncate text-xs text-zinc-500">{m.method} {m.url}</p>
        </div>
        <StatusPill s={s} />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-xs sm:grid-cols-6">
        {stats.map(([k, v]) => <div key={k}><dt className="text-zinc-500">{k}</dt><dd className="mt-0.5 font-medium tabular-nums">{v}</dd></div>)}
      </dl>
      <p className="mt-3 text-xs text-zinc-500">Last checked {s === 'paused' ? 'before pause' : ago(m.lastChecked)}</p>
    </article>
  );
}