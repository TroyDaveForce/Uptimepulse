'use client';
import { useEffect, useState } from 'react';

type T = { id: number; msg: string; kind: 'ok' | 'err' | 'warn' };
let push: ((t: T) => void) | null = null;
let seq = 0;
export const toast = (msg: string, kind: T['kind'] = 'ok') => push?.({ id: ++seq, msg, kind });

const tone = { ok: 'border-emerald-500/40', err: 'border-red-500/50', warn: 'border-amber-500/40' };

export default function ToastHost() {
  const [list, setList] = useState<T[]>([]);
  useEffect(() => {
    push = (t) => {
      setList((x) => [...x.slice(-3), t]);
      setTimeout(() => setList((x) => x.filter((y) => y.id !== t.id)), 5000);
    };
    return () => { push = null; };
  }, []);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2">
      {list.map((t) => (
        <div key={t.id} className={`pointer-events-auto max-w-sm rounded-xl border bg-zinc-900 px-4 py-3 text-sm shadow-xl ${tone[t.kind]}`}>{t.msg}</div>
      ))}
    </div>
  );
}