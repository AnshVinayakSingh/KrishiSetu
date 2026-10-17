'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const field = 'w-full mt-1 rounded-lg border border-[#CBD5C8] bg-white px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#86B96B]';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { t } = useLanguage();
  const router = useRouter();
  const signup = mode === 'signup';
  const [msg, setMsg] = useState<{ text: string; bad: boolean } | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const bad = (k: string) => setMsg({ text: t(k), bad: true });
    if (signup) {
      if (v.name.trim().length < 2) return bad('lpErrName');
      if (!/^[6-9]\d{9}$/.test(v.phone)) return bad('lpErrPhone');
      if (v.pw.length < 6) return bad('lpErrPass');
    }
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(v),
      });
      const d = await res.json();
      if (!res.ok) return bad(d.error ?? 'lpErrWrong');
    } catch {
      return bad('lpErrWrong');
    }
    setMsg({ text: t('lpOk'), bad: false });
    setTimeout(() => router.push('/dashboard'), 600);
  };

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-sm">
      <h1 className="text-3xl font-bold text-[#14532D]">{signup ? t('lpCreate') : t('lpWelcome')}</h1>
      <p className="mt-2 mb-6 text-[#66746A]">{t('lpSub')}</p>
      {signup && (
        <label className="block mb-4 text-sm font-semibold">{t('lpName')}
          <input name="name" autoComplete="name" className={field} />
        </label>
      )}
      <label className="block mb-4 text-sm font-semibold">{t('lpPhone')}
        <input name="phone" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel" className={field} />
      </label>
      {signup && (
        <label className="block mb-4 text-sm font-semibold">{t('lpRole')}
          <select name="role" className={field}>
            <option value="farmer">{t('lpFarmer')}</option>
            <option value="buyer">{t('lpBuyer')}</option>
          </select>
        </label>
      )}
      <label className="block mb-4 text-sm font-semibold">{t('lpPass')}
        <input name="pw" type="password" autoComplete={signup ? 'new-password' : 'current-password'} className={field} />
      </label>
      {msg && <p role="alert" className={`mb-4 text-sm font-semibold ${msg.bad ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>{msg.text}</p>}
      <button className="w-full rounded-lg bg-[#14532D] text-white font-semibold py-3 hover:bg-[#123B2A] focus:outline-none focus:ring-2 focus:ring-[#86B96B]">
        {signup ? t('lpDoSignup') : t('lpDoLogin')}
      </button>
      <p className="mt-5 text-sm text-[#66746A]">
        {signup ? t('lpHave') : t('lpNew')}{' '}
        <Link className="font-semibold text-[#14532D] underline" href={signup ? '/login' : '/signup'}>{signup ? t('lpLogin') : t('lpSignup')}</Link>
      </p>
      <p className="mt-2 text-sm"><Link className="text-[#14532D] underline" href="/">{t('lpBack')}</Link></p>
    </form>
  );
}
