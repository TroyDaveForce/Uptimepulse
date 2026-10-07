import { NextResponse } from 'next/server';
import { listMonitors, addMonitor, PlanLimitError } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await listMonitors());
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    new URL(b.url);
    if (!b.name) throw new Error('name is required');
    return NextResponse.json(await addMonitor(b), { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: e instanceof PlanLimitError ? 402 : 400 });
  }
}