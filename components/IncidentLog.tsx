import type { Incident } from '@/lib/types';

const dur = (a: number, b: number) => {
  const s = Math.round((b - a) / 1000);
  return s < 60 ? s + ' s' : s < 3600 ? Math.round(s / 60) + ' min' : (s / 3600).toFixed(1) + ' h';
};

export default function IncidentLog({ items }: { items: Incident[] }) {
  if (!items.length) return <p className="text-sm text-zinc-400">No incidents recorded. Nice.</p>;
  return (
    <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 text-sm">
      {items.map((i) => (
        <li key={i.id} className="grid gap-1 p-3 sm:grid-cols-4 sm:gap-3">
          <span><span className="text-zinc-500 sm:hidden">Started: </span>{new Date(i.start).toLocaleString()}</span>
          <span className={i.end ? 'text-zinc-300' : 'font-medium text-red-400'}>{i.end ? 'Resolved ' + new Date(i.end).toLocaleTimeString() : 'Ongoing'}</span>
          <span>{dur(i.start, i.end ?? Date.now())}</span>
          <span className="text-zinc-400">{i.cause}</span>
        </li>
      ))}
    </ul>
  );
}