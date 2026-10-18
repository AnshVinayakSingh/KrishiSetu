'use client';

import React, { useRef, useState } from 'react';
import { Camera, Home, ImagePlus, IndianRupee, Leaf, Pill, RotateCcw, ShieldCheck, Sprout, Stethoscope, AlertTriangle, Phone } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';

interface Result {
  isPlant: boolean; crop: string; problem: string; severity: 'low' | 'medium' | 'high'; confidence: number; summary: string;
  symptoms: string[]; causes: string[];
  homeRemedies: { name: string; how: string }[];
  medicines: { name: string; use: string; dose: string; costInr: number }[];
  extraCrops: { name: string; why: string }[];
  cost: { homeInr: number; medicineInr: number; labourInr: number; totalInr: number; note: string };
  prevention: string[]; seeExpert: string;
}

// Shrink the photo before upload: faster and cheaper, still clear enough for diagnosis.
const shrink = (file: File) => new Promise<string>((ok, no) => {
  const img = new Image(); const url = URL.createObjectURL(file);
  img.onload = () => {
    const s = Math.min(1, 1024 / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = img.width * s; c.height = img.height * s;
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
    ok(c.toDataURL('image/jpeg', 0.8));
  };
  img.onerror = () => no(new Error('img')); img.src = url;
});

const rs = (n: number) => `₹${Math.round(n || 0).toLocaleString('en-IN')}`;
const SEV = { low: ['bg-emerald-100 text-emerald-800', 'कम', 'Low'], medium: ['bg-amber-100 text-amber-800', 'मध्यम', 'Medium'], high: ['bg-rose-100 text-rose-800', 'ज़्यादा', 'High'] } as const;

function Section({ icon: Icon, title, color, children }: { icon: React.ElementType; title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white border border-[#E2E8DF] overflow-hidden">
      <h2 className={`flex items-center gap-2 px-5 py-3 text-base font-black ${color}`}><Icon className="w-5 h-5" /> {title}</h2>
      <div className="p-5 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}
const Bullets = ({ items }: { items: string[] }) => <ul className="list-disc pl-5 space-y-1.5">{items?.map((x, i) => <li key={i}>{x}</li>)}</ul>;

export default function DiseasePage() {
  const { language } = useLanguage();
  const { place } = useLocation();
  const hi = language === 'hi';
  const camRef = useRef<HTMLInputElement>(null);
  const galRef = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState('');
  const [crop, setCrop] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [res, setRes] = useState<Result | null>(null);

  const pick = async (f?: File) => {
    if (!f) return; setErr(''); setRes(null);
    try { setImg(await shrink(f)); } catch { setErr(hi ? 'फ़ोटो खुल नहीं पाई, दूसरी चुनें।' : 'Could not open the photo, pick another.'); }
  };

  const analyse = async () => {
    setBusy(true); setErr(''); setRes(null);
    try {
      const r = await fetch('/api/disease-detection', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: img.split(',')[1], mime: 'image/jpeg', crop, note, language, location: place ? `${place.district || place.city}, ${place.state}` : '' }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.success) setErr(r.status === 429 ? (hi ? 'थोड़ी देर बाद कोशिश करें।' : 'Too many tries, wait a minute.') : r.status === 503 ? (hi ? 'AI सेट नहीं है (GEMINI_API_KEY)।' : 'AI not set up (GEMINI_API_KEY missing).') : (hi ? 'जाँच नहीं हो पाई, दोबारा कोशिश करें।' : 'Analysis failed, please try again.'));
      else setRes(j.result);
    } catch { setErr(hi ? 'नेटवर्क समस्या।' : 'Network problem.'); }
    finally { setBusy(false); }
  };

  const reset = () => { setImg(''); setRes(null); setErr(''); setNote(''); setCrop(''); };
  const sev = res ? SEV[res.severity] ?? SEV.medium : SEV.medium;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-black text-[#14532D]">{hi ? 'फसल की जाँच' : 'Crop Doctor'}</h1>
          <p className="text-sm text-[#66746A]">{hi ? 'पत्ते या फसल की साफ़ फ़ोटो डालें, हम बताएंगे क्या दिक्कत है और क्या करें।' : 'Add a clear photo of the leaf or crop. We tell you the problem and what to do.'}</p>
        </div>

        {!res && (
          <div className="rounded-2xl bg-white border border-[#E2E8DF] p-5 space-y-4">
            <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => pick(e.target.files?.[0])} />
            <input ref={galRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
            {img ? (
              <div className="relative"><img src={img} alt="" className="w-full max-h-80 object-contain rounded-xl bg-[#F8F7F0]" />
                <button onClick={() => setImg('')} className="absolute top-2 right-2 px-3 py-1 rounded-full bg-white/90 text-xs font-bold shadow">{hi ? 'बदलें' : 'Change'}</button></div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => camRef.current?.click()} className="flex flex-col items-center gap-2 py-9 rounded-2xl bg-[#14532D] text-white font-bold"><Camera className="w-9 h-9" />{hi ? 'फ़ोटो खींचें' : 'Take photo'}</button>
                <button onClick={() => galRef.current?.click()} className="flex flex-col items-center gap-2 py-9 rounded-2xl border-2 border-dashed border-[#86B96B] text-[#14532D] font-bold"><ImagePlus className="w-9 h-9" />{hi ? 'गैलरी से चुनें' : 'From gallery'}</button>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="text-sm font-semibold">{hi ? 'फसल का नाम (ज़रूरी नहीं)' : 'Crop name (optional)'}
                <input value={crop} onChange={(e) => setCrop(e.target.value)} className="w-full mt-1 rounded-lg border border-[#CBD5C8] px-3 py-2.5 text-sm" placeholder={hi ? 'जैसे गेहूँ, टमाटर' : 'e.g. Wheat, Tomato'} /></label>
              <label className="text-sm font-semibold">{hi ? 'कुछ और बताना है?' : 'Anything else?'}
                <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full mt-1 rounded-lg border border-[#CBD5C8] px-3 py-2.5 text-sm" placeholder={hi ? 'जैसे 5 दिन से पीले धब्बे' : 'e.g. yellow spots for 5 days'} /></label>
            </div>
            {err && <p role="alert" className="text-sm font-semibold text-rose-600">{err}</p>}
            <button onClick={analyse} disabled={!img || busy} className="w-full py-3.5 rounded-xl bg-[#14532D] text-white font-bold disabled:opacity-40">
              {busy ? (hi ? 'जाँच हो रही है…' : 'Checking…') : (hi ? 'जाँच करें' : 'Check my crop')}
            </button>
          </div>
        )}

        {res && !res.isPlant && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 space-y-3"><p className="font-semibold">{res.summary}</p>
            <button onClick={reset} className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-sm font-bold">{hi ? 'दूसरी फ़ोटो डालें' : 'Try another photo'}</button></div>
        )}

        {res?.isPlant && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-[#E2E8DF] p-5 flex gap-4 items-start">
              {img && <img src={img} alt="" className="w-24 h-24 rounded-xl object-cover shrink-0" />}
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#66746A] uppercase tracking-wider">{res.crop}</p>
                <h2 className="text-xl font-black text-[#14532D]">{res.problem}</h2>
                <div className="mt-1.5 flex flex-wrap gap-2 text-xs font-bold">
                  <span className={`px-2.5 py-1 rounded-full ${sev[0]}`}>{hi ? 'गंभीरता' : 'Severity'}: {hi ? sev[1] : sev[2]}</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F1F3EE]">{hi ? 'भरोसा' : 'Confidence'}: {Math.round(res.confidence)}%</span>
                </div>
                <p className="mt-2 text-sm">{res.summary}</p>
              </div>
            </div>

            <Section icon={Stethoscope} title={hi ? 'क्या दिक्कत है' : 'What is wrong'} color="text-rose-700 bg-rose-50">
              <p className="font-bold mb-1">{hi ? 'लक्षण' : 'Signs'}</p><Bullets items={res.symptoms} />
              <p className="font-bold mt-3 mb-1">{hi ? 'कारण' : 'Causes'}</p><Bullets items={res.causes} />
            </Section>

            <Section icon={Home} title={hi ? 'घरेलू उपचार' : 'Home remedies'} color="text-emerald-800 bg-emerald-50">
              <div className="space-y-3">{res.homeRemedies?.map((r, i) => <div key={i}><p className="font-bold">{r.name}</p><p className="text-[#44524A]">{r.how}</p></div>)}</div>
            </Section>

            <Section icon={Pill} title={hi ? 'दवा (ज़रूरत हो तो)' : 'Medicines (if needed)'} color="text-blue-800 bg-blue-50">
              <div className="space-y-3">{res.medicines?.map((m, i) => (
                <div key={i} className="flex justify-between gap-3 border-b border-[#E2E8DF] pb-3 last:border-0 last:pb-0">
                  <div><p className="font-bold">{m.name}</p><p className="text-[#44524A]">{m.use}</p><p className="text-xs text-[#66746A] mt-0.5">{hi ? 'मात्रा' : 'Dose'}: {m.dose}</p></div>
                  <p className="font-black text-[#14532D] whitespace-nowrap">~{rs(m.costInr)}</p>
                </div>))}</div>
              <p className="mt-3 text-xs text-[#66746A]">{hi ? 'दवा की मात्रा पैकेट के लेबल के अनुसार रखें और दुकानदार या KVK से पूछ लें।' : 'Follow the label dose and confirm with your shop or KVK.'}</p>
            </Section>

            <Section icon={Sprout} title={hi ? 'साथ में लगाने लायक फसल' : 'Crops to add'} color="text-lime-800 bg-lime-50">
              <div className="space-y-2.5">{res.extraCrops?.map((c, i) => <div key={i}><p className="font-bold">{c.name}</p><p className="text-[#44524A]">{c.why}</p></div>)}</div>
            </Section>

            <Section icon={IndianRupee} title={hi ? 'अनुमानित खर्च (प्रति एकड़)' : 'Estimated cost (per acre)'} color="text-amber-800 bg-amber-50">
              <div className="space-y-2">
                {([[hi ? 'घरेलू उपचार' : 'Home remedies', res.cost?.homeInr], [hi ? 'दवा' : 'Medicines', res.cost?.medicineInr], [hi ? 'मज़दूरी' : 'Labour', res.cost?.labourInr]] as const).map(([k, v]) => <div key={k} className="flex justify-between"><span>{k}</span><span className="font-semibold">{rs(v)}</span></div>)}
                <div className="flex justify-between border-t border-[#E2E8DF] pt-2 text-lg font-black text-[#14532D]"><span>{hi ? 'कुल' : 'Total'}</span><span>{rs(res.cost?.totalInr)}</span></div>
              </div>
              <p className="mt-2 text-xs text-[#66746A]">{res.cost?.note} {hi ? '(यह सिर्फ़ अंदाज़ा है, असली भाव दुकान पर पूछें।)' : '(Rough estimate, check actual prices at your shop.)'}</p>
            </Section>

            <Section icon={ShieldCheck} title={hi ? 'आगे बचाव कैसे करें' : 'How to prevent it next time'} color="text-teal-800 bg-teal-50"><Bullets items={res.prevention} /></Section>

            <div className="rounded-2xl bg-[#F1F3EE] p-4 text-sm flex gap-3"><AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div><p>{res.seeExpert}</p><p className="mt-1 flex items-center gap-1.5 font-bold text-[#14532D]"><Phone className="w-4 h-4" /> {hi ? 'किसान कॉल सेंटर' : 'Kisan Call Centre'}: 1800-180-1551</p></div></div>

            <button onClick={reset} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#14532D] text-[#14532D] font-bold"><RotateCcw className="w-4 h-4" /> {hi ? 'नई फ़ोटो जाँचें' : 'Check another photo'}</button>
            <p className="text-center text-[11px] text-[#66746A] flex items-center justify-center gap-1"><Leaf className="w-3 h-3" /> {hi ? 'AI की सलाह प्रारंभिक है, पक्का करने के लिए कृषि अधिकारी से मिलें।' : 'AI advice is a first guide. Confirm with an agriculture officer.'}</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
