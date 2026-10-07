import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export default function ToolCard({ href, name, desc, Icon }: { href: string; name: string; desc: string; Icon: LucideIcon }) {
  return (
    <Link href={href} className="group flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-emerald-500/40">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400"><Icon className="h-5 w-5" aria-hidden="true" /></span>
      <span>
        <span className="block font-semibold group-hover:text-emerald-300">{name}</span>
        <span className="mt-1 block text-sm text-zinc-400">{desc}</span>
      </span>
    </Link>
  );
}