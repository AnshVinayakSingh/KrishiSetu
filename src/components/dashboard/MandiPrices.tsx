'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import type { MandiApiResponse } from '@/types';

export default function MandiPrices() {
  const { language } = useLanguage();
  const hi = language === 'hi';
  const { place } = useLocation();
  const [data, setData] = useState<MandiApiResponse | null>(null);
  const state = place?.state ?? '';

  useEffect(() => {
    const load = () =>
      fetch(`/api/mandi?state=${encodeURIComponent(state)}`)
        .then((r) => r.json())
        .then(setData)
        .catch(() => {});
    load();
    const id = setInterval(load, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(id);
  }, [state]);

  return (
    <section className="rounded-2xl bg-white border border-[#E2E8DF] shadow-xs">
      <div className="px-6 py-4 flex items-center justify-between border-b border-[#E2E8DF]">
        <h2 className="text-xs font-bold text-[#14532D] uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#228B52]" />
          {hi ? 'फसल भाव सूची (मंडी)' : 'Crop Price List (Mandi)'}
        </h2>
        {data && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${data.source === 'live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {data.source === 'live' ? (hi ? 'लाइव' : 'LIVE') : (hi ? 'डेमो डेटा' : 'DEMO DATA')}
          </span>
        )}
      </div>

      {!data ? (
        <div className="h-40 animate-pulse" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] text-[#66746A] uppercase tracking-wider">
                <th className="px-6 py-2.5 font-semibold">{hi ? 'फसल' : 'Crop'}</th>
                <th className="px-3 py-2.5 font-semibold">{hi ? 'मंडी' : 'Mandi'}</th>
                <th className="px-3 py-2.5 font-semibold text-right">{hi ? 'भाव (₹/क्विंटल)' : 'Price (₹/Qtl)'}</th>
                <th className="px-6 py-2.5 font-semibold text-right">{hi ? 'बदलाव / रेंज' : 'Change / Range'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8DF]/60">
              {data.rows.map((r) => (
                <tr key={r.id} className="hover:bg-[#F8F7F0]">
                  <td className="px-6 py-3 font-bold text-[#14532D]">{hi && r.cropHi ? r.cropHi : r.crop}</td>
                  <td className="px-3 py-3 text-[#66746A]">{r.mandi}<span className="block text-[10px]">{r.state} • {r.date}</span></td>
                  <td className="px-3 py-3 text-right font-extrabold text-[#14532D] text-sm">₹{r.modal.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3 text-right">
                    {r.change !== undefined ? (
                      <span className={`font-bold ${r.change >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {r.change >= 0 ? '▲' : '▼'} ₹{Math.abs(r.change)}
                      </span>
                    ) : r.min && r.max ? (
                      <span className="text-[#66746A]">₹{r.min} – ₹{r.max}</span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
