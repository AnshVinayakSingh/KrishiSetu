import { MongoClient, type Db } from 'mongodb';

// MongoDB Atlas connection (one shared client).
// Data goes ONLY into the "krishisetu" database (override: MONGODB_DB), so other projects
// in the same Atlas cluster are never touched or mixed.
const g = globalThis as unknown as { __ksdb?: Promise<Db> };

async function ensureIndexes(d: Db) {
  await d.collection('users').dropIndex('phone_1').catch(() => {}); // old phone-based unique index (login is by email now)
  await Promise.all([
    d.collection('users').createIndex({ email: 1 }, { unique: true }),
    d.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }), // auto-delete expired
    d.collection('conversations').createIndex({ userId: 1, updatedAt: -1 }),
    d.collection('messages').createIndex({ conversationId: 1, createdAt: 1 }),
    d.collection('applications').createIndex({ userId: 1, schemeId: 1 }, { unique: true }),
  ]);
}

export function db(): Promise<Db> {
  if (!g.__ksdb) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');
    g.__ksdb = new MongoClient(uri).connect().then(async (c) => {
      const d = c.db(process.env.MONGODB_DB ?? 'krishisetu');
      await ensureIndexes(d);
      return d;
    });
    g.__ksdb.catch(() => { g.__ksdb = undefined; }); // retry on next request if connect failed
  }
  return g.__ksdb;
}
