'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_SENSOR_TELEMETRY } from '@/data/mockData';
import { SensorTelemetry } from '@/types';
import { 
  Satellite, 
  Droplets, 
  Activity, 
  Wifi, 
  Battery, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Power, 
  RefreshCw, 
  Sliders,
  Layers,
  Calendar,
  Lock
} from 'lucide-react';

export default function SatelliteMonitoringPage() {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedField, setSelectedField] = useState('field-1');
  const [telemetry, setTelemetry] = useState<SensorTelemetry>(INITIAL_SENSOR_TELEMETRY);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState(false);
  const [showPumpSafetyModal, setShowPumpSafetyModal] = useState(false);
  const [pumpConfirmed, setPumpConfirmed] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fields = [
    {
      id: 'field-1',
      name: 'Wheat Plot #1 (North Acre)',
      nameHi: 'गेहूँ प्लॉट #1 (उत्तरी रकबा)',
      crop: 'Sharbati Wheat (DBW-187)',
      sownDate: '2026-10-01 (16 Days Ago)',
      soil: 'Black Loamy Soil',
      ndvi: 0.74,
      ndwi: 0.32,
      cloudCover: '4% (Clear Imagery)'
    },
    {
      id: 'field-2',
      name: 'Mustard Plot #2 (East Ridge)',
      nameHi: 'सरसों प्लॉट #2 (पूर्वी मेड़)',
      crop: 'Yellow Mustard (Pusa-28)',
      sownDate: '2026-09-28 (19 Days Ago)',
      soil: 'Sandy Loam',
      ndvi: 0.68,
      ndwi: 0.28,
      cloudCover: '6%'
    }
  ];

  const currentField = fields.find((f) => f.id === selectedField) || fields[0];

  // Fetch telemetry from /api/sensor-data
  const fetchTelemetry = async () => {
    setIsLoadingTelemetry(true);
    try {
      const res = await fetch('/api/sensor-data');
      const data = await res.json();
      if (data.success && data.telemetry) {
        setTelemetry(data.telemetry);
      }
    } catch (err) {
      // Keep initial telemetry
    } finally {
      setIsLoadingTelemetry(false);
    }
  };

  const handleSimulateMoisture = async (newMoisture: number) => {
    try {
      const res = await fetch('/api/sensor-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soilMoisturePercent: newMoisture,
          deviceId: telemetry.deviceId
        })
      });
      const data = await res.json();
      if (data.success) {
        setTelemetry(data.telemetry);
        addToast(
          'info',
          'Telemetry Simulated',
          `Sensor reported moisture level: ${newMoisture}% (${data.telemetry.irrigationStatus}).`
        );
      }
    } catch (err) {
      addToast('error', 'Simulation Failed');
    }
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#14532D] flex items-center gap-2">
                <Satellite className="w-6 h-6 text-[#228B52]" />
                <span>{language === 'hi' ? 'उपग्रह फसल निगरानी एवं स्मार्ट सिंचाई' : 'Satellite Crop Health & Smart Irrigation'}</span>
              </h1>
              <p className="text-xs text-[#66746A] mt-1 max-w-2xl">
                {language === 'hi'
                  ? 'मल्टी-स्पेक्ट्रल NDVI वनस्पति सूचकांक और ESP32 IoT मृदा सेंसर के समन्वय से पानी की बचत व समय पर सिंचाई सलाह।'
                  : 'Multi-spectral Sentinel-2 NDVI canopy monitoring integrated with ESP32 in-situ soil moisture telemetry.'}
              </p>
            </div>

            {/* Field Parcel Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#66746A]">
                {language === 'hi' ? 'खेत चुनें:' : 'Select Parcel:'}
              </span>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E8DF] text-xs font-bold text-[#14532D] focus:outline-none focus:border-[#14532D]"
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {language === 'hi' ? f.nameHi : f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Top Grid: Satellite NDVI Parcel Map & Indices */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Multi-spectral NDVI Heatmap Simulation */}
            <div className="lg:col-span-7 glass-panel p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
                <div>
                  <h3 className="text-sm font-extrabold text-[#14532D]">
                    {language === 'hi' ? currentField.nameHi : currentField.name}
                  </h3>
                  <p className="text-[11px] text-[#66746A]">
                    {currentField.crop} • {currentField.soil}
                  </p>
                </div>
                <span className="text-[11px] bg-[#86B96B]/20 text-[#14532D] font-bold px-2 py-0.5 rounded-full">
                  Sentinel-2 MSI
                </span>
              </div>

              {/* Simulated Multi-spectral Grid Heatmap */}
              <div className="relative rounded-2xl overflow-hidden border border-[#86B96B]/40 bg-gradient-to-br from-[#14532D] via-[#228B52] to-[#86B96B] p-6 text-white min-h-[220px] flex flex-col justify-between shadow-inner">
                {/* Visual Topographic Parcel Contours */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4,4" />
                    <circle cx="50%" cy="50%" r="55%" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="flex items-center justify-between z-10">
                  <span className="text-xs bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full font-bold">
                    NDVI: {currentField.ndvi} (High Canopy Vigour)
                  </span>
                  <span className="text-[11px] bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
                    Cloud Cover: {currentField.cloudCover}
                  </span>
                </div>

                {/* Center Coordinates & Growth Tracker */}
                <div className="my-auto text-center z-10 py-4">
                  <div className="inline-block bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                    <span className="block text-xs text-white/80">Sowing Progress</span>
                    <span className="text-base font-extrabold text-[#86B96B]">{currentField.sownDate}</span>
                    <span className="block text-[10px] text-white/60">Estimated Crown Root Stage</span>
                  </div>
                </div>

                {/* NDVI Scale Bar */}
                <div className="z-10 bg-black/50 backdrop-blur-md p-2 rounded-xl flex items-center justify-between text-[10px]">
                  <span>0.1 (Bare Soil)</span>
                  <div className="h-2 flex-1 mx-3 rounded-full bg-gradient-to-r from-amber-400 via-lime-400 to-[#14532D]" />
                  <span>0.9 (Dense Healthy)</span>
                </div>
              </div>

              {/* Historical NDVI Timeline Bars */}
              <div className="pt-2">
                <span className="text-xs font-bold text-[#14532D] block mb-2">
                  Historical NDVI Progression (Last 4 Weeks)
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white border border-[#E2E8DF]">
                    <span className="text-[10px] text-[#66746A] block">Week 1 (Sow)</span>
                    <span className="font-extrabold text-[#14532D]">0.22</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#E2E8DF]">
                    <span className="text-[10px] text-[#66746A] block">Week 2</span>
                    <span className="font-extrabold text-[#14532D]">0.41</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#E2E8DF]">
                    <span className="text-[10px] text-[#66746A] block">Week 3</span>
                    <span className="font-extrabold text-[#14532D]">0.62</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#86B96B]/20 border border-[#86B96B]">
                    <span className="text-[10px] text-[#14532D] font-bold block">Current</span>
                    <span className="font-black text-[#14532D]">{currentField.ndvi}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: ESP32 IoT Soil Telemetry & Safety Pump Controller */}
            <div className="lg:col-span-5 space-y-5">
              {/* ESP32 Hardware Card */}
              <div className="glass-panel p-5 rounded-3xl space-y-4 border border-[#86B96B]/40 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-[#14532D]">{telemetry.deviceId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#66746A]">
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{telemetry.signalStrengthRssi} dBm</span>
                    <Battery className="w-3.5 h-3.5 text-[#228B52] ml-1" />
                    <span>{telemetry.batteryLevelPercent}%</span>
                  </div>
                </div>

                {/* Primary Metric: Moisture Gauge */}
                <div className="p-4 rounded-2xl bg-white border border-[#E2E8DF] text-center space-y-1">
                  <span className="text-xs text-[#66746A] font-semibold">Root-Zone Soil Moisture</span>
                  <div className="text-4xl font-black text-[#14532D]">
                    {telemetry.soilMoisturePercent}%
                  </div>
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    telemetry.soilMoisturePercent < 35 
                      ? 'bg-amber-100 text-amber-900' 
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {telemetry.status}: {telemetry.irrigationStatus}
                  </span>
                </div>

                {/* Environmental Secondary Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F8F7F0] border border-[#E2E8DF]">
                    <span className="text-[10px] text-[#66746A] block">Soil Temp</span>
                    <span className="font-extrabold text-[#14532D]">{telemetry.soilTemperatureC}°C</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F7F0] border border-[#E2E8DF]">
                    <span className="text-[10px] text-[#66746A] block">Air Temp</span>
                    <span className="font-extrabold text-[#14532D]">{telemetry.ambientTempC}°C</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F7F0] border border-[#E2E8DF]">
                    <span className="text-[10px] text-[#66746A] block">Humidity</span>
                    <span className="font-extrabold text-[#14532D]">{telemetry.ambientHumidityPercent}%</span>
                  </div>
                </div>

                {/* Simulation Controls for Demonstration */}
                <div className="pt-2 border-t border-[#E2E8DF] space-y-2">
                  <span className="text-[11px] font-bold text-[#66746A] uppercase tracking-wider block">
                    Interactive IoT Simulation Controls:
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSimulateMoisture(28)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition-colors"
                    >
                      Simulate Dry (28%)
                    </button>
                    <button
                      onClick={() => handleSimulateMoisture(52)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-bold transition-colors"
                    >
                      Simulate Wet (52%)
                    </button>
                  </div>
                </div>

                {/* Pump Safety Controller Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowPumpSafetyModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <Power className="w-4 h-4 text-[#86B96B]" />
                    <span>
                      {pumpConfirmed
                        ? (language === 'hi' ? 'मोटर चालू (सक्रिय)' : 'Pump Running (Active)')
                        : (language === 'hi' ? 'सिंचाई मोटर स्विच (सुरक्षा जांच)' : 'Activate Irrigation Pump')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Strict Safety Protocol Notice */}
              <div className="p-3.5 rounded-2xl bg-[#14532D]/5 border border-[#14532D]/15 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#14532D] font-bold">
                  <Lock className="w-4 h-4 text-[#228B52]" />
                  <span>{language === 'hi' ? 'सख्त सुरक्षा प्रोटोकॉल' : 'Strict Safety Protocol'}</span>
                </div>
                <p className="text-[11px] text-[#66746A] leading-relaxed">
                  {language === 'hi'
                    ? 'AI सलाह कभी भी वास्तविक मोटर या वॉल्व को स्वतः चालू नहीं करती। किसान की व्यक्तिगत 2-चरणीय पुष्टि अनिवार्य है।'
                    : 'Physical pumps or valves are NEVER autonomously activated by AI models. Farmer multi-step confirmation is mandatory.'}
                </p>
              </div>
            </div>
          </div>

          {/* Pump Automation Safety Confirmation Modal */}
          {showPumpSafetyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
              <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-[#E2E8DF] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#14532D]">
                    {language === 'hi' ? 'सिंचाई मोटर सुरक्षा प्रमाणीकरण' : 'Manual Motor Authorization Check'}
                  </h3>
                  <p className="text-xs text-[#66746A] mt-1 leading-relaxed">
                    {language === 'hi'
                      ? 'क्या आपने खेत की क्यारियों और नोजल की भौतिक जांच कर ली है? शुक्रवार को 65% बारिश का अनुमान है, यदि आप अभी सिंचाई करते हैं तो जलभराव हो सकता है।'
                      : 'Have you verified field drains and lateral valves? Note: Rain is forecast for Friday. Running irrigation now may risk root waterlogging.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#F8F7F0] text-xs space-y-1 text-[#17251D]">
                  <div className="flex justify-between">
                    <span>Field:</span> <span className="font-bold">{currentField.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Moisture:</span> <span className="font-bold text-amber-700">{telemetry.soilMoisturePercent}%</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowPumpSafetyModal(false)}
                    className="flex-1 py-2 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#66746A] hover:bg-[#F8F7F0]"
                  >
                    Cancel / Postpone
                  </button>
                  <button
                    onClick={() => {
                      setPumpConfirmed(true);
                      setShowPumpSafetyModal(false);
                      addToast('success', 'Motor Authorized', 'Irrigation solenoid valve turned ON for 45 minutes.');
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold"
                  >
                    Confirm & Start Pump
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
