'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Check, Range } from '@/lib/types';

export default function ResponseTimeChart({ data, range }: { data: Check[]; range: Range }) {
  const d = data.map((c) => ({
    t: range === '24h' ? new Date(c.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(c.t).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    ms: c.up ? c.ms : null,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={d} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="#27272a" vertical={false} />
        <XAxis dataKey="t" tick={{ fill: '#71717a', fontSize: 11 }} minTickGap={40} stroke="#3f3f46" />
        <YAxis tick={{ fill: '#71717a', fontSize: 11 }} unit=" ms" stroke="#3f3f46" />
        <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }} labelStyle={{ color: '#a1a1aa' }} />
        <Line type="monotone" dataKey="ms" name="Response" stroke="#34d399" strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}