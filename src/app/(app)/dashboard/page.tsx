'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import WeatherCard from '@/components/dashboard/WeatherCard';
import PolicyBanner from '@/components/layout/PolicyBanner';
import MandiPrices from '@/components/dashboard/MandiPrices';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from '@/context/LocationContext';
import { useUser } from '@/context/UserContext';

export default function DashboardPage() {
  const { language } = useLanguage();
  const { place } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userName = useUser()?.name ?? '';
  const hi = language === 'hi';

  const where = place ? [place.city || place.district, place.state].filter(Boolean).join(', ') : '';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F0] text-[#17251D]">
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMobileMenuOpen={isMobileMenuOpen} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 space-y-6">
          <PolicyBanner />
          <div className="pb-4 border-b border-[#E2E8DF]">
            <h1 className="text-2xl font-black text-[#14532D] tracking-tight">
              {hi ? `नमस्ते${userName ? `, ${userName}` : ''}` : `Welcome${userName ? `, ${userName}` : ''}`}
            </h1>
            {where && <p className="text-xs text-[#66746A] mt-1 font-medium">📍 {where}</p>}
          </div>

          <WeatherCard />
          <MandiPrices />
        </main>
      </div>

      <Footer />
    </div>
  );
}
