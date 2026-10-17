'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bot, X, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';

interface Msg { role: 'user' | 'ai'; text: string }

// Small "Talk with AI" box pinned to the bottom-right corner. Uses /api/assistant.
export default function AiChatWidget() {
  const { language } = useLanguage();
  const hi = language === 'hi';
  const { place } = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, open]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setMsgs((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language, context: { location: place ? `${place.city}, ${place.state}` : undefined } }),
      });
      const j = await res.json();
      setMsgs((m) => [...m, { role: 'ai', text: String(j.response ?? '').replace(/\*\*/g, '').replace(/\*/g, '') || (hi ? 'जवाब नहीं मिला' : 'No answer') }]);
    } catch {
      setMsgs((m) => [...m, { role: 'ai', text: hi ? 'कुछ गड़बड़ हुई, दोबारा कोशिश करें।' : 'Something went wrong, try again.' }]);
    } finally {
      setBusy(false);
    }
  };

  const chips = hi ? ['पत्ती पीली क्यों हो रही है?', 'ड्रिप सिंचाई सब्सिडी', 'बारिश से पहले क्या करें?'] : ['Why are leaves yellow?', 'Drip irrigation subsidy', 'What to do before rain?'];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-[calc(100vw-2rem)] sm:w-80 h-[420px] flex flex-col rounded-2xl bg-white border border-[#E2E8DF] shadow-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#14532D] text-white flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-2"><Bot className="w-4 h-4 text-[#86B96B]" />{hi ? 'AI से बात करें' : 'Talk with AI'}</span>
            <button onClick={() => setOpen(false)} aria-label="Close"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#F8F7F0]">
            {msgs.length === 0 && (
              <div className="space-y-2">
                <p className="text-[11px] text-[#66746A]">{hi ? 'अपनी खेती से जुड़ा कोई भी सवाल पूछें:' : 'Ask anything about your farming:'}</p>
                {chips.map((c) => (
                  <button key={c} onClick={() => send(c)} className="block w-full text-left text-xs px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-[#14532D] hover:border-[#14532D]">{c}</button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[88%] px-3 py-2 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed ${m.role === 'user' ? 'ml-auto bg-[#14532D] text-white' : 'bg-white border border-[#E2E8DF] text-[#17251D]'}`}>{m.text}</div>
            ))}
            {busy && <div className="text-[11px] text-[#66746A] px-1">{hi ? 'सोच रहा हूँ…' : 'Thinking…'}</div>}
            <div ref={endRef} />
          </div>
          <div className="p-2 border-t border-[#E2E8DF] bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder={hi ? 'सवाल लिखें…' : 'Type your question…'}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#E2E8DF] focus:outline-none focus:border-[#14532D]"
              />
              <button onClick={() => send(input)} disabled={busy} className="p-2 rounded-xl bg-[#14532D] text-white disabled:opacity-50" aria-label="Send"><Send className="w-4 h-4" /></button>
            </div>
            <Link href="/assistant" className="block text-center text-[10px] text-[#228B52] font-semibold mt-1.5 hover:underline">{hi ? 'पूरा AI सहायक खोलें →' : 'Open full assistant →'}</Link>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#14532D] text-white text-xs font-bold shadow-lg hover:bg-[#123B2A]">
          <Bot className="w-4 h-4 text-[#86B96B]" />{hi ? 'AI से बात करें' : 'Talk with AI'}
        </button>
      )}
    </div>
  );
}
