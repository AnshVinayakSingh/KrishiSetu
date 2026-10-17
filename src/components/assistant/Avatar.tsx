'use client';

import React from 'react';

export type AssistantState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface AvatarProps {
  state: AssistantState;
  size?: 'sm' | 'md' | 'lg';
}

export default function AssistantAvatar({ state, size = 'md' }: AvatarProps) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeMap[size]}`}>
      {/* Outer Glow / Aura based on State */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          state === 'listening'
            ? 'bg-[#E9B949]/30 scale-125 animate-ping'
            : state === 'thinking'
            ? 'bg-[#86B96B]/30 scale-110 animate-pulse'
            : state === 'speaking'
            ? 'bg-[#228B52]/25 scale-120 animate-pulse-subtle'
            : 'bg-[#14532D]/10 scale-100'
        }`}
      />

      {/* Outer Soundwaves for Listening state */}
      {state === 'listening' && (
        <div className="absolute -inset-3 rounded-full border-2 border-[#E9B949]/60 animate-ping opacity-75" />
      )}

      {/* Main Indian Farmer / Krishi Guide Avatar Container */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#14532D] to-[#123B2A] border-2 border-[#86B96B] shadow-md flex items-center justify-center overflow-hidden">
        {/* Soft background field hill lines */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        >
          <path d="M0,80 Q25,60 50,75 T100,65 L100,100 L0,100 Z" fill="#86B96B" />
          <path d="M0,90 Q30,75 60,85 T100,80 L100,100 L0,100 Z" fill="#E9B949" />
        </svg>

        {/* Farmer SVG Mascot: Friendly face with Pagri (Turban), mustache, tilak, and ears */}
        <svg
          viewBox="0 0 100 100"
          className={`w-4/5 h-4/5 transition-transform duration-300 ${
            state === 'thinking' ? 'animate-bounce' : state === 'listening' ? 'scale-105' : 'scale-100'
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Turban (Pagri) - saffron/gold agricultural Indian headwear */}
          <path
            d="M20 38C20 22 32 14 50 14C68 14 80 22 80 38C75 32 65 30 50 30C35 30 25 32 20 38Z"
            fill="#E9B949"
          />
          <path
            d="M25 32C35 24 65 24 75 32C80 38 78 44 70 42C60 40 40 40 30 42C22 44 20 38 25 32Z"
            fill="#F59E0B"
          />
          {/* Turban fold knot */}
          <ellipse cx="50" cy="22" rx="7" ry="5" fill="#D97706" />

          {/* Face */}
          <ellipse cx="50" cy="54" rx="24" ry="25" fill="#FDE68A" />

          {/* Ears */}
          <ellipse cx="25" cy="54" rx="3.5" ry="5.5" fill="#FCD34D" />
          <ellipse cx="75" cy="54" rx="3.5" ry="5.5" fill="#FCD34D" />

          {/* Eyes with blink / animation */}
          <ellipse cx="40" cy="50" rx="3" ry="3.5" fill="#14532D" />
          <ellipse cx="60" cy="50" rx="3" ry="3.5" fill="#14532D" />
          <circle cx="41" cy="49" r="1" fill="#FFFFFF" />
          <circle cx="61" cy="49" r="1" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M34 44C38 42 43 43 45 45" stroke="#123B2A" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M66 44C62 42 57 43 55 45" stroke="#123B2A" strokeWidth="1.8" strokeLinecap="round" />

          {/* Tilak / Tika */}
          <rect x="49" y="38" width="2" height="6" rx="1" fill="#DC2626" />

          {/* Indian Mustache */}
          <path
            d="M38 62C44 60 49 63 50 64C51 63 56 60 62 62C66 63 68 66 65 67C59 68 53 66 50 68C47 66 41 68 35 67C32 66 34 63 38 62Z"
            fill="#123B2A"
          />

          {/* Mouth (moves when speaking) */}
          {state === 'speaking' ? (
            <ellipse cx="50" cy="71" rx="4.5" ry="3.5" fill="#B91C1C" className="animate-pulse" />
          ) : (
            <path d="M46 71C48 72.5 52 72.5 54 71" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" />
          )}

          {/* Sprout motif pinned to Pagri */}
          <path d="M50 18C52 14 56 12 58 14C58 17 54 18 50 18Z" fill="#86B96B" />
          <path d="M50 18C48 14 44 12 42 14C42 17 46 18 50 18Z" fill="#228B52" />
        </svg>

        {/* Dynamic Voice Waves indicator on bottom right when Speaking */}
        {state === 'speaking' && (
          <div className="absolute bottom-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white/90">
            <span className="w-1 bg-[#228B52] rounded-full animate-wave-bar" style={{ animationDelay: '0ms' }} />
            <span className="w-1 bg-[#228B52] rounded-full animate-wave-bar" style={{ animationDelay: '200ms' }} />
            <span className="w-1 bg-[#228B52] rounded-full animate-wave-bar" style={{ animationDelay: '400ms' }} />
          </div>
        )}
      </div>

      {/* State Badge Label */}
      <div className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs border bg-white text-[#14532D] border-[#86B96B]">
        {state === 'listening' && 'सुन रहे हैं... (Listening)'}
        {state === 'thinking' && 'सोच रहे हैं... (Thinking)'}
        {state === 'speaking' && 'बोल रहे हैं (Speaking)'}
        {state === 'idle' && 'कृषि सहायक (Ready)'}
      </div>
    </div>
  );
}
