import type { Monitor } from './types';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

export function emailHtml(m: Monitor, ev: 'up' | 'down', detail: string) {
  const c = ev === 'down' ? '#ef4444' : '#10b981';
  const t = ev === 'down' ? 'is DOWN' : 'is back UP';
  return `<!doctype html><html><body style="margin:0;background:#f4f4f5;font-family:Inter,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px"><table width="560" style="max-width:100%;background:#ffffff;border-radius:12px;border-top:4px solid ${c}"><tr><td style="padding:28px"><p style="margin:0;font-size:12px;letter-spacing:1px;color:#71717a">UPTIMEPULSE ALERT</p><h1 style="margin:8px 0 12px;font-size:22px;color:#18181b">${esc(m.name)} ${t}</h1><p style="margin:0 0 16px;color:#3f3f46">${esc(detail)}</p><p style="margin:0 0 20px;color:#3f3f46">Endpoint: <a href="${esc(m.url)}">${esc(m.url)}</a></p><a href="${process.env.NEXT_PUBLIC_SITE_URL || '#'}" style="display:inline-block;background:${c};color:#ffffff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">View dashboard</a></td></tr></table></td></tr></table></body></html>`;
}

export async function sendEmail(to: string[], subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  const k = process.env.RESEND_API_KEY;
  if (!k) return { ok: false, error: 'RESEND_API_KEY is not set' };
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${k}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.EMAIL_FROM || 'UptimePulse <onboarding@resend.dev>', to, subject, html }),
    });
    return r.ok ? { ok: true } : { ok: false, error: await r.text() };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}