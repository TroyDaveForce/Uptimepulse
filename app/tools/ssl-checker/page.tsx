import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';

export const metadata: Metadata = {
  title: 'Free SSL Checker',
  description: 'Check an SSL certificate issuer, expiry date, and days remaining for any domain with this free SSL checker.',
  alternates: { canonical: '/tools/ssl-checker' },
};

export default function Page() {
  return (
    <ToolPage kind="ssl" title="Free SSL Checker" paras={[
      'An expired SSL certificate turns a healthy website into a browser warning that scares visitors away and breaks API clients instantly. This SSL checker shows who issued a certificate, when it became valid, when it expires, and how many days remain, so renewals never catch you by surprise. Type a domain, run the check, and review the result in seconds.',
      'Certificates issued by automated authorities last only ninety days, which makes forgotten renewals one of the most common causes of avoidable downtime. Keep an eye on staging hosts, API subdomains, and old marketing domains too, since they are the ones people forget.',
      'For hands-off protection, add the domain to UptimePulse. Every check includes an SSL expiry check, and you get a warning in Slack or email well before the certificate lapses. It takes under a minute to set up and costs nothing to start. Fixing a renewal early is always cheaper than explaining an outage afterwards.',
    ]} />
  );
}