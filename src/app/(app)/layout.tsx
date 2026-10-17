'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationProvider } from '@/context/LocationContext';
import LocationGate from '@/components/common/LocationGate';

// Login check first, then location permission gate. Nothing renders until both pass.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('krishisetu_user')) setOk(true);
    else router.replace('/login');
  }, [router]);
  if (!ok) return null;
  return (
    <LocationProvider>
      <LocationGate>{children}</LocationGate>
    </LocationProvider>
  );
}
