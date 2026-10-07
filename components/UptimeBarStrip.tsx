const c = { up: 'bg-emerald-500', slow: 'bg-amber-500', down: 'bg-red-500' };

export default function UptimeBarStrip({ bars }: { bars: ('up' | 'slow' | 'down')[] }) {
  return (
    <div>
      <div role="img" aria-label="Uptime over the last 90 intervals" className="flex h-9 gap-[2px]">
        {bars.map((b, i) => <span key={i} className={`h-full flex-1 rounded-[2px] ${c[b]}`} />)}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-zinc-500"><span>30 days ago</span><span>Today</span></div>
    </div>
  );
}