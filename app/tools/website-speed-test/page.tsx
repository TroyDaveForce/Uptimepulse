import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';

export const metadata: Metadata = {
  title: 'Free Website Speed Test',
  description: 'Check server response time, time to first byte, and page weight for any URL with this free website speed test.',
  alternates: { canonical: '/tools/website-speed-test' },
};

export default function Page() {
  return (
    <ToolPage kind="speed" title="Free Website Speed Test" paras={[
      'A slow page costs visitors, rankings, and sales, yet most teams only notice when complaints arrive. This website speed test measures how quickly your server responds, how long the first byte takes to arrive, and how heavy the page is, then compares the numbers against sensible targets. Enter any public URL, run the test, and read the summary in seconds.',
      'Use it to compare before and after a deploy, to check a new CDN, or to see whether a marketing page needs lighter images. Fast pages convert better and rank higher, and a quick response is also the first sign a server is healthy. No account is needed to try the tool, and it works at any screen width.',
      'For continuous tracking rather than one-off checks, add the same address to the UptimePulse dashboard. Response time monitoring will chart every check, alert you when latency spikes, and keep a history you can share with your team or clients.',
    ]} />
  );
}