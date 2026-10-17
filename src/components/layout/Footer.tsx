'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sprout, PhoneCall, Mail, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="w-full bg-[#123B2A] text-white border-t border-[#14532D] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#86B96B] flex items-center justify-center text-[#123B2A] font-bold shadow-sm">
                <Sprout className="w-5 h-5 text-[#123B2A]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Krishi<span className="text-[#86B96B]">Setu</span>
              </span>
            </Link>
            <p className="text-xs text-white/70 leading-relaxed">
              {language === 'hi' 
                ? 'परंपरागत खेती से स्मार्ट खेती तक — भारतीय किसान भाइयों के लिए समर्पित निर्णय-समर्थन, रोग निदान और सीधा मंडी व्यापार मंच।'
                : 'Bridging traditional Indian agriculture to precision smart farming through AI disease diagnostics, satellite irrigation, and transparent direct markets.'
              }
            </p>
            <div className="pt-2 text-xs text-[#E9B949] font-medium flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              <span>{language === 'hi' ? 'भारतीय किसान का सच्चा साथी' : 'Built for Indian Agriculture'}</span>
            </div>
          </div>

          {/* Col 2: Core Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#86B96B] uppercase tracking-wider">
              {language === 'hi' ? 'स्मार्ट समाधान' : 'Smart Solutions'}
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/assistant" className="hover:text-[#E9B949] transition-colors">
                  {t('navAssistant')}
                </Link>
              </li>
              <li>
                <Link href="/disease-detection" className="hover:text-[#E9B949] transition-colors">
                  {t('navDisease')}
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-[#E9B949] transition-colors">
                  {t('navSimulator')}
                </Link>
              </li>
              <li>
                <Link href="/satellite-monitoring" className="hover:text-[#E9B949] transition-colors">
                  {t('navSatellite')}
                </Link>
              </li>
              <li>
                <Link href="/weather" className="hover:text-[#E9B949] transition-colors">
                  {t('navWeather')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Trade & Schemes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#86B96B] uppercase tracking-wider">
              {language === 'hi' ? 'बाजार व सरकारी योजनाएं' : 'Market & Governance'}
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/marketplace" className="hover:text-[#E9B949] transition-colors">
                  {t('navMarketplace')}
                </Link>
              </li>
              <li>
                <Link href="/profit-advisor" className="hover:text-[#E9B949] transition-colors">
                  {t('navProfitAdvisor')}
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-[#E9B949] transition-colors">
                  {t('navSchemes')} (PM-KISAN, PMFBY)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#E9B949] transition-colors">
                  {t('navServices')} (IFFCO, Seeds)
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#E9B949] transition-colors">
                  {t('navCommunity')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Helpline & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#86B96B] uppercase tracking-wider">
              {language === 'hi' ? 'किसान सहायता केंद्र' : 'Kisan Help & Support'}
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#E9B949] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] text-white/60">
                    {language === 'hi' ? 'टोल-फ्री किसान कॉल सेंटर:' : 'Toll-Free Kisan Call Centre:'}
                  </span>
                  <a 
                    href="tel:18001801551" 
                    className="text-white hover:text-[#E9B949] font-bold text-sm tracking-wide"
                  >
                    1800-180-1551
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#E9B949] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] text-white/60">Email Support:</span>
                  <a 
                    href="mailto:support@krishisetu.in" 
                    className="text-white hover:text-[#E9B949] font-medium"
                  >
                    support@krishisetu.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E9B949] shrink-0 mt-0.5" />
                <span className="text-white/70">
                  Krishi Vigyan Bhavan, Pusa Campus, New Delhi 110012
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/60">
          <p>
            {t('copyrightYear')}
          </p>
          <div className="flex items-center gap-2 text-white/80">
            <ShieldCheck className="w-3.5 h-3.5 text-[#86B96B]" />
            <span>
              {language === 'hi' 
                ? 'निर्णय-समर्थन प्रणाली — स्थानीय KVK अधिकारियों से पुष्टि अनुशंसित।'
                : 'Decision support system — consult local KVK agronomists for localized interventions.'
              }
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
