import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getField } from '@/lib/fieldStore';
import { ndviImage, satelliteConfigured } from '@/lib/satellite';

const cache = new Map<string, { at: number; png: Buffer }>();

export async function GET(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!satelliteConfigured()) return NextResponse.json({ error: 'satellite_not_configured' }, { status: 503 });
  const id = (await params).id;
  const f = await getField(user.id, id);
  if (!f) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  let hit = cache.get(id);
  if (!hit || Date.now() - hit.at > 12 * 3600_000) {
    try { hit = { at: Date.now(), png: await ndviImage(f.ring) }; cache.set(id, hit); }
    catch (e) { console.error('ndvi image failed:', e instanceof Error ? e.message : e); return NextResponse.json({ error: 'failed' }, { status: 502 }); }
  }
  return new Response(new Uint8Array(hit.png), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'private, max-age=3600' } });
}
