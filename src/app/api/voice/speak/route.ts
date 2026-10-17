import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { sarvamConfigured, textToSpeech, ttsSupported } from '@/lib/sarvam';
import { tooMany } from '@/lib/rateLimit';


// Text -> spoken audio (WAV), using Sarvam Bulbul.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!sarvamConfigured()) return NextResponse.json({ error: 'voice_not_configured' }, { status: 503 });
  if (tooMany(`tts:${user.id}`, 20)) return NextResponse.json({ error: 'slow_down' }, { status: 429 });

  try {
    const b = await req.json();
    const code = String(b.languageCode ?? 'hi-IN');
    const text = String(b.text ?? '').replace(/[*_`#]/g, '').trim();
    if (!text) return NextResponse.json({ error: 'no_text' }, { status: 400 });
    if (!ttsSupported(code)) return NextResponse.json({ error: 'language_not_spoken' }, { status: 422 });
    const audio = await textToSpeech(text, code);
    return new NextResponse(new Uint8Array(audio), { headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('speak failed:', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'speak_failed' }, { status: 502 });
  }
}
