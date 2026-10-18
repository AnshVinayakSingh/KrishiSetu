// Sentinel-2 via Copernicus Data Space (free). Needs COPERNICUS_CLIENT_ID / COPERNICUS_CLIENT_SECRET.
// Create them free: https://shapps.dataspace.copernicus.eu/dashboard -> User settings -> OAuth clients.
export type Ring = [number, number][]; // [lon, lat], closed

export const satelliteConfigured = () => Boolean(process.env.COPERNICUS_CLIENT_ID && process.env.COPERNICUS_CLIENT_SECRET);

let tok: { v: string; exp: number } | null = null;
async function token() {
  if (tok && tok.exp > Date.now() + 30_000) return tok.v;
  const res = await fetch('https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.COPERNICUS_CLIENT_ID!, client_secret: process.env.COPERNICUS_CLIENT_SECRET! }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Copernicus login failed (${res.status}). Check client id/secret`);
  const j = await res.json();
  tok = { v: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return tok.v;
}

const geom = (ring: Ring) => ({ type: 'Polygon', coordinates: [ring] });
const day = (d: Date) => d.toISOString().slice(0, 10);

const STATS_SCRIPT = `//VERSION=3
function setup(){return{input:[{bands:["B04","B08","B11","SCL","dataMask"]}],output:[{id:"ndvi",bands:1},{id:"ndmi",bands:1},{id:"dataMask",bands:1}]}}
function evaluatePixel(s){
  var bad=[3,8,9,10,11].indexOf(s.SCL)>=0;
  var ok=(s.dataMask==1&&!bad)?1:0;
  return{ndvi:[(s.B08-s.B04)/(s.B08+s.B04+1e-6)],ndmi:[(s.B08-s.B11)/(s.B08+s.B11+1e-6)],dataMask:[ok]};}`;

export interface Point { date: string; ndvi: number; ndmi: number; clear: number }

// NDVI (crop greenness) and NDMI (crop water content) averaged over the field, one value per ~5 days.
export async function satelliteSeries(ring: Ring, days = 120): Promise<Point[]> {
  const to = new Date(), from = new Date(Date.now() - days * 86400_000);
  const res = await fetch('https://sh.dataspace.copernicus.eu/api/v1/statistics', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}` },
    body: JSON.stringify({
      input: { bounds: { geometry: geom(ring), properties: { crs: 'http://www.opengis.net/def/crs/EPSG/0/4326' } }, data: [{ type: 'sentinel-2-l2a', dataFilter: { mosaickingOrder: 'leastCC' } }] },
      aggregation: { timeRange: { from: `${day(from)}T00:00:00Z`, to: `${day(to)}T23:59:59Z` }, aggregationInterval: { of: 'P5D' }, evalscript: STATS_SCRIPT, resx: 0.0001, resy: 0.0001 },
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Sentinel Hub ${res.status}: ${(await res.text()).slice(0, 150)}`);
  const j = await res.json();
  const out: Point[] = [];
  for (const d of j.data ?? []) {
    const n = d.outputs?.ndvi?.bands?.B0?.stats, m = d.outputs?.ndmi?.bands?.B0?.stats;
    if (!n || !m || n.mean === 'NaN' || m.mean === 'NaN' || !Number.isFinite(n.mean)) continue;
    const total = n.sampleCount || 1, clear = (total - (n.noDataCount || 0)) / total;
    if (clear < 0.4) continue; // mostly clouds: ignore
    out.push({ date: String(d.interval.from).slice(0, 10), ndvi: +n.mean.toFixed(3), ndmi: +m.mean.toFixed(3), clear: +clear.toFixed(2) });
  }
  return out;
}

const IMG_SCRIPT = `//VERSION=3
function setup(){return{input:["B04","B08","SCL","dataMask"],output:{bands:4}}}
function evaluatePixel(s){
  var bad=[3,8,9,10,11].indexOf(s.SCL)>=0; if(s.dataMask==0||bad) return[0,0,0,0];
  var v=(s.B08-s.B04)/(s.B08+s.B04+1e-6);
  if(v<0.2) return[0.65,0.0,0.15,0.85]; if(v<0.35) return[0.96,0.43,0.26,0.85];
  if(v<0.5) return[1,0.88,0.55,0.85]; if(v<0.65) return[0.65,0.85,0.42,0.85]; return[0.1,0.6,0.32,0.85];}`;

// Colour map of the field (red = weak crop, green = healthy) from the latest clear scene in 30 days.
export async function ndviImage(ring: Ring): Promise<Buffer> {
  const xs = ring.map((p) => p[0]), ys = ring.map((p) => p[1]);
  const bbox = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  const ratio = (bbox[2] - bbox[0]) / Math.max(bbox[3] - bbox[1], 1e-9);
  const w = ratio >= 1 ? 768 : Math.max(128, Math.round(768 * ratio)), h = ratio >= 1 ? Math.max(128, Math.round(768 / ratio)) : 768;
  const res = await fetch('https://sh.dataspace.copernicus.eu/api/v1/process', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}`, Accept: 'image/png' },
    body: JSON.stringify({
      input: { bounds: { bbox, geometry: geom(ring), properties: { crs: 'http://www.opengis.net/def/crs/EPSG/0/4326' } },
        data: [{ type: 'sentinel-2-l2a', dataFilter: { timeRange: { from: `${day(new Date(Date.now() - 30 * 86400_000))}T00:00:00Z`, to: `${day(new Date())}T23:59:59Z` }, mosaickingOrder: 'leastCC', maxCloudCoverage: 50 } }] },
      output: { width: w, height: h, responses: [{ identifier: 'default', format: { type: 'image/png' } }] },
      evalscript: IMG_SCRIPT,
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Sentinel Hub image ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}
