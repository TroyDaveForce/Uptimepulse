# UptimePulse

Uptime and API monitoring dashboard (Next.js 14, TypeScript, Tailwind). Runs in demo mode out of the box.

## Run locally
1. `npm install`
2. `copy .env.example .env.local` and fill in values you have
3. `npm run dev` then open http://localhost:3000

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. In Vercel: Add New > Project > import the repo (framework: Next.js).
3. Add environment variables (Settings > Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` = your production URL (no trailing slash)
   - `NEXT_PUBLIC_ADSENSE_CLIENT` = `ca-pub-XXXXXXXXXXXXXXXX`
   - `RESEND_API_KEY`, `EMAIL_FROM` (a verified Resend sender), `SLACK_WEBHOOK_URL` (fallback webhook)
   - `CRON_SECRET` = any long random string (Vercel sends it as a Bearer token to the cron route)
4. Deploy. `vercel.json` schedules `/api/cron/check` every minute. Per-minute cron needs a Vercel Pro plan; on Hobby, change the schedule to once a day.
5. Edit `public/ads.txt` and put your real AdSense publisher ID in it.

## Swap the demo store for Supabase/Postgres
All reads and writes go through `lib/store.ts`. Keep the exported function signatures
(`listMonitors`, `addMonitor`, `updateMonitor`, `deleteMonitor`, `getChecks`, `getIncidents`,
`addAlertChannel`, `sendTestAlert`, `recordCheck`) and re-implement each with your database client.
Tables: `monitors`, `checks (monitor_id, t, ms, up, code)`, `incidents (monitor_id, start, end, cause)`.
`getStats`, `getBars`, `tick` and the seed data are demo-only helpers: replace stats with SQL aggregates and delete `tick`.

## Notes
- Demo data lives in memory; a page reload re-seeds it. The cron route uses the server's own store instance.
- The simulated "Payments API" monitor goes down and recovers on a loop so you can see alerts.