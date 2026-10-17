'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { COMMUNITY_REPORTS } from '@/data/mockData';
import { CommunityReport } from '@/types';
import { 
  Users, 
  ThumbsUp, 
  ThumbsDown, 
  PlusCircle, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Filter, 
  Search,
  Flag,
  Share2
} from 'lucide-react';

export default function CommunityPage() {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reports, setReports] = useState<CommunityReport[]>(COMMUNITY_REPORTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // New Report Form State
  const [newReport, setNewReport] = useState({
    title: '',
    category: 'Pest Alert' as const,
    authorDistrict: 'Sehore, Madhya Pradesh',
    description: ''
  });

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleVote = (id: string, direction: 'up' | 'down') => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== id) return rep;

        let newUpvotes = rep.upvotes;
        let newUserVoted: 'up' | 'down' | null = direction;

        if (rep.userVoted === direction) {
          // Toggle off
          newUserVoted = null;
          newUpvotes = direction === 'up' ? rep.upvotes - 1 : rep.upvotes + 1;
        } else if (rep.userVoted) {
          // Switch vote
          newUpvotes = direction === 'up' ? rep.upvotes + 2 : rep.upvotes - 2;
        } else {
          // First vote
          newUpvotes = direction === 'up' ? rep.upvotes + 1 : rep.upvotes - 1;
        }

        return {
          ...rep,
          upvotes: newUpvotes,
          userVoted: newUserVoted
        };
      })
    );

    addToast('info', 'Vote Recorded', '1 active vote registered per farmer profile.');
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.title.trim() || !newReport.description.trim()) {
      addToast('error', 'Fields Required', 'Please enter both title and description.');
      return;
    }

    const created: CommunityReport = {
      id: `rep-${Date.now()}`,
      authorName: 'Baldev Singh (You)',
      authorDistrict: newReport.authorDistrict,
      category: newReport.category,
      categoryHi: newReport.category,
      title: newReport.title,
      titleHi: newReport.title,
      description: newReport.description,
      descriptionHi: newReport.description,
      timestamp: 'Just now',
      upvotes: 1,
      userVoted: 'up',
      verificationLevel: 'Farmer Community'
    };

    setReports([created, ...reports]);
    setShowSubmitModal(false);
    setNewReport({
      title: '',
      category: 'Pest Alert',
      authorDistrict: 'Sehore, Madhya Pradesh',
      description: ''
    });
    addToast('success', 'Report Shared', 'Your observation has been shared with nearby farmers.');
  };

  const filteredReports = reports.filter((r) => {
    return selectedCategory === 'All' || r.category === selectedCategory;
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
                <Users className="w-6 h-6 text-[#228B52]" />
                <span>{language === 'hi' ? 'किसान चौपाल एवं क्षेत्रीय अलर्ट' : 'Location-Based Community Radar'}</span>
              </h1>
              <p className="text-xs text-[#66746A] mt-1 max-w-2xl">
                {language === 'hi'
                  ? 'स्थानीय किसानों द्वारा साझा की गई कीट चेतावनी, नहर में पानी छोड़ने का समय, और मंडी आवक की जमीनी रिपोर्ट्स।'
                  : 'Crowdsourced micro-observations on pest outbreaks, canal water rosters, and spot market trends.'}
              </p>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-2xs self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4 text-[#86B96B]" />
              <span>{language === 'hi' ? 'खेत की सूचना पोस्ट करें' : 'Post Community Alert'}</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Pest Alert', 'Irrigation Canal', 'Mandi Arrival', 'Weather & Rain'].map((cat) => (
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

          {/* Reports Feed */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="glass-panel p-5 rounded-3xl border border-[#E2E8DF] space-y-3"
              >
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#228B52] bg-[#86B96B]/20 px-2.5 py-0.5 rounded-full">
                      {language === 'hi' ? report.categoryHi : report.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      report.verificationLevel === 'District Admin'
                        ? 'bg-purple-100 text-purple-900'
                        : report.verificationLevel === 'Agronomist Verified'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
                      {report.verificationLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#66746A]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#228B52]" /> {report.authorDistrict}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {report.timestamp}
                    </span>
                  </div>
                </div>

                {/* Report Content */}
                <div>
                  <h3 className="font-extrabold text-base text-[#14532D]">
                    {language === 'hi' ? report.titleHi : report.title}
                  </h3>
                  <p className="text-xs text-[#17251D] mt-1.5 leading-relaxed">
                    {language === 'hi' ? report.descriptionHi : report.description}
                  </p>
                  <span className="block text-[11px] text-[#66746A] mt-2 font-medium">
                    Reported by: {report.authorName}
                  </span>
                </div>

                {/* Footer with Upvote / Downvote */}
                <div className="pt-2 border-t border-[#E2E8DF]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(report.id, 'up')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                        report.userVoted === 'up'
                          ? 'bg-[#14532D] text-white border-[#14532D]'
                          : 'bg-white border-[#E2E8DF] text-[#66746A] hover:bg-[#F8F7F0]'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="font-bold">{report.upvotes} Helpful</span>
                    </button>

                    <button
                      onClick={() => handleVote(report.id, 'down')}
                      className={`p-1.5 rounded-xl border transition-all ${
                        report.userVoted === 'down'
                          ? 'bg-rose-700 text-white border-rose-700'
                          : 'bg-white border-[#E2E8DF] text-[#66746A] hover:bg-[#F8F7F0]'
                      }`}
                      title="Downvote inaccurate report"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => addToast('info', 'Report Flagged', 'Our agronomy moderation team will review this notice.')}
                    className="text-[11px] text-[#66746A] hover:text-rose-700 flex items-center gap-1 font-medium"
                  >
                    <Flag className="w-3 h-3" />
                    <span>Report inaccuracy</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Observation Modal */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
                  <h3 className="font-extrabold text-sm text-[#14532D]">
                    Post Field Alert / Community Observation
                  </h3>
                  <button onClick={() => setShowSubmitModal(false)} className="text-[#66746A]">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#14532D] mb-1">Observation Category</label>
                    <select
                      value={newReport.category}
                      onChange={(e) => setNewReport({ ...newReport, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF]"
                    >
                      <option value="Pest Alert">Pest Alert (कीट प्रकोप)</option>
                      <option value="Irrigation Canal">Irrigation Canal (नहर रोस्टर)</option>
                      <option value="Mandi Arrival">Mandi Arrival (मंडी आवक/भाव)</option>
                      <option value="Weather & Rain">Weather & Rain (मौसम)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#14532D] mb-1">Headline / Summary</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Spotted pink bollworm on cotton border..."
                      value={newReport.title}
                      onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14532D] mb-1">District / Region</label>
                    <input
                      type="text"
                      required
                      value={newReport.authorDistrict}
                      onChange={(e) => setNewReport({ ...newReport, authorDistrict: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14532D] mb-1">Detailed Description</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe symptoms, exact village or canal gauge reading..."
                      value={newReport.description}
                      onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="px-3 py-1.5 rounded-xl border border-[#E2E8DF] font-bold text-[#66746A]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white font-bold"
                    >
                      Publish Alert
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
