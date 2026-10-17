'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog, Droplets, Wind, BarChart3, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import type { WeatherApiResponse, WeatherDay } from '@/types';

const ICONS = { sun: Sun, cloud: Cloud, rain: CloudRain, storm: CloudLightning, snow: CloudSnow, fog: CloudFog };

function Chart({ days, todayIdx }: { days: WeatherDay[]; todayIdx: number }) {
  const W = 600, H = 140, P = 20;
  const all = days.flatMap((d) => [d.tempMax, d.tempMin]);
  const lo = Math.min(...all) - 2, hi = Math.max(...all) + 2;
  const x = (i: number) => P + (i * (W - 2 * P)) / (days.length - 1);
  const y = (v: number) => H - P - ((v - lo) / (hi - lo)) * (H - 2 * P);
  const line = (k: 'tempMax' | 'tempMin') => days.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d[k])}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-36">
      <line x1={x(todayIdx)} x2={x(todayIdx)} y1={8} y2={H - 8} stroke="#14532D" strokeDasharray="4 4" opacity="0.4" />
      <path d={line('tempMax')} fill="none" stroke="#E9B949" strokeWidth="2.5" />
      <path d={line('tempMin')} fill="none" stroke="#228B52" strokeWidth="2.5" />
      {days.map((d, i) => (
        <g key={d.date}>
          <circle cx={x(i)} cy={y(d.tempMax)} r="3" fill="#E9B949" />
          <circle cx={x(i)} cy={y(d.tempMin)} r="3" fill="#228B52" />
          <text x={x(i)} y={y(d.tempMax) - 7} fontSize="10" textAnchor="middle" fill="#66746A">{d.tempMax}°</text>
        </g>
      ))}
    </svg>
  );
}

function DayCard({ d, hi, highlight }: { d: WeatherDay; hi: boolean; highlight?: boolean }) {
  const Icon = ICONS[d.icon];
  const label = new Date(d.date + 'T00:00:00').toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { weekday: 'short', day: 'numeric' });
  return (
    <div className={`shrink-0 w-[88px] p-2.5 rounded-xl border text-center ${highlight ? 'border-[#14532D] bg-[#14532D]/5' : 'border-[#E2E8DF] bg-white'}`}>
      <p className="text-[10px] font-semibold text-[#66746A]">{label}</p>
      <Icon className="w-5 h-5 mx-auto my-1.5 text-[#228B52]" />
      <p className="text-xs font-bold text-[#14532D]">{d.tempMax}° <span className="text-[#66746A] font-medium">{d.tempMin}°</span></p>
      <p className="text-[10px] text-sky-700 mt-0.5">{d.rainProb !== null ? `${d.rainProb}%` : `${d.rainMm}mm`} 💧</p>
    </div>
  );
}

export default function WeatherCard() {
  const { language } = useLanguage();
  const hi = language === 'hi';
  const { coords } = useLocation();
  const [data, setData] = useState<WeatherApiResponse | null>(null);
  const [error, setError] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    if (!coords) return;
    const load = () =>
      fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lon}`)
        .then((r) => r.json())
        .then((d) => { setData(d); setError(false); })
        .catch(() => setError(true));
    load();
    const id = setInterval(load, 10 * 60 * 1000); // refresh every 10 min
    return () => clearInterval(id);
  }, [coords]);

  if (error && !data) return <div className="p-6 rounded-2xl bg-white border border-[#E2E8DF] text-xs text-rose-700">{hi ? 'मौसम लोड नहीं हुआ' : 'Could not load weather'}</div>;
  if (!data) return <div className="h-44 rounded-2xl bg-white border border-[#E2E8DF] animate-pulse" />;

  const Icon = ICONS[data.current.icon];
  const all = [...data.past, data.today, ...data.next];

  return (
    <section className="rounded-2xl bg-white border border-[#E2E8DF] shadow-xs overflow-hidden">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#86B96B]/20 flex items-center justify-center">
            <Icon className="w-9 h-9 text-[#228B52]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#66746A] uppercase tracking-wider">{hi ? 'अभी का मौसम' : 'Weather Now'}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${data.source === 'live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {data.source === 'live' ? (hi ? 'लाइव' : 'LIVE') : (hi ? 'डेमो डेटा' : 'DEMO DATA')}
              </span>
            </div>
            <div className="text-4xl font-black text-[#14532D] leading-tight">{Math.round(data.current.temp)}°C</div>
            <p className="text-xs font-semibold text-[#228B52]">{hi ? data.current.conditionHi : data.current.condition}</p>
          </div>
        </div>

        <div className="flex gap-5 text-xs text-[#17251D]">
          <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-sky-600" />{data.current.humidity}%</span>
          <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-[#66746A]" />{Math.round(data.current.wind)} km/h</span>
          <span className="flex items-center gap-1.5"><CloudRain className="w-4 h-4 text-sky-700" />{data.current.rainMm} mm</span>
        </div>

        <button
          onClick={() => setShowAnalytics((v) => !v)}
          className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold hover:bg-[#123B2A] inline-flex items-center justify-center gap-1.5"
        >
          {showAnalytics ? <ChevronUp className="w-3.5 h-3.5" /> : <BarChart3 className="w-3.5 h-3.5 text-[#86B96B]" />}
          {showAnalytics ? (hi ? 'बंद करें' : 'Hide') : (hi ? 'विश्लेषण देखें' : 'View Analytics')}
        </button>
      </div>

      {showAnalytics && (
        <div className="border-t border-[#E2E8DF] p-6 space-y-4 bg-[#F8F7F0]/60">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
              {hi ? 'पिछले 7 दिन • आज • अगले 7 दिन' : 'Past 7 days • Today • Next 7 days'}
            </h3>
            <span className="text-[10px] text-[#66746A] flex items-center gap-2">
              <i className="inline-block w-2 h-2 rounded-full bg-[#E9B949]" />{hi ? 'अधिकतम' : 'Max'}
              <i className="inline-block w-2 h-2 rounded-full bg-[#228B52]" />{hi ? 'न्यूनतम' : 'Min'}
            </span>
          </div>
          <Chart days={all} todayIdx={7} />
          <div>
            <p className="text-[11px] font-semibold text-[#66746A] mb-2">{hi ? 'पिछले 7 दिन' : 'Previous 7 days'}</p>
            <div className="flex gap-2 overflow-x-auto pb-1">{data.past.map((d) => <DayCard key={d.date} d={d} hi={hi} />)}</div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#66746A] mb-2">{hi ? 'आज और अगले 7 दिन (पूर्वानुमान)' : 'Today & next 7 days (forecast)'}</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <DayCard d={data.today} hi={hi} highlight />
              {data.next.map((d) => <DayCard key={d.date} d={d} hi={hi} />)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
