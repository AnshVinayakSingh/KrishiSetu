'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Sparkles, AlertTriangle, Cloud, CloudFog, CloudLightning, CloudRain, Droplets, MapPin, RefreshCw, Snowflake, Sun, Wind } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import type { WeatherApiResponse, WeatherDay } from '@/types';

const ICONS = { sun: Sun, cloud: Cloud, rain: CloudRain, storm: CloudLightning, snow: Snowflake, fog: CloudFog };

function Row({ d, hi, label }: { d: WeatherDay; hi: boolean; label?: string }) {
  const Icon = ICONS[d.icon];
  const day = label ?? new Date(d.date + 'T00:00:00').toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#E2E8DF] last:border-0">
      <p className="w-28 text-sm font-semibold">{day}</p>
      <Icon className="w-5 h-5 text-[#228B52] shrink-0" />
      <p className="flex-1 min-w-0 text-sm text-[#44524A] truncate">{hi ? d.conditionHi : d.condition}</p>
      <p className="text-xs text-sky-700 w-14 text-right">{d.rainProb !== null ? `${d.rainProb}%` : `${d.rainMm}mm`}</p>
      <p className="text-sm font-bold w-16 text-right">{d.tempMax}° <span className="text-[#66746A] font-medium">{d.tempMin}°</span></p>
    </div>
  );
}

