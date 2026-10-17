'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { LEARNING_RESOURCES } from '@/data/mockData';
import { LearningVideo } from '@/types';
import { 
  GraduationCap, 
  Play, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Languages, 
  Search, 
  Filter, 
  CheckCircle2, 
  X,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function LearningPage() {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [videos, setVideos] = useState<LearningVideo[]>(LEARNING_RESOURCES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLang, setSelectedLang] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<LearningVideo | null>(null);
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleToggleBookmark = (id: string, title: string) => {
    if (savedVideoIds.includes(id)) {
      setSavedVideoIds(savedVideoIds.filter((vId) => vId !== id));
      addToast('info', 'Bookmark Removed');
    } else {
      setSavedVideoIds([...savedVideoIds, id]);
      addToast('success', 'Guide Bookmarked', `Saved "${title}" to your offline library.`);
    }
  };

  const filteredVideos = videos.filter((v) => {
    const matchesCat = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesLang = selectedLang === 'All' || v.language === selectedLang || v.language === 'Both';
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.crop.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesLang && matchesSearch;
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
          <div className="pb-4 border-b border-[#E2E8DF]">
            <h1 className="text-xl sm:text-2xl font-black text-[#14532D] flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#228B52]" />
              <span>{language === 'hi' ? 'कृषि शिक्षा एवं वीडियो मार्गदर्शन केंद्र' : 'Agricultural Video & Knowledge Hub'}</span>
            </h1>
            <p className="text-xs text-[#66746A] mt-1 max-w-2xl">
              {language === 'hi'
                ? 'भारतीय कृषि अनुसंधान परिषद (ICAR) व कृषि विश्वविद्यालयों द्वारा प्रमाणित आधुनिक खेती, ड्रिप सिंचाई और जैविक खाद बनाने की विधियां।'
                : 'Curated agricultural video masterclasses and practical step-by-step guides from ICAR and state agricultural universities.'}
            </p>
          </div>

          {/* Search & Filters */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#66746A] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutorials: drip irrigation, organic jeevamrit, wheat sowing..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs text-[#17251D] focus:outline-none focus:border-[#14532D]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs font-semibold text-[#14532D] focus:outline-none focus:border-[#14532D]"
              >
                <option value="All">All Topics</option>
                <option value="Water Management">Water Management</option>
                <option value="Organic Farming">Organic & Natural Farming</option>
                <option value="Crop Cultivation">Crop Cultivation</option>
                <option value="Soil Health">Soil Health</option>
              </select>

              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs font-semibold text-[#14532D] focus:outline-none focus:border-[#14532D]"
              >
                <option value="All">All Languages</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVideos.map((video) => {
              const isSaved = savedVideoIds.includes(video.id);
              return (
                <div
                  key={video.id}
                  className="glass-panel p-5 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all duration-200 border border-[#E2E8DF] space-y-4"
                >
                  <div className="space-y-3">
                    {/* Video Thumbnail Frame */}
                    <div 
                      onClick={() => setActiveVideo(video)}
                      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#14532D] to-[#123B2A] aspect-video flex items-center justify-center cursor-pointer group shadow-inner"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/90 text-[#14532D] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5 text-[#14532D]" />
                      </div>

                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>{video.durationMinutes} Mins</span>
                      </div>

                      <div className="absolute bottom-2 right-2 bg-[#E9B949] text-[#123B2A] px-2 py-0.5 rounded text-[10px] font-black">
                        {video.language}
                      </div>
                    </div>

                    {/* Metadata & Title */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#66746A]">
                        <span className="font-bold text-[#228B52]">
                          {language === 'hi' ? video.categoryHi : video.category}
                        </span>
                        <span>{video.source}</span>
                      </div>
                      <h3 
                        onClick={() => setActiveVideo(video)}
                        className="font-extrabold text-sm text-[#14532D] mt-1 hover:text-[#228B52] cursor-pointer line-clamp-2"
                      >
                        {language === 'hi' ? video.titleHi : video.title}
                      </h3>
                    </div>

                    {/* Key takeaways bullet preview */}
                    <div className="p-3 rounded-2xl bg-white/70 border border-[#E2E8DF]/60 space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider block">
                        Core Takeaways:
                      </span>
                      {(language === 'hi' ? video.keyPointsHi : video.keyPoints).slice(0, 2).map((kp, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[#17251D] text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#228B52] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{kp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#E2E8DF] flex items-center justify-between">
                    <button
                      onClick={() => setActiveVideo(video)}
                      className="px-4 py-1.5 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#86B96B]" />
                      <span>{language === 'hi' ? 'पाठ देखें' : 'Watch Guide'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleBookmark(video.id, video.title)}
                      className={`p-2 rounded-xl border transition-all ${
                        isSaved
                          ? 'bg-[#86B96B]/20 border-[#86B96B] text-[#14532D]'
                          : 'bg-white border-[#E2E8DF] text-[#66746A] hover:text-[#14532D]'
                      }`}
                      title={isSaved ? 'Bookmarked' : 'Save for later'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#228B52]" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Video Modal Player */}
          {activeVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
              <div className="max-w-2xl w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
                  <div>
                    <span className="text-[10px] font-bold text-[#228B52] uppercase bg-[#86B96B]/20 px-2 py-0.5 rounded-full">
                      {activeVideo.category}
                    </span>
                    <h3 className="text-base font-extrabold text-[#14532D] mt-1">
                      {language === 'hi' ? activeVideo.titleHi : activeVideo.title}
                    </h3>
                  </div>
                  <button onClick={() => setActiveVideo(null)} className="p-1 rounded-lg text-[#66746A] hover:bg-[#F8F7F0]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Simulated High-Res Player */}
                <div className="aspect-video rounded-2xl bg-black flex flex-col items-center justify-center text-white p-6 relative shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-[#14532D] text-[#86B96B] flex items-center justify-center mb-3">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  <span className="text-sm font-bold text-white text-center">
                    Official Instructional Video ({activeVideo.source})
                  </span>
                  <span className="text-xs text-white/60 mt-1">
                    Playing in High Definition • Audio: {activeVideo.language}
                  </span>
                </div>

                {/* Full Key Instructions */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                    {language === 'hi' ? 'मुख्य तकनीकी चरण एवं सावधानियां:' : 'Step-by-Step Technical Protocol:'}
                  </h4>
                  <ul className="space-y-2 text-xs text-[#17251D]">
                    {(language === 'hi' ? activeVideo.keyPointsHi : activeVideo.keyPoints).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 bg-[#F8F7F0] p-2.5 rounded-xl border border-[#E2E8DF]">
                        <CheckCircle2 className="w-4 h-4 text-[#228B52] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold"
                  >
                    Done
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
