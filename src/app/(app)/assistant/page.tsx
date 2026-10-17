'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import Footer from '@/components/layout/Footer';
import AssistantAvatar, { AssistantState } from '@/components/assistant/Avatar';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export default function AssistantPage() {
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initial welcome message based on language
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: language === 'hi'
        ? 'नमस्ते किसान भाई! मैं कृषिसेतु का AI सहायक हूँ। आप अपनी फसल के रोग, खाद की मात्रा, सिंचाई समय या सरकारी योजनाओं के बारे में बोलकर या लिखकर पूछ सकते हैं।'
        : 'Welcome! I am your KrishiSetu AI Assistant. Feel free to ask questions about crop diseases, fertilizer dosing, irrigation scheduling, or government subsidies using voice or text.',
      timestamp: 'Just now',
      suggestedActions: [
        language === 'hi' ? 'गेहूँ की पत्तियां पीली हो रही हैं' : 'Wheat leaves turning yellow',
        language === 'hi' ? 'ड्रिप सिंचाई के लाभ व सब्सिडी' : 'Drip irrigation benefits & subsidy',
        language === 'hi' ? 'पीएम-किसान e-KYC की जानकारी' : 'PM-KISAN e-KYC requirements'
      ]
    }
  ]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, assistantState]);

  // Clean up audio speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Speech API: Speech-to-Text
  const handleToggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addToast(
        'error',
        'Speech Recognition Unavailable',
        'Your browser does not support Web Speech API. Please type your question.'
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      setAssistantState('idle');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setAssistantState('listening');
        addToast('info', language === 'hi' ? 'माइक सक्रिय' : 'Microphone Active', language === 'hi' ? 'बोलना शुरू करें...' : 'Speak now...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        setAssistantState('idle');
        handleSendMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setAssistantState('idle');
        addToast(
          'error',
          'Voice Input Error',
          event.error === 'not-allowed'
            ? 'Microphone permission denied. Please allow microphone access in browser.'
            : 'Could not catch voice. Please try speaking clearly or type below.'
        );
      };

      recognition.onend = () => {
        setIsListening(false);
        if (assistantState === 'listening') setAssistantState('idle');
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setAssistantState('idle');
      addToast('error', 'Voice Input Failed', 'Please use text input.');
    }
  };

  // Text-to-Speech via Web Speech API
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown bold or bullet asterisks before speaking
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // slightly slower for clear agronomic instructions

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAssistantState('speaking');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setAssistantState('idle');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setAssistantState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setAssistantState('idle');
    }
  };

  // Send Query to /api/assistant
  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setAssistantState('thinking');

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          language: language
        })
      });

      const data = await res.json();

      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: data.suggestedActions
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setAssistantState('speaking');
        speakText(data.response);
      } else {
        throw new Error('API returned failure');
      }
    } catch (err) {
      setAssistantState('idle');
      addToast('error', 'Assistant Connection Issue', 'Displaying offline agricultural guidance.');

      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: language === 'hi'
          ? 'नेटवर्क की समस्या के कारण तात्कालिक उत्तर नहीं मिल पाया। कृपया पुनः प्रयास करें अथवा किसान कॉल सेंटर टोल-फ्री 1800-180-1551 पर संपर्क करें।'
          : 'Could not connect to the agronomy server. Please retry or contact Kisan Call Centre toll-free at 1800-180-1551.',
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  // "Know more" from a policy banner lands here as /assistant?q=<question>: ask it once automatically.
  const autoAsked = useRef(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (!q || autoAsked.current) return;
    autoAsked.current = true;
    window.history.replaceState(null, '', '/assistant');
    handleSendMessage(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: language === 'hi' ? 'बातचीत का इतिहास साफ़ कर दिया गया है। नया सवाल पूछें।' : 'Conversation history cleared. Ask a new question.',
        timestamp: 'Just now'
      }
    ]);
    addToast('info', language === 'hi' ? 'इतिहास साफ़' : 'Chat Cleared');
  };

  const sampleQuestions = [
    {
      en: 'My wheat crop leaves are turning yellow. What are the causes?',
      hi: 'मेरी गेहूँ की फसल की पत्तियाँ पीली हो रही हैं। क्या कारण हो सकते हैं?'
    },
    {
      en: 'Explain drip irrigation and its government subsidy.',
      hi: 'ड्रिप सिंचाई के लाभ और सरकारी सब्सिडी के बारे में बताएं।'
    },
    {
      en: 'How should I prepare my field before heavy rainfall?',
      hi: 'भारी बारिश की चेतावनी से पहले खेत में क्या सावधानी बरतें?'
    },
    {
      en: 'What are the eligibility criteria for PM-KISAN ₹6,000?',
      hi: 'पीएम-किसान ₹6,000 पाने के लिए क्या पात्रता शर्तें हैं?'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F0] text-[#17251D]">
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMobileMenuOpen={isMobileMenuOpen} />
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-4.5rem)]">
          {/* Top Title & Avatar Status Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF] shrink-0">
            <div className="flex items-center gap-4">
              <AssistantAvatar state={assistantState} size="sm" />
              <div>
                <h1 className="text-xl font-black text-[#14532D] flex items-center gap-2">
                  <span>{t('assistantTitle')}</span>
                  <span className="text-[10px] bg-[#86B96B]/20 text-[#14532D] font-bold px-2 py-0.5 rounded-full">
                    Voice + AI
                  </span>
                </h1>
                <p className="text-xs text-[#66746A]">
                  {language === 'hi' 
                    ? 'हिंदी व अंग्रेजी में वॉइस और टेक्स्ट के जरिए सटीक कृषि समाधान'
                    : 'Voice-first decision support & agronomy guidance in Hindi & English'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-all"
                >
                  <VolumeX className="w-4 h-4 text-rose-600" />
                  <span>{t('stopSpeaking')}</span>
                </button>
              )}

              <button
                onClick={handleClearChat}
                className="p-2 rounded-xl border border-[#E2E8DF] bg-white text-[#66746A] hover:text-[#14532D] hover:bg-[#F8F7F0] transition-colors"
                title={t('clearChat')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Log Area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                    msg.sender === 'user' ? 'bg-[#14532D]' : 'bg-[#228B52]'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#14532D] text-white rounded-tr-none'
                      : 'bg-white border border-[#E2E8DF] text-[#17251D] rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal">{msg.text}</div>
                  
                  <div className={`mt-2 flex items-center justify-between text-[10px] ${
                    msg.sender === 'user' ? 'text-white/60' : 'text-[#66746A]'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-[#14532D] flex items-center gap-1 font-semibold ml-2"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#228B52]" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>

                  {/* Suggested Quick Follow-ups */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E2E8DF] flex flex-wrap gap-2">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(action)}
                          className="px-2.5 py-1 rounded-lg bg-[#F8F7F0] hover:bg-[#86B96B]/20 text-[11px] font-bold text-[#14532D] border border-[#E2E8DF] transition-all"
                        >
                          → {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Thinking / Processing indicator */}
            {assistantState === 'thinking' && (
              <div className="flex gap-3 max-w-md mr-auto">
                <div className="w-8 h-8 rounded-full bg-[#228B52] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E2E8DF] text-xs text-[#66746A] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#228B52] animate-ping" />
                  <span>
                    {language === 'hi' 
                      ? 'कृषि ज्ञानकोष से समाधान खोज रहे हैं...' 
                      : 'Consulting agronomy knowledge base...'
                    }
                  </span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Starters (Chips) */}
          <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-[#66746A] whitespace-nowrap">
              {t('suggestedQueries')}
            </span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(language === 'hi' ? q.hi : q.en)}
                className="px-3 py-1 rounded-full bg-white hover:bg-[#F8F7F0] border border-[#E2E8DF] text-[11px] text-[#14532D] font-medium whitespace-nowrap shadow-2xs hover:border-[#14532D]/40 transition-all"
              >
                {language === 'hi' ? q.hi : q.en}
              </button>
            ))}
          </div>

          {/* Input Controls Bar */}
          <div className="pt-2 border-t border-[#E2E8DF] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Button with Pulse */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-3 rounded-2xl transition-all duration-300 shadow-xs flex items-center justify-center ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                    : 'bg-white border border-[#E2E8DF] text-[#14532D] hover:bg-[#F8F7F0]'
                }`}
                title={t('micPrompt')}
              >
                {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-[#228B52]" />}
              </button>

              {/* Text Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={
                    isListening
                      ? (language === 'hi' ? 'सुन रहे हैं, बोलिए...' : 'Listening, please speak...')
                      : t('inputPlaceholder')
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E2E8DF] text-xs sm:text-sm text-[#17251D] placeholder:text-[#66746A]/60 focus:outline-none focus:border-[#14532D] focus:ring-1 focus:ring-[#14532D] shadow-2xs"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputQuery.trim() || assistantState === 'thinking'}
                className="p-3 rounded-2xl bg-[#14532D] text-white hover:bg-[#123B2A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs"
                title={t('send')}
              >
                <Send className="w-5 h-5 text-[#86B96B]" />
              </button>
            </form>
            <div className="pt-1.5 flex items-center justify-between text-[10px] text-[#66746A]">
              <span>{language === 'hi' ? 'वेब स्पीच API और सत्यापित कृषि ज्ञान द्वारा संचालित।' : 'Powered by Web Speech API & verified agronomy guidelines.'}</span>
              <span>{language === 'hi' ? 'टोल फ्री: 1800-180-1551' : 'Helpline: 1800-180-1551'}</span>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
