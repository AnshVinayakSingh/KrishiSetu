'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Home, PhoneCall, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md border border-[#E2E8DF] rounded-3xl p-8 text-center shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-[#14532D]/10 text-[#14532D] mx-auto flex items-center justify-center mb-6">
          <Sprout className="w-8 h-8 text-[#228B52]" />
        </div>

        <span className="text-xs font-bold text-[#228B52] uppercase tracking-wider bg-[#86B96B]/20 px-3 py-1 rounded-full">
          404 — पृष्ठ नहीं मिला (Page Not Found)
        </span>

        <h1 className="text-2xl font-black text-[#14532D] mt-4 tracking-tight">
          Oops! This path hasn&apos;t sprouted yet.
        </h1>

        <p className="text-xs text-[#66746A] mt-2 leading-relaxed">
          The agricultural page or crop listing you are searching for might have been harvested, moved, or never planted.
        </p>

        <p className="text-xs text-[#123B2A] font-medium mt-1">
          जिस पृष्ठ को आप खोज रहे हैं, वह उपलब्ध नहीं है। कृपया होमपेज पर लौटें।
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#14532D] text-white font-bold text-xs hover:bg-[#123B2A] transition-all shadow-xs"
          >
            <Home className="w-4 h-4 text-[#86B96B]" />
            <span>Return to KrishiSetu Home (होमपेज पर जाएं)</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-[#E2E8DF] bg-white text-[#17251D] font-bold text-xs hover:bg-[#F8F7F0] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#228B52]" />
            <span>Go to Farmer Dashboard (किसान डैशबोर्ड)</span>
          </Link>

          <a
            href="tel:18001801551"
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl text-xs text-[#66746A] hover:text-[#14532D] transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#E9B949]" />
            <span>Need assistance? Call Kisan Helpline 1800-180-1551</span>
          </a>
        </div>
      </div>
    </div>
  );
}
