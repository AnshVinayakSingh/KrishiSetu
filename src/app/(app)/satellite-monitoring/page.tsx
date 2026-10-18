'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Droplets, Layers, LocateFixed, MapPin, Plus, RefreshCw, Satellite, Sparkles, Trash2, Undo2, Waves } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';

const FieldMap = dynamic(() => import('@/components/satellite/FieldMap'), { ssr: false, loading: () => <div className="h-80 rounded-2xl bg-[#F1F3EE] animate-pulse" /> });

type Pt = [number, number];
interface Field { id: string; name: string; crop: string; sowingDate: string; ring: Pt[]; areaAcre: number }
interface Analysis {
  satellite: { available: boolean; series: { date: string; ndvi: number; ndmi: number }[] };
  soil: { tempC: number; soilTopPct: number; soilRootPct: number; rainPast7Mm: number; rainNext7Mm: number } | null;
  health: { label: 'good' | 'watch' | 'poor' | 'unknown'; score: number | null; trend: 'up' | 'down' | 'flat' };
  daysAfterSowing: number | null;
  advice: { summary: string; actions: { title: string; text: string; priority: 'high' | 'medium' | 'low' }[] } | null;
  notes: string[];
}

const CROPS = ['Wheat', 'Rice', 'Maize', 'Mustard', 'Sugarcane', 'Cotton', 'Soybean', 'Potato', 'Tomato', 'Onion', 'Gram', 'Other'];
const HEALTH = {
  good: ['bg-emerald-100 text-emerald-800', 'फसल स्वस्थ है', 'Crop is healthy'], watch: ['bg-amber-100 text-amber-800', 'ध्यान दें', 'Needs attention'],
  poor: ['bg-rose-100 text-rose-800', 'फसल कमज़ोर है', 'Crop is weak'], unknown: ['bg-slate-100 text-slate-700', 'डेटा नहीं मिला', 'No satellite data yet'],
} as const;
const PRI = { high: 'border-rose-300 bg-rose-50', medium: 'border-amber-300 bg-amber-50', low: 'border-[#E2E8DF] bg-white' } as const;

function areaAcre(pts: Pt[]) {
  if (pts.length < 3) return 0;
  const lat0 = pts.reduce((a, p) => a + p[1], 0) / pts.length, kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 110540;
  let a = 0; for (let i = 0; i < pts.length; i++) { const q = pts[(i + 1) % pts.length]; a += pts[i][0] * kx * q[1] * ky - q[0] * kx * pts[i][1] * ky; }
  return Math.abs(a / 2) / 4046.86;
}

function Trend({ s }: { s: Analysis['satellite']['series'] }) {
  if (s.length < 2) return <p className="text-sm text-[#66746A]">—</p>;
  const W = 320, H = 110, x = (i: number) => 8 + (i / (s.length - 1)) * (W - 16), y = (v: number) => H - 10 - Math.max(0, Math.min(0.9, v)) / 0.9 * (H - 20);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0.3, 0.5, 0.7].map((g) => <line key={g} x1="0" x2={W} y1={y(g)} y2={y(g)} stroke="#E2E8DF" strokeDasharray="3 3" />)}
      <polyline fill="none" stroke="#228B52" strokeWidth="3" strokeLinejoin="round" points={s.map((p, i) => `${x(i)},${y(p.ndvi)}`).join(' ')} />
      {s.map((p, i) => <circle key={i} cx={x(i)} cy={y(p.ndvi)} r="3.5" fill="#14532D" />)}
    </svg>
  );
}

