'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { UserRole } from '@/types';
import { 
  Settings, 
  Save, 
  User, 
  MapPin, 
  Sprout, 
  Bell, 
  ShieldCheck, 
  PhoneCall, 
  CheckCircle2,
  Languages
} from 'lucide-react';

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<UserRole>('farmer');
  const [name, setName] = useState('Baldev Singh Gill');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [state, setState] = useState('Madhya Pradesh');
  const [district, setDistrict] = useState('Sehore');
  const [village, setVillage] = useState('Bilkisganj');
  const [landAcres, setLandAcres] = useState<number>(5.5);
  const [soilType, setSoilType] = useState('Medium Black Loamy Soil');
  const [irrigationType, setIrrigationType] = useState('Tubewell + Border Drip');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Farm Settings Saved', 'Your agronomic preferences and cluster configuration have been updated.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F0] text-[#17251D]">
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMobileMenuOpen={isMobileMenuOpen} />
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="pb-4 border-b border-[#E2E8DF]">
            <h1 className="text-xl sm:text-2xl font-black text-[#14532D] flex items-center gap-2">
              <Settings className="w-6 h-6 text-[#228B52]" />
              <span>{t('navSettings')}</span>
            </h1>
            <p className="text-xs text-[#66746A] mt-1 max-w-2xl">
              {language === 'hi'
                ? 'अपने खेत का रकबा, मृदा प्रकार, सिंचाई साधन और प्राथमिक भाषा कॉन्फ़िगर करें।'
                : 'Configure your farm parcel size, soil type, irrigation infrastructure, and account notifications.'}
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="max-w-3xl space-y-6">
            {/* Role Switcher */}
            <div className="glass-panel p-5 rounded-3xl space-y-3">
              <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider block">
                Platform Account Role
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    role === 'farmer'
                      ? 'bg-[#14532D] text-white border-[#14532D] shadow-xs'
                      : 'bg-white border-[#E2E8DF] text-[#17251D] hover:bg-[#F8F7F0]'
                  }`}
                >
                  <div className="font-extrabold text-sm">Farmer / Producer (किसान)</div>
                  <div className={`text-xs mt-1 ${role === 'farmer' ? 'text-white/80' : 'text-[#66746A]'}`}>
                    Post crop lots, receive buyer bids, scan plant diseases, and get IoT irrigation advice.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    role === 'buyer'
                      ? 'bg-[#14532D] text-white border-[#14532D] shadow-xs'
                      : 'bg-white border-[#E2E8DF] text-[#17251D] hover:bg-[#F8F7F0]'
                  }`}
                >
                  <div className="font-extrabold text-sm">Buyer / Wholesaler (खरीदार / मिल)</div>
                  <div className={`text-xs mt-1 ${role === 'buyer' ? 'text-white/80' : 'text-[#66746A]'}`}>
                    Browse bulk crop listings, submit bids, and coordinate farm-gate pickup.
                  </div>
                </button>
              </div>
            </div>

            {/* Farm & Personal Profile Details */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                Farmer & Parcel Specification
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#14532D] mb-1">Full Name (पूरा नाम)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-[#17251D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#14532D] mb-1">Mobile Number (Aadhaar linked)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-[#17251D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#14532D] mb-1">State (राज्य)</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-[#17251D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#14532D] mb-1">District & Village (जिला व गांव)</label>
                  <input
                    type="text"
                    required
                    value={`${district}, ${village}`}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-[#17251D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#14532D] mb-1">Landholding Size (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={landAcres}
                    onChange={(e) => setLandAcres(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-[#17251D] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#14532D] mb-1">Dominant Soil Type</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-[#17251D]"
                  >
                    <option value="Medium Black Loamy Soil">Medium Black Soil (काली मिट्टी)</option>
                    <option value="Alluvial Loam">Alluvial Loam (जलोढ़ दोमट)</option>
                    <option value="Red Sandy Soil">Red Sandy Soil (लाल रेतीली मिट्टी)</option>
                    <option value="Clayey Moisture Retentive">Heavy Clay (चिका मिट्टी)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#14532D] mb-1 text-xs">Irrigation Infrastructure</label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs text-[#17251D]"
                >
                  <option value="Tubewell + Border Drip">Tubewell + Drip Micro-Irrigation</option>
                  <option value="Canal Command Area">Canal Water Rotation (नहरी सिंचाई)</option>
                  <option value="Open Well + Diesel Pump">Open Well + Diesel Engine Pump</option>
                  <option value="Rainfed Only">Rainfed (बारानी खेती)</option>
                </select>
              </div>
            </div>

            {/* Language & Alert Toggles */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                Language & Notifications
              </h3>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E2E8DF]">
                <div className="flex items-center gap-2.5">
                  <Languages className="w-5 h-5 text-[#228B52]" />
                  <div>
                    <span className="font-bold text-xs text-[#14532D]">Primary Display Language</span>
                    <span className="block text-[11px] text-[#66746A]">
                      Currently: {language === 'hi' ? 'हिंदी (Devanagari)' : 'English'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="px-3 py-1.5 rounded-xl bg-[#F8F7F0] border border-[#E2E8DF] text-xs font-bold text-[#14532D]"
                >
                  {language === 'en' ? 'Switch to हिंदी' : 'Switch to English'}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E2E8DF] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#14532D]">Weather & Rain Early Warnings</span>
                    <span className="block text-[11px] text-[#66746A]">Receive alerts for spray postponement</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={weatherAlerts}
                    onChange={(e) => setWeatherAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#14532D]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E2E8DF] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#14532D]">Buyer Bid SMS Notifications</span>
                    <span className="block text-[11px] text-[#66746A]">Instant alert when a mill places an offer</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#14532D]"
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#86B96B]" />
                <span>Save All Settings (सहेजें)</span>
              </button>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}
