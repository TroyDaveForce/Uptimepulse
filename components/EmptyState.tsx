import Link from 'next/link';
import { Radar } from 'lucide-react';

export default function EmptyState({ title, body, cta, onCta, href }: { title: string; body: string; cta: string; onCta?: () => void; href?: string }) {
  const cls = 'mt-5 inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400';
  return (
    <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-12 text-center">
      <Radar className="mx-auto h-8 w-8 text-zinc-500" aria-hidden="true" />
      <p className="mt-3 text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-zinc-400">{body}</p>
      {href ? <Link href={href} className={cls}>{cta}</Link> : <button onClick={onCta} className={cls}>{cta}</button>}
    </div>
  );
}