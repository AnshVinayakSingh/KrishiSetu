import { NextRequest, NextResponse } from 'next/server';
import { MANDI_PRICES } from '@/data/mockData';
import type { MandiApiResponse, MandiRow } from '@/types';

// Agmarknet daily mandi prices via data.gov.in. Needs DATA_GOV_API_KEY in .env.local (free signup).
const RESOURCE = '9ef84268-d588-465a-a308-a864a43d0070';

const demo = (): MandiApiResponse => ({
  source: 'demo',
  updatedAt: new Date().toISOString(),
  rows: MANDI_PRICES.map((m) => ({
    id: m.id, crop: m.crop, cropHi: m.cropHi, variety: m.variety, mandi: m.mandi,
    state: m.state, modal: m.pricePerQuintal, change: m.change, date: m.date,
  })),
});

async function fetchRows(key: string, state: string): Promise<MandiRow[]> {
  const q = new URLSearchParams({ 'api-key': key, format: 'json', limit: '100' });
  if (state) q.set('filters[state]', state);
  const res = await fetch(`https://api.data.gov.in/resource/${RESOURCE}?${q}`, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`data.gov.in ${res.status}`);
  const j = await res.json();
  const seen = new Set<string>();
  const rows: MandiRow[] = [];
  for (const r of j.records ?? []) {
    const modal = Number(r.modal_price);
    if (!modal || seen.has(r.commodity)) continue; // one row per commodity
    seen.add(r.commodity);
    rows.push({
      id: `${r.market}-${r.commodity}`, crop: r.commodity, variety: r.variety, mandi: r.market,
      state: r.state, modal, min: Number(r.min_price) || undefined, max: Number(r.max_price) || undefined,
      date: r.arrival_date,
    });
  }
  return rows.slice(0, 12);
}

// GET /api/mandi?state=Uttar Pradesh
export async function GET(req: NextRequest) {
  const key = process.env.DATA_GOV_API_KEY;
  if (!key || process.env.MANDI_MODE === 'demo') return NextResponse.json(demo());
  const state = req.nextUrl.searchParams.get('state') ?? '';
  try {
    let rows = await fetchRows(key, state);
    if (!rows.length && state) rows = await fetchRows(key, ''); // nothing for that state -> national
    if (!rows.length) return NextResponse.json(demo());
    return NextResponse.json({ source: 'live', rows, updatedAt: new Date().toISOString() } satisfies MandiApiResponse);
  } catch {
    return NextResponse.json(demo());
  }
}
