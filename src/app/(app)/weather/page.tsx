'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_WEATHER_DATA } from '@/data/mockData';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Sun, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Calendar,
  CloudRain,
  Compass
} from 'lucide-react';

export default function WeatherPage() {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState('Sehore / Bhopal Ag-Zone');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const clusters = [
    'Sehore / Bhopal Ag-Zone, MP',
    'Ludhiana Grain Belt, Punjab',
    'Karnal Agro-Climatic Zone, Haryana',
    'Nashik Horticulture Cluster, Maharashtra',
    'Kota Chambal Basin, Rajasthan',
    'Kolar Vegetable Belt, Karnataka'
  ];

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const weather = MOCK_WEATHER_DATA;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F0] text-[#17251D]">
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMobileMenuOpen={isMobileMenuOpen} />
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header & Location Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#14532D] flex items-center gap-2">
                <CloudSun className="w-6 h-6 text-[#228B52]" />
                <span>{t('weatherTitle')}</span>
              </h1>
              <p className="text-xs text-[#66746A] mt-1 max-w-2xl">
                {t('weatherSubtitle')}
              </p>
            </div>

            {/* Ag-Cluster Dropdown */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#228B52] shrink-0" />
              <select
                value={selectedCluster}
                onChange={(e) => {
                  setSelectedCluster(e.target.value);
                  addToast('info', 'Weather Station Switched', `Loaded telemetry for ${e.target.value}.`);
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E8DF] text-xs font-semibold text-[#14532D] focus:outline-none focus:border-[#14532D]"
              >
                {clusters.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Micro-Climate Card */}
          <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border border-[#86B96B]/30 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#228B52] uppercase tracking-wider bg-[#86B96B]/20 px-2.5 py-0.5 rounded-full">
                  {selectedCluster}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-[#14532D]">{weather.temp}°C</span>
                  <span className="text-sm text-[#66746A] font-medium">
                    H: {weather.tempMax}° • L: {weather.tempMin}°
                  </span>
                </div>
                <p className="text-sm font-bold text-[#14532D]">
                  {language === 'hi' ? weather.conditionHi : weather.condition}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#66746A] pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#228B52]" /> Updated: {weather.lastUpdated}
                  </span>
                  <span>Source: {weather.dataSource}</span>
                </div>
              </div>

              {/* Climate Vitals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-white/80 border border-[#E2E8DF] text-center">
                  <Droplets className="w-4 h-4 text-sky-600 mx-auto mb-1" />
                  <span className="block text-[10px] text-[#66746A]">{t('humidity')}</span>
                  <span className="font-extrabold text-sm text-[#14532D]">{weather.humidity}%</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 border border-[#E2E8DF] text-center">
                  <Wind className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="block text-[10px] text-[#66746A]">{t('wind')}</span>
                  <span className="font-extrabold text-sm text-[#14532D]">{weather.windSpeed} km/h</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 border border-[#E2E8DF] text-center">
                  <CloudRain className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <span className="block text-[10px] text-[#66746A]">{t('rainProbability')}</span>
                  <span className="font-extrabold text-sm text-blue-800">{weather.rainProbability}%</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 border border-[#E2E8DF] text-center">
                  <Sun className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <span className="block text-[10px] text-[#66746A]">UV Index</span>
                  <span className="font-extrabold text-sm text-[#14532D]">{weather.uvIndex} (Moderate)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Agricultural Spraying & Harvesting Advisory Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spray Window Status */}
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                  {t('sprayWindow')}
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  Today: Favorable
                </span>
              </div>
              <p className="text-xs text-[#66746A] leading-relaxed">
                {language === 'hi'
                  ? 'आज सुबह 7:00 से 11:00 बजे के बीच हवा की गति 11 किमी/घंटा और आर्द्रता 52% है — कीटनाशक और फोलियर पोषण स्प्रे के लिए उपयुक्त समय है।'
                  : 'Wind speed is steady at 11 km/h with 52% humidity. Optimal spraying window is open today between 7:00 AM and 11:00 AM.'}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#228B52] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero spray drift risk for neighboring plots</span>
              </div>
            </div>

            {/* Upcoming Weather Threat Warning */}
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{language === 'hi' ? weather.agriculturalAlert?.titleHi : weather.agriculturalAlert?.title}</span>
                </h3>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  Friday Risk
                </span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {language === 'hi' ? weather.agriculturalAlert?.messageHi : weather.agriculturalAlert?.message}
              </p>
              <div className="pt-1 text-xs font-bold text-amber-900">
                Action: {language === 'hi' ? weather.agriculturalAlert?.actionHi : weather.agriculturalAlert?.action}
              </div>
            </div>
          </div>

          {/* 7-Day Precision Agronomic Forecast Cards */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#228B52]" />
              <span>7-Day Agricultural Forecast Matrix</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    day.rainProb > 40
                      ? 'bg-sky-50/80 border-sky-300'
                      : 'bg-white/80 border-[#E2E8DF] hover:border-[#86B96B]'
                  }`}
                >
                  <span className="block text-xs font-bold text-[#14532D]">
                    {language === 'hi' ? day.dayHi : day.day}
                  </span>
                  <span className="text-[11px] text-[#66746A] block mt-0.5">
                    {language === 'hi' ? day.conditionHi : day.condition}
                  </span>

                  <div className="my-2 py-1 border-y border-[#E2E8DF]/60">
                    <span className="text-base font-black text-[#14532D]">{day.tempMax}°</span>
                    <span className="text-xs text-[#66746A] ml-1">/{day.tempMin}°</span>
                  </div>

                  {/* Precipitation Probability Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-[#E2E8DF] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full transition-all"
                        style={{ width: `${day.rainProb}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-sky-800">
                      {day.rainProb}% Rain
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
