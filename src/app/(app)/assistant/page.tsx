'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUp, Menu, MessageSquare, Mic, Plus, Sparkles, Square, Trash2, Volume2, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { useUser } from '@/context/UserContext';
import { guessLang, VOICE_LANGS } from '@/lib/voiceLangs';

type Mode = 'chat' | 'voice';
type Phase = 'idle' | 'recording' | 'thinking' | 'speaking';
interface Msg { role: 'user' | 'ai'; text: string }
interface Conv { id: string; title: string; updatedAt: string }

const MAX_REC = 25;
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';

const T = {
  en: {
    chat: 'Chat with Setu AI', voice: 'Voice assistant', newChat: 'New chat', history: 'History', none: 'No past chats yet',
    hello: 'Hello', ask: 'How can I help your farm today?', ph: 'Message Setu AI…', back: 'Dashboard',
    tap: 'Tap to speak', rec: 'Listening… tap to send', think: 'Thinking…', speak: 'Speaking… tap to stop',
    vhint: 'Speak in any Indian language', errGen: 'Something went wrong. Try again.', errMic: 'Microphone is blocked. Allow it in browser settings.',
    errHear: 'Could not hear you. Please try again.', errVoice: 'Voice is not set up yet (SARVAM_API_KEY missing).', errAi: 'AI is not set up yet (GEMINI_API_KEY missing).', errBusy: 'Too many requests. Wait a minute.',
    sugg: ['My wheat leaves are turning yellow', 'How to get PM-KISAN money?', 'Drip irrigation subsidy details', 'Prepare my field before heavy rain'],
    foot: 'Setu AI can make mistakes. Confirm doses with your KVK. Helpline 1800-180-1551.', del: 'Delete', listen: 'Listen',
  },
  hi: {
    chat: 'Setu AI से चैट', voice: 'वॉइस असिस्टेंट', newChat: 'नई चैट', history: 'पुरानी चैट', none: 'अभी कोई चैट नहीं',
    hello: 'नमस्ते', ask: 'आज खेती में मैं क्या मदद करूँ?', ph: 'Setu AI से पूछें…', back: 'डैशबोर्ड',
    tap: 'बोलने के लिए दबाएँ', rec: 'सुन रहा हूँ… भेजने के लिए दबाएँ', think: 'सोच रहा हूँ…', speak: 'बोल रहा हूँ… रोकने के लिए दबाएँ',
    vhint: 'किसी भी भारतीय भाषा में बोलें', errGen: 'कुछ गड़बड़ हुई, दोबारा कोशिश करें।', errMic: 'माइक बंद है। ब्राउज़र सेटिंग में अनुमति दें।',
    errHear: 'आवाज़ सुनाई नहीं दी। दोबारा बोलें।', errVoice: 'वॉइस अभी सेट नहीं है (SARVAM_API_KEY नहीं मिली)।', errAi: 'AI अभी सेट नहीं है (GEMINI_API_KEY नहीं मिली)।', errBusy: 'बहुत ज़्यादा अनुरोध, एक मिनट रुकें।',
    sugg: ['गेहूँ की पत्तियाँ पीली हो रही हैं', 'पीएम-किसान का पैसा कैसे मिलेगा?', 'ड्रिप सिंचाई पर सब्सिडी', 'भारी बारिश से पहले खेत की तैयारी'],
    foot: 'Setu AI गलती कर सकता है। दवा/खाद की मात्रा KVK से पूछें। हेल्पलाइन 1800-180-1551।', del: 'हटाएँ', listen: 'सुनें',
  },
} as const;

