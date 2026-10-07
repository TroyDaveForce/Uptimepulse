import type { Metadata } from 'next';
import StatusView from '@/components/StatusView';

export const metadata: Metadata = { title: 'Service status', robots: { index: false } };

export default function StatusPage({ params }: { params: { id: string } }) {
  return <main className="mx-auto max-w-3xl px-4 py-12"><StatusView id={params.id} /></main>;
}