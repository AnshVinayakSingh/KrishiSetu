import { randomUUID } from 'node:crypto';
import { db } from './db';

interface ConvDoc { _id: string; userId: string; title: string; createdAt: Date; updatedAt: Date }
interface MsgDoc { conversationId: string; role: 'user' | 'assistant'; content: string; lang: string; createdAt: Date }

export async function createConversation(userId: string, title = 'New chat') {
  const _id = randomUUID();
  const now = new Date();
  await (await db()).collection<ConvDoc>('conversations').insertOne({ _id, userId, title: title.slice(0, 80), createdAt: now, updatedAt: now });
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

export async function listConversations(userId: string) {
  const rows = await (await db()).collection<ConvDoc>('conversations').find({ userId }).sort({ updatedAt: -1 }).limit(50).toArray();
  return rows.map((c) => ({ id: c._id, title: c.title, updatedAt: c.updatedAt }));
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
