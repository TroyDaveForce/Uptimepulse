import { NextResponse } from 'next/server';
import { listMonitors, recordCheck } from '@/lib/store';
import { checkMonitor } from '@/lib/monitor';
import { notify } from '@/lib/alerts';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const due = (await listMonitors()).filter((m) => !m.paused && Date.now() - m.lastChecked >= m.interval * 60000 - 5000);
  const results = await Promise.all(
    due.map(async (m) => {
      const r = await checkMonitor(m);
      const changed = r.isUp !== m.isUp;
      await recordCheck(m.id, { t: r.checkedAt, ms: r.responseTimeMs, up: r.isUp, code: r.statusCode }, r.sslExpiryDays);
      // Alert only on a state change, never on every failed check.
      if (changed) await notify(m, r.isUp ? 'up' : 'down', r.isUp ? 'Recovered' : `HTTP ${r.statusCode || 'timeout'} after 3 attempts`);
      return { id: m.id, isUp: r.isUp, statusCode: r.statusCode, responseTimeMs: r.responseTimeMs, sslExpiryDays: r.sslExpiryDays, changed };
    })
  );
  return NextResponse.json({ checked: results.length, results });
}