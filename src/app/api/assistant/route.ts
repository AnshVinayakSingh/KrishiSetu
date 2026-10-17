import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, type PublicUser } from '@/lib/auth';
import { addMessage, createConversation, getMessages, ownsConversation, type ChatMode } from '@/lib/chatStore';
import { askGemini, geminiConfigured, geminiModelName, plain, type GeminiTurn } from '@/lib/gemini';
import { localAdvice } from '@/lib/localAdvice';
import { langLabel } from '@/lib/voiceLangs';
import { sarvamConfigured } from '@/lib/sarvam';
import { tooMany } from '@/lib/rateLimit';

interface AssistantRequestBody {
  query: string;
  language?: 'hi' | 'en';
  langCode?: string;          // e.g. "ta-IN" (voice talks in other Indian languages)
  mode?: ChatMode;            // "chat" (default) or "voice"; each keeps its own last-5 backup
  persist?: boolean;          // save this exchange to the logged-in user's history
  conversationId?: string;
  context?: { crop?: string; location?: string };
}

export async function POST(req: NextRequest) {
  try {
    const body: AssistantRequestBody = await req.json();
    const query = String(body.query ?? '').trim().slice(0, 1500);
    if (!query) return NextResponse.json({ success: false, error: 'Empty question' }, { status: 400 });
    const lang = body.language === 'hi' ? 'hi' : 'en';
    const mode: ChatMode = body.mode === 'voice' ? 'voice' : 'chat';

    let user: PublicUser | null = null;
    try { user = await getCurrentUser(); } catch { /* database unreachable: still answer from the fallback */ }

    // Reuse an existing conversation only if it belongs to this user.
    let conversationId: string | undefined;
    let history: GeminiTurn[] = [];
    if (user && body.conversationId) {
      try {
        if (await ownsConversation(user.id, body.conversationId)) {
          conversationId = body.conversationId;
          history = (await getMessages(conversationId)).map((m) => ({ role: m.role, content: m.content }));
        }
      } catch { /* ignore */ }
    }

    let answer = '';
    let engine: 'gemini' | 'verified-knowledge-base' = 'verified-knowledge-base';
    let suggestedActions: string[] = [];
    let answerEn = '';
    let answerHi = '';
    let aiNote = '';

    if (!user) aiNote = 'Not logged in';
    else if (!geminiConfigured()) aiNote = 'GEMINI_API_KEY is missing (add it to .env.local and restart the server)';
    else if (tooMany(`ai:${user.id}`, 20)) aiNote = 'Too many questions, wait a minute';
    else {
      try {
        answer = plain(await askGemini({
          query, history, voice: mode === 'voice', context: body.context,
          languageName: body.langCode ? langLabel(body.langCode) : undefined,
        }));
        engine = 'gemini';
      } catch (e) {
        aiNote = (e instanceof Error ? e.message : 'Gemini failed').slice(0, 220);
        console.error('gemini failed:', aiNote);
      }
    }
    if (!answer) {
      const local = localAdvice(query, lang);
      answerEn = local.answerEn; answerHi = local.answerHi; suggestedActions = local.suggestedActions;
      answer = lang === 'hi' ? answerHi : answerEn;
      if (!aiNote) aiNote = 'AI unavailable';
    } else {
      answerEn = answerHi = answer;
    }

    if (body.persist && user) {
      try {
        if (!conversationId) conversationId = await createConversation(user.id, query.slice(0, 60), mode);
        await addMessage(conversationId, 'user', query, body.langCode ?? lang);
        await addMessage(conversationId, 'assistant', answer, body.langCode ?? lang);
      } catch (e) {
        console.error('chat save failed:', e instanceof Error ? e.message : e);
        conversationId = undefined; // the answer still reaches the farmer
      }
    }

    return NextResponse.json({
      success: true,
      conversationId,
      mode: engine,
      aiNote: engine === 'gemini' ? '' : aiNote,
      query,
      response: answer,
      responseEn: answerEn,
      responseHi: answerHi,
      suggestedActions,
      timestamp: new Date().toISOString(),
      disclaimer: lang === 'hi'
        ? 'कृषिसेतु AI सलाहकार प्रारंभिक मार्गदर्शन प्रदान करता है। महत्वपूर्ण रसायनों के उपयोग से पूर्व लेबल निर्देश व कृषि विशेषज्ञ की सलाह अवश्य लें।'
        : 'KrishiSetu AI Assistant provides guidance based on verified agronomic practices. Verify dosage with certified agronomists.',
    });
  } catch (error) {
    console.error('assistant failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: 'Failed to process inquiry' }, { status: 500 });
  }
}

// Open /api/assistant in the browser (while logged in) to check which keys the server can see. Shows yes/no only, never the keys.
export async function GET() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  return NextResponse.json({ geminiKeySet: geminiConfigured(), geminiModel: geminiModelName(), sarvamKeySet: sarvamConfigured() });
}
