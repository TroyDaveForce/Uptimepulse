import type { Monitor } from './types';
import { sendEmail, emailHtml } from './email';

export type Ev = 'down' | 'up';

export function slackPayload(m: Monitor, ev: Ev, detail: string) {
  const down = ev === 'down';
  return {
    text: `${down ? ':red_circle:' : ':large_green_circle:'} ${m.name} is ${down ? 'DOWN' : 'back UP'}`,
    attachments: [
      {
        color: down ? '#ef4444' : '#10b981',
        blocks: [
          { type: 'section', text: { type: 'mrkdwn', text: `*${m.name}* is *${down ? 'DOWN' : 'back UP'}*\n<${m.url}|${m.url}>` } },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Detail*\n${detail}` },
              { type: 'mrkdwn', text: `*Expected*\nHTTP ${m.expected}` },
              { type: 'mrkdwn', text: `*Method*\n${m.method}` },
              { type: 'mrkdwn', text: `*Time*\n${new Date().toUTCString()}` },
            ],
          },
        ],
      },
    ],
  };
}

/** Called only on a state change (up->down or down->up). */
export async function notify(m: Monitor, ev: Ev, detail: string) {
  const out: string[] = [];
  const url = m.slackUrl || process.env.SLACK_WEBHOOK_URL;
  if (m.slackOn && url) {
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(slackPayload(m, ev, detail)) });
      out.push(r.ok ? 'slack:ok' : 'slack:' + r.status);
    } catch { out.push('slack:error'); }
  }
  const to = m.emails.split(',').map((x) => x.trim()).filter(Boolean);
  if (m.emailOn && to.length) {
    const r = await sendEmail(to, `[UptimePulse] ${m.name} is ${ev === 'down' ? 'DOWN' : 'back UP'}`, emailHtml(m, ev, detail));
    out.push(r.ok ? 'email:ok' : 'email:fail');
  }
  return out;
}