export default function CropSatellitePage() {
  const { language } = useLanguage();
  const hi = language === 'hi';
  const { coords, request } = useLocation();
  const [fields, setFields] = useState<Field[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Pt[]>([]);
  const [form, setForm] = useState({ name: '', crop: 'Wheat', sowingDate: '' });
  const [an, setAn] = useState<Analysis | null>(null);
  const [anBusy, setAnBusy] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [err, setErr] = useState('');

  const field = fields.find((f) => f.id === sel) ?? null;

  const loadFields = useCallback(async () => {
    try { const r = await fetch('/api/fields'); const j = await r.json(); setFields(j.fields ?? []); if (!sel && j.fields?.length) setSel(j.fields[0].id); }
    catch { /* ignore */ } finally { setLoaded(true); }
  }, [sel]);
  useEffect(() => { loadFields(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const analyse = useCallback(async (id: string, fresh = false) => {
    setAnBusy(true); setAn(null);
    try { const r = await fetch(`/api/fields/${id}/analysis?lang=${language}${fresh ? '&fresh=1' : ''}`); if (r.ok) setAn(await r.json()); } catch { /* ignore */ }
    setAnBusy(false);
  }, [language]);
  useEffect(() => { if (sel && !adding) analyse(sel); }, [sel, adding, analyse]);

  const save = async () => {
    setErr('');
    const r = await fetch('/api/fields', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, points: draft }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setErr(j.error === 'bad_area' ? (hi ? 'खेत का आकार सही नहीं है (0.05–500 एकड़)।' : 'Field size must be 0.05–500 acre.') : (hi ? 'सेव नहीं हुआ।' : 'Could not save.'));
    setFields((f) => [j.field, ...f]); setSel(j.field.id); setAdding(false); setDraft([]); setForm({ name: '', crop: 'Wheat', sowingDate: '' });
  };
  const remove = async (id: string) => {
    if (!confirm(hi ? 'यह खेत हटाएँ?' : 'Delete this field?')) return;
    await fetch(`/api/fields/${id}`, { method: 'DELETE' });
    const rest = fields.filter((f) => f.id !== id); setFields(rest); setSel(rest[0]?.id ?? null); setAn(null);
  };

  const h = HEALTH[an?.health.label ?? 'unknown'];
  const last = an?.satellite.series.at(-1);
  const notConfigured = an?.notes.includes('satellite_not_configured');
  const center: Pt | null = coords ? [coords.lon, coords.lat] : null;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-[#14532D] flex items-center gap-2"><Satellite className="w-6 h-6" /> {hi ? 'सैटेलाइट फसल प्रबंधन' : 'Satellite Crop Manager'}</h1>
            <p className="text-sm text-[#66746A]">{hi ? 'अपना खेत नक्शे पर चिह्नित करें, सैटेलाइट से फसल की सेहत देखें।' : 'Mark your field on the map. See crop health from satellite.'}</p>
          </div>
          {!adding && <button onClick={() => { setAdding(true); if (!coords) request(); }} className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#14532D] text-white text-sm font-bold"><Plus className="w-4 h-4" /> {hi ? 'खेत जोड़ें' : 'Add field'}</button>}
        </div>

        {adding && (
          <section className="rounded-2xl bg-white border border-[#E2E8DF] p-5 space-y-4">
            <p className="font-bold text-[#14532D]">{hi ? '1. नक्शे पर खेत के कोनों पर बारी-बारी से दबाएँ' : '1. Tap the corners of your field on the map, one by one'}</p>
            <FieldMap center={center} draft={draft} onAdd={(p) => setDraft((d) => [...d, p])} />
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button onClick={() => setDraft((d) => d.slice(0, -1))} disabled={!draft.length} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#CBD5C8] disabled:opacity-40"><Undo2 className="w-4 h-4" /> {hi ? 'पीछे' : 'Undo'}</button>
              <button onClick={() => setDraft([])} disabled={!draft.length} className="px-3 py-1.5 rounded-lg border border-[#CBD5C8] disabled:opacity-40">{hi ? 'साफ़ करें' : 'Clear'}</button>
              <button onClick={request} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#CBD5C8]"><LocateFixed className="w-4 h-4" /> {hi ? 'मेरी लोकेशन' : 'My location'}</button>
              <span className="ml-auto font-semibold text-[#14532D]">{draft.length >= 3 ? `${areaAcre(draft).toFixed(2)} ${hi ? 'एकड़' : 'acre'}` : `${draft.length}/3+ ${hi ? 'कोने' : 'corners'}`}</span>
            </div>
            <p className="font-bold text-[#14532D]">{hi ? '2. खेत की जानकारी' : '2. Field details'}</p>
            <div className="grid sm:grid-cols-3 gap-3 text-sm font-semibold">
              <label>{hi ? 'खेत का नाम' : 'Field name'}<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={hi ? 'जैसे उत्तरी खेत' : 'e.g. North field'} className="w-full mt-1 rounded-lg border border-[#CBD5C8] px-3 py-2.5 font-normal" /></label>
              <label>{hi ? 'फसल' : 'Crop'}<select value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} className="w-full mt-1 rounded-lg border border-[#CBD5C8] px-3 py-2.5 font-normal bg-white">{CROPS.map((c) => <option key={c}>{c}</option>)}</select></label>
              <label>{hi ? 'बुवाई की तारीख' : 'Sowing date'}<input type="date" value={form.sowingDate} onChange={(e) => setForm({ ...form, sowingDate: e.target.value })} className="w-full mt-1 rounded-lg border border-[#CBD5C8] px-3 py-2.5 font-normal" /></label>
            </div>
            {err && <p className="text-sm font-semibold text-rose-600">{err}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setAdding(false); setDraft([]); setErr(''); }} className="px-5 py-3 rounded-xl border border-[#CBD5C8] font-bold">{hi ? 'रद्द करें' : 'Cancel'}</button>
              <button onClick={save} disabled={draft.length < 3} className="flex-1 py-3 rounded-xl bg-[#14532D] text-white font-bold disabled:opacity-40">{hi ? 'खेत सेव करें' : 'Save field'}</button>
            </div>
          </section>
        )}

        {!adding && loaded && !fields.length && (
          <div className="rounded-2xl bg-white border border-dashed border-[#86B96B] p-10 text-center space-y-3">
            <MapPin className="w-10 h-10 mx-auto text-[#228B52]" />
            <p className="font-semibold">{hi ? 'अभी कोई खेत नहीं जुड़ा' : 'No field added yet'}</p>
            <p className="text-sm text-[#66746A]">{hi ? '"खेत जोड़ें" दबाकर अपना खेत नक्शे पर बनाएँ।' : 'Press "Add field" and draw your field on the map.'}</p>
          </div>
        )}

        {!adding && field && (
          <>
            {fields.length > 1 && <div className="flex gap-2 overflow-x-auto pb-1">{fields.map((f) => <button key={f.id} onClick={() => setSel(f.id)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border ${f.id === sel ? 'bg-[#14532D] text-white border-[#14532D]' : 'bg-white border-[#CBD5C8]'}`}>{f.name}</button>)}</div>}

            <section className="rounded-2xl bg-white border border-[#E2E8DF] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div><p className="font-black text-lg text-[#14532D]">{field.name}</p><p className="text-xs text-[#66746A]">{field.crop} · {field.areaAcre} {hi ? 'एकड़' : 'acre'}{an?.daysAfterSowing != null ? ` · ${an.daysAfterSowing} ${hi ? 'दिन की फसल' : 'days old'}` : ''}</p></div>
                <div className="flex gap-1">
                  <button onClick={() => analyse(field.id, true)} title="Refresh" className="p-2 rounded-lg hover:bg-[#F1F3EE]"><RefreshCw className={`w-4 h-4 ${anBusy ? 'animate-spin' : ''}`} /></button>
                  <button onClick={() => remove(field.id)} title="Delete" className="p-2 rounded-lg hover:bg-rose-50 text-rose-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <FieldMap ring={field.ring} overlayUrl={showMap && an?.satellite.available ? `/api/fields/${field.id}/ndvi-image` : null} />
              {an?.satellite.available && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button onClick={() => setShowMap((v) => !v)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#CBD5C8] font-semibold"><Layers className="w-3.5 h-3.5" /> {showMap ? (hi ? 'सामान्य फ़ोटो' : 'Plain photo') : (hi ? 'फसल की सेहत का रंग' : 'Crop health colours')}</button>
                  <span className="flex items-center gap-1.5">{hi ? 'कमज़ोर' : 'Weak'} {['#a50026', '#f46d43', '#fee08b', '#a6d96a', '#1a9850'].map((c) => <i key={c} className="w-5 h-2.5 rounded-sm" style={{ background: c }} />)} {hi ? 'स्वस्थ' : 'Healthy'}</span>
                </div>
              )}
            </section>

            {anBusy && <div className="h-40 rounded-2xl bg-white border border-[#E2E8DF] animate-pulse" />}

            {an && !anBusy && (
              <>
                {notConfigured && <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm">{hi ? 'सैटेलाइट की चाबी (COPERNICUS) अभी नहीं जुड़ी है, इसलिए फसल की सेहत का नक्शा नहीं दिख रहा। नीचे मिट्टी और मौसम का असली डेटा है।' : 'Satellite keys (COPERNICUS) are not added yet, so crop-health maps are off. Real soil and weather data is shown below.'}</div>}
                {an.notes.filter((n) => n.startsWith('satellite:')).map((n) => <div key={n} className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs break-words">{n}</div>)}

                <section className="rounded-2xl bg-white border border-[#E2E8DF] p-5 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-black ${h[0]}`}>{hi ? h[1] : h[2]}</span>
                    {an.health.score !== null && <span className="text-3xl font-black text-[#14532D]">{an.health.score}<span className="text-base text-[#66746A]">/100</span></span>}
                    {an.health.label !== 'unknown' && <span className="text-sm font-semibold text-[#44524A]">{an.health.trend === 'up' ? (hi ? '↑ बढ़ रही है' : '↑ improving') : an.health.trend === 'down' ? (hi ? '↓ गिर रही है' : '↓ declining') : (hi ? '→ स्थिर' : '→ steady')}</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {([
                      [Satellite, hi ? 'हरियाली (NDVI)' : 'Greenness (NDVI)', last ? last.ndvi.toFixed(2) : '—'],
                      [Waves, hi ? 'फसल में पानी (NDMI)' : 'Crop water (NDMI)', last ? last.ndmi.toFixed(2) : '—'],
                      [Droplets, hi ? 'मिट्टी की नमी' : 'Soil moisture', an.soil ? `${an.soil.soilTopPct}%` : '—'],
                    ] as const).map(([I, l, v]) => <div key={l} className="rounded-xl bg-[#F8F7F0] p-3"><I className="w-5 h-5 mx-auto text-[#228B52]" /><p className="mt-1 text-xl font-black text-[#14532D]">{v}</p><p className="text-[11px] text-[#66746A] leading-tight">{l}</p></div>)}
                  </div>
                  {an.soil && <p className="text-sm text-[#44524A]">{hi ? 'पिछले 7 दिन की बारिश' : 'Rain past 7 days'}: <b>{an.soil.rainPast7Mm} mm</b> · {hi ? 'अगले 7 दिन' : 'next 7 days'}: <b>{an.soil.rainNext7Mm} mm</b> · {hi ? 'जड़ों के पास नमी' : 'root-zone moisture'}: <b>{an.soil.soilRootPct}%</b></p>}
                  {an.satellite.series.length > 1 && <div><p className="text-sm font-bold mb-1">{hi ? 'हरियाली का ग्राफ़ (पिछले ~4 महीने)' : 'Greenness trend (last ~4 months)'}</p><Trend s={an.satellite.series} /></div>}
                </section>

                {an.advice && (
                  <section className="rounded-2xl bg-white border border-[#E2E8DF] p-5 space-y-3">
                    <h2 className="flex items-center gap-2 font-black text-[#14532D]"><Sparkles className="w-5 h-5 text-[#228B52]" /> {hi ? 'आपके खेत के लिए सलाह' : 'Advice for your field'}</h2>
                    <p className="text-sm font-semibold">{an.advice.summary}</p>
                    {an.advice.actions?.map((a, i) => <div key={i} className={`rounded-xl border p-3 ${PRI[a.priority] ?? PRI.low}`}><p className="font-bold text-sm">{a.title}</p><p className="text-sm text-[#44524A]">{a.text}</p></div>)}
                  </section>
                )}
                <p className="text-center text-[11px] text-[#66746A]">{hi ? 'डेटा: Sentinel-2 (ESA), Open-Meteo। सैटेलाइट हर ~5 दिन में नई फ़ोटो देता है; बादल हों तो पुरानी दिखती है।' : 'Data: Sentinel-2 (ESA), Open-Meteo. Satellite refreshes every ~5 days; cloudy days show older scenes.'}</p>
              </>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
