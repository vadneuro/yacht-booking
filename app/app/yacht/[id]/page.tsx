'use client';

import { useState, use, useRef, useEffect, useCallback } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import ContactHub from '@/components/ui/ContactHub';
import { getYachtById, createBooking, COMMISSION_RATE, type Yacht } from '@/lib/data';
import { createNotification } from '@/lib/notifications';

interface Props {
  params: Promise<{ id: string }>;
}

export default function YachtDetailPage({ params }: Props) {
  const { id } = use(params);
  const yacht = getYachtById(id);
  if (!yacht) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Header />
      <div className="h-[72px]" />

      {/* Hero gallery */}
      <GallerySection yacht={yacht} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-10">
            <YachtInfo yacht={yacht} />
            <FeaturesSection yacht={yacht} />
            <RoutesSection />
          </div>

          {/* Right: Booking */}
          <div className="lg:col-span-1">
            <BookingWidget yacht={yacht} />
          </div>
        </div>
      </div>

      <Footer />
      <ContactHub />
    </div>
  );
}

function GallerySection({ yacht }: { yacht: Yacht }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);

  const goNext = useCallback(() => setActivePhoto(i => (i + 1) % yacht.photos.length), [yacht.photos.length]);
  const goPrev = useCallback(() => setActivePhoto(i => (i - 1 + yacht.photos.length) % yacht.photos.length), [yacht.photos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  return (
    <div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-[var(--navy)]"
      >
        <motion.img
          src={yacht.photos[activePhoto]}
          alt={yacht.name}
          className="w-full h-full object-contain"
          style={{ scale, opacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium text-[var(--navy)] hover:bg-white transition-colors shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Назад
          </Link>
        </div>

        {/* Photo counter */}
        {yacht.photos.length > 1 && (
          <div className="absolute top-6 right-6">
            <span className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-xs font-semibold text-white">
              {activePhoto + 1} / {yacht.photos.length}
            </span>
          </div>
        )}

        {/* Nav arrows */}
        {yacht.photos.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/20 mb-3">
              {yacht.typeLabel}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              {yacht.name}
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Thumbnail strip */}
      {yacht.photos.length > 1 && (
        <div className="bg-[var(--navy)] px-5 py-3 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex gap-2">
            {yacht.photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(i)}
                className={`flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden transition-all ${
                  activePhoto === i ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((block, i) => (
        <div key={i} className="mb-5">
          {block.split('\n').map((line, j) => {
            const parts = line.split(/\*\*(.+?)\*\*/);
            const hasFormatting = parts.length > 1;
            if (line.startsWith('• ')) {
              const content = line.slice(2);
              const cParts = content.split(/\*\*(.+?)\*\*/);
              return (
                <div key={j} className="flex gap-2.5 mb-2.5 pl-1">
                  <span className="text-[var(--azure)] mt-0.5 flex-shrink-0">•</span>
                  <p>
                    {cParts.map((part, k) =>
                      k % 2 === 1
                        ? <strong key={k} className="text-[var(--navy)]">{part}</strong>
                        : <span key={k}>{part}</span>
                    )}
                  </p>
                </div>
              );
            }
            if (hasFormatting) {
              return (
                <p key={j} className="mb-1.5">
                  {parts.map((part, k) =>
                    k % 2 === 1
                      ? <strong key={k} className="text-[var(--navy)]">{part}</strong>
                      : <span key={k}>{part}</span>
                  )}
                </p>
              );
            }
            return line.trim() ? <p key={j} className="mb-2">{line}</p> : null;
          })}
        </div>
      ))}
    </>
  );
}

function YachtInfo({ yacht }: { yacht: Yacht }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <p className="text-lg text-[var(--muted)] leading-relaxed mb-6">
        {yacht.description}
      </p>

      {yacht.longDescription && (
        <div className="mb-8">
          <div className="relative">
            <div
              className={`overflow-hidden transition-all duration-700 ease-out text-sm text-[var(--muted)] leading-relaxed ${
                expanded ? 'max-h-[5000px]' : 'max-h-[180px]'
              }`}
            >
              <RichText text={yacht.longDescription} />
            </div>

            {!expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--azure)] hover:text-[var(--navy)] transition-colors"
          >
            {expanded ? 'Свернуть' : 'Читать подробнее'}
            <motion.svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M6 9l6 6 6-6"/>
            </motion.svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Вместимость',
            value: `${yacht.capacity} чел.`,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
          },
          {
            label: 'Цена',
            value: `${yacht.pricePerHour.toLocaleString('ru')} ₽/ч`,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
          },
          {
            label: 'Тип',
            value: yacht.typeLabel,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M12 2v8"/></svg>,
          },
          {
            label: 'Мин. аренда',
            value: '2 часа',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
          },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-2xl bg-[var(--surface)] border border-black/[0.04]">
            <div className="text-[var(--azure)] mb-2">{stat.icon}</div>
            <p className="text-sm font-bold text-[var(--navy)]">{stat.value}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FeaturesSection({ yacht }: { yacht: Yacht }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-[var(--navy)] mb-5">Оснащение</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {yacht.features.map(feature => (
          <div key={feature} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface)] border border-black/[0.04]">
            <div className="w-8 h-8 rounded-lg bg-[var(--azure-light)] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--azure)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[var(--navy)]">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RoutesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-[var(--navy)] mb-5">Популярные маршруты</h2>
      <div className="space-y-3">
        {[
          { name: 'Ялта — Ласточкино гнездо', duration: '2 часа', difficulty: 'Лёгкий' },
          { name: 'Бухта Ласпи и Фиолент', duration: '4 часа', difficulty: 'Средний' },
          { name: 'Форос — Балаклава', duration: '6 часов', difficulty: 'Длинный' },
        ].map(route => (
          <div key={route.name} className="flex items-center justify-between p-4 rounded-xl border border-black/[0.06] hover:border-[var(--azure)]/30 hover:bg-[var(--azure-light)]/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--azure-light)] flex items-center justify-center group-hover:bg-[var(--azure)] group-hover:text-white transition-colors text-[var(--azure)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--navy)]">{route.name}</p>
                <p className="text-xs text-[var(--muted)]">{route.difficulty}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-[var(--muted)]">{route.duration}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function BookingWidget({ yacht }: { yacht: Yacht }) {
  const [form, setForm] = useState({
    date: '',
    timeStart: '10:00',
    timeEnd: '14:00',
    clientName: '',
    clientPhone: '',
    notes: '',
  });
  const [bookingId, setBookingId] = useState<string | null>(null);

  const hours = () => {
    if (!form.timeStart || !form.timeEnd) return 0;
    const [sh, sm] = form.timeStart.split(':').map(Number);
    const [eh, em] = form.timeEnd.split(':').map(Number);
    return Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
  };

  const total = Math.round(hours() * yacht.pricePerHour);
  const commission = Math.round(total * COMMISSION_RATE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hours() <= 0) return;
    const booking = createBooking({
      yachtId: yacht.id,
      yachtName: yacht.name,
      date: form.date,
      timeStart: form.timeStart,
      timeEnd: form.timeEnd,
      clientName: form.clientName,
      clientPhone: form.clientPhone,
      notes: form.notes,
      amount: total,
      type: 'standard',
      source: 'form',
    });
    createNotification({
      type: 'new_booking',
      bookingId: booking.id,
      message: `Новое бронирование: ${yacht.name}, ${booking.date} ${form.timeStart}–${form.timeEnd}, ${form.clientName}`,
    });
    setBookingId(booking.id);
  };

  if (bookingId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="sticky top-[96px] p-8 rounded-2xl bg-white border border-emerald-200 shadow-lg text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--navy)] mb-2">Бронирование создано!</h3>
        <p className="text-sm text-[var(--muted)] mb-2">
          Оплатите бронь <span className="font-bold text-[var(--navy)]">{commission.toLocaleString('ru')} ₽</span> для подтверждения.
        </p>
        <p className="text-xs text-[var(--muted)] mb-5">
          Остаток {(total - commission).toLocaleString('ru')} ₽ — капитану в день прогулки.
        </p>
        <a
          href={`/booking/${bookingId}/pay`}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white
                     bg-gradient-to-r from-[var(--azure)] to-[var(--teal)]
                     shadow-lg shadow-[var(--azure)]/25 hover:shadow-[var(--azure)]/40
                     hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          Оплатить бронь {commission.toLocaleString('ru')} ₽
        </a>
        <button
          onClick={() => setBookingId(null)}
          className="mt-3 text-sm font-semibold text-[var(--azure)] hover:underline"
        >
          Новое бронирование
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="sticky top-[96px]"
    >
      <div className="p-6 rounded-2xl bg-white border border-black/[0.06] shadow-xl shadow-black/[0.04]">
        {/* Price header */}
        <div className="flex items-baseline gap-2 mb-6 pb-5 border-b border-black/[0.06]">
          <span className="text-2xl font-bold text-[var(--navy)]">
            {yacht.pricePerHour.toLocaleString('ru')} ₽
          </span>
          <span className="text-sm text-[var(--muted)]">/ час</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
              Дата
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-medium text-[var(--navy)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--azure)]/30 focus:border-[var(--azure)] transition-all"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
                Начало
              </label>
              <input
                type="time"
                required
                value={form.timeStart}
                onChange={e => setForm(f => ({ ...f, timeStart: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-medium text-[var(--navy)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--azure)]/30 focus:border-[var(--azure)] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
                Конец
              </label>
              <input
                type="time"
                required
                value={form.timeEnd}
                onChange={e => setForm(f => ({ ...f, timeEnd: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-medium text-[var(--navy)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--azure)]/30 focus:border-[var(--azure)] transition-all"
              />
            </div>
          </div>

          {/* Price calc */}
          {total > 0 && (
            <div className="p-4 rounded-xl bg-[var(--azure-light)] border border-[var(--azure)]/10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">{hours()} ч × {yacht.pricePerHour.toLocaleString('ru')} ₽</span>
                <span className="font-bold text-[var(--navy)]">{total.toLocaleString('ru')} ₽</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-[var(--azure)]/10">
                <span className="text-[var(--azure)] font-medium">Бронь (15%)</span>
                <span className="font-bold text-[var(--azure)]">{commission.toLocaleString('ru')} ₽</span>
              </div>
              <p className="text-[10px] text-[var(--muted)]">Остальное оплачивается капитану напрямую</p>
            </div>
          )}

          {/* Client info */}
          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
              Ваше имя
            </label>
            <input
              type="text"
              required
              placeholder="Как к вам обращаться?"
              value={form.clientName}
              onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm text-[var(--navy)] bg-[var(--surface)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--azure)]/30 focus:border-[var(--azure)] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
              Телефон
            </label>
            <input
              type="tel"
              required
              placeholder="+7 (900) 000-00-00"
              value={form.clientPhone}
              onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm text-[var(--navy)] bg-[var(--surface)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--azure)]/30 focus:border-[var(--azure)] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
              Пожелания <span className="text-[var(--muted)]/50 normal-case tracking-normal">(необязательно)</span>
            </label>
            <textarea
              rows={2}
              placeholder="День рождения, маршрут, снорклинг..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm text-[var(--navy)] bg-[var(--surface)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--azure)]/30 focus:border-[var(--azure)] transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={hours() <= 0}
            className="w-full py-4 rounded-xl font-bold text-base text-white
                       bg-gradient-to-r from-[var(--azure)] to-[var(--teal)]
                       shadow-lg shadow-[var(--azure)]/25 hover:shadow-[var(--azure)]/40
                       hover:scale-[1.01] active:scale-[0.99]
                       disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none
                       transition-all"
          >
            Отправить заявку
          </button>

          {/* Trust */}
          <div className="flex items-center justify-center gap-4 pt-2 text-[10px] text-[var(--muted)]">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Безопасная оплата
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
              Бесплатная отмена
            </span>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
