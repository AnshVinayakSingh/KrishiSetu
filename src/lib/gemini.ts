// Gemini (Google AI Studio key) via plain REST, no extra npm package needed.
// Model names change often, so set GEMINI_MODEL on Render. If it is missing/unavailable we try the fallbacks.
const DEFAULT_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-2.5-flash'];

export interface GeminiTurn { role: 'user' | 'assistant'; content: string }

const SYSTEM = `You are KrishiSetu AI, a friendly farming helper for Indian farmers.
Rules:
- Reply in the SAME language the farmer used (Hindi in Devanagari, English, Tamil, Telugu, Marathi, Bengali, Punjabi, Gujarati, Kannada, Malayalam, Odia, etc.). If the farmer writes Hindi in English letters (Hinglish), reply in simple Hindi in Devanagari.
- Use very simple words. Give practical steps for crops, soil, water, pests, weather, mandi and government schemes.
- Plain text only. No markdown, no asterisks, no headings, no emojis. Use short lines starting with "-" if a list is really needed.
- For pesticide or fertiliser, tell them to check the label dose and ask a local KVK or agriculture officer. For serious problems mention Kisan Call Centre 1800-180-1551.
- Never invent mandi prices, subsidy amounts or dates. If unsure, say so and tell them where to check.
- If the question is not about farming, rural life or KrishiSetu, politely steer back to farming.`;

export function geminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export const geminiModelName = () => process.env.GEMINI_MODEL || DEFAULT_MODELS[0];

export async function askGemini(opts: {
  query: string;
  history?: GeminiTurn[];
  voice?: boolean;          // spoken answer: shorter, no lists
  context?: { crop?: string; location?: string };
  languageName?: string;    // e.g. "Tamil" - only a hint, the farmer's own language still wins
}): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set');

  const extra: string[] = [];
  if (opts.context?.location) extra.push(`Farmer location: ${opts.context.location}.`);
  if (opts.context?.crop) extra.push(`Crop: ${opts.context.crop}.`);
  if (opts.languageName) extra.push(`The farmer is speaking ${opts.languageName}; answer in ${opts.languageName}.`);
  extra.push(opts.voice
    ? 'This answer will be read aloud: maximum 60 words, short sentences, no lists.'
    : 'Keep the answer under 130 words.');

  const contents = [
    ...(opts.history ?? []).slice(-8).map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    { role: 'user', parts: [{ text: opts.query }] },
  ];

  const models = [process.env.GEMINI_MODEL, ...DEFAULT_MODELS].filter((m, i, a): m is string => Boolean(m) && a.indexOf(m) === i);
  let lastErr = 'unknown';

  for (const model of models) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25_000);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: `${SYSTEM}\n${extra.join('\n')}` }] },
          contents,
          generationConfig: { maxOutputTokens: 4096 },
        }),
        signal: ctrl.signal,
      });
      if (res.status === 404) { lastErr = `${model}: model not found`; continue; } // not available for this key -> try the next one
      if (!res.ok) {
        const e = await res.json().catch(() => null);
        const why = String(e?.error?.message ?? '').slice(0, 140);
        if (res.status === 400 && /api key/i.test(why)) throw new Error('Gemini API key is not valid');
        if (res.status === 400) { lastErr = `${model}: ${why || 'bad request'}`; continue; }
        if (res.status === 401 || res.status === 403) throw new Error(`Gemini key rejected (HTTP ${res.status}). Check the key and that the Gemini API is enabled. ${why}`);
        if (res.status === 429) throw new Error('Gemini free limit reached. Wait a minute and try again.');
        throw new Error(`Gemini HTTP ${res.status} ${why}`);
      }
      const j = await res.json();
      const text = (j?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? '').join('').trim();
      if (text) return text;
      lastErr = `${model}: empty answer`;
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(`Gemini failed (${lastErr})`);
}

// Remove markdown so chat bubbles and speech sound clean.
export const plain = (s: string) => s.replace(/\*\*/g, '').replace(/[*_`#]/g, '').replace(/\n{3,}/g, '\n\n').trim();
