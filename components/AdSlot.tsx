'use client';
import { useEffect } from 'react';

export default function AdSlot({ slot }: { slot: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  useEffect(() => {
    if (!client) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch { /* ad blocked or already filled */ }
  }, [client]);
  return (
    <aside aria-label="Advertisement" className="my-10 w-full">
      <p className="mb-1 text-center text-[11px] uppercase tracking-wide text-zinc-500">Advertisement</p>
      <div className="mx-auto flex h-[120px] w-full max-w-3xl items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-800">
        {client && <ins className="adsbygoogle" style={{ display: 'block', width: '100%', height: 120 }} data-ad-client={client} data-ad-slot={slot} data-ad-format="horizontal" data-full-width-responsive="false" />}
      </div>
    </aside>
  );
}