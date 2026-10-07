import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';

export const metadata: Metadata = {
  title: 'Free Broken Link Checker',
  description: 'Scan a page for broken links and see which URLs return 404 or server errors with this free broken link checker.',
  alternates: { canonical: '/tools/broken-link-checker' },
};

export default function Page() {
  return (
    <ToolPage kind="links" title="Free Broken Link Checker" paras={[
      'Broken links frustrate visitors, waste crawl budget, and quietly erode the search rankings you worked hard to earn. This broken link checker scans a page and reports every link that returns an error, such as a 404 Not Found or a 500 server error, so you can fix them quickly. Enter a page address, start the scan, and review the list of problem URLs along with their status codes.',
      'Run it after a redesign, a migration, or a big content update, when links are most likely to break. Internal links deserve extra attention because they shape how search engines move through your site. Links to other websites can break at any time without warning, so regular checks matter more than one-off ones.',
      'To know the moment a key page itself goes offline, add it to the UptimePulse dashboard. A website downtime checker will watch it around the clock and send alerts the second something fails.',
    ]} />
  );
}