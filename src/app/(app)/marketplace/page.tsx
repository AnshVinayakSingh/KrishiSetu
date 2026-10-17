'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_CROP_LISTINGS, INITIAL_BUYER_OFFERS } from '@/data/mockData';
import { CropListing, BuyerOffer, ChatMessage } from '@/types';
import { 
  Store, 
  Search, 
  Filter, 
  PlusCircle, 
  MessageSquare, 
  Check, 
  X, 
  ArrowLeftRight, 
  Truck, 
  MapPin, 
  Wheat, 
  ShieldCheck, 
  TrendingUp,
  Send,
  Eye,
  AlertCircle
} from 'lucide-react';

export default function MarketplacePage() {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [listings, setListings] = useState<CropListing[]>(INITIAL_CROP_LISTINGS);
  const [offers, setOffers] = useState<BuyerOffer[]>(INITIAL_BUYER_OFFERS);
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'listings' | 'offers' | 'create'>('listings');
  const [activeNegotiationOffer, setActiveNegotiationOffer] = useState<BuyerOffer | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // New Listing Form State
  const [newListing, setNewListing] = useState({
    cropName: 'Sharbati Wheat',
    variety: 'MP Sharbati 306',
    quantity: 100,
    unit: 'Quintals' as const,
    harvestDate: 'Ready for Dispatch',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    grade: 'Grade A (Premium)' as const,
    askingPricePerUnit: 2850,
    pricingMode: 'Negotiable' as const,
    minOrderQuantity: 20,
    deliveryOption: 'Buyer pickup from Farm Gate' as const,
    description: 'Cleaned, sun-dried, moisture tested below 11.5%.'
  });

  // Demo Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'buyer',
      senderName: 'Amit Agrawal (Malwa Agro Mills)',
      text: 'Namaste Baldev ji, we reviewed your Sharbati Wheat lot of 120 Quintals. Can you confirm if grain moisture is certified below 12%?',
      timestamp: '10:30 AM'
    },
    {
      id: 'c2',
      sender: 'farmer',
      senderName: 'Baldev Singh (Farmer)',
      text: 'Haan Amit ji, yesterday KVK Sehore certified moisture at 11.2%. Very clean luster. We can load directly onto your 10-wheel truck.',
      timestamp: '10:35 AM'
    },
    {
      id: 'c3',
      sender: 'buyer',
      senderName: 'Amit Agrawal (Malwa Agro Mills)',
      text: 'Great. We have placed a formal offer of ₹2,840/Qtl for 100 Quintals with 24-hr RTGS payment post-weighbridge.',
      timestamp: '10:40 AM',
      offerUpdate: { price: 2840, quantity: 100, status: 'Active Offer' }
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Filter listings
  const filteredListings = listings.filter((l) => {
    const matchesCrop = selectedCropFilter === 'All' || l.cropName.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const matchesSearch = l.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.variety.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  // Handle Offer Actions
  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Agreed' as const } : o))
    );
    addToast('success', t('offerAccepted'), 'Logistics coordination and digital weighbridge pass generated.');
  };

  const handleRejectOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Rejected' as const } : o))
    );
    addToast('info', t('offerRejected'), 'Buyer notified of offer rejection.');
  };

  const handleSendCounter = () => {
    if (!activeNegotiationOffer || !counterPriceInput) return;

    setOffers((prev) =>
      prev.map((o) =>
        o.id === activeNegotiationOffer.id
          ? {
              ...o,
              status: 'Countered' as const,
              counterPricePerUnit: counterPriceInput,
              note: `Farmer proposed counter of ₹${counterPriceInput}/Qtl.`
            }
          : o
      )
    );

    // Append to Chat
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'farmer',
      senderName: 'Baldev Singh (Farmer)',
      text: `I have sent a counter offer of ₹${counterPriceInput}/Qtl for your consideration.`,
      timestamp: 'Just now',
      offerUpdate: {
        price: counterPriceInput,
        quantity: activeNegotiationOffer.quantityRequested,
        status: 'Counter-Offer Proposed'
      }
    };
    setChatMessages((prev) => [...prev, newMsg]);

    addToast('success', t('counterOfferSent'), `Proposed price: ₹${counterPriceInput}/Qtl`);
    setActiveNegotiationOffer(null);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.cropName || !newListing.quantity || !newListing.askingPricePerUnit) {
      addToast('error', 'Missing Fields', 'Please complete all required listing fields.');
      return;
    }

    const created: CropListing = {
      id: `list-${Date.now()}`,
      farmerId: 'farmer-1',
      farmerName: 'Baldev Singh',
      farmerPhone: '+91 98765 43210',
      cropName: newListing.cropName,
      cropNameHi: newListing.cropName,
      variety: newListing.variety,
      quantity: Number(newListing.quantity),
      unit: newListing.unit,
      harvestDate: newListing.harvestDate,
      district: newListing.district,
      state: newListing.state,
      grade: newListing.grade,
      askingPricePerUnit: Number(newListing.askingPricePerUnit),
      pricingMode: newListing.pricingMode,
      minOrderQuantity: Number(newListing.minOrderQuantity),
      deliveryOption: newListing.deliveryOption,
      description: newListing.description,
      status: 'Active',
      createdAt: 'Just now'
    };

    setListings([created, ...listings]);
    setViewMode('listings');
    addToast('success', 'Crop Lot Posted', 'Your produce is now visible to registered buyers & mills.');
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'farmer',
      senderName: 'Baldev Singh (Farmer)',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, msg]);
    setChatInput('');
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
                <Store className="w-6 h-6 text-[#228B52]" />
                <span>{t('marketplaceTitle')}</span>
              </h1>
              <p className="text-xs text-[#66746A] mt-1 max-w-2xl">
                {t('marketplaceSubtitle')}
              </p>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('listings')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'listings'
                    ? 'bg-[#14532D] text-white shadow-2xs'
                    : 'bg-white border border-[#E2E8DF] text-[#17251D] hover:bg-[#F8F7F0]'
                }`}
              >
                {language === 'hi' ? 'सक्रिय फसलें (Browse)' : 'Crop Lots'}
              </button>

              <button
                onClick={() => setViewMode('offers')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                  viewMode === 'offers'
                    ? 'bg-[#14532D] text-white shadow-2xs'
                    : 'bg-white border border-[#E2E8DF] text-[#17251D] hover:bg-[#F8F7F0]'
                }`}
              >
                <span>{language === 'hi' ? 'बोलियां व मोलभाव' : 'Buyer Offers & Bids'}</span>
                <span className="ml-1.5 text-[10px] bg-[#E9B949] text-[#123B2A] px-1.5 py-0.2 rounded-full font-black">
                  {offers.length}
                </span>
              </button>

              <button
                onClick={() => setViewMode('create')}
                className="px-3.5 py-1.5 rounded-xl bg-[#228B52] hover:bg-[#14532D] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t('createListingButton')}</span>
              </button>
            </div>
          </div>

          {/* VIEW 1: BROWSE CROP LISTINGS */}
          {viewMode === 'listings' && (
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#66746A] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs text-[#17251D] focus:outline-none focus:border-[#14532D]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedCropFilter}
                    onChange={(e) => setSelectedCropFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs font-semibold text-[#14532D] focus:outline-none focus:border-[#14532D] w-full sm:w-auto"
                  >
                    <option value="All">{t('allCrops')}</option>
                    <option value="Wheat">Wheat (गेहूँ)</option>
                    <option value="Mustard">Mustard (सरसों)</option>
                    <option value="Basmati">Basmati Paddy (धान)</option>
                    <option value="Onion">Onion (प्याज)</option>
                  </select>
                </div>
              </div>

              {/* Crop Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="glass-panel p-5 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all duration-200 border border-[#E2E8DF] space-y-4"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
                        <span className="text-xs font-bold text-[#14532D] bg-[#86B96B]/20 px-2.5 py-0.5 rounded-full">
                          {listing.cropName}
                        </span>
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          {listing.grade}
                        </span>
                      </div>

                      <div className="mt-3">
                        <h3 className="font-extrabold text-base text-[#14532D]">
                          {listing.variety}
                        </h3>
                        <p className="text-xs text-[#66746A] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#228B52]" />
                          <span>{listing.district}, {listing.state}</span>
                        </p>
                      </div>

                      <p className="text-xs text-[#17251D] mt-2.5 line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E2E8DF]/60 text-xs">
                        <div>
                          <span className="block text-[10px] text-[#66746A]">{t('quantityAvailable')}</span>
                          <span className="font-bold text-[#14532D]">
                            {listing.quantity} {listing.unit}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#66746A]">{t('deliveryMode')}</span>
                          <span className="font-medium text-[#17251D] text-[11px] truncate block">
                            {listing.deliveryOption}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8DF] flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] text-[#66746A]">{t('askingPrice')}</span>
                        <span className="font-black text-lg text-[#14532D]">
                          ₹{listing.askingPricePerUnit}{' '}
                          <span className="text-xs font-normal text-[#66746A]">/ Qtl</span>
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setViewMode('offers');
                          addToast('info', 'Negotiation Drawer', `Viewing bids for ${listing.cropName}`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold transition-all shadow-2xs"
                      >
                        {t('makeOffer')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: BUYER OFFERS & LIVE NEGOTIATION CHAT */}
          {viewMode === 'offers' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left 6 Cols: Active Bids Table */}
              <div className="lg:col-span-6 space-y-4">
                <div className="glass-panel p-5 rounded-3xl space-y-4">
                  <h3 className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                    {language === 'hi' ? 'प्राप्त बोलियां एवं मोलभाव स्थिति' : 'Active Buyer Offers'}
                  </h3>

                  <div className="space-y-3">
                    {offers.map((offer) => (
                      <div
                        key={offer.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          offer.status === 'Agreed'
                            ? 'bg-emerald-50 border-emerald-300'
                            : offer.status === 'Countered'
                            ? 'bg-amber-50 border-amber-300'
                            : 'bg-white border-[#E2E8DF]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[#14532D] text-sm">
                            {offer.buyerCompany}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            offer.status === 'Agreed' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                          }`}>
                            {offer.status}
                          </span>
                        </div>

                        <div className="my-2.5 text-xs text-[#66746A]">
                          <p>{offer.note}</p>
                          <div className="mt-2 flex items-center justify-between font-bold text-[#14532D]">
                            <span>Offered: ₹{offer.offeredPricePerUnit} / Qtl</span>
                            <span>Qty: {offer.quantityRequested} Qtl</span>
                          </div>
                          {offer.counterPricePerUnit && (
                            <div className="mt-1 text-emerald-700 font-extrabold text-xs">
                              Counter Sent: ₹{offer.counterPricePerUnit} / Qtl
                            </div>
                          )}
                        </div>

                        {offer.status !== 'Agreed' && offer.status !== 'Rejected' && (
                          <div className="pt-2 border-t border-[#E2E8DF]/60 flex items-center gap-2">
                            <button
                              onClick={() => handleAcceptOffer(offer.id)}
                              className="flex-1 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept Deal</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveNegotiationOffer(offer);
                                setCounterPriceInput(offer.offeredPricePerUnit + 40);
                              }}
                              className="flex-1 py-1.5 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold transition-all flex items-center justify-center gap-1"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                              <span>Counter Offer</span>
                            </button>

                            <button
                              onClick={() => handleRejectOffer(offer.id)}
                              className="p-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 transition-all"
                              title="Decline Offer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Counter Offer Modal / Box */}
                {activeNegotiationOffer && (
                  <div className="glass-panel p-5 rounded-3xl border border-[#86B96B] space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-[#14532D] text-xs uppercase">
                        Propose Counter-Offer to {activeNegotiationOffer.buyerName}
                      </h4>
                      <button onClick={() => setActiveNegotiationOffer(null)} className="text-[#66746A]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-[11px] font-bold text-[#14532D] mb-1">
                          Counter Price (₹/Quintal)
                        </label>
                        <input
                          type="number"
                          value={counterPriceInput}
                          onChange={(e) => setCounterPriceInput(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs font-bold text-[#14532D]"
                        />
                      </div>
                      <button
                        onClick={handleSendCounter}
                        className="mt-5 px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold"
                      >
                        Submit Counter
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right 6 Cols: Direct Buyer-Farmer Negotiation Chat */}
              <div className="lg:col-span-6 glass-panel p-5 rounded-3xl flex flex-col h-[520px]">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
                  <div>
                    <h3 className="text-xs font-extrabold text-[#14532D]">
                      Direct Buyer Chat: Malwa Agro Flour Mills
                    </h3>
                    <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> GST & Mandi License Verified
                    </span>
                  </div>
                  <span className="text-[11px] text-[#66746A]">Lot #101 (Wheat)</span>
                </div>

                {/* Chat Message Stream */}
                <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        msg.sender === 'farmer'
                          ? 'ml-auto bg-[#14532D] text-white rounded-tr-none'
                          : 'mr-auto bg-white border border-[#E2E8DF] text-[#17251D] rounded-tl-none'
                      }`}
                    >
                      <div className="font-bold text-[11px] opacity-80 mb-0.5">{msg.senderName}</div>
                      <p>{msg.text}</p>
                      {msg.offerUpdate && (
                        <div className="mt-2 p-2 rounded-xl bg-black/10 border border-white/20 text-[11px] font-bold">
                          Offer: ₹{msg.offerUpdate.price}/Qtl for {msg.offerUpdate.quantity} Qtl
                        </div>
                      )}
                      <div className="text-[9px] opacity-60 text-right mt-1">{msg.timestamp}</div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendChatMessage} className="pt-2 border-t border-[#E2E8DF] flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message to buyer..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs focus:outline-none focus:border-[#14532D]"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#14532D] text-white hover:bg-[#123B2A]"
                  >
                    <Send className="w-4 h-4 text-[#86B96B]" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* VIEW 3: CREATE NEW CROP LISTING FORM */}
          {viewMode === 'create' && (
            <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="pb-3 border-b border-[#E2E8DF]">
                <h2 className="text-lg font-black text-[#14532D]">
                  {language === 'hi' ? 'बिक्री हेतु नई फसल दर्ज करें' : 'Post New Crop Lot for Sale'}
                </h2>
                <p className="text-xs text-[#66746A] mt-0.5">
                  Reach verified regional flour mills, exporters, and wholesale purchasers.
                </p>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#14532D] mb-1">Crop Name</label>
                    <input
                      type="text"
                      required
                      value={newListing.cropName}
                      onChange={(e) => setNewListing({ ...newListing, cropName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#14532D] mb-1">Variety</label>
                    <input
                      type="text"
                      required
                      value={newListing.variety}
                      onChange={(e) => setNewListing({ ...newListing, variety: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#14532D] mb-1">Quantity</label>
                    <input
                      type="number"
                      required
                      value={newListing.quantity}
                      onChange={(e) => setNewListing({ ...newListing, quantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#14532D] mb-1">Unit</label>
                    <select
                      value={newListing.unit}
                      onChange={(e) => setNewListing({ ...newListing, unit: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs"
                    >
                      <option value="Quintals">Quintals</option>
                      <option value="Tons">Tons</option>
                      <option value="Kg">Kg</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#14532D] mb-1">Asking Price (₹/Unit)</label>
                    <input
                      type="number"
                      required
                      value={newListing.askingPricePerUnit}
                      onChange={(e) => setNewListing({ ...newListing, askingPricePerUnit: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs font-bold text-[#14532D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#14532D] mb-1">Quality Grade</label>
                    <select
                      value={newListing.grade}
                      onChange={(e) => setNewListing({ ...newListing, grade: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs"
                    >
                      <option value="Grade A (Premium)">Grade A (Premium)</option>
                      <option value="Grade B (Standard)">Grade B (Standard)</option>
                      <option value="Grade C (Fair)">Grade C (Fair)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#14532D] mb-1">Delivery Preference</label>
                    <select
                      value={newListing.deliveryOption}
                      onChange={(e) => setNewListing({ ...newListing, deliveryOption: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs"
                    >
                      <option value="Buyer pickup from Farm Gate">Buyer pickup from Farm Gate</option>
                      <option value="Farmer will arrange">Farmer will arrange</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#14532D] mb-1">Description & Storing Specs</label>
                  <textarea
                    rows={3}
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8DF] text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8DF]">
                  <button
                    type="button"
                    onClick={() => setViewMode('listings')}
                    className="px-4 py-2 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#66746A] hover:bg-[#F8F7F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#14532D] hover:bg-[#123B2A] text-white text-xs font-bold shadow-xs"
                  >
                    Publish Listing
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
