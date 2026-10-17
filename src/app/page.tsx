'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MinimalBar from '@/components/layout/MinimalBar';
import { useLanguage } from '@/context/LanguageContext';

const arch = (t: number): [number, number] => [50 + 300 * t, 230 * ((1 - t) ** 2 + t ** 2) - 80 * t * (1 - t)];

function BridgeArt({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto" role="img" aria-label={label}>
      <circle cx="320" cy="60" r="28" fill="#E9B949" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M0 ${258 + i * 14} Q100 ${246 + i * 14} 200 ${258 + i * 14} T400 ${258 + i * 14}`} fill="none" stroke="#86B96B" strokeWidth="2" opacity={0.8 - i * 0.2} />
      ))}
      <path d="M50 230 Q200 -40 350 230" fill="none" stroke="#14532D" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 230 H370" stroke="#14532D" strokeWidth="6" strokeLinecap="round" />
      {[0.2, 0.35, 0.5, 0.65, 0.8].map((p) => {
        const [x, y] = arch(p);
        return <line key={p} x1={x} y1={y} x2={x} y2="230" stroke="#14532D" strokeWidth="2" />;
      })}
      <path d="M38 230V196M38 214c-9 0-12-6-12-13 9 0 12 6 12 13zM38 208c0-8 4-13 12-13 0 8-4 13-12 13z" fill="none" stroke="#228B52" strokeWidth="4" strokeLinecap="round" />
      <circle cx="362" cy="206" r="18" fill="#E9B949" />
      <text x="362" y="213" textAnchor="middle" fontSize="20" fontWeight="700" fill="#14532D">₹</text>
    </svg>
  );
}

export default function LandingPage() {
  const { t } = useLanguage();
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return (
    <div className="min-h-screen flex flex-col">
      <MinimalBar cta />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#14532D] leading-snug">{t('lpTitle')}</h1>
          <p className="mt-4 text-lg text-[#66746A] max-w-md">{t('lpSub')}</p>
          <ul className="mt-6 space-y-2 text-[#17251D]">
            {['lpP1', 'lpP2', 'lpP3'].map((k) => (
              <li key={k} className="flex gap-2"><span className="text-[#228B52] font-bold" aria-hidden="true">+</span>{t(k)}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="px-6 py-3 rounded-lg font-semibold bg-[#14532D] text-white hover:bg-[#123B2A] focus:outline-none focus:ring-2 focus:ring-[#86B96B]">{t('lpSignup')}</Link>
            <Link href="/login" className="px-6 py-3 rounded-lg font-semibold border border-[#14532D] text-[#14532D] hover:bg-[#EEF3EA] focus:outline-none focus:ring-2 focus:ring-[#86B96B]">{t('lpLogin')}</Link>
          </div>
        </div>
        <BridgeArt label={t('lpArt')} />
      </main>
      <section id="features" className="border-t border-[#E2E8DF] bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#14532D]">{t('lpFeatTitle')}</h2>
          <div className="mt-8 grid md:grid-cols-2 md:gap-x-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="py-4 border-t border-[#E2E8DF]">
                <h3 className="font-semibold text-[#17251D]">{t(`lpF${i}T`)}</h3>
                <p className="text-[#66746A]">{t(`lpF${i}D`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="how" className="border-t border-[#E2E8DF] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#14532D]">{t('lpHowTitle')}</h2>
            <ol className="mt-6 space-y-5 list-decimal pl-5 marker:font-bold marker:text-[#228B52]">
              {[1, 2, 3].map((i) => (
                <li key={i}><span className="font-semibold">{t(`lpH${i}T`)}</span><p className="text-[#66746A]">{t(`lpH${i}D`)}</p></li>
              ))}
            </ol>
          </div>
          <div className="space-y-6">
            <div className="border-t border-[#E2E8DF] pt-4"><h3 className="text-xl font-bold text-[#14532D]">{t('lpForFarm')}</h3><p className="text-[#66746A]">{t('lpForFarmD')}</p></div>
            <div className="border-t border-[#E2E8DF] pt-4"><h3 className="text-xl font-bold text-[#14532D]">{t('lpForBuy')}</h3><p className="text-[#66746A]">{t('lpForBuyD')}</p></div>
            <p className="text-sm text-[#66746A]">{t('lpNote')}</p>
            <Link href="/signup" className="inline-block px-6 py-3 rounded-lg font-semibold bg-[#14532D] text-white hover:bg-[#123B2A]">{t('lpSignup')}</Link>
          </div>
        </div>
      </section>
      <footer className="border-t border-[#E2E8DF] py-5 text-center text-sm text-[#66746A]">
        &copy; {year} {t('appName')}. {t('lpFoot')}
      </footer>
    </div>
  );
}