// Tiny markdown: **bold**, "- " bullets, "1." steps. No raw HTML, so it is safe.
function Rich({ text }: { text: string }) {
  const inline = (s: string) => s.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <React.Fragment key={i}>{p}</React.Fragment>));
  return (
    <div className="space-y-2">
      {text.split(/\n{2,}/).map((blk, bi) => {
        const lines = blk.split('\n').filter(Boolean);
        if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) return <ul key={bi} className="list-disc pl-5 space-y-1">{lines.map((l, i) => <li key={i}>{inline(l.replace(/^\s*[-•*]\s+/, ''))}</li>)}</ul>;
        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) return <ol key={bi} className="list-decimal pl-5 space-y-1">{lines.map((l, i) => <li key={i}>{inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>)}</ol>;
        return <p key={bi} className="whitespace-pre-line">{inline(blk.replace(/^#+\s*/gm, ''))}</p>;
      })}
    </div>
  );
}

export default function SetuAIPage() {
  const { language } = useLanguage();
  const { place } = useLocation();
  const user = useUser();
  const hi = language === 'hi';
  const L = hi ? T.hi : T.en;

  const [mode, setMode] = useState<Mode>('chat');
  const [side, setSide] = useState(false);
  const [convs, setConvs] = useState<Record<Mode, Conv[]>>({ chat: [], voice: [] });
  const [msgs, setMsgs] = useState<Record<Mode, Msg[]>>({ chat: [], voice: [] });
  const [convId, setConvId] = useState<Record<Mode, string | undefined>>({ chat: undefined, voice: undefined });
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [secs, setSecs] = useState(0);
  const [vlang, setVlang] = useState('unknown');

  const endRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunks = useRef<Blob[]>([]);
  const idRef = useRef(convId);
  useEffect(() => { idRef.current = convId; }, [convId]);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, mode, phase]);

  const loadConvs = useCallback(async () => {
    try {
      const [c, v] = await Promise.all(['chat', 'voice'].map((m) => fetch(`/api/conversations?mode=${m}`).then((r) => (r.ok ? r.json() : { conversations: [] }))));
      setConvs({ chat: c.conversations ?? [], voice: v.conversations ?? [] });
    } catch { /* keep old */ }
  }, []);
  useEffect(() => { loadConvs(); }, [loadConvs]);

  const stopAudio = useCallback(() => { const a = audioRef.current; if (a) { a.pause(); a.currentTime = 0; } }, []);
  const releaseMic = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    streamRef.current?.getTracks().forEach((t) => t.stop()); streamRef.current = null;
  }, []);
  useEffect(() => () => { releaseMic(); stopAudio(); }, [releaseMic, stopAudio]);

  const add = (m: Mode, ...x: Msg[]) => setMsgs((s) => ({ ...s, [m]: [...s[m], ...x] }));
  const fail = (code?: string, status?: number) => {
    if (status === 429) return setErr(L.errBusy);
    if (code === 'gemini_not_configured') return setErr(L.errAi);
    if (status === 503 || code === 'voice_not_configured') return setErr(L.errVoice);
    setErr(L.errGen);
  };
  const ctx = { location: place ? `${place.city}, ${place.state}` : undefined };

  // ---------- CHAT (streams word by word) ----------
  const sendChat = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setErr(''); setInput(''); setBusy(true);
    if (taRef.current) taRef.current.style.height = 'auto';
    setMsgs((s) => ({ ...s, chat: [...s.chat, { role: 'user', text: q }, { role: 'ai', text: '' }] }));
    try {
      const res = await fetch('/api/assistant/stream', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, conversationId: idRef.current.chat, context: ctx }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        setMsgs((s) => ({ ...s, chat: s.chat.slice(0, -1) }));
        return fail(j.error, res.status);
      }
      const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '', acc = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
          if (!line) continue;
          const o = JSON.parse(line);
          if (o.t) { acc += o.t; const cur = acc; setMsgs((s) => ({ ...s, chat: [...s.chat.slice(0, -1), { role: 'ai', text: cur }] })); }
          if (o.error) { setErr(L.errGen + ' ' + o.error); if (!acc) setMsgs((s) => ({ ...s, chat: s.chat.slice(0, -1) })); }
          if (o.done && o.conversationId) { setConvId((c) => ({ ...c, chat: o.conversationId })); loadConvs(); }
        }
      }
    } catch { setMsgs((s) => ({ ...s, chat: s.chat.filter((m) => m.text) })); fail(); }
    finally { setBusy(false); }
  };

  // ---------- VOICE ----------
  const speak = async (text: string, hint?: string) => {
    try {
      const res = await fetch('/api/voice/speak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, languageCode: guessLang(text, hint) }) });
      if (!res.ok) { if (res.status === 422) return setPhase('idle'); const j = await res.json().catch(() => ({})); setPhase('idle'); return fail(j.error, res.status); }
      const url = URL.createObjectURL(await res.blob());
      const a = audioRef.current ?? new Audio(); audioRef.current = a; a.src = url;
      setPhase('speaking');
      a.onended = () => { setPhase('idle'); URL.revokeObjectURL(url); };
      a.onerror = () => setPhase('idle');
      await a.play();
    } catch { setPhase('idle'); }
  };

  const finishRec = async (blob: Blob, ext: string) => {
    setPhase('thinking');
    try {
      const fd = new FormData(); fd.append('audio', blob, `speech.${ext}`); fd.append('language', vlang);
      const r = await fetch('/api/voice/transcribe', { method: 'POST', body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setPhase('idle'); return fail(j.error, r.status); }
      const said = String(j.transcript ?? '').trim();
      if (!said) { setPhase('idle'); return setErr(L.errHear); }
      const code = String(j.languageCode ?? '');
      add('voice', { role: 'user', text: said });
      const a = await fetch('/api/assistant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: said, language, langCode: code || undefined, mode: 'voice', persist: true, conversationId: idRef.current.voice, context: ctx }),
      });
      const d = await a.json().catch(() => ({}));
      if (!a.ok || !d.success) { setPhase('idle'); return fail(undefined, a.status); }
      const answer = String(d.response ?? '').trim();
      add('voice', { role: 'ai', text: answer });
      if (d.conversationId) { setConvId((c) => ({ ...c, voice: d.conversationId })); loadConvs(); }
      if (d.aiNote) setErr(d.aiNote);
      await speak(answer, code);
    } catch { setPhase('idle'); fail(); }
  };

  const stopRec = () => { if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop(); };
  const startRec = async () => {
    setErr('');
    const a = audioRef.current ?? new Audio(); audioRef.current = a; a.src = SILENT_WAV; a.play().catch(() => {}); // unlock playback on phones
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); streamRef.current = stream;
      const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunks.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
      rec.onstop = () => {
        releaseMic();
        const type = rec.mimeType || mime || 'audio/webm';
        finishRec(new Blob(chunks.current, { type }), type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm');
      };
      recRef.current = rec; rec.start(); setPhase('recording'); setSecs(0);
      timerRef.current = setInterval(() => setSecs((s) => { if (s + 1 >= MAX_REC) stopRec(); return s + 1; }), 1000);
    } catch { releaseMic(); setPhase('idle'); setErr(L.errMic); }
  };
  const onOrb = () => {
    if (phase === 'recording') return stopRec();
    if (phase === 'speaking') { stopAudio(); return setPhase('idle'); }
    if (phase === 'idle') startRec();
  };

  // ---------- history ----------
  const newChat = () => { stopAudio(); setPhase('idle'); setErr(''); setMsgs((s) => ({ ...s, [mode]: [] })); setConvId((c) => ({ ...c, [mode]: undefined })); setSide(false); };
  const openConv = async (id: string) => {
    try {
      const r = await fetch(`/api/conversations/${id}`); if (!r.ok) return;
      const j = await r.json();
      setMsgs((s) => ({ ...s, [mode]: (j.messages ?? []).map((x: { role: string; content: string }) => ({ role: x.role === 'assistant' ? 'ai' : 'user', text: x.content })) }));
      setConvId((c) => ({ ...c, [mode]: id })); setErr(''); setSide(false);
    } catch { /* ignore */ }
  };
  const delConv = async (id: string) => {
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' }).catch(() => {});
    if (idRef.current[mode] === id) newChat();
    loadConvs();
  };

  // Auto-ask when coming from a banner ("Ask Setu AI").
  const asked = useRef(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (!q || asked.current) return;
    asked.current = true; window.history.replaceState(null, '', '/assistant'); sendChat(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = msgs[mode];
  const first = (user?.name ?? '').split(' ')[0];
  const statusText = phase === 'recording' ? `${L.rec} (${secs}s)` : phase === 'thinking' ? L.think : phase === 'speaking' ? L.speak : L.tap;

  const Sidebar = (
    <aside className="w-72 h-full bg-[#F1F3EE] border-r border-[#E2E8DF] flex flex-col">
      <div className="p-3 flex items-center justify-between">
        <span className="flex items-center gap-2 font-black text-[#14532D]"><Sparkles className="w-5 h-5 text-[#228B52]" /> Setu AI</span>
        <button onClick={() => setSide(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white" aria-label="Close"><X className="w-5 h-5" /></button>
      </div>
      <div className="px-3"><button onClick={newChat} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-[#E2E8DF] text-sm font-semibold text-[#14532D] hover:bg-[#F8F7F0]"><Plus className="w-4 h-4" /> {L.newChat}</button></div>
      <p className="px-4 pt-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#66746A]">{L.history}</p>
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
        {convs[mode].length === 0 && <p className="px-3 py-2 text-xs text-[#66746A]">{L.none}</p>}
        {convs[mode].map((c) => (
          <div key={c.id} className={`group flex items-center rounded-lg ${convId[mode] === c.id ? 'bg-white shadow-xs' : 'hover:bg-white/70'}`}>
            <button onClick={() => openConv(c.id)} className="flex-1 min-w-0 text-left px-3 py-2 text-sm truncate">{c.title}</button>
            <button onClick={() => delConv(c.id)} title={L.del} className="p-2 text-[#66746A] hover:text-rose-600 lg:opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
      <Link href="/dashboard" className="m-3 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#14532D] hover:bg-white"><ArrowLeft className="w-4 h-4" /> {L.back}</Link>
    </aside>
  );

  return (
    <div className="fixed inset-0 z-50 flex bg-white text-[#17251D]">
      <div className="hidden lg:block">{Sidebar}</div>
      {side && <div className="lg:hidden fixed inset-0 z-50 flex"><div className="shadow-2xl">{Sidebar}</div><div className="flex-1 bg-black/40" onClick={() => setSide(false)} /></div>}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="shrink-0 flex items-center gap-2 px-3 sm:px-5 h-14 border-b border-[#E2E8DF]">
          <button onClick={() => setSide(true)} className="lg:hidden p-2 rounded-lg hover:bg-[#F1F3EE]" aria-label="Menu"><Menu className="w-5 h-5" /></button>
          <div className="flex p-1 rounded-full bg-[#F1F3EE] mx-auto lg:mx-0">
            {([['chat', MessageSquare, L.chat], ['voice', Mic, L.voice]] as const).map(([m, Icon, label]) => (
              <button key={m} onClick={() => { if (m !== mode) { stopAudio(); setPhase('idle'); setErr(''); setMode(m); } }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition ${mode === m ? 'bg-white text-[#14532D] shadow-sm' : 'text-[#66746A]'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
          <Link href="/dashboard" className="lg:hidden p-2 rounded-lg hover:bg-[#F1F3EE]" aria-label={L.back}><X className="w-5 h-5" /></Link>
        </header>

        {err && <div className="shrink-0 mx-auto mt-2 max-w-xl px-4 py-2 rounded-lg bg-rose-50 text-rose-700 text-xs sm:text-sm font-medium">{err}</div>}

        {mode === 'chat' ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {list.length === 0 && (
                  <div className="pt-[10vh] text-center">
                    <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#14532D] to-[#86B96B] bg-clip-text text-transparent">{L.hello}{first ? `, ${first}` : ''}</h1>
                    <p className="mt-2 text-lg sm:text-xl text-[#66746A]">{L.ask}</p>
                    <div className="mt-8 grid sm:grid-cols-2 gap-3 text-left">
                      {L.sugg.map((s) => <button key={s} onClick={() => sendChat(s)} className="p-4 rounded-2xl border border-[#E2E8DF] bg-[#F8F7F0] hover:bg-[#F1F3EE] text-sm font-medium">{s}</button>)}
                    </div>
                  </div>
                )}
                {list.map((m, i) => m.role === 'user' ? (
                  <div key={i} className="flex justify-end"><div className="max-w-[85%] px-4 py-2.5 rounded-3xl bg-[#F1F3EE] text-[15px] whitespace-pre-line">{m.text}</div></div>
                ) : (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#14532D] flex items-center justify-center"><Sparkles className="w-4 h-4 text-[#86B96B]" /></div>
                    <div className="flex-1 min-w-0 text-[15px] leading-relaxed pt-1">
                      {m.text ? <Rich text={m.text} /> : <span className="inline-flex gap-1 py-2">{[0, 1, 2].map((d) => <span key={d} className="w-2 h-2 rounded-full bg-[#228B52] animate-bounce" style={{ animationDelay: `${d * 120}ms` }} />)}</span>}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            </div>
            <div className="shrink-0 px-4 pb-3 pt-1">
              <div className="max-w-3xl mx-auto flex items-end gap-2 rounded-3xl border border-[#CBD5C8] bg-[#F8F7F0] px-4 py-2 focus-within:border-[#14532D]">
                <textarea ref={taRef} rows={1} value={input} placeholder={L.ph}
                  onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'; }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(input); } }}
                  className="flex-1 resize-none bg-transparent outline-none py-2 text-[15px] placeholder:text-[#66746A]/70 max-h-40" />
                <button onClick={() => sendChat(input)} disabled={!input.trim() || busy} aria-label="Send"
                  className="mb-1 w-9 h-9 shrink-0 rounded-full bg-[#14532D] text-white flex items-center justify-center disabled:opacity-30"><ArrowUp className="w-5 h-5" /></button>
              </div>
              <p className="mt-2 text-center text-[11px] text-[#66746A]">{L.foot}</p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
                {list.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex gap-2 items-start'}>
                    {m.role === 'user'
                      ? <div className="max-w-[85%] px-4 py-2.5 rounded-3xl bg-[#F1F3EE] text-[15px]">{m.text}</div>
                      : <><div className="flex-1 text-[15px] leading-relaxed"><Rich text={m.text} /></div>
                        <button onClick={() => speak(m.text)} title={L.listen} className="p-2 text-[#228B52] hover:bg-[#F1F3EE] rounded-full"><Volume2 className="w-4 h-4" /></button></>}
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-3 pb-8 pt-4">
              <button onClick={onOrb} disabled={phase === 'thinking'} aria-label="Mic"
                className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white shadow-lg transition ${phase === 'recording' ? 'bg-rose-600' : 'bg-[#14532D] hover:bg-[#123B2A]'} disabled:opacity-70`}>
                {(phase === 'recording' || phase === 'speaking') && <span className="absolute inset-0 rounded-full bg-[#86B96B]/50 animate-ping" />}
                {phase === 'recording' || phase === 'speaking' ? <Square className="relative w-8 h-8 fill-white" /> : phase === 'thinking' ? <span className="relative w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <Mic className="relative w-9 h-9" />}
              </button>
              <p className="text-sm font-semibold text-[#14532D]">{statusText}</p>
              <p className="text-xs text-[#66746A]">{L.vhint}</p>
              <select value={vlang} onChange={(e) => setVlang(e.target.value)} disabled={phase !== 'idle'} className="text-xs rounded-full border border-[#CBD5C8] bg-white px-3 py-1.5">
                {VOICE_LANGS.map((l) => <option key={l.code} value={l.code}>{l.native}{l.code !== 'unknown' ? ` · ${l.label}` : ''}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
