import { NextRequest, NextResponse } from 'next/server';

// GET /api/location?lat=..&lon=..  -> { city, district, state }  (reverse geocoding via OpenStreetMap Nominatim)
export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lon = Number(req.nextUrl.searchParams.get('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: 'lat/lon required' }, { status: 400 });
  }
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&lat=${lat}&lon=${lon}`,
      { headers: { 'User-Agent': 'KrishiSetu/1.0 (contact: admin@krishisetu.app)' }, cache: 'no-store', signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) throw new Error('geocode failed');
    const a = (await res.json()).address ?? {};
    return NextResponse.json({
      city: a.city || a.town || a.village || a.suburb || a.county || '',
      district: a.state_district || a.county || '',
      state: a.state || '',
    });
  } catch {
    return NextResponse.json({ city: '', district: '', state: '' });
  }
}
