'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { POLICY_BANNERS } from '@/data/policyBanners';

// Government-style banner on the dashboard: rotates every 5 sec, PM photo on the right.
// Put the photo at /public/banners/pm.png (transparent PNG looks best). If missing, it is hidden.
export default function PolicyBanner() {
  const { language } = useLanguage();
  const hi = language === 'hi';
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [noPhoto, setNoPhoto] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % POLICY_BANNERS.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      className="w-full rounded-2xl overflow-hidden shadow-sm border border-[#E2E8DF] bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#FF9933 33%,#FFFFFF 33% 66%,#138808 66%)' }} />
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${i * 100}%)` }}>
          {POLICY_BANNERS.map((b) => (
            <div
              key={b.id}
              className="relative w-full shrink-0 min-h-[190px] sm:min-h-[220px] text-white flex items-stretch"
              style={{ background: `linear-gradient(110deg, ${b.from} 0%, ${b.to} 100%)` }}
            >
              {b.image && <img src={b.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />}
              <div className="relative z-10 flex-1 min-w-0 p-5 sm:p-8 flex flex-col justify-center">
                <span className="inline-flex w-fit items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full">
                  🇮🇳 {hi ? 'भारत सरकार की योजना' : 'Government of India Scheme'}
                </span>
                <h3 className="mt-3 text-xl sm:text-3xl font-black leading-tight">{hi ? b.titleHi : b.title}</h3>
                <p className="mt-1 text-sm sm:text-base text-white/90 max-w-md">{hi ? b.taglineHi : b.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={b.apply} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-[#14532D] text-xs sm:text-sm font-bold hover:bg-white/90"
                  >
                    {hi ? 'आधिकारिक साइट पर आवेदन करें' : 'Apply on official site'} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Link
                    href={`/assistant?q=${encodeURIComponent(hi ? `${b.titleHi} के बारे में बताओ` : `Tell me about ${b.title}`)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/70 text-xs sm:text-sm font-bold hover:bg-white/15"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> {hi ? 'Setu AI से पूछें' : 'Ask Setu AI'}
                  </Link>
                </div>
              </div>
              <div className="relative z-10 hidden sm:flex w-56 shrink-0 items-end justify-center pr-4">
                {!noPhoto ? (
                  <div className="text-center pb-3">
                    <img
                      src="/banners/pm.png" alt={hi ? 'माननीय प्रधानमंत्री' : 'Hon. Prime Minister'}
                      onError={() => setNoPhoto(true)}
                      className="h-40 w-auto object-contain drop-shadow-xl"
                    />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 mt-1">{hi ? 'माननीय प्रधानमंत्री' : 'Hon. Prime Minister'}</p>
                  </div>
                ) : (
                  <span className="self-center text-7xl opacity-90 select-none" aria-hidden>{b.emoji}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-1.5 py-2.5 bg-white">
        {POLICY_BANNERS.map((b, idx) => (
          <button key={b.id} onClick={() => setI(idx)} aria-label={`Banner ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-6 bg-[#14532D]' : 'w-1.5 bg-[#14532D]/25'}`} />
        ))}
      </div>
    </section>
  );
}
