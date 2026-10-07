'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Checkout() {
  const [plan, setPlan] = useState('pro');
  const [billing, setBilling] = useState('monthly');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setPlan(q.get('plan') || 'pro');
    setBilling(q.get('billing') || 'monthly');
  }, []);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr('Enter a valid email address'); return; }
    setErr('');
    setSent(true);
    window.location.href = `mailto:hello@uptimepulse.app?subject=${encodeURIComponent('Notify me: ' + plan + ' (' + billing + ')')}&body=${encodeURIComponent('Please notify me at ' + email + ' when checkout opens.')}`;
  }
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">Checkout is coming soon</h1>
      <p className="mt-3 text-zinc-400">You picked the <strong className="capitalize text-white">{plan}</strong> plan ({billing}). Payments open shortly. Leave your email and we will tell you the moment it is live.</p>
      <form onSubmit={submit} noValidate className="mt-6 space-y-3">
        <label htmlFor="em" className="block text-sm font-medium">Email address</label>
        <input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" aria-invalid={!!err}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5" />
        {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
        <button className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-zinc-950 hover:bg-emerald-400">Notify me</button>
        {sent && <p role="status" className="text-sm text-emerald-400">Thanks! Your email app should open with a confirmation message.</p>}
      </form>
      <Link href="/pricing" className="mt-6 inline-block text-sm text-emerald-400 hover:underline">&larr; Back to pricing</Link>
    </main>
  );
}