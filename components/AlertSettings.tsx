'use client';
import { useState } from 'react';
import type { Monitor } from '@/lib/types';
import { addAlertChannel, updateMonitor, sendTestAlert } from '@/lib/store';
import { toast } from './Toast';
import SlackPreview from './SlackPreview';

function Toggle({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => set(!on)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}
const field = 'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm';

export default function AlertSettings({ m }: { m: Monitor }) {
  const [slack, setSlack] = useState(m.slackUrl);
  const [emails, setEmails] = useState(m.emails);
  const [busy, setBusy] = useState(false);

  async function save() {
    const s = slack.trim();
    if (s && !/^https:\/\/hooks\.slack\.com\/services\//.test(s)) { toast('Slack webhook must start with https://hooks.slack.com/services/', 'err'); return; }
    const list = emails.split(',').map((x) => x.trim()).filter(Boolean);
    if (list.some((x) => !/^\S+@\S+\.\S+$/.test(x))) { toast('One of the email addresses looks invalid', 'err'); return; }
    await addAlertChannel(m.id, { type: 'slack', value: s });
    await addAlertChannel(m.id, { type: 'email', value: list.join(', ') });
    toast('Alert channels saved');
  }
  async function test() {
    setBusy(true);
    const r = await sendTestAlert(m.id);
    toast(r.message, r.ok ? 'ok' : 'err');
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between"><label htmlFor={`sl-${m.id}`} className="text-sm font-medium">Slack webhook URL</label><Toggle on={m.slackOn} set={(v) => updateMonitor(m.id, { slackOn: v })} label="Enable Slack alerts" /></div>
          <input id={`sl-${m.id}`} value={slack} onChange={(e) => setSlack(e.target.value)} placeholder="https://hooks.slack.com/services/T000/B000/XXXX" className={field} />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between"><label htmlFor={`em-${m.id}`} className="text-sm font-medium">Email recipients</label><Toggle on={m.emailOn} set={(v) => updateMonitor(m.id, { emailOn: v })} label="Enable email alerts" /></div>
          <input id={`em-${m.id}`} value={emails} onChange={(e) => setEmails(e.target.value)} placeholder="oncall@company.com, dev@company.com" className={field} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={save} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400">Save channels</button>
        <button onClick={test} disabled={busy} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 disabled:opacity-60">{busy ? 'Sending...' : 'Send test alert'}</button>
      </div>
      <SlackPreview m={m} />
    </div>
  );
}