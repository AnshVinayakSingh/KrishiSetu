'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import PolicyBanner from './PolicyBanner';
import { Sprout, Languages, MapPin, Bell, Menu, X } from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Header({ onToggleMobileMenu, isMobileMenuOpen }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const { place } = useLocation();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const locationLabel = place ? [place.city || place.district, place.state].filter(Boolean).join(', ') : (language === 'hi' ? 'लोकेशन...' : 'Locating...');

  return (
    <>
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E8DF] bg-white/90 backdrop-blur-md">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark - Clickable to Home */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#14532D] flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 border border-[#86B96B]/30">
            <Sprout className="w-5 h-5 text-[#86B96B]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-[#14532D]">
              Krishi<span className="text-[#228B52]">Setu</span>
            </span>
            <span className="text-[10px] text-[#66746A] -mt-1 font-medium hidden sm:inline">
              {language === 'hi' ? 'परंपरागत से स्मार्ट खेती' : 'Smart Agriculture Bridge'}
            </span>
          </div>
        </Link>

        {/* Right Action Tools: Language, Location, Notifications, Mobile Drawer */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Pill */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E2E8DF] bg-white text-xs font-semibold text-[#14532D] hover:bg-[#F8F7F0] hover:border-[#14532D]/40 transition-all shadow-2xs"
            title={t('switchLanguage')}
          >
            <Languages className="w-3.5 h-3.5 text-[#228B52]" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
          <button
            onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/'); }}
            className="px-3 py-1.5 rounded-full border border-[#E2E8DF] bg-white text-xs font-semibold text-[#14532D] hover:bg-[#F8F7F0]"
          >
            {t('lpLogout')}
          </button>

          {/* Live detected location */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8DF] bg-[#F8F7F0] text-xs font-medium text-[#17251D]">
            <MapPin className="w-3.5 h-3.5 text-[#228B52]" />
            <span className="truncate max-w-[140px]">{locationLabel}</span>
          </div>

          {/* Notifications Modal Pill */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationModal(!showNotificationModal)}
              className="relative p-2 rounded-lg border border-[#E2E8DF] text-[#17251D] hover:bg-[#F8F7F0] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#14532D]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E9B949]" />
            </button>

            {showNotificationModal && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl glass-dropdown p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
                  <span className="text-xs font-bold text-[#14532D]">
                    {language === 'hi' ? 'नवीनतम सूचनाएं' : 'Farm Alerts & Updates'}
                  </span>
                  <span className="text-[10px] bg-[#86B96B]/20 text-[#14532D] px-1.5 py-0.5 rounded font-medium">
                    2 New
                  </span>
                </div>
                <div className="divide-y divide-[#E2E8DF]/60 mt-2 space-y-2">
                  <div className="pt-2 text-xs">
                    <p className="font-semibold text-[#14532D]">
                      {language === 'hi' ? 'मौसम चेतावनी: शुक्रवार को बारिश' : 'Weather Alert: Rain Expected Friday'}
                    </p>
                    <p className="text-[11px] text-[#66746A] mt-0.5">
                      {language === 'hi' ? 'छिड़काव टालें और कटी उपज सुरक्षित रखें।' : 'Postpone pesticide spraying and secure open crop heaps.'}
                    </p>
                  </div>
                  <div className="pt-2 text-xs">
                    <p className="font-semibold text-[#14532D]">
                      {language === 'hi' ? 'नई व्यापारी बोली: ₹2,840/क्विंटल' : 'New Buyer Bid: ₹2,840/Qtl'}
                    </p>
                    <p className="text-[11px] text-[#66746A] mt-0.5">
                      {language === 'hi' ? 'मालवा एग्रो मिल्स ने आपके शरबती गेहूँ पर बोली लगाई।' : 'Malwa Agro Flour Mills placed a bid on your Sharbati Wheat.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg border border-[#E2E8DF] text-[#14532D] hover:bg-[#F8F7F0] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
    <PolicyBanner />
    </>
  );
}
