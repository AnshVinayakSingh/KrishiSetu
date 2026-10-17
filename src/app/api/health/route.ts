import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Open /api/health on your deployed site to see why the database is not connecting.
export async function GET() {
  const envSet = !!process.env.MONGODB_URI;
  if (!envSet) return NextResponse.json({ envSet, ok: false, error: 'MONGODB_URI is not set on this server' });
  try {
    await (await db()).command({ ping: 1 });
    return NextResponse.json({ envSet, ok: true, database: process.env.MONGODB_DB ?? 'krishisetu' });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json({ envSet, ok: false, error: `${err.name}: ${err.message}`.slice(0, 300) });
  }
}
