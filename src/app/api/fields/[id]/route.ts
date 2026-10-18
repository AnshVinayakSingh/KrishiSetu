import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { deleteField } from '@/lib/fieldStore';

export async function DELETE(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  await deleteField(user.id, (await params).id);
  return NextResponse.json({ ok: true });
}
