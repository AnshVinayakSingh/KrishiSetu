import { NextRequest, NextResponse } from 'next/server';
import { createUser, startSession } from '@/lib/auth';

// Error values are translation keys used by the login/signup form.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name ?? '').trim();
  const phone = String(b.phone ?? '');
  const pw = String(b.pw ?? '');
  const role = b.role === 'buyer' ? 'buyer' : 'farmer';
  if (name.length < 2) return NextResponse.json({ error: 'lpErrName' }, { status: 400 });
  if (!/^[6-9]\d{9}$/.test(phone)) return NextResponse.json({ error: 'lpErrPhone' }, { status: 400 });
  if (pw.length < 6) return NextResponse.json({ error: 'lpErrPass' }, { status: 400 });
  const user = await createUser({ name, phone, pw, role });
  if (!user) return NextResponse.json({ error: 'lpErrExists' }, { status: 409 });
  await startSession(user.id);
  return NextResponse.json({ user });
}
