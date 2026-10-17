'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { MANDI_PRICES } from '@/data/mockData';
import { 
  Sprout, 
  PhoneCall, 
  Languages, 
  MapPin, 
  Bell, 
  Menu, 
  X, 
  TrendingUp, 
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Header({ onToggleMobileMenu, isMobileMenuOpen }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState('Sehore, MP');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const locations = [
    'Sehore, MP',
    'Ludhiana, Punjab',
    'Karnal, Haryana',
    'Nashik, Maharashtra',
    'Kota, Rajasthan',
    'Agra, UP',
    'Kolar, Karnataka'
  ];

  const navLinks = [
    { href: '/', label: t('navOverview') },
    { href: '/dashboard', label: t('navDashboard') },
    { href: '/assistant', label: t('navAssistant'), highlight: true },
    { href: '/disease-detection', label: t('navDisease') },
    { href: '/marketplace', label: t('navMarketplace') },
    { href: '/schemes', label: t('navSchemes') },
    { href: '/weather', label: t('navWeather') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col border-b border-[#E2E8DF] bg-white/90 backdrop-blur-md">
      {/* Top Ticker Bar: Agmarknet Mandi Benchmark Rates */}
      <div className="w-full bg-[#123B2A] text-white text-xs py-1.5 px-3 sm:px-6 flex items-center justify-between border-b border-[#14532D]">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="flex items-center gap-1.5 font-semibold text-[#86B96B] shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('mandiTickerLabel')}:</span>
            <span className="sm:hidden">मंडी भाव:</span>
          </span>
          <div className="flex items-center gap-4 animate-none overflow-x-auto no-scrollbar scroll-smooth">
            {MANDI_PRICES.slice(0, 4).map((item) => (
              <span key={item.id} className="inline-flex items-center gap-1.5 shrink-0 bg-white/10 px-2 py-0.5 rounded text-[11px]">
                <span className="text-white font-medium">{language === 'hi' ? item.cropHi : item.crop}</span>
                <span className="text-[#E9B949] font-bold">₹{item.pricePerQuintal}</span>
                <span className={`text-[10px] ${item.change >= 0 ? 'text-[#86B96B]' : 'text-rose-300'}`}>
                  {item.change >= 0 ? `+₹${item.change}` : `-₹${Math.abs(item.change)}`}
                </span>
                <span className="text-white/60 text-[10px]">({item.mandi.split(' ')[0]})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Toll-free Kisan Helpline Clickable */}
        <div className="hidden lg:flex items-center gap-2 text-[#86B96B] shrink-0 pl-3">
          <PhoneCall className="w-3 h-3 text-[#E9B949]" />
          <span className="text-white/80">{t('kisanCallCenter')}:</span>
          <a 
            href="tel:18001801551" 
            className="text-[#E9B949] hover:underline font-bold tracking-wide"
            title="Toll Free Kisan Call Centre"
          >
            1800-180-1551
          </a>
        </div>
      </div>

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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#14532D] text-white shadow-xs' 
                    : link.highlight
                    ? 'text-[#14532D] bg-[#86B96B]/20 hover:bg-[#86B96B]/30 font-semibold'
                    : 'text-[#17251D] hover:bg-black/5 hover:text-[#14532D]'
                }`}
              >
                {link.highlight && <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#228B52]" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

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
            onClick={() => { localStorage.removeItem('krishisetu_user'); router.push('/'); }}
            className="px-3 py-1.5 rounded-full border border-[#E2E8DF] bg-white text-xs font-semibold text-[#14532D] hover:bg-[#F8F7F0]"
          >
            {t('lpLogout')}
          </button>

          {/* Location Selector Dropdown Pill */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowLocationModal(!showLocationModal)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8DF] bg-[#F8F7F0] text-xs font-medium text-[#17251D] hover:bg-white transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[#228B52]" />
              <span className="truncate max-w-[90px]">{selectedLocation}</span>
            </button>

            {showLocationModal && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl glass-dropdown p-2 z-50">
                <div className="text-[11px] font-semibold text-[#66746A] px-2 py-1 uppercase tracking-wider">
                  {t('selectLocation')}
                </div>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationModal(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded-lg transition-colors ${
                      selectedLocation === loc 
                        ? 'bg-[#14532D] text-white font-medium' 
                        : 'text-[#17251D] hover:bg-[#F8F7F0]'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
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
            className="md:hidden p-2 rounded-lg border border-[#E2E8DF] text-[#14532D] hover:bg-[#F8F7F0] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
