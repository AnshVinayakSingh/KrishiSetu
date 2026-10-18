import { NextRequest, NextResponse } from 'next/server';
import { demoWeather, liveWeather } from '@/lib/weather';

// GET /api/weather?lat=..&lon=..
// WEATHER_MODE=demo in .env.local forces demo data. Otherwise live; falls back to demo on failure.
export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lon = Number(req.nextUrl.searchParams.get('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: 'lat/lon required' }, { status: 400 });
  }
  if (process.env.WEATHER_MODE === 'demo') return NextResponse.json(demoWeather());
  // No silent fake data: try twice, otherwise tell the app it failed so it can show a retry.
  for (let i = 0; i < 2; i++) {
    try { return NextResponse.json(await liveWeather(lat, lon), { headers: { 'Cache-Control': 'no-store' } }); }
    catch (e) { if (i === 1) console.error('weather failed:', e instanceof Error ? e.message : e); }
  }
  return NextResponse.json({ error: 'weather_unavailable' }, { status: 502 });
}
