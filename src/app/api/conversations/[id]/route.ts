import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { deleteConversation, getMessages, ownsConversation } from '@/lib/chatStore';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser();
  const { id } = await params;
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!(await ownsConversation(user.id, id))) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ messages: await getMessages(id) });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser();
  const { id } = await params;
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!(await ownsConversation(user.id, id))) return NextResponse.json({ error: 'not found' }, { status: 404 });
  await deleteConversation(id);
  return NextResponse.json({ ok: true });
}
