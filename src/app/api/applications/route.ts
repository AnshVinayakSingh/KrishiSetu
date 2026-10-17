import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

interface AppDoc {
  _id: string; userId: string; schemeId: string; schemeName: string; fullName: string; phone: string;
  state: string; district: string; village: string; landAcres: number | null; crop: string; status: string; createdAt: Date;
}
const ref = (id: string) => `KS-${id.slice(0, 8).toUpperCase()}`;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const rows = await (await db()).collection<AppDoc>('applications').find({ userId: user.id }).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({
    applications: rows.map((r) => ({ id: r._id, schemeId: r.schemeId, schemeName: r.schemeName, status: r.status, createdAt: r.createdAt, reference: ref(r._id) })),
  });
}

// Error values are short codes handled by the apply form.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const s = (k: string, max = 100) => String(b[k] ?? '').trim().slice(0, max);
  const fullName = s('fullName'), phone = s('phone', 10), state = s('state'), district = s('district');
  const acres = b.landAcres === '' || b.landAcres == null ? null : Number(b.landAcres);
  if (!s('schemeId') || !s('schemeName')) return NextResponse.json({ error: 'scheme' }, { status: 400 });
  if (fullName.length < 2 || !/^[6-9]\d{9}$/.test(phone) || !state || !district || (acres !== null && !(acres >= 0 && acres < 10000))) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const _id = randomUUID();
  try {
    await (await db()).collection<AppDoc>('applications').insertOne({
      _id, userId: user.id, schemeId: s('schemeId'), schemeName: s('schemeName'), fullName, phone, state, district,
      village: s('village'), landAcres: acres, crop: s('crop'), status: 'submitted', createdAt: new Date(),
    });
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return NextResponse.json({ error: 'duplicate' }, { status: 409 });
    throw e;
  }
  return NextResponse.json({ reference: ref(_id) });
}
