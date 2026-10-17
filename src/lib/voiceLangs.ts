// Pure language data shared by the browser widget and the server (no secrets here).
export interface VoiceLang { code: string; label: string; native: string; tts: boolean }

// "tts" = Sarvam Bulbul can speak this language back.
export const VOICE_LANGS: VoiceLang[] = [
  { code: 'unknown', label: 'Auto detect', native: 'Auto', tts: false },
  { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी', tts: true },
  { code: 'en-IN', label: 'English', native: 'English', tts: true },
  { code: 'mr-IN', label: 'Marathi', native: 'मराठी', tts: true },
  { code: 'gu-IN', label: 'Gujarati', native: 'ગુજરાતી', tts: true },
  { code: 'pa-IN', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', tts: true },
  { code: 'bn-IN', label: 'Bengali', native: 'বাংলা', tts: true },
  { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்', tts: true },
  { code: 'te-IN', label: 'Telugu', native: 'తెలుగు', tts: true },
  { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ', tts: true },
  { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം', tts: true },
  { code: 'od-IN', label: 'Odia', native: 'ଓଡ଼ିଆ', tts: true },
];

export const ttsSupported = (code: string) => VOICE_LANGS.some((l) => l.code === code && l.tts);
export const langLabel = (code: string) => VOICE_LANGS.find((l) => l.code === code)?.label;

// Which language is this text written in? Decided from the script, so the reply is spoken in the right voice.
export function guessLang(text: string, hint?: string): string {
  const ranges: [RegExp, string][] = [
    [/[\u0900-\u097F]/, 'hi-IN'], [/[\u0980-\u09FF]/, 'bn-IN'], [/[\u0A00-\u0A7F]/, 'pa-IN'], [/[\u0A80-\u0AFF]/, 'gu-IN'],
    [/[\u0B00-\u0B7F]/, 'od-IN'], [/[\u0B80-\u0BFF]/, 'ta-IN'], [/[\u0C00-\u0C7F]/, 'te-IN'], [/[\u0C80-\u0CFF]/, 'kn-IN'], [/[\u0D00-\u0D7F]/, 'ml-IN'],
  ];
  const hit = ranges.find(([re]) => re.test(text))?.[1] ?? 'en-IN';
  return hit === 'hi-IN' && hint === 'mr-IN' ? 'mr-IN' : hit; // Marathi shares the Devanagari script with Hindi
}
