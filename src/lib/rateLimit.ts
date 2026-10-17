// Tiny in-memory limiter (per server instance). Protects the Gemini / Sarvam keys from being hammered.
const hits = new Map<string, number[]>();

export function tooMany(key: string, max = 20, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    hits.set(key, arr);
    return true;
  }
  arr.push(now);
  hits.set(key, arr);
  return false;
}
