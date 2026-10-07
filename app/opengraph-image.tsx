import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'UptimePulse - free website and API uptime monitoring';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#09090b', color: '#fafafa' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, color: '#34d399' }}>UptimePulse</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>Know the second your site or API goes down</div>
        <div style={{ fontSize: 32, marginTop: 28, color: '#a1a1aa' }}>Uptime, response time and SSL monitoring with Slack + email alerts</div>
      </div>
    ),
    size
  );
}