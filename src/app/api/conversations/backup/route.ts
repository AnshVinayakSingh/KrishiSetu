import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { backupFor, KEEP } from '@/lib/chatStore';

// Downloads the saved backup (last 5 chats + last 5 voice talks, as text) as a JSON file.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const data = await backupFor(user.id);
  const body = JSON.stringify({ app: 'KrishiSetu', exportedAt: new Date().toISOString(), keepsLast: KEEP, ...data }, null, 2);
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="krishisetu-chat-backup.json"',
      'Cache-Control': 'no-store',
    },
  });
}
