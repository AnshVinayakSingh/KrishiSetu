import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { sarvamConfigured, speechToText, VOICE_LANGS } from '@/lib/sarvam';
import { tooMany } from '@/lib/rateLimit';

const MAX_BYTES = 5 * 1024 * 1024;

// Browser recording (webm/mp4/ogg) -> text, using Sarvam speech-to-text.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!sarvamConfigured()) return NextResponse.json({ error: 'voice_not_configured' }, { status: 503 });
  if (tooMany(`stt:${user.id}`, 15)) return NextResponse.json({ error: 'slow_down' }, { status: 429 });

  try {
    const form = await req.formData();
    const file = form.get('audio');
    if (!(file instanceof Blob) || file.size === 0) return NextResponse.json({ error: 'no_audio' }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'audio_too_long' }, { status: 413 });
    const asked = String(form.get('language') ?? 'unknown');
    const language = VOICE_LANGS.some((l) => l.code === asked) ? asked : 'unknown';
    const name = (file as File).name || 'speech.webm';
    const out = await speechToText(file, name, language);
    return NextResponse.json(out);
  } catch (e) {
    console.error('transcribe failed:', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'transcribe_failed' }, { status: 502 });
  }
}
