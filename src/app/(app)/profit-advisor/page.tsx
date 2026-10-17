'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { 
  TrendingUp, 
  RotateCcw, 
  Truck, 
  Building2, 
  Warehouse, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ProfitAdvisorPage() {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Calculator Inputs
  const [crop, setCrop] = useState('Sharbati Wheat');
  const [quantityQtl, setQuantityQtl] = useState<number>(100);
  const [mandiPrice, setMandiPrice] = useState<number>(2850);
  const [directBuyerPrice, setDirectBuyerPrice] = useState<number>(2820); // Buyer quotes ₹30 less, but picks up from farm
  const [distanceKm, setDistanceKm] = useState<number>(25);
  const [cultivationCostPerQtl, setCultivationCostPerQtl] = useState<number>(1450); // DAP, Urea, seed, diesel, irrigation
  const [warehouseHoldMonths, setWarehouseHoldMonths] = useState<number>(2);
  const [expectedSurgePrice, setExpectedSurgePrice] = useState<number>(3100);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Calculations:
  // Channel 1: APMC Mandi
  const grossMandi = quantityQtl * mandiPrice;
  const transportCostMandi = distanceKm * 40 + (quantityQtl * 25); // freight
  const mandiCess = grossMandi * 0.015; // 1.5% Mandi fee
  const loadingUnloadingMandi = quantityQtl * 18; // palledari / hammali
  const totalSellingExpensesMandi = transportCostMandi + mandiCess + loadingUnloadingMandi;
  const netProceedsMandi = grossMandi - totalSellingExpensesMandi;
  const trueProfitMandi = netProceedsMandi - (quantityQtl * cultivationCostPerQtl);

  // Channel 2: Direct Buyer (Farm Gate Pickup)
  const grossDirect = quantityQtl * directBuyerPrice;
  const totalSellingExpensesDirect = quantityQtl * 5; // Minimal weighing assistance
  const netProceedsDirect = grossDirect - totalSellingExpensesDirect;
  const trueProfitDirect = netProceedsDirect - (quantityQtl * cultivationCostPerQtl);

  // Channel 3: Warehouse Storage & Hold (Sell Later in 60 Days)
  const storageCost = quantityQtl * 45 * warehouseHoldMonths;
  const shrinkageLoss = quantityQtl * 0.015 * expectedSurgePrice; // 1.5% moisture weight reduction
  const grossHold = quantityQtl * 0.985 * expectedSurgePrice;
  const totalSellingExpensesHold = storageCost + shrinkageLoss + transportCostMandi;
  const netProceedsHold = grossHold - totalSellingExpensesHold;
  const trueProfitHold = netProceedsHold - (quantityQtl * cultivationCostPerQtl);

  // Best Channel Determination
  let bestChannel = 'direct';
  let maxProfit = trueProfitDirect;

  if (trueProfitMandi > maxProfit) {
    bestChannel = 'mandi';
    maxProfit = trueProfitMandi;
  }
  if (trueProfitHold > maxProfit) {
    bestChannel = 'hold';
    maxProfit = trueProfitHold;
  }

  const handleReset = () => {
    setQuantityQtl(100);
    setMandiPrice(2850);
    setDirectBuyerPrice(2820);
    setDistanceKm(25);
    setCultivationCostPerQtl(1450);
    setWarehouseHoldMonths(2);
    setExpectedSurgePrice(3100);
    addToast('info', 'Reset', 'Parameters restored to benchmark values.');
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
                <TrendingUp className="w-6 h-6 text-[#228B52]" />
                <span>{t('navProfitAdvisor')}</span>
              </h1>
              <p className="text-xs text-[#66746A] mt-1 max-w-2xl">
                {language === 'hi'
                  ? 'मंडी आढ़त व परिवहन घटाकर वास्तविक शुद्ध आय की तुलना — अधिक कोटेड मूल्य का अर्थ हमेशा अधिक शुद्ध मुनाफा नहीं होता।'
                  : 'Transparent net proceed comparison between APMC Mandi, Direct Buyer farm-gate pickup, and Cold-Storage holding.'}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8DF] bg-white text-xs font-semibold text-[#66746A] hover:bg-[#F8F7F0] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Values</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 5 Cols: Sliders & Numbers */}
            <div className="lg:col-span-5 space-y-5">
              <div className="glass-panel p-5 rounded-3xl space-y-4">
                <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                  {language === 'hi' ? 'फसल व बिक्री लागत विवरण' : 'Produce & Expense Inputs'}
                </h3>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#14532D]">Quantity to Sell</span>
                    <span className="font-extrabold text-[#228B52]">{quantityQtl} Quintals</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={quantityQtl}
                    onChange={(e) => setQuantityQtl(Number(e.target.value))}
                    className="w-full accent-[#14532D]"
                  />
                </div>

                {/* Distance to APMC Mandi */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#14532D]">Distance to APMC Mandi</span>
                    <span className="font-extrabold text-[#14532D]">{distanceKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="100"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full accent-[#14532D]"
                  />
                </div>

                {/* APMC Mandi Price Quote */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#14532D]">Mandi Quoted Rate (₹/Qtl)</span>
                    <span className="font-extrabold text-[#14532D]">₹{mandiPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="6000"
                    step="25"
                    value={mandiPrice}
                    onChange={(e) => setMandiPrice(Number(e.target.value))}
                    className="w-full accent-[#14532D]"
                  />
                </div>

                {/* Direct Buyer Price Quote */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#14532D]">Direct Buyer Rate (₹/Qtl)</span>
                    <span className="font-extrabold text-[#228B52]">₹{directBuyerPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="6000"
                    step="25"
                    value={directBuyerPrice}
                    onChange={(e) => setDirectBuyerPrice(Number(e.target.value))}
                    className="w-full accent-[#228B52]"
                  />
                  <span className="text-[10px] text-[#66746A]">
                    Note: Buyer picks up from farm gate with 0 transport charges.
                  </span>
                </div>

                {/* Cultivation Cost */}
                <div className="space-y-1.5 pt-2 border-t border-[#E2E8DF]">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#14532D]">Cost of Cultivation (₹/Qtl)</span>
                    <span className="font-extrabold text-[#14532D]">₹{cultivationCostPerQtl}</span>
                  </div>
                  <input
                    type="range"
                    min="800"
                    max="2800"
                    step="25"
                    value={cultivationCostPerQtl}
                    onChange={(e) => setCultivationCostPerQtl(Number(e.target.value))}
                    className="w-full accent-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Three-Way Channel Comparison Cards */}
            <div className="lg:col-span-7 space-y-6">
              {/* Highlight Best Option Banner */}
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-300 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-2xl bg-[#14532D] text-white shrink-0">
                  <Sparkles className="w-5 h-5 text-[#86B96B]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#14532D]">
                    {bestChannel === 'direct'
                      ? (language === 'hi' ? 'सीधे खरीदार (फार्म गेट पिकअप) से अधिकतम शुद्ध मुनाफा!' : 'Direct Buyer Pickup Yields Highest Net Proceeds!')
                      : bestChannel === 'mandi'
                      ? (language === 'hi' ? 'मंडी में बेचना आर्थिक दृष्टि से श्रेष्ठ है!' : 'Local Mandi Yields Highest Net Proceeds!')
                      : (language === 'hi' ? 'वेयरहाउस में रोककर बेचना सर्वोत्तम है!' : 'Holding in Storage Yields Highest Margin!')}
                  </h3>
                  <p className="text-xs text-emerald-950 mt-1 leading-relaxed">
                    {bestChannel === 'direct'
                      ? `Even though the buyer quotes ₹${mandiPrice - directBuyerPrice}/Qtl lower on paper, you save ₹${Math.round(totalSellingExpensesMandi).toLocaleString('en-IN')} in truck transport and mandi cess, pocketing ₹${Math.round(trueProfitDirect - trueProfitMandi).toLocaleString('en-IN')} more in pure profit.`
                      : `Higher mandi price exceeds transportation deductions for your current distance.`}
                  </p>
                </div>
              </div>

              {/* 3 Channels Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Channel 1: APMC Mandi */}
                <div className={`glass-panel p-4 rounded-2xl space-y-3 border border-[#E2E8DF] shadow-xs ${
                  bestChannel === 'mandi' ? 'bg-emerald-50/40' : ''
                }`}>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#14532D]">
                    <Building2 className="w-4 h-4 text-[#228B52]" />
                    <span>APMC Mandi</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-[11px] text-[#66746A]">
                      Gross: ₹{grossMandi.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-rose-700">
                      Transport: -₹{Math.round(transportCostMandi).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-rose-700">
                      Mandi Cess & Labor: -₹{Math.round(mandiCess + loadingUnloadingMandi).toLocaleString('en-IN')}
                    </div>
                    <div className="pt-2 border-t border-[#E2E8DF]">
                      <span className="block text-[10px] text-[#66746A]">Net Proceeds:</span>
                      <span className="font-extrabold text-sm text-[#14532D]">
                        ₹{Math.round(netProceedsMandi).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#66746A]">True Net Profit:</span>
                      <span className="font-black text-sm text-[#228B52]">
                        ₹{Math.round(trueProfitMandi).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Channel 2: Direct Buyer */}
                <div className={`glass-panel p-4 rounded-2xl space-y-3 border border-[#E2E8DF] shadow-xs ${
                  bestChannel === 'direct' ? 'bg-emerald-50/40' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#14532D]">
                      <Truck className="w-4 h-4 text-[#228B52]" />
                      <span>Direct Buyer</span>
                    </div>
                    <span className="text-[9px] bg-[#86B96B] text-[#123B2A] font-extrabold px-1.5 py-0.2 rounded-full">
                      Zero Freight
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-[11px] text-[#66746A]">
                      Gross: ₹{grossDirect.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold">
                      Transport: ₹0 (Buyer Truck)
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold">
                      Mandi Cess: ₹0
                    </div>
                    <div className="pt-2 border-t border-[#E2E8DF]">
                      <span className="block text-[10px] text-[#66746A]">Net Proceeds:</span>
                      <span className="font-extrabold text-sm text-[#14532D]">
                        ₹{Math.round(netProceedsDirect).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#66746A]">True Net Profit:</span>
                      <span className="font-black text-sm text-[#228B52]">
                        ₹{Math.round(trueProfitDirect).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Channel 3: Hold & Sell Later */}
                <div className={`glass-panel p-4 rounded-2xl space-y-3 border border-[#E2E8DF] shadow-xs ${
                  bestChannel === 'hold' ? 'bg-emerald-50/40' : ''
                }`}>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#14532D]">
                    <Warehouse className="w-4 h-4 text-amber-700" />
                    <span>Hold (60 Days)</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-[11px] text-[#66746A]">
                      Gross: ₹{Math.round(grossHold).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-rose-700">
                      Storage Fee: -₹{storageCost.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-rose-700">
                      Weight Loss: -₹{Math.round(shrinkageLoss).toLocaleString('en-IN')}
                    </div>
                    <div className="pt-2 border-t border-[#E2E8DF]">
                      <span className="block text-[10px] text-[#66746A]">Net Proceeds:</span>
                      <span className="font-extrabold text-sm text-[#14532D]">
                        ₹{Math.round(netProceedsHold).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#66746A]">True Net Profit:</span>
                      <span className="font-black text-sm text-[#228B52]">
                        ₹{Math.round(trueProfitHold).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Economic Explanation Note */}
              <div className="p-4 rounded-2xl glass-panel text-xs text-[#66746A] space-y-1">
                <span className="font-bold text-[#14532D] block">
                  {language === 'hi' ? 'महत्वपूर्ण किसान सलाह:' : 'Key Agronomic Takeaway:'}
                </span>
                <p className="leading-relaxed">
                  {language === 'hi'
                    ? 'अक्सर व्यापारी मंडी में थोड़ा अधिक भाव दिखाते हैं, परंतु तुलाई, पल्लेदारी और लंबी दूरी के भाड़े के कारण किसान के हाथ में कम पैसा आता है। कृषिसेतु का मुनाफा सलाहकार आपको शुद्ध बचत दिखाता है।'
                    : 'The highest headline quote does not guarantee the highest net proceeds. Weighing fees, market commission, and diesel freight can consume up to 8-12% of gross crop value.'}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
