'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bot, Download, History, MessageCircle, Mic, Plus, Send, Square, Volume2, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { guessLang, VOICE_LANGS } from '@/lib/voiceLangs';

type Mode = 'chat' | 'voice';
interface Msg { role: 'user' | 'ai'; text: string }
interface Session { convId?: string; msgs: Msg[] }
interface HistItem { id: string; title: string; updatedAt: string }
type Phase = 'idle' | 'recording' | 'thinking' | 'speaking';

const MAX_RECORD_SECONDS = 25; // Sarvam's quick speech-to-text handles up to 30 seconds
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';

const TEXT = {
  en: {
    title: 'KrishiSetu AI', open: 'Ask AI', close: 'Close', chat: 'Chat', voice: 'Voice',
    hint: 'Ask anything about your farming:', placeholder: 'Type your question…', send: 'Send',
    thinking: 'Thinking…', tapToSpeak: 'Tap the mic and speak', listening: 'Listening… tap to stop', speaking: 'Speaking… tap to stop',
    voiceHint: 'Speak in your own language. Pick one below or leave it on Auto.',
    history: 'Recent', historyChat: 'Last 5 chats', historyVoice: 'Last 5 voice talks', empty: 'Nothing saved yet', backup: 'Download backup', newChat: 'New',
    full: 'Open full assistant', listen: 'Listen',
    errGeneric: 'Something went wrong. Please try again.', basic: 'Basic mode', errMic: 'Microphone is blocked. Allow it in your browser settings.',
    errHear: 'Could not hear anything. Please try again.', errVoice: 'Voice is not available right now. You can still type.', errBusy: 'Too many requests. Wait a minute.',
  },
  hi: {
    title: 'कृषिसेतु AI', open: 'AI से पूछें', close: 'बंद करें', chat: 'चैट', voice: 'आवाज़',
    hint: 'अपनी खेती से जुड़ा कोई भी सवाल पूछें:', placeholder: 'सवाल लिखें…', send: 'भेजें',
    thinking: 'सोच रहा हूँ…', tapToSpeak: 'माइक दबाकर बोलें', listening: 'सुन रहा हूँ… रोकने के लिए दबाएँ', speaking: 'बोल रहा हूँ… रोकने के लिए दबाएँ',
    voiceHint: 'अपनी भाषा में बोलें। नीचे भाषा चुनें या Auto रहने दें।',
    history: 'पुराने', historyChat: 'पिछली 5 चैट', historyVoice: 'पिछली 5 आवाज़ बातें', empty: 'अभी कुछ सेव नहीं है', backup: 'बैकअप डाउनलोड', newChat: 'नया',
    full: 'पूरा AI सहायक खोलें', listen: 'सुनें',
    errGeneric: 'कुछ गड़बड़ हुई, दोबारा कोशिश करें।', basic: 'बेसिक मोड', errMic: 'माइक बंद है। ब्राउज़र सेटिंग में अनुमति दें।',
    errHear: 'कुछ सुनाई नहीं दिया। दोबारा बोलें।', errVoice: 'अभी आवाज़ उपलब्ध नहीं है। आप लिखकर पूछ सकते हैं।', errBusy: 'बहुत ज़्यादा अनुरोध। एक मिनट रुकें।',
  },
} as const;

const EMPTY: Record<Mode, Session> = { chat: { msgs: [] }, voice: { msgs: [] } };

