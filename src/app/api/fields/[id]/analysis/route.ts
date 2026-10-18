import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getField } from '@/lib/fieldStore';
import { geminiConfigured, geminiJson } from '@/lib/gemini';
import { satelliteConfigured, satelliteSeries, type Point } from '@/lib/satellite';

const cache = new Map<string, { at: number; data: unknown }>();

const ADVICE = `You are Setu AI crop manager for an Indian farmer. Given REAL satellite (Sentinel-2) and weather numbers for ONE field, return ONLY JSON:
{"summary":string (2 simple sentences on crop health),"actions":[{"title":string,"text":string,"priority":"high"|"medium"|"low"}]}
4-5 actions covering irrigation (use soil moisture + rain forecast), fertiliser/nutrition, pest/disease watch, and what to do in the next 7 days for this crop stage. Use only the given numbers, very simple words, no invented values. NDVI: <0.3 weak, 0.3-0.5 fair, 0.5-0.7 good, >0.7 very dense. NDMI: low = water-stressed crop. Write in the requested language.`;

async function ground(lat: number, lon: number) {
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m` +
    `&hourly=soil_moisture_3_to_9cm,soil_moisture_9_to_27cm&daily=precipitation_sum&past_days=7&forecast_days=7&timezone=auto`, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error('Open-Meteo ' + r.status);
  const j = await r.json();
  const now = new Date(j.current.time).getTime();
  let i = (j.hourly.time as string[]).findIndex((t) => new Date(t).getTime() >= now); if (i < 0) i = 0;
  const pct = (v: number) => Math.round(Math.max(0, Math.min(100, (v / 0.45) * 100)));
  const p: number[] = j.daily.precipitation_sum.map((x: number | null) => x ?? 0);
  return {
    tempC: j.current.temperature_2m,
    soilTopPct: pct(j.hourly.soil_moisture_3_to_9cm[i]), soilRootPct: pct(j.hourly.soil_moisture_9_to_27cm[i]),
    rainPast7Mm: Math.round(p.slice(0, 7).reduce((a, b) => a + b, 0)), rainNext7Mm: Math.round(p.slice(7).reduce((a, b) => a + b, 0)),
  };
}

function health(s: Point[]) {
  if (!s.length) return { label: 'unknown', score: null as number | null, trend: 'flat' };
  const last = s[s.length - 1], prev = s[Math.max(0, s.length - 3)];
  const score = Math.round(Math.max(0, Math.min(100, (last.ndvi / 0.75) * 100)));
  const diff = last.ndvi - prev.ndvi;
  return { label: last.ndvi >= 0.5 ? 'good' : last.ndvi >= 0.3 ? 'watch' : 'poor', score, trend: diff > 0.05 ? 'up' : diff < -0.07 ? 'down' : 'flat' };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const id = (await params).id;
  const lang = req.nextUrl.searchParams.get('lang') === 'hi' ? 'hi' : 'en';
  const f = await getField(user.id, id);
  if (!f) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const key = `${id}:${lang}`, hit = cache.get(key);
  if (hit && Date.now() - hit.at < 6 * 3600_000 && !req.nextUrl.searchParams.has('fresh')) return NextResponse.json(hit.data);

  const lat = f.ring.reduce((a, p) => a + p[1], 0) / f.ring.length, lon = f.ring.reduce((a, p) => a + p[0], 0) / f.ring.length;
  const notes: string[] = [];
  const [series, soil] = await Promise.all([
    satelliteConfigured() ? satelliteSeries(f.ring).catch((e) => { notes.push('satellite: ' + (e instanceof Error ? e.message : 'failed')); return [] as Point[]; }) : Promise.resolve([] as Point[]),
    ground(lat, lon).catch(() => { notes.push('weather unavailable'); return null; }),
  ]);
  if (!satelliteConfigured()) notes.push('satellite_not_configured');

  const das = f.sowingDate ? Math.max(0, Math.floor((Date.now() - new Date(f.sowingDate).getTime()) / 86400_000)) : null;
  const h = health(series);
  let advice: unknown = null;
  if (geminiConfigured() && (series.length || soil)) {
    try {
      advice = await geminiJson(ADVICE, [{ text: `Language: ${lang === 'hi' ? 'Hindi (Devanagari)' : 'English'}. Crop: ${f.crop || 'unknown'}. Days after sowing: ${das ?? 'unknown'}. Field size: ${f.areaAcre} acre.
Satellite (date, NDVI, NDMI): ${series.slice(-8).map((p) => `${p.date} ${p.ndvi} ${p.ndmi}`).join('; ') || 'not available'}.
Weather/soil now: ${soil ? JSON.stringify(soil) : 'not available'}.` }]);
    } catch (e) { notes.push('advice failed'); console.error('field advice failed:', e instanceof Error ? e.message : e); }
  }
  const data = { satellite: { available: series.length > 0, series }, soil, health: h, daysAfterSowing: das, advice, notes, updatedAt: new Date().toISOString() };
  cache.set(key, { at: Date.now(), data });
  return NextResponse.json(data);
}
