'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard,
  Bot,
  ScanLine,
  CloudSun,
  Satellite,
  Calculator,
  TrendingUp,
  Store,
  Building2,
  FileText,
  GraduationCap,
  Users,
  Settings,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

export default function Sidebar() {
  const { language, t } = useLanguage();
  const pathname = usePathname();

  const navGroups = [
    {
      title: language === 'hi' ? 'स्मार्ट कृषि कार्य' : 'Core Smart Farming',
      items: [
        { href: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
        { href: '/assistant', label: t('navAssistant'), icon: Bot, badge: 'AI' },
        { href: '/disease-detection', label: t('navDisease'), icon: ScanLine },
        { href: '/weather', label: t('navWeather'), icon: CloudSun },
        { href: '/satellite-monitoring', label: t('navSatellite'), icon: Satellite },
      ]
    },
    {
      title: language === 'hi' ? 'निर्णय एवं बाजार' : 'Decisions & Market',
      items: [
        { href: '/simulator', label: t('navSimulator'), icon: Calculator },
        { href: '/profit-advisor', label: t('navProfitAdvisor'), icon: TrendingUp },
        { href: '/marketplace', label: t('navMarketplace'), icon: Store, badge: 'Bids' },
        { href: '/services', label: t('navServices'), icon: Building2 },
      ]
    },
    {
      title: language === 'hi' ? 'ज्ञान एवं सहायता' : 'Knowledge & Community',
      items: [
        { href: '/schemes', label: t('navSchemes'), icon: FileText },
        { href: '/learning', label: t('navLearning'), icon: GraduationCap },
        { href: '/community', label: t('navCommunity'), icon: Users },
        { href: '/settings', label: t('navSettings'), icon: Settings },
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[#E2E8DF] bg-white/70 backdrop-blur-md p-4 min-h-[calc(100vh-4rem)] justify-between">
      <div className="space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <h3 className="text-[11px] font-bold text-[#66746A] uppercase tracking-wider px-3">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#14532D] text-white shadow-2xs font-bold'
                        : 'text-[#17251D] hover:bg-[#F8F7F0] hover:text-[#14532D]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#86B96B]' : 'text-[#228B52]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-[#86B96B] text-[#123B2A]' : 'bg-[#E9B949]/30 text-[#123B2A]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Kisan Helpline Contact Widget at bottom */}
      <div className="mt-6 p-3.5 rounded-2xl bg-[#14532D]/5 border border-[#14532D]/15">
        <div className="flex items-center gap-2 text-[#14532D]">
          <PhoneCall className="w-4 h-4 text-[#228B52]" />
          <span className="text-xs font-bold">
            {language === 'hi' ? 'किसान कॉल सेंटर' : 'Kisan Help Desk'}
          </span>
        </div>
        <p className="text-[11px] text-[#66746A] mt-1">
          {language === 'hi' ? 'निःशुल्क सरकारी कृषि परामर्श सेवा' : 'Toll-free agricultural guidance 24/7'}
        </p>
        <a
          href="tel:18001801551"
          className="mt-2 block text-center text-xs font-bold text-white bg-[#14532D] hover:bg-[#123B2A] py-1.5 rounded-lg transition-colors shadow-2xs"
        >
          1800-180-1551
        </a>
      </div>
    </aside>
  );
}
