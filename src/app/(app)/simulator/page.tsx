'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Calculator, 
  RotateCcw, 
  BookmarkCheck, 
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function SimulatorPage() {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Simulation Inputs
  const [scenarioType, setScenarioType] = useState<'harvest_timing' | 'irrigation_method' | 'organic_shift'>('harvest_timing');
  const [crop, setCrop] = useState('Wheat');
  const [acres, setAcres] = useState<number>(5);
  const [currentMandiPrice, setCurrentMandiPrice] = useState<number>(2850);
  const [expectedSurgePercent, setExpectedSurgePercent] = useState<number>(8); // +8%
  const [storageCostPerQtlMonth, setStorageCostPerQtlMonth] = useState<number>(45);
  const [holdingMonths, setHoldingMonths] = useState<number>(2);
  const [rainRiskPercent, setRainRiskPercent] = useState<number>(20);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Mathematical Calculations
  const yieldPerAcreQtl = crop === 'Wheat' ? 20 : crop === 'Mustard' ? 12 : crop === 'Paddy' ? 25 : 18;
  const totalYieldQtl = acres * yieldPerAcreQtl;

  // Scenario A: Sell / Harvest Now
  const baseHarvestCost = acres * 2200; // Combine harvester / cutting
  const baseGrossA = totalYieldQtl * currentMandiPrice;
  const baseExpensesA = baseHarvestCost + (acres * 1200); // transport & handling
  const netProceedsA = baseGrossA - baseExpensesA;
  const waterUsageA = acres * (scenarioType === 'irrigation_method' ? 3200000 : 2500000); // liters
  const laborDaysA = acres * (scenarioType === 'irrigation_method' ? 14 : 8);

  // Scenario B: Alternative Action
  let netProceedsB = 0;
  let grossB = 0;
  let waterUsageB = waterUsageA;
  let laborDaysB = laborDaysA;
  let riskLevelB: 'Low' | 'Medium' | 'High' = 'Medium';

  if (scenarioType === 'harvest_timing') {
    // Hold & Sell in +60 days
    const anticipatedPrice = currentMandiPrice * (1 + expectedSurgePercent / 100);
    // Weight shrinkage / moisture loss: ~1.5%
    const adjustedYield = totalYieldQtl * 0.985;
    grossB = adjustedYield * anticipatedPrice;
    const storageExpenses = totalYieldQtl * storageCostPerQtlMonth * holdingMonths;
    const expensesB = baseHarvestCost + storageExpenses + (acres * 1400);
    netProceedsB = grossB - expensesB;
    riskLevelB = rainRiskPercent > 35 ? 'High' : 'Low';
  } else if (scenarioType === 'irrigation_method') {
    // Drip Irrigation with 55% PMKSY Subsidy
    grossB = totalYieldQtl * 1.22 * currentMandiPrice; // 22% yield gain via fertigation
    const dripInstallationNetCost = (acres * 18000) * 0.45; // after 55% subsidy amortized
    netProceedsB = grossB - (baseExpensesA + dripInstallationNetCost * 0.3);
    waterUsageB = waterUsageA * 0.48; // 52% water saved
    laborDaysB = Math.round(laborDaysA * 0.6); // 40% labor saved
    riskLevelB = 'Low';
  } else {
    // Organic Jeevamrit / Bio-fertilizer shift
    grossB = totalYieldQtl * 0.95 * (currentMandiPrice * 1.25); // Premium organic pricing
    const organicInputCost = acres * 1400; // much cheaper than chemical DAP/Urea
    netProceedsB = grossB - organicInputCost;
    waterUsageB = waterUsageA * 0.9;
    laborDaysB = Math.round(laborDaysA * 1.2);
    riskLevelB = 'Medium';
  }

  const deltaProfit = netProceedsB - netProceedsA;
  const isBBetter = deltaProfit > 0;

  const handleReset = () => {
    setAcres(5);
    setCurrentMandiPrice(2850);
    setExpectedSurgePercent(8);
    setStorageCostPerQtlMonth(45);
    setHoldingMonths(2);
    setRainRiskPercent(20);
    addToast('info', 'Simulation Reset', 'Parameters returned to baseline agricultural defaults.');
  };

  const handleSaveScenario = () => {
    addToast('success', 'Scenario Bookmarked', `Saved ${crop} ${acres} Acre simulation for review.`);
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
                <Calculator className="w-6 h-6 text-[#228B52]" />
                <span>{t('simulatorTitle')}</span>
              </h1>
              <p className="text-xs text-[#66746A] mt-1 max-w-2xl">
                {t('simulatorSubtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8DF] bg-white text-xs font-semibold text-[#66746A] hover:text-[#14532D] hover:bg-[#F8F7F0] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('resetSimulation')}</span>
              </button>
              <button
                onClick={handleSaveScenario}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14532D] text-white text-xs font-bold hover:bg-[#123B2A] transition-colors shadow-2xs"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-[#86B96B]" />
                <span>{language === 'hi' ? 'सिम्युलेशन सहेजें' : 'Save Scenario'}</span>
              </button>
            </div>
          </div>

          {/* Scenario Type Selection Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white border border-[#E2E8DF]">
            <button
              onClick={() => setScenarioType('harvest_timing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                scenarioType === 'harvest_timing'
                  ? 'bg-[#14532D] text-white shadow-2xs'
                  : 'text-[#17251D] hover:bg-[#F8F7F0]'
              }`}
            >
              {language === 'hi' ? 'कटाई समय: आज बनाम 60 दिन बाद' : 'Harvest Timing: Sell Now vs 60 Days Later'}
            </button>

            <button
              onClick={() => setScenarioType('irrigation_method')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                scenarioType === 'irrigation_method'
                  ? 'bg-[#14532D] text-white shadow-2xs'
                  : 'text-[#17251D] hover:bg-[#F8F7F0]'
              }`}
            >
              {language === 'hi' ? 'सिंचाई: पारंपरिक फ्लड बनाम 55% सब्सिडी ड्रिप' : 'Irrigation: Flood vs Subsidized Drip'}
            </button>

            <button
              onClick={() => setScenarioType('organic_shift')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                scenarioType === 'organic_shift'
                  ? 'bg-[#14532D] text-white shadow-2xs'
                  : 'text-[#17251D] hover:bg-[#F8F7F0]'
              }`}
            >
              {language === 'hi' ? 'खाद: रासायनिक बनाम देसी जीवामृत जैविक' : 'Fertilizer: Chemical vs Organic Bio'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 5 Cols: Interactive Sliders & Parameter Controls */}
            <div className="lg:col-span-5 space-y-5">
              <div className="glass-panel p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider flex items-center justify-between">
                  <span>{language === 'hi' ? 'खेत और बाजार इनपुट' : 'Farm & Market Assumptions'}</span>
                  <span className="text-[10px] text-[#228B52] bg-[#86B96B]/20 px-2 py-0.5 rounded-full font-bold">
                    Interactive Sliders
                  </span>
                </h3>

                {/* Crop Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-[#14532D] mb-1">
                    {language === 'hi' ? 'फसल का चयन' : 'Select Crop'}
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs font-medium text-[#17251D] focus:outline-none focus:border-[#14532D]"
                  >
                    <option value="Wheat">Wheat / गेहूँ (Avg: 20 Qtl/Acre)</option>
                    <option value="Mustard">Mustard / सरसों (Avg: 12 Qtl/Acre)</option>
                    <option value="Paddy">Paddy / धान (Avg: 25 Qtl/Acre)</option>
                    <option value="Soybean">Soybean / सोयाबीन (Avg: 14 Qtl/Acre)</option>
                  </select>
                </div>

                {/* Acreage Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#14532D]">{t('acreage')}</span>
                    <span className="font-extrabold text-[#228B52]">{acres} Acres</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="0.5"
                    value={acres}
                    onChange={(e) => setAcres(parseFloat(e.target.value))}
                    className="w-full accent-[#14532D] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#66746A]">
                    <span>1 Acre</span>
                    <span>Total Yield: {totalYieldQtl} Quintals</span>
                    <span>25 Acres</span>
                  </div>
                </div>

                {/* Current Mandi Price Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#14532D]">
                      {language === 'hi' ? 'वर्तमान मंडी भाव (₹/क्विंटल)' : 'Current Mandi Price (₹/Qtl)'}
                    </span>
                    <span className="font-extrabold text-[#14532D]">₹{currentMandiPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="1200"
                    max="7000"
                    step="50"
                    value={currentMandiPrice}
                    onChange={(e) => setCurrentMandiPrice(parseInt(e.target.value))}
                    className="w-full accent-[#14532D] cursor-pointer"
                  />
                </div>

                {/* Conditional Sliders based on Scenario */}
                {scenarioType === 'harvest_timing' && (
                  <>
                    <div className="space-y-1.5 pt-2 border-t border-[#E2E8DF]">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#14532D]">
                          {language === 'hi' ? 'अपेक्षित मूल्य वृद्धि (% surge)' : 'Expected Price Surge (%)'}
                        </span>
                        <span className="font-extrabold text-emerald-700">+{expectedSurgePercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        value={expectedSurgePercent}
                        onChange={(e) => setExpectedSurgePercent(parseInt(e.target.value))}
                        className="w-full accent-[#228B52] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#14532D]">
                          {language === 'hi' ? 'वेयरहाउस किराया (₹/क्विंटल/माह)' : 'Storage Cost (₹/Qtl/Month)'}
                        </span>
                        <span className="font-extrabold text-[#14532D]">₹{storageCostPerQtlMonth}</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="90"
                        value={storageCostPerQtlMonth}
                        onChange={(e) => setStorageCostPerQtlMonth(parseInt(e.target.value))}
                        className="w-full accent-[#14532D] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#14532D]">
                          {language === 'hi' ? 'मौसम/बारिश खराबी जोखिम (%)' : 'Weather Damage Risk (%)'}
                        </span>
                        <span className="font-extrabold text-amber-700">{rainRiskPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        value={rainRiskPercent}
                        onChange={(e) => setRainRiskPercent(parseInt(e.target.value))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>
                  </>
                )}

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-[#66746A]">
                  <span className="font-bold text-amber-900 block mb-0.5">
                    {language === 'hi' ? 'कृषि अर्थशास्त्र गणना नियम:' : 'Agronomic Model Assumption:'}
                  </span>
                  {scenarioType === 'harvest_timing'
                    ? (language === 'hi' ? 'भंडारण में 1.5% वजन/नमी ह्रास और वेयरहाउस शुल्क घटाकर गणना की जाती है।' : 'Accounts for 1.5% natural grain moisture shrinkage plus monthly storage fees.')
                    : (language === 'hi' ? 'पीएमकेएसवाई योजना अंतर्गत 55% सूक्ष्म सिंचाई अनुदान समायोजित है।' : 'Integrates 55% subsidy from PMKSY Micro-Irrigation guidelines.')}
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Side-by-Side Comparison & Recommendation */}
            <div className="lg:col-span-7 space-y-6">
              {/* Recommendation Banner */}
              <div className={`p-4 rounded-2xl border flex items-start justify-between gap-4 shadow-xs ${
                isBBetter 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl text-white shrink-0 mt-0.5 ${
                    isBBetter ? 'bg-[#14532D]' : 'bg-amber-700'
                  }`}>
                    {isBBetter ? <TrendingUp className="w-5 h-5 text-[#86B96B]" /> : <TrendingDown className="w-5 h-5 text-amber-200" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold">
                      {isBBetter 
                        ? (language === 'hi' ? `विकल्प बी से ₹${Math.abs(deltaProfit).toLocaleString('en-IN')} का अतिरिक्त शुद्ध लाभ!` : `Option B Yields ₹${Math.abs(deltaProfit).toLocaleString('en-IN')} Higher Net Profit!`)
                        : (language === 'hi' ? `वर्तमान पद्धति (विकल्प ए) अधिक सुरक्षित व लाभकारी है!` : `Option A (Immediate Action) is Financially Preferable!`)
                      }
                    </h3>
                    <p className="text-xs text-opacity-80 mt-1 leading-relaxed">
                      {scenarioType === 'harvest_timing'
                        ? (isBBetter
                            ? (language === 'hi' ? 'अपेक्षित 8% तेजी वेयरहाउस शुल्क और वजन कमी से अधिक मुनाफा दे रही है।' : 'Expected price appreciation comfortably offsets warehouse storage and moisture shrinkage.')
                            : (language === 'hi' ? 'वेयरहाउस किराया और बारिश जोखिम मूल्य वृद्धि से अधिक है। आज बेचना बेहतर है।' : 'Storage costs and rain risks erode the expected price surge. Immediate harvest is safer.'))
                        : (language === 'hi' ? 'ड्रिप सिंचाई से 52% पानी की बचत और 22% उपज वृद्धि से शुद्ध बचत बढ़ रही है।' : 'Drip fertigation conserves 52% water and enhances yields by 22% under subsidy amortisation.')
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Scenario A Card */}
                <div className="glass-panel p-5 rounded-2xl space-y-4 border border-[#E2E8DF] shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
                    <span className="text-xs font-bold text-[#66746A] uppercase">Option A (Baseline)</span>
                    <span className="text-[10px] bg-[#F8F7F0] text-[#17251D] px-2 py-0.5 rounded font-bold">Current</span>
                  </div>
                  <h4 className="font-extrabold text-[#14532D] text-sm">
                    {scenarioType === 'harvest_timing'
                      ? (language === 'hi' ? 'आज तुरंत कटाई व बिक्री' : 'Harvest & Sell Immediately')
                      : (language === 'hi' ? 'पारंपरिक फ्लड सिंचाई' : 'Traditional Flood Irrigation')}
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#66746A]">Gross Sale Value:</span>
                      <span className="font-bold text-[#14532D]">₹{Math.round(baseGrossA).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#66746A]">Expenses & Labor:</span>
                      <span className="text-rose-700 font-semibold">-₹{Math.round(baseExpensesA).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t border-[#E2E8DF] flex justify-between text-sm">
                      <span className="font-extrabold text-[#14532D]">Estimated Net Margin:</span>
                      <span className="font-black text-[#14532D]">₹{Math.round(netProceedsA).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="pt-2 border-t border-[#E2E8DF]/60 space-y-1.5 text-[11px] text-[#66746A]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-sky-600" /> Water:</span>
                        <span>{(waterUsageA / 100000).toFixed(1)} Lakh Litres</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-amber-600" /> Labor:</span>
                        <span>{laborDaysA} Man-Days</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scenario B Card */}
                <div className="glass-panel p-5 rounded-2xl space-y-4 border border-[#E2E8DF] shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
                    <span className="text-xs font-bold text-[#228B52] uppercase">Option B (Proposed)</span>
                    <span className="text-[10px] bg-[#86B96B]/20 text-[#14532D] px-2 py-0.5 rounded font-bold">Alternative</span>
                  </div>
                  <h4 className="font-extrabold text-[#14532D] text-sm">
                    {scenarioType === 'harvest_timing'
                      ? (language === 'hi' ? 'भंडारण कर 60 दिन बाद बिक्री' : 'Hold in Warehouse for 60 Days')
                      : (language === 'hi' ? 'ड्रिप (55% सब्सिडी) सिंचाई' : 'Drip Fertigation (55% Subsidy)')}
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#66746A]">Gross Sale Value:</span>
                      <span className="font-bold text-[#14532D]">₹{Math.round(grossB).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#66746A]">Expenses & Storage:</span>
                      <span className="text-rose-700 font-semibold">
                        -₹{Math.round(grossB - netProceedsB).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#E2E8DF] flex justify-between text-sm">
                      <span className="font-extrabold text-[#14532D]">Estimated Net Margin:</span>
                      <span className="font-black text-[#228B52]">₹{Math.round(netProceedsB).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="pt-2 border-t border-[#E2E8DF]/60 space-y-1.5 text-[11px] text-[#66746A]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-sky-600" /> Water:</span>
                        <span className="text-emerald-700 font-bold">
                          {(waterUsageB / 100000).toFixed(1)} Lakh Litres ({Math.round((1 - waterUsageB / waterUsageA) * 100)}% saved)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-amber-600" /> Labor:</span>
                        <span>{laborDaysB} Man-Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formula & Calculation Transparency Accordion */}
              <div className="p-4 rounded-2xl glass-panel space-y-2 text-xs">
                <span className="font-bold text-[#14532D] block">
                  {language === 'hi' ? 'पारदर्शी गणना सूत्र (Mathematical Basis):' : 'Transparent Calculation Formulas:'}
                </span>
                <p className="text-[#66746A] leading-relaxed">
                  <strong>Gross Sale Value</strong> = Quantity (adjusted for 1.5% natural dry-down) × Expected Price.<br />
                  <strong>Estimated Net Proceeds</strong> = Gross Value − (Harvesting + Warehouse Storage Fee ₹{storageCostPerQtlMonth}/Qtl/mo + Handling).
                </p>
                <div className="pt-1 text-[11px] text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Illustrative model based on standard agronomic benchmarks. Market prices are subject to volatility.</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
