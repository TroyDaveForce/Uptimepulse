import type { Monitor } from '@/lib/types';

export default function SslPanel({ m }: { m: Monitor }) {
  const to = Date.now() + m.sslDays * 864e5;
  const from = to - 90 * 864e5;
  const warn = m.sslDays < 14;
  const f = (t: number) => new Date(t).toLocaleDateString();
  return (
    <div className={`rounded-lg border p-4 text-sm ${warn ? 'border-amber-500/50 bg-amber-500/5' : 'border-zinc-800'}`}>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div><dt className="text-zinc-500">Issuer</dt><dd className="font-medium">{m.issuer}</dd></div>
        <div><dt className="text-zinc-500">Valid from</dt><dd className="font-medium">{f(from)}</dd></div>
        <div><dt className="text-zinc-500">Valid to</dt><dd className="font-medium">{f(to)}</dd></div>
        <div><dt className="text-zinc-500">Days left</dt><dd className={`font-medium ${warn ? 'text-amber-400' : 'text-emerald-400'}`}>{m.sslDays}</dd></div>
      </dl>
      {warn && <p role="alert" className="mt-3 text-amber-300">This certificate expires in under 14 days. Renew it soon to avoid browser warnings.</p>}
    </div>
  );
}