'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { AGRICULTURAL_SHOPS } from '@/data/mockData';
import { AgriculturalShop } from '@/types';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  ShieldCheck, 
  Tag, 
  Flag,
  X
} from 'lucide-react';

export default function ServicesPage() {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shops, setShops] = useState<AgriculturalShop[]>(AGRICULTURAL_SHOPS);
  const [selectedType, setSelectedType] = useState('All');
  const [searchProduct, setSearchProduct] = useState('');
  const [reportingProduct, setReportingProduct] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const filteredShops = shops.filter((s) => {
    const matchesType = selectedType === 'All' || s.type === selectedType;
    const matchesSearch = !searchProduct.trim() || 
      s.products.some((p) => p.item.toLowerCase().includes(searchProduct.toLowerCase()) || p.brand.toLowerCase().includes(searchProduct.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Report Submitted', `Price discrepancy report logged for ${reportingProduct}. District officer notified.`);
    setReportingProduct(null);
    setReportReason('');
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
              <Building2 className="w-6 h-6 text-[#228B52]" />
              <span>{language === 'hi' ? 'खाद-बीज केंद्र एवं कृषि सेवाएं' : 'Agricultural Inputs & Service Directory'}</span>
            </h1>
            <p className="text-xs text-[#66746A] mt-1 max-w-2xl">
              {language === 'hi'
                ? 'नजदीकी इफको केंद्र, प्रमाणित बीज विक्रेता, और मृदा परीक्षण लैब। सरकारी सब्सिडी दरों पर यूरिया व डीएपी की वास्तविक उपलब्धता।'
                : 'Compare verified retail prices for subsidized Urea (₹266.50), DAP, NPK complexes, and certified seed dealers.'}
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#66746A] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                placeholder="Search fertilizer (Urea, DAP, NPK), seed variety, or test service..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs text-[#17251D] focus:outline-none focus:border-[#14532D]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs font-semibold text-[#14532D] focus:outline-none focus:border-[#14532D] w-full sm:w-auto"
              >
                <option value="All">All Agricultural Centers</option>
                <option value="IFFCO Kendra">IFFCO Farmer Centers</option>
                <option value="Private Dealer">Licensed Input Dealers</option>
                <option value="Soil Testing Lab">Soil Testing Labs</option>
              </select>
            </div>
          </div>

          {/* Shops & Price Comparison Grid */}
          <div className="space-y-6">
            {filteredShops.map((shop) => (
              <div key={shop.id} className="glass-panel p-6 rounded-3xl border border-[#E2E8DF] space-y-4">
                {/* Shop Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8DF]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-[#14532D]">{shop.name}</h3>
                      {shop.verified && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Center
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#66746A] mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#228B52]" /> {shop.district}, {shop.state} ({shop.distanceKm} km away)
                      </span>
                    </div>
                  </div>

                  <a
                    href={`tel:${shop.phone}`}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold transition-all shadow-2xs shrink-0 self-start sm:self-auto"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#86B96B]" />
                    <span>Call Center: {shop.phone}</span>
                  </a>
                </div>

                {/* Products Table with Normalized Prices */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2E8DF] text-[11px] font-bold text-[#66746A] uppercase tracking-wider">
                        <th className="py-2 pr-4">Product / Service</th>
                        <th className="py-2 px-3">Brand</th>
                        <th className="py-2 px-3">Pack Size</th>
                        <th className="py-2 px-3">Subsidized Price</th>
                        <th className="py-2 px-3">Per Unit Cost</th>
                        <th className="py-2 px-3">Stock Status</th>
                        <th className="py-2 pl-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8DF]/60">
                      {shop.products.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/50 transition-colors">
                          <td className="py-2.5 pr-4 font-bold text-[#14532D]">
                            {item.item}
                            {item.govtSubsidized && (
                              <span className="ml-1.5 text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                                Govt MRP Cap
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-[#17251D]">{item.brand}</td>
                          <td className="py-2.5 px-3 text-[#66746A]">{item.packSize}</td>
                          <td className="py-2.5 px-3 font-extrabold text-[#14532D]">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-[#66746A] font-medium">{item.unitPrice}</td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-2.5 pl-3 text-right">
                            <button
                              onClick={() => setReportingProduct(`${item.item} (${shop.name})`)}
                              className="text-[10px] font-bold text-[#66746A] hover:text-rose-700 hover:underline flex items-center gap-1 ml-auto"
                            >
                              <Flag className="w-3 h-3" />
                              <span>Report Price</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Report Price Modal */}
          {reportingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
                  <h3 className="font-extrabold text-sm text-[#14532D] flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-rose-600" />
                    <span>Report Incorrect Price or Black-Marketing</span>
                  </h3>
                  <button onClick={() => setReportingProduct(null)} className="text-[#66746A]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#66746A]">
                  Reporting: <strong className="text-[#14532D]">{reportingProduct}</strong>
                </p>

                <form onSubmit={handleReportSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#14532D] mb-1">
                      Issue Encountered
                    </label>
                    <select
                      required
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs"
                    >
                      <option value="">Select reason...</option>
                      <option value="Overcharging above official MRP">Overcharging above official subsidized MRP</option>
                      <option value="Dealer forcing compulsory bundle purchase (e.g. Zinc with Urea)">Forcing compulsory bundled product purchase</option>
                      <option value="Stock artificially withheld / Out of stock in reality">Stock not available despite showing in stock</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setReportingProduct(null)}
                      className="px-3 py-1.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#66746A]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
