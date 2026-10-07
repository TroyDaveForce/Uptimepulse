'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

const PLANS = [
  { key: 'starter', name: 'Starter', price: 19, pop: false, features: ['10 monitors', '5-minute checks', 'Email alerts'] },
  { key: 'pro', name: 'Pro', price: 49, pop: true, features: ['50 monitors', '1-minute checks', 'Slack + email alerts', 'Public status pages'] },
  { key: 'business', name: 'Business', price: 99, pop: false, features: ['200 monitors', '30-second checks', 'Multi-user access', 'API access'] },
];

export default function PricingTable({ compact = false }: { compact?: boolean }) {
  const [annual, setAnnual] = useState(false);
  const tab = (on: boolean) => `rounded-full px-4 py-1.5 text-sm font-medium ${on ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-white'}`;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex rounded-full border border-zinc-700 p-1" role="group" aria-label="Billing period">
          <button aria-pressed={!annual} onClick={() => setAnnual(false)} className={tab(!annual)}>Monthly</button>
          <button aria-pressed={annual} onClick={() => setAnnual(true)} className={tab(annual)}>Annual</button>
        </div>
        <span className="text-sm text-emerald-400">2 months free on annual</span>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.key} className={`relative rounded-xl border bg-zinc-900/60 p-6 shadow-lg shadow-black/20 ${p.pop ? 'border-emerald-500/60' : 'border-zinc-800'}`}>
            {p.pop && <span className="absolute -top-3 left-6 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-semibold text-zinc-950">Most Popular</span>}
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="mt-3"><span className="text-4xl font-bold">${annual ? Math.round((p.price * 10) / 12) : p.price}</span><span className="text-zinc-400">/mo</span></p>
            <p className="mt-1 h-5 text-xs text-zinc-500">{annual ? `Billed $${p.price * 10}/yr` : 'Billed monthly'}</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {(compact ? p.features.slice(0, 3) : p.features).map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />{f}</li>)}
            </ul>
            <Link href={`/checkout?plan=${p.key}&billing=${annual ? 'annual' : 'monthly'}`}
              className={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${p.pop ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400' : 'border border-zinc-700 hover:bg-zinc-800'}`}>
              Choose {p.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}