import type { Metadata } from 'next';
import PricingTable from '@/components/PricingTable';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'UptimePulse pricing: Starter, Pro, and Business plans for uptime monitoring, Slack alerts, and public status pages.',
  alternates: { canonical: '/pricing' },
};

const rows: [string, string, string, string][] = [
  ['Monitors', '10', '50', '200'],
  ['Fastest check interval', '5 minutes', '1 minute', '30 seconds'],
  ['Email alerts', 'Yes', 'Yes', 'Yes'],
  ['Slack alerts', 'No', 'Yes', 'Yes'],
  ['Public status pages', 'No', 'Yes', 'Yes'],
  ['Multi-user access', 'No', 'No', 'Yes'],
  ['API access', 'No', 'No', 'Yes'],
];

export default function Pricing() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing for every uptime monitor</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">Pick a plan by monitor count and check frequency. Switch to annual billing and get two months free.</p>
      <div className="mt-8"><PricingTable /></div>
      <h2 className="mt-16 text-2xl font-semibold">Compare plans</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="sr-only">Plan comparison</caption>
          <thead className="bg-zinc-900 text-zinc-400">
            <tr><th scope="col" className="p-3 font-medium">Feature</th><th scope="col" className="p-3 font-medium">Starter</th><th scope="col" className="p-3 font-medium">Pro</th><th scope="col" className="p-3 font-medium">Business</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-zinc-800">
                <th scope="row" className="p-3 font-medium">{r[0]}</th><td className="p-3">{r[1]}</td><td className="p-3">{r[2]}</td><td className="p-3">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}