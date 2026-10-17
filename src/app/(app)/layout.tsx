'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Sends visitors who are not logged in back to /login.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('krishisetu_user')) setOk(true);
    else router.replace('/login');
  }, [router]);
  return ok ? <>{children}</> : null;
}
