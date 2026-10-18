import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createField, listFields, ringAreaAcre } from '@/lib/fieldStore';

export async function GET() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  return NextResponse.json({ fields: await listFields(user.id) });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const pts: [number, number][] = Array.isArray(b.points) ? b.points.map((p: number[]) => [Number(p[0]), Number(p[1])]) : [];
  if (pts.length < 3 || pts.length > 50 || pts.some((p) => !Number.isFinite(p[0]) || !Number.isFinite(p[1]) || Math.abs(p[1]) > 90 || Math.abs(p[0]) > 180))
    return NextResponse.json({ error: 'bad_polygon' }, { status: 400 });
  const ring = [...pts, pts[0]] as [number, number][];
  const areaAcre = ringAreaAcre(ring);
  if (areaAcre < 0.05 || areaAcre > 500) return NextResponse.json({ error: 'bad_area' }, { status: 400 });
  const field = await createField(user.id, {
    name: String(b.name || 'My field').slice(0, 40), crop: String(b.crop || '').slice(0, 40),
    sowingDate: /^\d{4}-\d{2}-\d{2}$/.test(b.sowingDate) ? b.sowingDate : '', ring, areaAcre: +areaAcre.toFixed(2),
  });
  return NextResponse.json({ field });
}
