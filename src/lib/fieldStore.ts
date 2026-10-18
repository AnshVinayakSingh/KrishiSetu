import { randomUUID } from 'node:crypto';
import { db } from './db';
import type { Ring } from './satellite';

export interface FieldDoc { _id: string; userId: string; name: string; crop: string; sowingDate: string; ring: Ring; areaAcre: number; createdAt: Date }

const col = async () => (await db()).collection<FieldDoc>('fields');
const pub = (f: FieldDoc) => ({ id: f._id, name: f.name, crop: f.crop, sowingDate: f.sowingDate, ring: f.ring, areaAcre: f.areaAcre });

export const listFields = async (userId: string) => (await (await col()).find({ userId }).sort({ createdAt: -1 }).limit(20).toArray()).map(pub);
export const getField = async (userId: string, id: string) => (await col()).findOne({ _id: id, userId });
export const deleteField = async (userId: string, id: string) => { await (await col()).deleteOne({ _id: id, userId }); };
export async function createField(userId: string, f: { name: string; crop: string; sowingDate: string; ring: Ring; areaAcre: number }) {
  const doc: FieldDoc = { _id: randomUUID(), userId, ...f, createdAt: new Date() };
  await (await col()).insertOne(doc);
  return pub(doc);
}

// Area in acres from lon/lat ring (flat-earth approximation is fine for farm sizes).
export function ringAreaAcre(ring: Ring) {
  const lat0 = ring.reduce((a, p) => a + p[1], 0) / ring.length;
  const kx = 111_320 * Math.cos((lat0 * Math.PI) / 180), ky = 110_540;
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * kx * ring[i + 1][1] * ky - ring[i + 1][0] * kx * ring[i][1] * ky;
  return Math.abs(a / 2) / 4046.86;
}
