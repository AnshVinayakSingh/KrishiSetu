import { NextRequest, NextResponse } from 'next/server';
import { startSession, toPublic, verifyPassword, type UserDoc } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const b = await req.json().catch(() => ({}));
    const email = String(b.email ?? '').trim().toLowerCase();
    const u = await (await db()).collection<UserDoc>('users').findOne({ email });
    if (!u || !verifyPassword(String(b.pw ?? ''), u.pwHash)) return NextResponse.json({ error: 'lpErrWrong' }, { status: 401 });
    await startSession(u._id);
    return NextResponse.json({ user: toPublic(u) });
  } catch (e) {
    console.error('login failed:', e); // visible in Render > Logs (e.g. Mongo connection / bad auth)
    return NextResponse.json({ error: 'lpErrServer' }, { status: 500 });
  }
}
