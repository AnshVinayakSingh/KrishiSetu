// Sarvam AI voice: speech-to-text (Saaras) and text-to-speech (Bulbul). Key goes in SARVAM_API_KEY.
const BASE = 'https://api.sarvam.ai';

export { VOICE_LANGS, ttsSupported, langLabel } from './voiceLangs';

export const sarvamConfigured = () => Boolean(process.env.SARVAM_API_KEY);

export async function speechToText(audio: Blob, filename: string, languageCode: string) {
  const key = process.env.SARVAM_API_KEY;
  if (!key) throw new Error('SARVAM_API_KEY is not set');
  const fd = new FormData();
  fd.append('file', audio, filename);
  fd.append('language_code', languageCode || 'unknown');
  if (process.env.SARVAM_STT_MODEL) fd.append('model', process.env.SARVAM_STT_MODEL); // default = Sarvam's latest
  const res = await fetch(`${BASE}/speech-to-text`, { method: 'POST', headers: { 'api-subscription-key': key }, body: fd });
  if (!res.ok) throw new Error(`Sarvam STT HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = (await res.json()) as { transcript?: string; language_code?: string | null };
  return { transcript: (j.transcript ?? '').trim(), languageCode: j.language_code ?? (languageCode !== 'unknown' ? languageCode : 'hi-IN') };
}

export async function textToSpeech(text: string, languageCode: string): Promise<Buffer> {
  const key = process.env.SARVAM_API_KEY;
  if (!key) throw new Error('SARVAM_API_KEY is not set');
  const res = await fetch(`${BASE}/text-to-speech`, {
    method: 'POST',
    headers: { 'api-subscription-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text.slice(0, 2000),
      language_code: languageCode,
      speaker: process.env.SARVAM_TTS_SPEAKER || 'shubh',
      model: process.env.SARVAM_TTS_MODEL || 'bulbul:v3',
    }),
  });
  if (!res.ok) throw new Error(`Sarvam TTS HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = (await res.json()) as { audios?: string[] };
  if (!j.audios?.[0]) throw new Error('Sarvam TTS returned no audio');
  return Buffer.from(j.audios[0], 'base64');
}
