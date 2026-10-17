'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function Logo() {
  const { t } = useLanguage();
  return (
    <Link href="/" className="flex items-center gap-2 text-[#14532D] font-bold text-xl" aria-label={t('appName')}>
      <svg width="26" height="26" viewBox="0 0 64 64" fill="none" stroke="#14532D" strokeWidth="5" strokeLinecap="round" aria-hidden="true">
        <path d="M32 54V28M32 38c-9 0-13-5-13-13 9 0 13 5 13 13zM32 32c0-8 4-13 13-13 0 8-4 13-13 13z" />
      </svg>
      {t('appName')}
    </Link>
  );
}

export default function MinimalBar({ cta = false }: { cta?: boolean }) {
  const { setLanguage, language, t } = useLanguage();
  return (
    <header className="border-b border-[#E2E8DF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#14532D] hover:bg-[#EEF3EA] focus:outline-none focus:ring-2 focus:ring-[#86B96B]"
          >
            {t('languageToggle')}
          </button>
          {cta && (
            <>
              <Link href="/login" className="px-3 py-1.5 text-sm font-semibold text-[#14532D] hover:underline">{t('lpLogin')}</Link>
              <Link href="/signup" className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#14532D] text-white hover:bg-[#123B2A] focus:outline-none focus:ring-2 focus:ring-[#86B96B]">{t('lpSignup')}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
