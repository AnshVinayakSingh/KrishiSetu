import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { geminiConfigured, geminiJson } from '@/lib/gemini';
import { tooMany } from '@/lib/rateLimit';

const SYSTEM = `You are Setu AI, a weather advisor for Indian farmers. You get REAL weather numbers (current, past 7 days, next 7 days). Analyse them and return ONLY JSON:
{"headline":string (one short line on the week),"alerts":[{"level":"high"|"medium"|"low","text":string}] (0-3: heavy rain, heatwave, frost, strong wind, dry spell),
"advice":[{"title":string,"text":string}] (4 items covering: irrigation, spraying/fertiliser timing, sowing/harvest/drying, and one safety/crop-protection tip)}
Rules: use only the numbers given, mention actual days (e.g. "Thursday"); very simple words; no invented data; if a crop is given tailor to it. Write in the requested language.`;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!geminiConfigured()) return NextResponse.json({ error: 'gemini_not_configured' }, { status: 503 });
  if (tooMany(`wadv:${user.id}`, 10)) return NextResponse.json({ error: 'slow_down' }, { status: 429 });
  try {
    const b = await req.json();
    const w = b.weather;
    const day = (d: { date: string; tempMax: number; tempMin: number; rainProb: number | null; rainMm: number; condition: string }) =>
      `${d.date} ${d.tempMax}/${d.tempMin}C rain ${d.rainProb ?? '-'}% ${d.rainMm}mm ${d.condition}`;
    const text = `Language: ${b.language === 'hi' ? 'Hindi (Devanagari)' : 'English'}. Location: ${String(b.location ?? 'India').slice(0, 60)}.${b.crop ? ` Crop: ${String(b.crop).slice(0, 40)}.` : ''}
Now: ${w.current.temp}C, humidity ${w.current.humidity}%, wind ${w.current.wind} km/h, ${w.current.condition}.
Past 7 days:\n${w.past.map(day).join('\n')}
Next 7 days:\n${[w.today, ...w.next].map(day).join('\n')}`;
    return NextResponse.json({ success: true, result: await geminiJson(SYSTEM, [{ text }]) });
  } catch (e) {
    console.error('weather advice failed:', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'failed' }, { status: 502 });
  }
}