export default function ChatDock() {
  const { language } = useLanguage();
  const { place } = useLocation();
  const hi = language === 'hi';
  const T = hi ? TEXT.hi : TEXT.en;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const [sessions, setSessions] = useState<Record<Mode, Session>>(EMPTY);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [hist, setHist] = useState<Record<Mode, HistItem[]>>({ chat: [], voice: [] });

  const [voiceLang, setVoiceLang] = useState('unknown');
  const [phase, setPhase] = useState<Phase>('idle');
  const [seconds, setSeconds] = useState(0);

  const endRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const sessionsRef = useRef(sessions);
  useEffect(() => { sessionsRef.current = sessions; }, [sessions]);

  const session = sessions[mode];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [sessions, open, mode, busy, phase]);

  const stopAudio = useCallback(() => {
    const a = audioRef.current;
    if (a) { a.pause(); a.currentTime = 0; }
  }, []);

  const releaseMic = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => { releaseMic(); stopAudio(); }, [releaseMic, stopAudio]);

  const patch = (m: Mode, fn: (s: Session) => Session) =>
    setSessions((all) => ({ ...all, [m]: fn(all[m]) }));

  const fail = (code?: string, status?: number) => {
    if (status === 429) return setError(T.errBusy);
    if (status === 503 || code === 'voice_not_configured') return setError(T.errVoice);
    setError(T.errGeneric);
  };

  // ---- talk to Gemini through /api/assistant ----
  const ask = async (text: string, m: Mode, langCode?: string): Promise<string | null> => {
    patch(m, (s) => ({ ...s, msgs: [...s.msgs, { role: 'user', text }] }));
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text, language, langCode, mode: m, persist: true,
          conversationId: sessionsRef.current[m].convId,
          context: { location: place ? `${place.city}, ${place.state}` : undefined },
        }),
      });
      const j = await res.json();
      if (!res.ok || !j.success) { fail(undefined, res.status); return null; }
      const answer = String(j.response ?? '').trim() || (hi ? 'जवाब नहीं मिला' : 'No answer');
      if (j.aiNote) setError(`${T.basic}: ${j.aiNote}`); // tells the real reason when Gemini is not answering
      patch(m, (s) => ({ convId: j.conversationId ?? s.convId, msgs: [...s.msgs, { role: 'ai', text: answer }] }));
      return answer;
    } catch {
      fail();
      return null;
    }
  };

  // ---- Sarvam text-to-speech ----
  const speak = async (text: string, hint?: string) => {
    try {
      const res = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, languageCode: guessLang(text, hint) }),
      });
      if (!res.ok) {
        if (res.status === 422) return; // this language cannot be spoken, the text is enough
        const j = await res.json().catch(() => ({}));
        return fail(j.error, res.status);
      }
      const url = URL.createObjectURL(await res.blob());
      const a = audioRef.current ?? new Audio();
      audioRef.current = a;
      a.src = url;
      setPhase('speaking');
      a.onended = () => { setPhase('idle'); URL.revokeObjectURL(url); };
      a.onerror = () => setPhase('idle');
      await a.play();
    } catch {
      setPhase('idle');
    }
  };

  // ---- chat tab ----
  const sendChat = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setError(''); setInput(''); setBusy(true);
    await ask(q, 'chat');
    setBusy(false);
  };

  // ---- voice tab ----
  const finishRecording = async (blob: Blob, ext: string) => {
    setPhase('thinking');
    try {
      const fd = new FormData();
      fd.append('audio', blob, `speech.${ext}`);
      fd.append('language', voiceLang);
      const res = await fetch('/api/voice/transcribe', { method: 'POST', body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setPhase('idle'); return fail(j.error, res.status); }
      const said = String(j.transcript ?? '').trim();
      if (!said) { setPhase('idle'); return setError(T.errHear); }
      const code = String(j.languageCode ?? '');
      const answer = await ask(said, 'voice', code || undefined);
      if (answer) await speak(answer, code);
      else setPhase('idle');
      setPhase((p) => (p === 'speaking' ? p : 'idle'));
    } catch {
      setPhase('idle');
      fail();
    }
  };

  const stopRecording = () => {
    if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
  };

  const startRecording = async () => {
    setError('');
    // Unlock audio playback inside this tap so the spoken reply is allowed to play later (needed on phones).
    const a = audioRef.current ?? new Audio();
    audioRef.current = a;
    a.src = SILENT_WAV;
    a.play().catch(() => {});
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        releaseMic();
        const type = rec.mimeType || mime || 'audio/webm';
        const ext = type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm';
        finishRecording(new Blob(chunksRef.current, { type }), ext);
      };
      recRef.current = rec;
      rec.start();
      setPhase('recording');
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_RECORD_SECONDS) stopRecording();
          return s + 1;
        });
      }, 1000);
    } catch {
      releaseMic();
      setPhase('idle');
      setError(T.errMic);
    }
  };

  const onMic = () => {
    if (phase === 'recording') return stopRecording();
    if (phase === 'speaking') { stopAudio(); return setPhase('idle'); }
    if (phase === 'idle') startRecording();
  };

  // ---- history + backup (last 5 chats, last 5 voice talks) ----
  const loadHistory = async () => {
    try {
      const [c, v] = await Promise.all([
        fetch('/api/conversations?mode=chat').then((r) => (r.ok ? r.json() : { conversations: [] })),
        fetch('/api/conversations?mode=voice').then((r) => (r.ok ? r.json() : { conversations: [] })),
      ]);
      setHist({ chat: c.conversations ?? [], voice: v.conversations ?? [] });
    } catch { /* keep old list */ }
  };

  const toggleHistory = () => { if (!showHistory) loadHistory(); setShowHistory((v) => !v); };

  const openOld = async (m: Mode, id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (!res.ok) return;
      const j = await res.json();
      const msgs: Msg[] = (j.messages ?? []).map((x: { role: string; content: string }) => ({ role: x.role === 'assistant' ? 'ai' : 'user', text: x.content }));
      patch(m, () => ({ convId: id, msgs }));
      setMode(m); setShowHistory(false); setError('');
    } catch { /* ignore */ }
  };

  const newSession = () => { stopAudio(); setPhase('idle'); patch(mode, () => ({ msgs: [] })); setError(''); setShowHistory(false); };

  const chips = hi
    ? ['पत्ती पीली क्यों हो रही है?', 'ड्रिप सिंचाई सब्सिडी', 'बारिश से पहले क्या करें?']
    : ['Why are leaves yellow?', 'Drip irrigation subsidy', 'What to do before rain?'];

  const status = phase === 'recording' ? `${T.listening} (0:${String(seconds).padStart(2, '0')})`
    : phase === 'thinking' ? T.thinking
    : phase === 'speaking' ? T.speaking
    : T.tapToSpeak;

  // ---- closed state: one small button ----
  if (!open) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#14532D] text-white text-xs font-bold shadow-lg hover:bg-[#123B2A] focus:outline-none focus:ring-2 focus:ring-[#86B96B]">
          <Bot className="w-4 h-4 text-[#86B96B]" />{T.open}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="w-[calc(100vw-2rem)] sm:w-[22rem] h-[min(34rem,calc(100vh-2rem))] flex flex-col rounded-2xl bg-white border border-[#E2E8DF] shadow-xl overflow-hidden">
        {/* header */}
        <div className="px-3 py-2.5 bg-[#14532D] text-white flex items-center justify-between">
          <span className="text-xs font-bold flex items-center gap-2"><Bot className="w-4 h-4 text-[#86B96B]" />{T.title}</span>
          <div className="flex items-center gap-1">
            <button onClick={newSession} aria-label={T.newChat} title={T.newChat} className="p-1.5 rounded-lg hover:bg-white/10"><Plus className="w-4 h-4" /></button>
            <button onClick={toggleHistory} aria-label={T.history} title={T.history} className={`p-1.5 rounded-lg hover:bg-white/10 ${showHistory ? 'bg-white/15' : ''}`}><History className="w-4 h-4" /></button>
            <button onClick={() => { stopAudio(); stopRecording(); setOpen(false); }} aria-label={T.close} className="p-1.5 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* tabs */}
        <div className="grid grid-cols-2 gap-1 p-1.5 bg-[#EEF3EA]">
          {(['chat', 'voice'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setShowHistory(false); setError(''); }}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold ${mode === m ? 'bg-white text-[#14532D] shadow-sm' : 'text-[#66746A] hover:text-[#14532D]'}`}
            >
              {m === 'chat' ? <MessageCircle className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              {m === 'chat' ? T.chat : T.voice}
            </button>
          ))}
        </div>

        {/* body */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-[#F8F7F0]">
            {(['chat', 'voice'] as Mode[]).map((m) => (
              <div key={m}>
                <p className="text-[11px] font-semibold text-[#66746A] mb-1.5">{m === 'chat' ? T.historyChat : T.historyVoice}</p>
                {hist[m].length === 0 && <p className="text-[11px] text-[#66746A]">{T.empty}</p>}
                <div className="space-y-1.5">
                  {hist[m].map((h) => (
                    <button key={h.id} onClick={() => openOld(m, h.id)} className="w-full text-left px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] hover:border-[#14532D]">
                      <span className="block text-xs text-[#17251D] truncate">{h.title}</span>
                      <span className="block text-[10px] text-[#66746A]">{new Date(h.updatedAt).toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <a href="/api/conversations/backup" download className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-[#14532D] text-[#14532D] text-xs font-semibold hover:bg-[#EEF3EA]">
              <Download className="w-3.5 h-3.5" />{T.backup}
            </a>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#F8F7F0]">
            {session.msgs.length === 0 && (
              mode === 'chat' ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-[#66746A]">{T.hint}</p>
                  {chips.map((c) => (
                    <button key={c} onClick={() => sendChat(c)} className="block w-full text-left text-xs px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-[#14532D] hover:border-[#14532D]">{c}</button>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#66746A]">{T.voiceHint}</p>
              )
            )}
            {session.msgs.map((m, i) => (
              <div key={i} className={`flex items-end gap-1 ${m.role === 'user' ? 'justify-end' : ''}`}>
                <div className={`max-w-[88%] px-3 py-2 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed ${m.role === 'user' ? 'bg-[#14532D] text-white' : 'bg-white border border-[#E2E8DF] text-[#17251D]'}`}>{m.text}</div>
                {m.role === 'ai' && (
                  <button onClick={() => { stopAudio(); speak(m.text, voiceLang); }} aria-label={T.listen} title={T.listen} className="p-1 text-[#66746A] hover:text-[#14532D]"><Volume2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            ))}
            {busy && <div className="text-[11px] text-[#66746A] px-1">{T.thinking}</div>}
            <div ref={endRef} />
          </div>
        )}

        {error && <div role="alert" className="px-3 py-1.5 text-[11px] text-[#B91C1C] bg-[#FEF2F2] border-t border-[#FECACA]">{error}</div>}

        {/* footer controls */}
        <div className="p-2 border-t border-[#E2E8DF] bg-white">
          {mode === 'chat' ? (
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChat(input)}
                placeholder={T.placeholder}
                className="flex-1 min-w-0 text-xs px-3 py-2 rounded-xl border border-[#E2E8DF] focus:outline-none focus:border-[#14532D]"
              />
              <button onClick={() => sendChat(input)} disabled={busy || !input.trim()} className="p-2 rounded-xl bg-[#14532D] text-white disabled:opacity-50" aria-label={T.send}><Send className="w-4 h-4" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <select
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value)}
                disabled={phase !== 'idle'}
                aria-label="Language"
                className="text-xs px-2 py-2 rounded-xl border border-[#E2E8DF] bg-white text-[#17251D] focus:outline-none focus:border-[#14532D] max-w-[7.5rem]"
              >
                {VOICE_LANGS.map((l) => <option key={l.code} value={l.code}>{l.code === 'unknown' ? 'Auto' : `${l.native}`}</option>)}
              </select>
              <button
                onClick={onMic}
                disabled={phase === 'thinking'}
                aria-label={status}
                className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#86B96B] ${phase === 'recording' ? 'bg-[#DC2626] animate-pulse-subtle' : 'bg-[#14532D] hover:bg-[#123B2A]'}`}
              >
                {phase === 'recording' || phase === 'speaking' ? <Square className="w-5 h-5" fill="currentColor" /> : <Mic className="w-6 h-6" />}
              </button>
              <p className="flex-1 text-[11px] leading-snug text-[#66746A]">{status}</p>
            </div>
          )}
          <Link href="/assistant" className="block text-center text-[10px] text-[#228B52] font-semibold mt-1.5 hover:underline">{T.full} →</Link>
        </div>
      </div>
    </div>
  );
}
