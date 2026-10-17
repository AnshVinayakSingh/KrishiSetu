'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { useUser } from '@/context/UserContext';
import { POLICY_BANNERS } from '@/data/policyBanners';

const input = 'w-full mt-1 rounded-lg border border-[#CBD5C8] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#86B96B]';

export default function ApplyPage() {
  const { schemeId } = useParams<{ schemeId: string }>();
  const { language } = useLanguage();
  const hi = language === 'hi';
  const user = useUser();
  const { place } = useLocation();
  const scheme = POLICY_BANNERS.find((b) => b.id === schemeId);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState('');

  if (!scheme) {
    return <AppShell><p className="text-sm text-[#66746A]">{hi ? 'योजना नहीं मिली।' : 'Scheme not found.'}</p></AppShell>;
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const v = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, schemeId: scheme.id, schemeName: scheme.title }),
      });
      const d = await res.json();
      if (res.ok) setRef(d.reference);
      else setErr(d.error === 'duplicate'
        ? (hi ? 'आप इस योजना के लिए पहले ही आवेदन कर चुके हैं।' : 'You have already applied for this scheme.')
        : (hi ? 'कृपया सभी ज़रूरी जानकारी सही भरें।' : 'Please fill all required fields correctly.'));
    } catch {
      setErr(hi ? 'नेटवर्क समस्या, दोबारा कोशिश करें।' : 'Network problem, please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-xl">
        <div className="rounded-2xl p-5 text-white mb-6" style={{ background: `linear-gradient(110deg, ${scheme.from}, ${scheme.to})` }}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{hi ? 'आवेदन फॉर्म' : 'Application Form'}</span>
          <h1 className="text-xl font-black">{hi ? scheme.titleHi : scheme.title}</h1>
          <p className="text-sm text-white/85">{hi ? scheme.taglineHi : scheme.tagline}</p>
        </div>

        {ref ? (
          <div className="rounded-2xl bg-white border border-[#E2E8DF] p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#228B52] mx-auto" />
            <h2 className="text-lg font-black text-[#14532D]">{hi ? 'आवेदन जमा हो गया' : 'Application submitted'}</h2>
            <p className="text-sm text-[#66746A]">{hi ? 'आपका संदर्भ नंबर:' : 'Your reference number:'}</p>
            <p className="text-2xl font-black tracking-wider text-[#14532D]">{ref}</p>
            <Link href="/dashboard" className="inline-block mt-2 px-5 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold">{hi ? 'डैशबोर्ड पर जाएँ' : 'Back to dashboard'}</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="rounded-2xl bg-white border border-[#E2E8DF] p-6 space-y-4">
            <label className="block text-sm font-semibold">{hi ? 'पूरा नाम *' : 'Full name *'}
              <input name="fullName" defaultValue={user?.name} required className={input} />
            </label>
            <label className="block text-sm font-semibold">{hi ? 'मोबाइल नंबर *' : 'Mobile number *'}
              <input name="phone" defaultValue={user?.phone} inputMode="numeric" maxLength={10} required className={input} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-semibold">{hi ? 'राज्य *' : 'State *'}
                <input name="state" defaultValue={place?.state} required className={input} />
              </label>
              <label className="block text-sm font-semibold">{hi ? 'जिला *' : 'District *'}
                <input name="district" defaultValue={place?.district || place?.city} required className={input} />
              </label>
            </div>
            <label className="block text-sm font-semibold">{hi ? 'गाँव' : 'Village'}
              <input name="village" className={input} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-semibold">{hi ? 'ज़मीन (एकड़)' : 'Land (acres)'}
                <input name="landAcres" type="number" step="0.1" min="0" className={input} />
              </label>
              <label className="block text-sm font-semibold">{hi ? 'मुख्य फसल' : 'Main crop'}
                <input name="crop" className={input} />
              </label>
            </div>
            {err && <p role="alert" className="text-sm font-semibold text-[#DC2626]">{err}</p>}
            <button disabled={busy} className="w-full rounded-lg bg-[#14532D] text-white font-semibold py-3 hover:bg-[#123B2A] disabled:opacity-60">
              {busy ? (hi ? 'जमा हो रहा है…' : 'Submitting…') : (hi ? 'आवेदन जमा करें' : 'Submit application')}
            </button>
            <p className="text-[11px] text-[#66746A]">{hi ? 'आधार या बैंक नंबर यहाँ न भरें।' : 'Do not enter Aadhaar or bank numbers here.'}</p>
          </form>
        )}
      </div>
    </AppShell>
  );
}
