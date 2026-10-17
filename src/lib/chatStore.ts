import { randomUUID } from 'node:crypto';
import { db } from './db';

export type ChatMode = 'chat' | 'voice';
// Only the newest KEEP chats and the newest KEEP voice talks are backed up per user; older ones are removed automatically.
export const KEEP = 30;

interface ConvDoc { _id: string; userId: string; title: string; mode?: ChatMode; createdAt: Date; updatedAt: Date }
interface MsgDoc { conversationId: string; role: 'user' | 'assistant'; content: string; lang: string; createdAt: Date }

// Old conversations have no "mode" field, so they count as normal chats.
const modeFilter = (mode: ChatMode) => (mode === 'voice' ? { mode: 'voice' as const } : { mode: { $ne: 'voice' as const } });

async function prune(userId: string, mode: ChatMode) {
  const d = await db();
  const old = await d.collection<ConvDoc>('conversations')
    .find({ userId, ...modeFilter(mode) }, { projection: { _id: 1 } })
    .sort({ updatedAt: -1 }).skip(KEEP).toArray();
  if (!old.length) return;
  const ids = old.map((c) => c._id);
  await d.collection<ConvDoc>('conversations').deleteMany({ _id: { $in: ids } });
  await d.collection<MsgDoc>('messages').deleteMany({ conversationId: { $in: ids } });
}

export async function createConversation(userId: string, title = 'New chat', mode: ChatMode = 'chat') {
  const _id = randomUUID();
  const now = new Date();
  await (await db()).collection<ConvDoc>('conversations').insertOne({ _id, userId, title: title.slice(0, 80), mode, createdAt: now, updatedAt: now });
  await prune(userId, mode).catch(() => {}); // backup cleanup must never break a chat
  return _id;
}

export async function ownsConversation(userId: string, convId: string) {
  return (await (await db()).collection<ConvDoc>('conversations').countDocuments({ _id: convId, userId }, { limit: 1 })) > 0;
}

export async function addMessage(convId: string, role: 'user' | 'assistant', content: string, lang: string) {
  const d = await db();
  const now = new Date();
  await d.collection<MsgDoc>('messages').insertOne({ conversationId: convId, role, content, lang, createdAt: now });
  await d.collection<ConvDoc>('conversations').updateOne({ _id: convId }, { $set: { updatedAt: now } });
}

export async function listConversations(userId: string, mode?: ChatMode) {
  const rows = await (await db()).collection<ConvDoc>('conversations')
    .find(mode ? { userId, ...modeFilter(mode) } : { userId }).sort({ updatedAt: -1 }).limit(mode ? KEEP : 50).toArray();
  return rows.map((c) => ({ id: c._id, title: c.title, mode: (c.mode ?? 'chat') as ChatMode, updatedAt: c.updatedAt }));
}

export async function getMessages(convId: string) {
  return (await db()).collection<MsgDoc>('messages')
    .find({ conversationId: convId }, { projection: { _id: 0, conversationId: 0 } }).sort({ createdAt: 1 }).toArray();
}

export async function deleteConversation(convId: string) {
  const d = await db();
  await d.collection<ConvDoc>('conversations').deleteOne({ _id: convId });
  await d.collection<MsgDoc>('messages').deleteMany({ conversationId: convId });
}

// Everything that is currently backed up (recent chats and voice talks) with all messages.
export async function backupFor(userId: string) {
  const out: Record<ChatMode, { id: string; title: string; updatedAt: Date; messages: { role: string; content: string; lang: string; createdAt: Date }[] }[]> = { chat: [], voice: [] };
  for (const mode of ['chat', 'voice'] as ChatMode[]) {
    for (const c of await listConversations(userId, mode)) {
      out[mode].push({ id: c.id, title: c.title, updatedAt: c.updatedAt, messages: await getMessages(c.id) });
    }
  }
  return out;
}
