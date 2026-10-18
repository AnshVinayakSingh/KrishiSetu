import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { geminiConfigured, geminiJson } from '@/lib/gemini';
import { tooMany } from '@/lib/rateLimit';

const SYSTEM = `You are Setu AI crop doctor for Indian small farmers. Look at the crop photo and return ONLY JSON:
{"isPlant":boolean,"crop":string,"problem":string,"severity":"low"|"medium"|"high","confidence":number 0-100,
"summary":string (2 simple sentences),"symptoms":string[],"causes":string[],
"homeRemedies":[{"name":string,"how":string}],
"medicines":[{"name":string (chemical/bio-product generic name),"use":string,"dose":string,"costInr":number}],
"extraCrops":[{"name":string,"why":string}] (companion, trap or rotation crops that reduce this problem),
"cost":{"homeInr":number,"medicineInr":number,"labourInr":number,"totalInr":number,"note":string} (estimate per acre in rupees),
"prevention":string[],"seeExpert":string}
Rules: very simple words; if photo is not a plant or too unclear set isPlant=false and explain in summary; if unsure lower confidence and say so; 3-5 items per list; dose "as per product label" is fine, never invent exact doses; costs are rough India market estimates. Write every text value in the requested language.`;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!geminiConfigured()) return NextResponse.json({ error: 'gemini_not_configured' }, { status: 503 });
  if (tooMany(`dis:${user.id}`, 8)) return NextResponse.json({ error: 'slow_down' }, { status: 429 });
  try {
    const b = await req.json();
    const image = String(b.image ?? '');
    const mime = /^image\/(jpeg|png|webp)$/.test(b.mime) ? b.mime : 'image/jpeg';
    if (!image || image.length > 6_000_000) return NextResponse.json({ error: 'bad_image' }, { status: 400 });
    const lang = b.language === 'hi' ? 'Hindi (Devanagari)' : 'English';
    const note = String(b.note ?? '').slice(0, 300);
    const result = await geminiJson(SYSTEM, [
      { inlineData: { mimeType: mime, data: image } },
      { text: `Language: ${lang}.${b.crop ? ` Farmer says crop is ${String(b.crop).slice(0, 40)}.` : ''}${note ? ` Farmer note: ${note}` : ''}${b.location ? ` Location: ${String(b.location).slice(0, 60)}.` : ''}` },
    ]);
    return NextResponse.json({ success: true, result });
  } catch (e) {
    console.error('disease failed:', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'analysis_failed' }, { status: 502 });
  }
}
