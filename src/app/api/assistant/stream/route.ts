import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { addMessage, createConversation, getMessages, ownsConversation } from '@/lib/chatStore';
import { geminiConfigured, streamGemini, type GeminiTurn } from '@/lib/gemini';
import { tooMany } from '@/lib/rateLimit';

// Chat answers stream word by word (newline-separated JSON): {t:"text"} ... {done:true, conversationId}
export async function POST(req: NextRequest) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (!geminiConfigured()) return NextResponse.json({ error: 'gemini_not_configured' }, { status: 503 });
  if (tooMany(`ai:${user.id}`, 25)) return NextResponse.json({ error: 'slow_down' }, { status: 429 });

  const b = await req.json().catch(() => ({}));
  const query = String(b.query ?? '').trim().slice(0, 1500);
  if (!query) return NextResponse.json({ error: 'empty' }, { status: 400 });

  let conversationId: string | undefined;
  let history: GeminiTurn[] = [];
  if (b.conversationId) {
    try {
      if (await ownsConversation(user.id, String(b.conversationId))) {
        conversationId = String(b.conversationId);
        history = (await getMessages(conversationId)).map((m) => ({ role: m.role, content: m.content }));
      }
    } catch { /* continue without history */ }
  }

  const enc = new TextEncoder();
  const out = new ReadableStream({
    async start(ctrl) {
      const send = (o: object) => ctrl.enqueue(enc.encode(JSON.stringify(o) + '\n'));
      let full = '';
      try {
        for await (const piece of streamGemini({ query, history, context: b.context })) { full += piece; send({ t: piece }); }
        if (!full.trim()) throw new Error('empty answer');
        try {
          if (!conversationId) conversationId = await createConversation(user.id, query.slice(0, 60), 'chat');
          await addMessage(conversationId, 'user', query, 'chat');
          await addMessage(conversationId, 'assistant', full.trim(), 'chat');
        } catch (e) { console.error('chat save failed:', e instanceof Error ? e.message : e); }
        send({ done: true, conversationId });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'failed';
        console.error('stream failed:', msg);
        send({ error: msg.slice(0, 200) });
      } finally { ctrl.close(); }
    },
  });
  return new Response(out, { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store' } });
}
