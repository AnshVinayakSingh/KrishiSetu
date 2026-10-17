'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationProvider } from '@/context/LocationContext';
import { UserProvider, type AppUser } from '@/context/UserContext';
import LocationGate from '@/components/common/LocationGate';
import ChatDock from '@/components/assistant/ChatDock';

// 1) session check against the database, 2) location permission gate. Nothing renders until both pass.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setUser(d.user))
      .catch(() => router.replace('/login'));
  }, [router]);
  if (!user) return null;
  return (
    <UserProvider user={user}>
      <LocationProvider>
        <LocationGate>
          {children}
          <ChatDock />
        </LocationGate>
      </LocationProvider>
    </UserProvider>
  );
}
