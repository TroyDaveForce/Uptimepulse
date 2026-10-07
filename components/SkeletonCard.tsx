export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 motion-reduce:animate-none" aria-hidden="true">
      <div className="flex justify-between"><div className="h-4 w-40 rounded bg-zinc-800" /><div className="h-5 w-14 rounded-full bg-zinc-800" /></div>
      <div className="mt-2 h-3 w-56 max-w-full rounded bg-zinc-800/70" />
      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-8 rounded bg-zinc-800/70" />)}</div>
    </div>
  );
}