export default function WeatherPage() {
  const { language } = useLanguage();
  const { coords, place, status, request } = useLocation();
  const hi = language === 'hi';
  const [data, setData] = useState<WeatherApiResponse | null>(null);
  const [err, setErr] = useState(false);
  const [adv, setAdv] = useState<{ headline: string; alerts: { level: string; text: string }[]; advice: { title: string; text: string }[] } | null>(null);
  const [advBusy, setAdvBusy] = useState(false);
  const [tab, setTab] = useState<'next' | 'past'>('next');

  const load = useCallback(async () => {
    if (!coords) return;
    setErr(false);
    try {
      const r = await fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lon}`);
      if (!r.ok) throw new Error('x');
      setData(await r.json());
    } catch { setErr(true); }
  }, [coords]);
  useEffect(() => { load(); }, [load]);

  // Ask Gemini to analyse the live numbers (once per fresh weather load).
  useEffect(() => {
    if (!data) return;
    setAdvBusy(true);
    fetch('/api/weather-advice', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weather: data, language, location: place ? `${place.district || place.city}, ${place.state}` : '' }) })
      .then((r) => (r.ok ? r.json() : null)).then((j) => setAdv(j?.result ?? null)).catch(() => setAdv(null)).finally(() => setAdvBusy(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, language]);

  const Icon = data ? ICONS[data.current.icon] : Sun;

  return (
    <AppShell>
      <div className="max-w-xl mx-auto space-y-5">
        {!coords && (
          <div className="rounded-2xl bg-white border border-[#E2E8DF] p-8 text-center space-y-3">
            <MapPin className="w-8 h-8 mx-auto text-[#228B52]" />
            <p className="font-semibold">{status === 'denied' ? (hi ? 'लोकेशन की अनुमति बंद है। ब्राउज़र सेटिंग में चालू करें।' : 'Location is blocked. Allow it in browser settings.') : (hi ? 'मौसम के लिए लोकेशन चाहिए' : 'We need your location for weather')}</p>
            <button onClick={request} className="px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-sm font-bold">{hi ? 'लोकेशन दें' : 'Allow location'}</button>
          </div>
        )}

        {coords && err && !data && (
          <div className="rounded-2xl bg-white border border-[#E2E8DF] p-8 text-center space-y-3">
            <p className="font-semibold text-rose-700">{hi ? 'मौसम लोड नहीं हुआ' : 'Could not load weather'}</p>
            <button onClick={load} className="px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-sm font-bold inline-flex items-center gap-2"><RefreshCw className="w-4 h-4" /> {hi ? 'दोबारा कोशिश करें' : 'Try again'}</button>
          </div>
        )}

        {coords && !data && !err && <div className="h-64 rounded-2xl bg-white border border-[#E2E8DF] animate-pulse" />}

        {data && (
          <>
            <section className="rounded-3xl bg-gradient-to-br from-[#14532D] to-[#228B52] text-white p-7 text-center">
              {place && <p className="inline-flex items-center gap-1.5 text-sm text-white/85"><MapPin className="w-4 h-4" /> {place.district || place.city}, {place.state}</p>}
              <Icon className="w-16 h-16 mx-auto mt-3" />
              <p className="mt-2 text-7xl font-black leading-none">{Math.round(data.current.temp)}°</p>
              <p className="mt-2 text-lg font-semibold">{hi ? data.current.conditionHi : data.current.condition}</p>
              <p className="text-sm text-white/80 mt-1">{hi ? 'आज' : 'Today'}: {data.today.tempMax}° / {data.today.tempMin}°</p>
              <div className="mt-5 flex justify-center gap-6 text-sm">
                <span className="inline-flex items-center gap-1.5"><Droplets className="w-4 h-4" /> {Math.round(data.current.humidity)}%</span>
                <span className="inline-flex items-center gap-1.5"><Wind className="w-4 h-4" /> {Math.round(data.current.wind)} km/h</span>
                <span className="inline-flex items-center gap-1.5"><CloudRain className="w-4 h-4" /> {data.today.rainProb ?? 0}%</span>
              </div>
            </section>

            <section className="rounded-2xl bg-white border border-[#E2E8DF] p-5 space-y-3">
              <h2 className="flex items-center gap-2 font-black text-[#14532D]"><Sparkles className="w-5 h-5 text-[#228B52]" /> {hi ? 'इस हफ्ते खेती के लिए सलाह' : 'Farming advice for this week'}</h2>
              {advBusy && <div className="space-y-2 animate-pulse"><div className="h-4 bg-[#F1F3EE] rounded w-3/4" /><div className="h-4 bg-[#F1F3EE] rounded w-full" /><div className="h-4 bg-[#F1F3EE] rounded w-2/3" /></div>}
              {adv && <>
                <p className="text-sm font-semibold">{adv.headline}</p>
                {adv.alerts?.map((a, i) => <p key={i} className={`flex gap-2 rounded-xl px-3 py-2 text-sm font-medium ${a.level === 'high' ? 'bg-rose-50 text-rose-800' : a.level === 'medium' ? 'bg-amber-50 text-amber-800' : 'bg-sky-50 text-sky-800'}`}><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />{a.text}</p>)}
                {adv.advice?.map((a, i) => <div key={i}><p className="font-bold text-sm">{a.title}</p><p className="text-sm text-[#44524A]">{a.text}</p></div>)}
              </>}
            </section>

            <section className="rounded-2xl bg-white border border-[#E2E8DF] p-5">
              <div className="flex p-1 rounded-full bg-[#F1F3EE] mb-2">
                {([['next', hi ? 'अगले 7 दिन' : 'Next 7 days'], ['past', hi ? 'पिछले 7 दिन' : 'Past 7 days']] as const).map(([k, l]) => (
                  <button key={k} onClick={() => setTab(k)} className={`flex-1 py-2 rounded-full text-sm font-semibold ${tab === k ? 'bg-white text-[#14532D] shadow-sm' : 'text-[#66746A]'}`}>{l}</button>
                ))}
              </div>
              {(tab === 'next' ? data.next : [...data.past].reverse()).map((d) => <Row key={d.date} d={d} hi={hi} />)}
              <p className="mt-3 text-[11px] text-[#66746A] flex justify-between"><span>{hi ? 'बारिश की संभावना / मात्रा' : 'Rain chance / amount'}</span>
                <button onClick={load} className="inline-flex items-center gap-1 font-semibold text-[#14532D]"><RefreshCw className="w-3 h-3" /> {hi ? 'अपडेट' : 'Refresh'}</button></p>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
