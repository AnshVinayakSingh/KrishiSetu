'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { 
  INITIAL_BUYER_OFFERS, 
  MOCK_WEATHER_DATA 
} from '@/data/mockData';
import { 
  Sprout, 
  Bot, 
  ScanLine, 
  Store, 
  Calculator, 
  CloudSun, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Baldev Singh');
  const [userState, setUserState] = useState('Madhya Pradesh');

  const hi = language === 'hi';

  useEffect(() => {
    try {
      const stored = localStorage.getItem('krishisetu_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setUserName(u.name);
        if (u.state) setUserState(u.state);
      }
    } catch {
      // fallback
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F0] text-[#17251D]">
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMobileMenuOpen={isMobileMenuOpen} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dashboard Main Content */}
        <main className="flex-1 p-6 lg:p-10 space-y-8">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8DF]">
            <div>
              <h1 className="text-2xl font-black text-[#14532D] tracking-tight">
                {hi ? `नमस्ते, ${userName}` : `Welcome, ${userName}`}
              </h1>
              <p className="text-xs text-[#66746A] mt-1 font-medium">
                {hi 
                  ? `प्रक्षेत्र: सीहोर, ${userState} • रबी फसल सत्र 2026` 
                  : `Region: Sehore, ${userState} • Rabi Season 2026`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/marketplace"
                className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold hover:bg-[#123B2A] transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                <Sprout className="w-3.5 h-3.5 text-[#86B96B]" />
                <span>{hi ? 'फसल बेचें' : 'List Crop'}</span>
              </Link>
              <Link
                href="/assistant"
                className="px-4 py-2 rounded-xl bg-white border border-[#E2E8DF] text-[#14532D] text-xs font-bold hover:bg-[#F8F7F0] transition-all inline-flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-[#228B52]" />
                <span>{hi ? 'AI सहायक' : 'Ask AI'}</span>
              </Link>
            </div>
          </div>

          {/* Minimal 3 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: My Crop Lot */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8DF] shadow-xs hover:border-[#14532D]/30 transition-all flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#66746A] uppercase tracking-wider block">
                  {hi ? 'सक्रिय फसल लॉट' : 'Active Crop Lot'}
                </span>
                <div className="mt-2 text-2xl font-black text-[#14532D]">
                  120 <span className="text-xs font-normal text-[#66746A]">Quintals</span>
                </div>
                <p className="text-xs text-[#228B52] font-semibold mt-1">
                  {hi ? 'शरबती गेहूँ (ग्रेड A)' : 'Sharbati Wheat (Grade A)'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E2E8DF]/60 flex items-center justify-between text-xs">
                <span className="text-[#66746A]">{hi ? 'मांग भाव: ₹2,900' : 'Asking: ₹2,900/Qtl'}</span>
                <Link href="/marketplace" className="text-[#14532D] font-bold hover:underline">
                  {hi ? 'देखें →' : 'View →'}
                </Link>
              </div>
            </div>

            {/* Card 2: Best Buyer Bid */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8DF] shadow-xs hover:border-[#14532D]/30 transition-all flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#66746A] uppercase tracking-wider block">
                  {hi ? 'सर्वश्रेष्ठ व्यापारी बोली' : 'Top Buyer Offer'}
                </span>
                <div className="mt-2 text-2xl font-black text-[#14532D]">
                  ₹2,840 <span className="text-xs font-normal text-[#66746A]">/ Qtl</span>
                </div>
                <p className="text-xs text-amber-700 font-semibold mt-1">
                  {hi ? 'मालवा एग्रो मिल्स (100 क्विंटल)' : 'Malwa Agro Flour Mills (100 Qtl)'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E2E8DF]/60 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold">{hi ? '1 लंबित बोली' : '1 Pending Offer'}</span>
                <Link href="/marketplace" className="text-[#14532D] font-bold hover:underline">
                  {hi ? 'मोलभाव करें →' : 'Negotiate →'}
                </Link>
              </div>
            </div>

            {/* Card 3: Weather Alert */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8DF] shadow-xs hover:border-[#14532D]/30 transition-all flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#66746A] uppercase tracking-wider block">
                  {hi ? 'मौसम पूर्वानुमान' : 'Weather Outlook'}
                </span>
                <div className="mt-2 text-2xl font-black text-[#14532D]">
                  29°C <span className="text-xs font-normal text-[#66746A]">Sehore</span>
                </div>
                <p className="text-xs text-amber-700 font-semibold mt-1">
                  {hi ? 'शुक्रवार को बारिश की संभावना' : 'Rain anticipated on Friday'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E2E8DF]/60 flex items-center justify-between text-xs">
                <span className="text-[#66746A]">{hi ? 'छिड़काव टालें' : 'Spray: Postpone'}</span>
                <Link href="/weather" className="text-[#14532D] font-bold hover:underline">
                  {hi ? '7-दिन मौसम →' : '7-Day View →'}
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions (4 Clean Minimal Tiles) */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
              {hi ? 'त्वरित सुविधाएं' : 'Quick Actions'}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/disease-detection"
                className="p-5 rounded-2xl bg-white border border-[#E2E8DF] hover:border-[#14532D] hover:shadow-sm transition-all group flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-[#86B96B]/15 text-[#14532D] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ScanLine className="w-5 h-5 text-[#228B52]" />
                </div>
                <span className="text-xs font-bold text-[#14532D]">
                  {hi ? 'फसल रोग जांच' : 'Disease Detection'}
                </span>
                <span className="text-[10px] text-[#66746A] mt-1">
                  {hi ? 'पत्ती फोटो से जांचें' : 'Photo Diagnosis'}
                </span>
              </Link>

              <Link
                href="/marketplace"
                className="p-5 rounded-2xl bg-white border border-[#E2E8DF] hover:border-[#14532D] hover:shadow-sm transition-all group flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-[#86B96B]/15 text-[#14532D] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Store className="w-5 h-5 text-[#228B52]" />
                </div>
                <span className="text-xs font-bold text-[#14532D]">
                  {hi ? 'सीधा बाजार' : 'Direct Market'}
                </span>
                <span className="text-[10px] text-[#66746A] mt-1">
                  {hi ? 'बिना बिचौलियों के' : 'Sell to Buyers'}
                </span>
              </Link>

              <Link
                href="/simulator"
                className="p-5 rounded-2xl bg-white border border-[#E2E8DF] hover:border-[#14532D] hover:shadow-sm transition-all group flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-[#86B96B]/15 text-[#14532D] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Calculator className="w-5 h-5 text-[#228B52]" />
                </div>
                <span className="text-xs font-bold text-[#14532D]">
                  {hi ? 'फार्मिंग सिम्युलेटर' : 'Decision Simulator'}
                </span>
                <span className="text-[10px] text-[#66746A] mt-1">
                  {hi ? 'व्हाट-इफ तुलना' : 'What-If Scenarios'}
                </span>
              </Link>

              <Link
                href="/assistant"
                className="p-5 rounded-2xl bg-white border border-[#E2E8DF] hover:border-[#14532D] hover:shadow-sm transition-all group flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-[#14532D]/10 text-[#14532D] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Bot className="w-5 h-5 text-[#14532D]" />
                </div>
                <span className="text-xs font-bold text-[#14532D]">
                  {hi ? 'कृषि AI सहायक' : 'AI Assistant'}
                </span>
                <span className="text-[10px] text-[#66746A] mt-1">
                  {hi ? 'आवाज व सवाल' : 'Voice & Chat'}
                </span>
              </Link>
            </div>
          </div>

          {/* Clean 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Buyer Bids */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8DF] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                  {hi ? 'ताजा व्यापारी बोलियां' : 'Recent Buyer Bids'}
                </h3>
                <Link href="/marketplace" className="text-xs text-[#228B52] font-semibold hover:underline">
                  {hi ? 'सभी देखें →' : 'View All →'}
                </Link>
              </div>

              <div className="divide-y divide-[#E2E8DF]/60">
                {INITIAL_BUYER_OFFERS.slice(0, 2).map((offer) => (
                  <div key={offer.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-[#14532D] text-xs">{offer.buyerCompany}</p>
                      <p className="text-[11px] text-[#66746A] mt-0.5">{offer.quantityRequested} Qtl • {offer.timestamp}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-[#14532D] text-sm block">₹{offer.offeredPricePerUnit}</span>
                      <Link
                        href="/marketplace"
                        className="text-[11px] text-[#228B52] font-semibold hover:underline"
                      >
                        {hi ? 'मोलभाव करें' : 'Negotiate'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Agronomy Tip & Scheme */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8DF] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#E9B949]" />
                  <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                    {hi ? 'आज की कृषि सलाह' : 'Agronomy Advisory'}
                  </h3>
                </div>
                <h4 className="text-xs font-bold text-[#14532D]">
                  {hi ? 'गेहूँ में पहली सिंचाई (CRI अवस्था)' : 'First Irrigation for Wheat (CRI Stage)'}
                </h4>
                <p className="text-xs text-[#66746A] mt-1 leading-relaxed">
                  {hi
                    ? 'बुवाई के 21-25 दिनों बाद ताज मूल अवस्था में हल्की सिंचाई करें। इससे कल्लों का अच्छा विकास होता है।'
                    : 'Apply crown-root initiation irrigation at 21-25 days after sowing. Promotes healthy tillering.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2E8DF]/60 flex items-center justify-between">
                <span className="text-[11px] text-[#66746A]">
                  {hi ? 'PM-KISAN DBT: सक्रिय' : 'PM-KISAN DBT: Active'}
                </span>
                <Link href="/schemes" className="text-xs font-bold text-[#14532D] hover:underline">
                  {hi ? 'योजनाएं देखें →' : 'Govt Schemes →'}
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
