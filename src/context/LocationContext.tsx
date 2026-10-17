'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type LocStatus = 'asking' | 'granted' | 'denied' | 'unsupported';
interface Place { city: string; district: string; state: string }
interface LocationCtx {
  status: LocStatus;
  coords: { lat: number; lon: number } | null;
  place: Place | null;
  request: () => void;
}

const Ctx = createContext<LocationCtx>({ status: 'asking', coords: null, place: null, request: () => {} });
export const useLocation = () => useContext(Ctx);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<LocStatus>('asking');
  const [coords, setCoords] = useState<LocationCtx['coords']>(null);
  const [place, setPlace] = useState<Place | null>(null);

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) { setStatus('unsupported'); return; }
    setStatus('asking');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(c);
        setStatus('granted');
        fetch(`/api/location?lat=${c.lat}&lon=${c.lon}`)
          .then((r) => r.json())
          .then(setPlace)
          .catch(() => {});
      },
      () => setStatus('denied'),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 }
    );
  }, []);

  useEffect(() => { request(); }, [request]);

  return <Ctx.Provider value={{ status, coords, place, request }}>{children}</Ctx.Provider>;
}
