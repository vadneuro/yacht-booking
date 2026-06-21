'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'closed' | 'menu' | 'chat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const CHANNELS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    sub: 'Ответим за 5 минут',
    color: '#25D366',
    url: 'https://wa.me/79001234567?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%B0%D1%80%D0%B5%D0%BD%D0%B4%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D1%8F%D1%85%D1%82%D1%83',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    sub: 'AI-бот 24/7',
    color: '#26A5E4',
    url: 'https://t.me/glissa_yacht',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
  },
  {
    id: 'vk',
    label: 'ВКонтакте',
    sub: 'Сообщество',
    color: '#0077FF',
    url: 'https://vk.me/glissa_yacht',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>,
  },
  {
    id: 'phone',
    label: 'Позвонить',
    sub: '+7 (900) 123-45-67',
    color: '#10b981',
    url: 'tel:+79001234567',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  },
];

export default function ContactHub() {
  const [view, setView] = useState<View>('closed');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Привет! Я — ИИ-помощник Glissa. Помогу подобрать яхту, рассчитать стоимость и забронировать. Спрашивайте!',
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `web-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (view === 'chat') setTimeout(() => inputRef.current?.focus(), 100);
  }, [view]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Произошла ошибка. Напишите нам в WhatsApp!',
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Не удалось соединиться. Напишите нам в WhatsApp или Telegram!',
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── FAB Button ── */}
      <AnimatePresence>
        {view === 'closed' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('menu')}
            className="fixed bottom-6 right-6 z-50 w-[60px] h-[60px] rounded-full
                       bg-gradient-to-br from-[var(--azure)] to-[var(--teal)]
                       text-white flex items-center justify-center
                       shadow-xl shadow-[var(--azure)]/30 hover:shadow-[var(--azure)]/50 transition-shadow"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Menu Panel ── */}
      <AnimatePresence>
        {view === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[340px] max-w-[calc(100vw-48px)]
                       rounded-3xl overflow-hidden bg-white border border-black/[0.08]
                       shadow-2xl shadow-black/15"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-[var(--azure)] to-[var(--teal)] text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-base">Свяжитесь с нами</p>
                  <p className="text-xs text-white/70 mt-0.5">Выберите удобный способ</p>
                </div>
                <button
                  onClick={() => setView('closed')}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* AI Chat option */}
            <button
              onClick={() => setView('chat')}
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[var(--surface)] transition-colors border-b border-black/[0.04]"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--azure)] to-[var(--teal)] flex items-center justify-center text-white flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="m15 13-3 3-3-3"/>
                </svg>
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-sm text-[var(--navy)]">AI-консьерж</p>
                <p className="text-xs text-[var(--muted)]">Подберёт яхту и оформит бронь мгновенно</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-600 font-medium">online</span>
              </div>
            </button>

            {/* Messenger channels */}
            <div className="p-3 space-y-1">
              {CHANNELS.map((ch, i) => (
                <motion.a
                  key={ch.id}
                  href={ch.url}
                  target={ch.id !== 'phone' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--surface)] transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ background: ch.color }}
                  >
                    {ch.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[var(--navy)]">{ch.label}</p>
                    <p className="text-xs text-[var(--muted)]">{ch.sub}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {view === 'chat' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[560px] max-h-[calc(100svh-120px)]
                       rounded-3xl overflow-hidden flex flex-col
                       bg-white border border-black/[0.08] shadow-2xl shadow-black/15"
          >
            {/* Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-[var(--azure)] to-[var(--teal)] text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView('menu')}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <div>
                  <p className="font-bold text-sm">Glissa AI</p>
                  <p className="text-[11px] text-white/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    Отвечает мгновенно
                  </p>
                </div>
              </div>
              <button
                onClick={() => setView('closed')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[var(--surface)]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[var(--azure)] text-white rounded-br-md'
                      : 'bg-white border border-black/[0.06] text-[var(--navy)] rounded-bl-md shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/50' : 'text-black/25'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-black/[0.06] shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-black/20 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-black/20 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-black/20 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 border-t border-black/[0.04] bg-white">
                {['Какие яхты есть?', 'Цены', 'Хочу на закат'].map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); setTimeout(() => sendMessage(), 50); }}
                    className="px-3 py-1.5 rounded-full bg-[var(--azure-light)] text-[var(--azure)] text-xs font-medium whitespace-nowrap hover:bg-[var(--azure)]/20 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-black/[0.06] bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-black/[0.06] text-sm text-[var(--navy)] placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--azure)]/20 transition-all"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-[var(--azure)] text-white flex items-center justify-center
                             hover:bg-[var(--azure)]/90 disabled:opacity-40 active:scale-95 transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
              <p className="text-center text-[10px] text-black/25 mt-2">
                Claude AI — отвечает 24/7
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
