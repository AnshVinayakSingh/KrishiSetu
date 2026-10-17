'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { GOVERNMENT_SCHEMES } from '@/data/mockData';
import { GovernmentScheme } from '@/types';
import { 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  PhoneCall, 
  Sparkles, 
  HelpCircle, 
  Search, 
  Filter,
  ShieldCheck,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function SchemesPage() {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(GOVERNMENT_SCHEMES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>('pm-kisan');
  const [showEligibilityQuiz, setShowEligibilityQuiz] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Eligibility Quiz State
  const [quizAnswers, setQuizAnswers] = useState({
    landholding: 'yes',
    landSize: 'marginal', // marginal (<2 ha) vs large
    aadhaarLinked: 'yes',
    hasWaterSource: 'yes'
  });
  const [quizCompleted, setQuizCompleted] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const filteredSchemes = schemes.filter((s) => {
    return selectedCategory === 'All' || s.category === selectedCategory;
  });

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
                <FileText className="w-6 h-6 text-[#228B52]" />
                <span>{language === 'hi' ? 'सरकारी कृषि योजनाएं व सब्सिडी' : 'Government Agricultural Schemes & Subsidies'}</span>
              </h1>
              <p className="text-xs text-[#66746A] mt-1 max-w-2xl">
                {language === 'hi'
                  ? 'पीएम-किसान, फसल बीमा, सूक्ष्म सिंचाई व यंत्रीकरण अनुदान के आधिकारिक नियम, पात्रता व प्रत्यक्ष आवेदन लिंक।'
                  : 'Verified official criteria, required revenue documentation, and direct application portals for Central & State schemes.'}
              </p>
            </div>

            <button
              onClick={() => setShowEligibilityQuiz(!showEligibilityQuiz)}
              className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-2xs self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-[#86B96B]" />
              <span>{language === 'hi' ? 'मेरी पात्रता जांचें' : 'Am I Eligible? (Quiz)'}</span>
            </button>
          </div>

          {/* Interactive "Am I Eligible?" Quiz Card */}
          {showEligibilityQuiz && (
            <div className="glass-panel p-6 rounded-3xl border border-[#86B96B] space-y-4 shadow-sm animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-xs">
                    ?
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#14532D]">
                      {language === 'hi' ? 'त्वरित किसान पात्रता जांच (3 सरल प्रश्न)' : 'Quick 30-Second Eligibility Assessment'}
                    </h3>
                    <p className="text-[11px] text-[#66746A]">
                      Find out which subsidies and credit limits your farm qualifies for.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEligibilityQuiz(false)}
                  className="text-xs text-[#66746A] hover:text-[#14532D] font-bold"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#14532D] mb-1">1. Do you possess cultivable land in revenue records?</label>
                  <select
                    value={quizAnswers.landholding}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, landholding: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] font-medium"
                  >
                    <option value="yes">Yes, Registered Landholder (हाँ, खतौनी दर्ज है)</option>
                    <option value="no">No / Tenant Sharecropper (बटाईदार/पट्टेदार)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#14532D] mb-1">2. Operational Landholding Size?</label>
                  <select
                    value={quizAnswers.landSize}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, landSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] font-medium"
                  >
                    <option value="marginal">Small & Marginal (&lt; 2 Hectares / 5 Acres)</option>
                    <option value="large">Medium / Large (&gt; 5 Acres)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#14532D] mb-1">3. Functioning Borewell or Water Source?</label>
                  <select
                    value={quizAnswers.hasWaterSource}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, hasWaterSource: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] font-medium"
                  >
                    <option value="yes">Yes, Borewell / Farm Pond Available</option>
                    <option value="no">Rainfed Only (केवल वर्षा आधारित)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#E2E8DF]">
                <button
                  onClick={() => {
                    setQuizCompleted(true);
                    addToast('success', 'Assessment Complete', 'Qualified for PM-KISAN, PMFBY, and 55% PMKSY Subsidy.');
                  }}
                  className="px-5 py-2 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold"
                >
                  View My Eligible Subsidies
                </button>

                {quizCompleted && (
                  <span className="text-xs font-extrabold text-[#228B52]">
                    ✓ You qualify for: PM-KISAN (₹6k), 55% Drip Subsidy & 4% KCC Crop Loan
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Scheme Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Financial Assistance', 'Insurance', 'Irrigation', 'Mechanization', 'Credit'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#14532D] text-white shadow-2xs'
                    : 'bg-white border border-[#E2E8DF] text-[#17251D] hover:bg-[#F8F7F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scheme Detail Cards Accordion */}
          <div className="space-y-4">
            {filteredSchemes.map((scheme) => {
              const isExpanded = expandedSchemeId === scheme.id;
              return (
                <div
                  key={scheme.id}
                  className="glass-panel p-5 rounded-3xl border border-[#E2E8DF] space-y-4 transition-all"
                >
                  {/* Scheme Header Banner */}
                  <div
                    onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#228B52] bg-[#86B96B]/20 px-2.5 py-0.5 rounded-full">
                          {scheme.category}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {scheme.status}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-[#14532D] mt-1.5">
                        {language === 'hi' ? scheme.nameHi : scheme.name}
                      </h3>
                      <p className="text-xs text-[#66746A] mt-0.5">
                        {language === 'hi' ? scheme.taglineHi : scheme.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span className="text-xs font-bold text-[#14532D] hidden sm:inline">
                        {isExpanded ? 'Collapse' : 'View Full Details'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#228B52]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#228B52]" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content Details */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-[#E2E8DF] space-y-4 text-xs animate-in fade-in">
                      {/* Financial Benefit Amount */}
                      <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                        <span className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wider mb-0.5">
                          Direct Benefit Amount & Subsidy:
                        </span>
                        <p className="text-emerald-900 font-semibold leading-relaxed">
                          {language === 'hi' ? scheme.benefitAmountHi : scheme.benefitAmount}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Eligibility Criteria */}
                        <div className="p-4 rounded-2xl bg-white border border-[#E2E8DF] space-y-2">
                          <h4 className="font-bold text-[#14532D] uppercase tracking-wider text-[11px]">
                            {language === 'hi' ? 'पात्रता शर्तें' : 'Mandatory Eligibility Criteria'}
                          </h4>
                          <ul className="space-y-1.5 text-[#17251D]">
                            {(language === 'hi' ? scheme.eligibilityHi : scheme.eligibility).map((e, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#228B52] shrink-0 mt-0.5" />
                                <span>{e}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Required Documents */}
                        <div className="p-4 rounded-2xl bg-white border border-[#E2E8DF] space-y-2">
                          <h4 className="font-bold text-[#14532D] uppercase tracking-wider text-[11px]">
                            {language === 'hi' ? 'आवश्यक दस्तावेज सूची' : 'Required Documentation Checklist'}
                          </h4>
                          <ul className="space-y-1.5 text-[#17251D]">
                            {(language === 'hi' ? scheme.documentsRequiredHi : scheme.documentsRequired).map((doc, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="font-bold text-[#228B52]">•</span>
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Official Links & Helpline Bar */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-[#66746A]">
                          <PhoneCall className="w-4 h-4 text-[#E9B949]" />
                          <span>Official Scheme Helpline: <strong>{scheme.helpline}</strong></span>
                        </div>

                        <a
                          href={scheme.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>Open Official Govt Portal</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#86B96B]" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
