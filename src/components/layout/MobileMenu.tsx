'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
  X,
  Sprout,
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
  PhoneCall,
  Mail,
  Languages
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  if (!isOpen) return null;

  const links = [
    { href: '/', label: t('navOverview'), icon: Sprout },
    { href: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { href: '/assistant', label: t('navAssistant'), icon: Bot, badge: 'AI' },
    { href: '/disease-detection', label: t('navDisease'), icon: ScanLine },
    { href: '/simulator', label: t('navSimulator'), icon: Calculator },
    { href: '/weather', label: t('navWeather'), icon: CloudSun },
    { href: '/satellite-monitoring', label: t('navSatellite'), icon: Satellite },
    { href: '/marketplace', label: t('navMarketplace'), icon: Store },
    { href: '/profit-advisor', label: t('navProfitAdvisor'), icon: TrendingUp },
    { href: '/services', label: t('navServices'), icon: Building2 },
    { href: '/schemes', label: t('navSchemes'), icon: FileText },
    { href: '/learning', label: t('navLearning'), icon: GraduationCap },
    { href: '/community', label: t('navCommunity'), icon: Users },
    { href: '/settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-5 z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
            <Link href="/" onClick={onClose} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#14532D] flex items-center justify-center text-white">
                <Sprout className="w-4 h-4 text-[#86B96B]" />
              </div>
              <span className="font-extrabold text-lg text-[#14532D]">KrishiSetu</span>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-[#E2E8DF] text-[#66746A] hover:bg-[#F8F7F0]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Switcher Button */}
          <div className="my-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#F8F7F0] border border-[#E2E8DF] text-xs font-bold text-[#14532D]"
            >
              <Languages className="w-4 h-4 text-[#228B52]" />
              <span>{language === 'en' ? 'हिंदी में बदलें (Switch to Hindi)' : 'Switch to English'}</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#14532D] text-white font-bold'
                      : 'text-[#17251D] hover:bg-[#F8F7F0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#86B96B]' : 'text-[#228B52]'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] bg-[#E9B949]/30 text-[#14532D] px-1.5 py-0.5 rounded font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Contact links at drawer footer */}
        <div className="pt-4 mt-6 border-t border-[#E2E8DF] space-y-2 text-xs">
          <a
            href="tel:18001801551"
            className="flex items-center gap-2 text-[#14532D] font-medium hover:underline p-1"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#228B52]" />
            <span>Kisan Helpline: 1800-180-1551</span>
          </a>
          <a
            href="mailto:support@krishisetu.in"
            className="flex items-center gap-2 text-[#66746A] hover:underline p-1"
          >
            <Mail className="w-3.5 h-3.5 text-[#228B52]" />
            <span>support@krishisetu.in</span>
          </a>
          <p className="text-[10px] text-[#66746A]/80 pt-2">
            © 2026 KrishiSetu. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
