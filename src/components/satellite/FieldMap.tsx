'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Pt = [number, number]; // [lon, lat]
interface Props {
  center?: Pt | null;
  draft?: Pt[];                    // points being drawn
  onAdd?: (p: Pt) => void;         // set => draw mode
  ring?: Pt[];                     // saved field outline
  overlayUrl?: string | null;      // NDVI colour image
  className?: string;
}
const ll = (p: Pt): L.LatLngTuple => [p[1], p[0]];

// Free satellite photo basemap (Esri) + our own drawing / NDVI overlay. No API key.
export default function FieldMap({ center, draft, onAdd, ring, overlayUrl, className }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const addRef = useRef(onAdd); addRef.current = onAdd;

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { zoomControl: true, attributionControl: true }).setView([22.5, 79], 5);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Imagery © Esri' }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    m.on('click', (e) => addRef.current?.([e.latlng.lng, e.latlng.lat]));
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  useEffect(() => { if (center && map.current && !ring?.length) map.current.setView(ll(center), 16); }, [center, ring]);

  useEffect(() => {
    const m = map.current, g = layer.current; if (!m || !g) return;
    g.clearLayers();
    const pts = ring?.length ? ring : draft ?? [];
    if (pts.length >= 2) L.polygon(pts.map(ll), { color: '#FFD54A', weight: 3, fillOpacity: ring?.length && overlayUrl ? 0 : 0.15 }).addTo(g);
    if (!ring?.length) pts.forEach((p) => L.circleMarker(ll(p), { radius: 6, color: '#fff', weight: 2, fillColor: '#14532D', fillOpacity: 1 }).addTo(g));
    if (ring?.length) {
      const b = L.latLngBounds(ring.map(ll));
      if (overlayUrl) L.imageOverlay(overlayUrl, b, { opacity: 1 }).addTo(g);
      m.fitBounds(b, { padding: [30, 30], maxZoom: 18 });
    }
  }, [draft, ring, overlayUrl]);

  return <div ref={el} className={className ?? 'h-80 w-full rounded-2xl overflow-hidden border border-[#E2E8DF]'} style={{ cursor: onAdd ? 'crosshair' : undefined }} />;
}
