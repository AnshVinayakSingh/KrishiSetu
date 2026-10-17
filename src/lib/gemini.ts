// Gemini (Google AI Studio key) via plain REST. Supports normal and streaming answers.
// Set GEMINI_MODEL in .env.local. If it is missing/unavailable we try the fallbacks.
const DEFAULT_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.5-flash-lite'];

export interface GeminiTurn { role: 'user' | 'assistant'; content: string }

const SYSTEM = `You are Setu AI, the friendly farming assistant inside the KrishiSetu app for Indian farmers.
Rules:
- Reply in the SAME language the farmer used (Hindi in Devanagari, English, Tamil, Telugu, Marathi, Bengali, Punjabi, Gujarati, Kannada, Malayalam, Odia). If the farmer writes Hindi in English letters (Hinglish), reply in simple Hindi in Devanagari.
- Answer the actual question directly in the first line, then give practical steps. Use very simple words, like a helpful village agriculture officer.
- Cover crops, soil, water, pests, weather, mandi, farm loans and government schemes (PM-KISAN, PMFBY, KCC, PMKSY, PM-KUSUM, e-NAM, Soil Health Card).
- For pesticide or fertiliser, say to follow the label dose and ask the local KVK. For serious problems mention Kisan Call Centre 1800-180-1551.
- Never invent mandi prices, subsidy amounts or dates. If unsure, say so and tell them where to check (official portal, KVK, CSC).
- If the question is not about farming or rural life, politely steer back to farming.`;

const CHAT_STYLE = `Format: short answer. You may use **bold** for key words and "-" bullets or "1." steps. No headings, no tables, no emojis. Keep it under 170 words unless the farmer asks for detail.`;
const VOICE_STYLE = `This answer will be read aloud: plain text only, no symbols, no lists, short sentences, maximum 55 words.`;

export const geminiConfigured = () => Boolean(process.env.GEMINI_API_KEY);
export const geminiModelName = () => process.env.GEMINI_MODEL || DEFAULT_MODELS[0];

interface Opts {
  query: string;
  history?: GeminiTurn[];
  voice?: boolean;
  context?: { crop?: string; location?: string };
  languageName?: string;
}

function buildBody(o: Opts, thinkingOff: boolean) {
  const extra: string[] = [];
  if (o.context?.location) extra.push(`Farmer location: ${o.context.location}.`);
  if (o.context?.crop) extra.push(`Crop: ${o.context.crop}.`);
  if (o.languageName) extra.push(`The farmer is speaking ${o.languageName}; answer in ${o.languageName}.`);
  extra.push(o.voice ? VOICE_STYLE : CHAT_STYLE);
  const contents = [
    ...(o.history ?? []).slice(-10).map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    { role: 'user', parts: [{ text: o.query }] },
  ];
  return {
    systemInstruction: { parts: [{ text: `${SYSTEM}\n${extra.join('\n')}` }] },
    contents,
    generationConfig: {
      maxOutputTokens: o.voice ? 300 : 900,
      temperature: 0.5,
      ...(thinkingOff ? { thinkingConfig: { thinkingBudget: 0 } } : {}), // no "thinking" = much faster first word
    },
  };
}

// Opens a Gemini response, trying models in order. Returns the live Response.
async function open(o: Opts, stream: boolean, signal: AbortSignal): Promise<Response> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set');
  const models = [process.env.GEMINI_MODEL, ...DEFAULT_MODELS].filter((m, i, a): m is string => Boolean(m) && a.indexOf(m) === i);
  const method = stream ? 'streamGenerateContent?alt=sse' : 'generateContent';
  let lastErr = 'unknown';

  for (const model of models) {
    for (const thinkingOff of [true, false]) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(buildBody(o, thinkingOff)),
        signal,
      });
      if (res.ok) return res;
      const e = await res.json().catch(() => null);
      const why = String(e?.error?.message ?? '').slice(0, 140);
      if (res.status === 404) { lastErr = `${model}: model not found`; break; }
      if (res.status === 400) {
        if (/api key/i.test(why)) throw new Error('Gemini API key is not valid');
        lastErr = `${model}: ${why || 'bad request'}`;
        continue; // retry once without thinkingConfig, then next model
      }
      if (res.status === 401 || res.status === 403) throw new Error(`Gemini key rejected (HTTP ${res.status}). ${why}`);
      if (res.status === 429) throw new Error('Gemini free limit reached. Wait a minute and try again.');
      throw new Error(`Gemini HTTP ${res.status} ${why}`);
    }
  }
  throw new Error(`Gemini failed (${lastErr})`);
}

const textOf = (j: { candidates?: { content?: { parts?: { text?: string }[] } }[] }) =>
  (j?.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('');

export async function askGemini(o: Opts): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25_000);
  try {
    const res = await open(o, false, ctrl.signal);
    const text = textOf(await res.json()).trim();
    if (!text) throw new Error('Gemini gave an empty answer');
    return text;
  } finally { clearTimeout(timer); }
}

// Yields text pieces as soon as Gemini produces them.
export async function* streamGemini(o: Opts): AsyncGenerator<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 40_000);
  try {
    const res = await open(o, true, ctrl.signal);
    const reader = res.body!.getReader();
    const dec = new TextDecoder();
    let buf = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line.startsWith('data:')) continue;
        try { const t = textOf(JSON.parse(line.slice(5))); if (t) yield t; } catch { /* partial line */ }
      }
    }
  } finally { clearTimeout(timer); }
}

// Remove markdown so speech and plain bubbles sound clean.
export const plain = (s: string) => s.replace(/\*\*/g, '').replace(/[*_`#]/g, '').replace(/\n{3,}/g, '\n\n').trim();
