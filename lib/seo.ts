export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://uptimepulse.vercel.app';
export const TITLE = 'Free Website & API Uptime Monitor \u2014 Check Downtime & Get Slack Alerts';
export const DESC =
  'Monitor websites and APIs 24/7. Track uptime, response time, and SSL expiry, and get instant Slack + email alerts when something goes down. Free to start.';
export const FAQ = [
  { q: 'How often does UptimePulse check my site?', a: 'Every 1, 5, 15, or 60 minutes depending on your plan. The Business plan adds 30-second checks.' },
  { q: 'Will I get spammed with alerts?', a: 'No. You get one alert when a monitor goes down and one when it recovers, after three failed retries confirm the outage.' },
  { q: 'Can it monitor an API that must return a specific response?', a: 'Yes. Choose the method and expected status code, then require a keyword or a JSON path value in the response body.' },
  { q: 'Is there a free plan?', a: 'You can start free. Paid plans add more monitors, faster checks, Slack alerts, and public status pages.' },
];
export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'UptimePulse',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      description: DESC,
      url: SITE,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
};