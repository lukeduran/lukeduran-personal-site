'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getSiteContent } from '@/lib/content';
import Image from 'next/image';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type ChatStatus = 'idle' | 'loading' | 'streaming';

const content = getSiteContent();
const { name } = content.professional.hero;
const chatIntro = content.chat?.intro;

const STARTERS = [
  'Walk me through your experience.',
  'Tell me about a product you have shipped.',
  'How do you approach prioritization?',
  'What makes you different as a PM?',
  'What do you enjoy building?',
  'How do you work with engineering teams?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  useEffect(() => {
    if (!showSuggestions) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current?.contains(e.target as Node) ||
        sparkleRef.current?.contains(e.target as Node)
      ) return;
      setShowSuggestions(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  async function send(text: string) {
    if (!text.trim() || status !== 'idle') return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    const next = [...messages, userMessage];

    setMessages([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setStatus('loading');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let partial = '';

      setStatus('streaming');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        partial += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: partial };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, something went wrong on my end. Try again or reach out to Luke directly.',
        };
        return updated;
      });
    } finally {
      setStatus('idle');
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const isStreaming = status === 'streaming';
  const showStarters = messages.length === 0;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">

      {/* A — Subtle ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-1 absolute left-[-5%] top-[10%] h-[500px] w-[500px] rounded-full bg-accent/25 blur-3xl" />
        <div className="animate-float-2 absolute bottom-[5%] right-[-5%] h-[420px] w-[420px] rounded-full bg-accent/18 blur-3xl" />
      </div>

      {/* B — Header with teal gradient wash */}
      <header className="relative flex-none border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/8 via-accent/3 to-transparent" />
        <div className="relative mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-foreground/50 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-sm font-semibold text-foreground">{name}</span>
          <div className="w-16" />
        </div>
      </header>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center px-4 py-8 sm:px-6">
          <AnimatePresence mode="wait">
            {showStarters ? (
              <motion.div
                key="starters"
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 h-28 w-28 overflow-hidden rounded-full border-2 border-accent/30 shadow-md">
                    <Image
                      src="/images/headshot.png"
                      alt={name}
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {chatIntro && (
                    <p className="mb-10 max-w-md text-base text-foreground/60">
                      {chatIntro}
                    </p>
                  )}
                  <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-lg border border-accent/15 bg-background/80 px-4 py-3 text-left text-sm text-foreground/70 backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-accent/5 hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {messages.map((msg, idx) => {
                  const isLastAssistant = idx === messages.length - 1 && msg.role === 'assistant';

                  if (msg.role === 'user') {
                    return (
                      <div key={idx} className="flex justify-end">
                        <div className="max-w-[75%] rounded-2xl bg-accent px-4 py-2.5 text-sm leading-relaxed text-white">
                          {msg.content}
                        </div>
                      </div>
                    );
                  }

                  if (!msg.content && status === 'loading') return null;

                  return (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-accent/60">
                        {name}
                      </span>
                      <div className="rounded-2xl bg-accent/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground/80">
                        <p className="whitespace-pre-wrap">
                          {msg.content}
                          {isLastAssistant && isStreaming && (
                            <span className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-[1px] animate-pulse bg-foreground/40" />
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {status === 'loading' && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/25">
                      {name}
                    </span>
                    <span className="flex items-center gap-1 pt-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:300ms]" />
                    </span>
                  </div>
                )}

                <div ref={bottomRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input */}
      <div className="relative flex-none border-t border-border bg-background/90 px-4 py-4 backdrop-blur-sm sm:px-6">
        {/* Suggestions popover */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute bottom-full left-4 right-4 mb-2 sm:left-6 sm:right-6"
            >
              <div ref={suggestionsRef} className="mx-auto max-w-3xl rounded-xl border border-border bg-background p-2 shadow-lg">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { send(s); setShowSuggestions(false); }}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-foreground/70 transition-colors hover:bg-accent/5 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mx-auto flex max-w-3xl items-end gap-3">
          {!showStarters && (
            <button
              ref={sparkleRef}
              onClick={() => setShowSuggestions((v) => !v)}
              disabled={status !== 'idle'}
              aria-label="Show suggested questions"
              className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl border transition-all disabled:opacity-30 ${
                showSuggestions
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-muted/30 text-foreground/40 hover:border-accent/40 hover:text-accent'
              }`}
            >
              <Sparkles className="h-4 w-4" />
            </button>
          )}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            rows={1}
            disabled={status !== 'idle'}
            className="flex-1 resize-none rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none focus:ring-0 disabled:opacity-50"
            style={{ minHeight: '44px', maxHeight: '120px' }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = 'auto';
              t.style.height = t.scrollHeight + 'px';
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || status !== 'idle'}
            aria-label="Send message"
            className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-accent bg-accent text-white transition-opacity disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-foreground/25">
          Answers are grounded in Luke's actual experience. For anything else,{' '}
          <a href={`mailto:${content.person.email}`} className="underline underline-offset-2">
            reach out directly
          </a>
          .
        </p>
      </div>
    </div>
  );
}
