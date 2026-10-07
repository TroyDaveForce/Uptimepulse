import type { Monitor } from '@/lib/types';
import { slackPayload } from '@/lib/alerts';

export default function SlackPreview({ m }: { m: Monitor }) {
  const detail = `HTTP 503 (expected ${m.expected}) after 3 retries`;
  const payload = slackPayload(m, 'down', detail);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-1 text-xs text-zinc-500">Slack payload (JSON)</p>
        <pre tabIndex={0} aria-label="Slack JSON payload" className="max-h-64 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">{JSON.stringify(payload, null, 2)}</pre>
      </div>
      <div>
        <p className="mb-1 text-xs text-zinc-500">How it looks in Slack</p>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm">
          <div className="flex gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded bg-emerald-600 font-bold" aria-hidden="true">U</div>
            <div className="min-w-0">
              <p className="font-bold">UptimePulse <span className="ml-1 rounded bg-zinc-800 px-1 text-[10px] font-normal">APP</span></p>
              <div className="mt-1 border-l-4 border-red-500 pl-3">
                <p className="font-semibold">{m.name} is DOWN</p>
                <p className="truncate text-sky-400">{m.url}</p>
                <p className="mt-1 text-zinc-400">{detail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}