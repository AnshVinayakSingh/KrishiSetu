import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from './db';

const COOKIE = 'ks_session';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface PublicUser { id: string; name: string; email: string; role: string; state: string; district: string }
export interface UserDoc { _id: string; name: string; email: string; pwHash: string; role: string; state: string; district: string; createdAt: Date }
interface SessionDoc { _id: string; userId: string; expiresAt: Date }

export const toPublic = (u: UserDoc): PublicUser => ({ id: u._id, name: u.name, email: u.email, role: u.role, state: u.state, district: u.district });

export function hashPassword(pw: string) {
  const salt = randomBytes(16);
  return `${salt.toString('hex')}:${scryptSync(pw, salt, 64).toString('hex')}`;
}

export function verifyPassword(pw: string, stored: string) {
  const [saltHex, keyHex] = stored.split(':');
  return timingSafeEqual(scryptSync(pw, Buffer.from(saltHex, 'hex'), 64), Buffer.from(keyHex, 'hex'));
}

const sha = (s: string) => createHash('sha256').update(s).digest('hex');

// Returns null if the email is already registered.
export async function createUser(v: { name: string; email: string; pw: string; role: string }): Promise<PublicUser | null> {
  const doc: UserDoc = { _id: randomUUID(), name: v.name, email: v.email, pwHash: hashPassword(v.pw), role: v.role, state: '', district: '', createdAt: new Date() };
  try {
    await (await db()).collection<UserDoc>('users').insertOne(doc);
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return null;
    throw e;
  }
  return toPublic(doc);
}

export async function startSession(userId: string) {
  const token = randomBytes(32).toString('base64url');
  await (await db()).collection<SessionDoc>('sessions').insertOne({ _id: sha(token), userId, expiresAt: new Date(Date.now() + TTL_MS) });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: TTL_MS / 1000,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await (await db()).collection<SessionDoc>('sessions').deleteOne({ _id: sha(token) });
  jar.delete(COOKIE);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const d = await db();
  const s = await d.collection<SessionDoc>('sessions').findOne({ _id: sha(token), expiresAt: { $gt: new Date() } });
  if (!s) return null;
  const u = await d.collection<UserDoc>('users').findOne({ _id: s.userId });
  return u ? toPublic(u) : null;
}
