import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/pricing', '/tools/website-speed-test', '/tools/ssl-checker', '/tools/broken-link-checker'];
  return paths.map((p) => ({ url: SITE + p, lastModified: new Date(), changeFrequency: 'weekly', priority: p === '' ? 1 : 0.7 }));
}