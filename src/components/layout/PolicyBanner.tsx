'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { POLICY_BANNERS } from '@/data/policyBanners';

// Auto-rotating government policy banners (7 in queue). Pauses on hover/touch.
export default function PolicyBanner() {
  const { language } = useLanguage();
  const hi = language === 'hi';
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % POLICY_BANNERS.length), 4000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="w-full overflow-hidden bg-[#F8F7F0] border-b border-[#E2E8DF]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="overflow-hidden rounded-2xl">
          <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${i * 100}%)` }}>
            {POLICY_BANNERS.map((b) => (
              <a
                key={b.id}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full shrink-0 h-24 sm:h-28 flex items-center justify-between px-5 sm:px-8 text-white"
                style={{
                  background: b.image ? `linear-gradient(90deg, ${b.from}E6, ${b.to}99), url(${b.image}) center/cover` : `linear-gradient(110deg, ${b.from}, ${b.to})`,
                }}
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    {hi ? 'सरकारी योजना' : 'Govt. Policy'}
                  </span>
                  <h3 className="text-base sm:text-xl font-black leading-tight truncate">{hi ? b.titleHi : b.title}</h3>
                  <p className="text-[11px] sm:text-sm text-white/85 truncate">{hi ? b.taglineHi : b.tagline}</p>
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-white/90">
                    {hi ? 'आवेदन / जानकारी' : 'Apply / Know more'} <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
                <span className="text-6xl sm:text-7xl opacity-90 drop-shadow-lg select-none pl-3" aria-hidden>{b.emoji}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-1.5 mt-2">
          {POLICY_BANNERS.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => setI(idx)}
              aria-label={`Banner ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-5 bg-[#14532D]' : 'w-1.5 bg-[#14532D]/25'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
