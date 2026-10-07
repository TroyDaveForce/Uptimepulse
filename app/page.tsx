import type { Metadata } from 'next';
import { Gauge, ShieldCheck, Link2 } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import PricingTable from '@/components/PricingTable';
import AdSlot from '@/components/AdSlot';
import ToolCard from '@/components/ToolCard';
import { TITLE, DESC, SITE, FAQ, jsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: '/' },
  openGraph: { title: TITLE, description: DESC, url: SITE, type: 'website' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-12">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">Know the second your website or API goes down</h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-400 sm:text-lg">Free uptime monitoring with instant Slack and email alerts. Add a URL and watch it live below.</p>
        <div className="mt-6"><Dashboard /></div>
      </div>

      <article className="mx-auto mt-20 max-w-3xl space-y-4 px-4 leading-relaxed text-zinc-300">
        <h2 className="pt-2 text-2xl font-semibold text-white">What UptimePulse Monitors</h2>
        <p>UptimePulse is an uptime monitor that checks your websites and APIs on a schedule and records whether each request succeeded, how long it took, and what the server answered. As a website downtime checker it confirms every outage with three retries and a ten-second timeout, so one dropped packet never wakes your team at 3 a.m.</p>
        <p>Response time monitoring charts latency over 24 hours, 7 days, or 30 days, with average and 95th-percentile figures that expose slow endpoints before users notice. Every check also stores the HTTP status code, so you can tell a 503 from a 404 at a glance, and you set the exact code you expect.</p>
        <p>An SSL expiry check reads the certificate on each run and warns you under 14 days, ending the classic expired-certificate outage. For API monitoring, add an assertion: require a keyword in the response body, or test that a JSON path equals a value, so a 200 response carrying an error payload still counts as a failure.</p>

        <h2 className="pt-6 text-2xl font-semibold text-white">How to Set It Up in 60 Seconds</h2>
        <p>Paste your URL or API endpoint into the Add monitor box and give it a friendly name. Pick a check interval of 1, 5, 15, or 60 minutes, depending on your plan. Optionally choose the HTTP method, the expected status code, and a keyword or JSON assertion.</p>
        <p>Then connect Slack by pasting an incoming-webhook URL, add one or more email recipients, or do both. Use Send test alert to see the exact message before anything breaks. From that moment UptimePulse watches in the background and sends Slack alerts and email the instant a monitor changes state: once when it goes down and once when it recovers, never on every failed check.</p>

        <AdSlot slot="1000000001" />

        <h2 className="pt-2 text-2xl font-semibold text-white">Why It Pays for Itself</h2>
        <p>A silent outage costs money long before anyone files a ticket. Checkout errors, a broken login API, or an expired certificate can quietly drain revenue for hours. Catching the problem in minutes protects sales, keeps customers happy, and means you hear about it before your clients complain.</p>
        <p>Incident history and uptime percentages double as SLA reporting, and every monitor can be shared as a public status page so customers see the truth without emailing support. One avoided outage usually covers a year of the subscription.</p>
      </article>

      <section aria-labelledby="tools-h" className="mx-auto mt-16 max-w-4xl px-4">
        <h2 id="tools-h" className="text-2xl font-semibold">Related Free Tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <ToolCard href="/tools/website-speed-test" name="Website Speed Test" desc="Measure response time, first byte, and page weight." Icon={Gauge} />
          <ToolCard href="/tools/ssl-checker" name="SSL Checker" desc="See certificate issuer, expiry date, and days left." Icon={ShieldCheck} />
          <ToolCard href="/tools/broken-link-checker" name="Broken Link Checker" desc="Find links that return 404 or server errors." Icon={Link2} />
        </div>
      </section>

      <section aria-labelledby="pricing-h" className="mx-auto mt-20 max-w-5xl px-4">
        <h2 id="pricing-h" className="text-2xl font-semibold">Simple pricing that scales with you</h2>
        <div className="mt-6"><PricingTable compact /></div>
      </section>

      <section aria-labelledby="faq-h" className="mx-auto mt-20 max-w-3xl px-4">
        <h2 id="faq-h" className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          {FAQ.map((f) => (
            <div key={f.q}><h3 className="font-medium text-white">{f.q}</h3><p className="mt-1 text-zinc-400">{f.a}</p></div>
          ))}
        </div>
      </section>

      <AdSlot slot="1000000002" />
    </main>
  );
}