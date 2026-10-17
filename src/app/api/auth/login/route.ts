import { NextRequest, NextResponse } from 'next/server';
import { startSession, toPublic, verifyPassword, type UserDoc } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const u = await (await db()).collection<UserDoc>('users').findOne({ phone: String(b.phone ?? '') });
  if (!u || !verifyPassword(String(b.pw ?? ''), u.pwHash)) return NextResponse.json({ error: 'lpErrWrong' }, { status: 401 });
  await startSession(u._id);
  return NextResponse.json({ user: toPublic(u) });
}
