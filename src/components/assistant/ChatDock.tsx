'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

// Small floating shortcut to the full-screen Setu AI. Hidden on the assistant page itself.
export default function ChatDock() {
  const path = usePathname();
  if (path?.startsWith('/assistant')) return null;
  return (
    <Link href="/assistant" aria-label="Setu AI"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-[#14532D] text-white text-sm font-bold shadow-lg hover:bg-[#123B2A]">
      <Sparkles className="w-4 h-4 text-[#86B96B]" /> Setu AI
    </Link>
  );
}
