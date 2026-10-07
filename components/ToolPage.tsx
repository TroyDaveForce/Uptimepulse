import Link from 'next/link';
import ToolShell from './ToolShell';

export default function ToolPage({ kind, title, paras }: { kind: 'speed' | 'ssl' | 'links'; title: string; paras: string[] }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/" className="text-sm text-emerald-400 hover:underline">&larr; Back to UptimePulse</Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <div className="mt-4 space-y-4 leading-relaxed text-zinc-300">{paras.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</div>
      <div className="mt-8"><ToolShell kind={kind} /></div>
    </main>
  );
}