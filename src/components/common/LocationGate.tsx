'use client';

import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';

// Blocks the whole app until the browser location permission is granted.
export default function LocationGate({ children }: { children: React.ReactNode }) {
  const { status, request } = useLocation();
  const { language } = useLanguage();
  const hi = language === 'hi';

  if (status === 'granted') return <>{children}</>;

  const waiting = status === 'asking';
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F0] p-6">
      <div className="max-w-sm w-full text-center bg-white border border-[#E2E8DF] rounded-3xl p-8 shadow-sm space-y-4">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#14532D] flex items-center justify-center">
          {waiting ? <Loader2 className="w-7 h-7 text-[#86B96B] animate-spin" /> : <MapPin className="w-7 h-7 text-[#86B96B]" />}
        </div>
        <h1 className="text-lg font-black text-[#14532D]">
          {hi ? 'लोकेशन की अनुमति दें' : 'Allow location access'}
        </h1>
        <p className="text-xs text-[#66746A] leading-relaxed">
          {status === 'unsupported'
            ? (hi ? 'आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता। कृपया दूसरा ब्राउज़र इस्तेमाल करें।' : 'Your browser does not support location. Please use another browser.')
            : waiting
            ? (hi ? 'कृपया ब्राउज़र में "Allow" दबाएँ…' : 'Please tap "Allow" in the browser prompt…')
            : (hi
                ? 'आपके खेत के मौसम और नज़दीकी मंडी भाव के लिए लोकेशन ज़रूरी है। एड्रेस बार के लॉक/लोकेशन आइकन से अनुमति दें, फिर दोबारा कोशिश करें।'
                : 'Location is required for your local weather and nearby mandi prices. Allow it from the lock/location icon in the address bar, then retry.')}
        </p>
        {status === 'denied' && (
          <button onClick={request} className="w-full py-2.5 rounded-xl bg-[#14532D] text-white text-xs font-bold hover:bg-[#123B2A]">
            {hi ? 'दोबारा कोशिश करें' : 'Try again'}
          </button>
        )}
      </div>
    </div>
  );
}
