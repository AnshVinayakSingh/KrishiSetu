import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createConversation, listConversations, type ChatMode } from '@/lib/chatStore';

const asMode = (v: unknown): ChatMode | undefined => (v === 'voice' ? 'voice' : v === 'chat' ? 'chat' : undefined);

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const mode = asMode(req.nextUrl.searchParams.get('mode'));
  return NextResponse.json({ conversations: await listConversations(user.id, mode) });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  return NextResponse.json({ id: await createConversation(user.id, String(b.title ?? 'New chat'), asMode(b.mode) ?? 'chat') });
}
