'use client';

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import Footer from './Footer';

// Standard page frame: header + banner, sidebar, footer.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F0] text-[#17251D]">
      <MobileMenu isOpen={open} onClose={() => setOpen(false)} />
      <Header onToggleMobileMenu={() => setOpen(!open)} isMobileMenuOpen={open} />
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
