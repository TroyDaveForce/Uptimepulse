import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import './globals.css';
import ToastHost from '@/components/Toast';
import { SITE, TITLE, DESC } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: '%s | UptimePulse' },
  description: DESC,
  openGraph: { siteName: 'UptimePulse', type: 'website', title: TITLE, description: DESC },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#09090b' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <html lang="en">
      <body className={inter.className}>
        {client && (
          <Script async strategy="afterInteractive" crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`} />
        )}
        <header className="border-b border-zinc-800/80">
          <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Activity className="h-5 w-5 text-emerald-400" aria-hidden="true" /> UptimePulse
            </Link>
            <ul className="flex items-center gap-4 text-sm text-zinc-300 sm:gap-6">
              <li><Link href="/" className="hover:text-white">Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/tools/ssl-checker" className="hover:text-white">Free tools</Link></li>
            </ul>
          </nav>
        </header>
        {children}
        <footer className="mt-4 border-t border-zinc-800/80 py-8 text-sm text-zinc-500">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
            <p>&copy; {new Date().getFullYear()} UptimePulse</p>
            <ul className="flex flex-wrap gap-4">
              <li><Link href="/pricing" className="hover:text-zinc-300">Pricing</Link></li>
              <li><Link href="/tools/website-speed-test" className="hover:text-zinc-300">Website Speed Test</Link></li>
              <li><Link href="/tools/ssl-checker" className="hover:text-zinc-300">SSL Checker</Link></li>
              <li><Link href="/tools/broken-link-checker" className="hover:text-zinc-300">Broken Link Checker</Link></li>
            </ul>
          </div>
        </footer>
        <ToastHost />
      </body>
    </html>
  );
}