'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { type Booking } from '@/lib/data';

interface Props {
  params: Promise<{ id: string }>;
}

export default function PayCommissionPage({ params }: Props) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(r => r.json())
      .then(d => {
        setBooking(d.booking);
        if (d.booking?.status === 'commission_paid' || d.booking?.status === 'confirmed') {
          setPaid(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    await new Promise(r => setTimeout(r, 1500));
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'commission_paid' }),
    });
    setPaid(true);
    setPaying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--surface)]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--muted)]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--surface)]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg font-bold text-[var(--navy)]">Бронирование не найдено</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      <Header />
      <div className="h-[72px]" />

      <div className="flex-1 flex items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {paid ? (
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-8 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5"
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
              <h2 className="text-xl font-bold text-[var(--navy)] mb-2">Бронь оплачена!</h2>
              <p className="text-sm text-[var(--muted)] mb-6">
                Менеджер подтвердит бронирование в ближайшее время. Вы получите уведомление.
              </p>

              <div className="p-4 rounded-xl bg-[var(--surface)] text-left space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Яхта</span>
                  <span className="font-semibold text-[var(--navy)]">{booking.yachtName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Дата</span>
                  <span className="font-semibold text-[var(--navy)]">{booking.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Время</span>
                  <span className="font-semibold text-[var(--navy)]">{booking.timeStart}–{booking.timeEnd}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-black/[0.06]">
                  <span className="text-emerald-600 font-medium">Оплачено</span>
                  <span className="font-bold text-emerald-700">{booking.commission.toLocaleString('ru')} ₽</span>
                </div>
              </div>

              <Link
                href={`/booking/${id}`}
                className="text-sm font-semibold text-[var(--azure)] hover:underline"
              >
                Отслеживать статус бронирования
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-black/[0.06] shadow-xl overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-[var(--navy)] to-[oklch(18%_0.04_220)]">
                <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">Оплата брони</p>
                <p className="text-3xl font-bold text-white">{booking.commission.toLocaleString('ru')} ₽</p>
                <p className="text-sm text-white/60 mt-1">15% от стоимости {booking.amount.toLocaleString('ru')} ₽</p>
              </div>

              {/* Booking summary */}
              <div className="px-6 py-4 bg-[var(--surface)] border-b border-black/[0.06]">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">{booking.yachtName}</span>
                  <span className="font-medium text-[var(--navy)]">{booking.date}, {booking.timeStart}–{booking.timeEnd}</span>
                </div>
              </div>

              {/* Payment form (simulated) */}
              <form onSubmit={handlePay} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
                    Номер карты
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={card.number}
                    onChange={e => setCard(c => ({ ...c, number: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-medium text-[var(--navy)] bg-[var(--surface)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--azure)]/30 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
                      Срок
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ММ/ГГ"
                      maxLength={5}
                      value={card.expiry}
                      onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-medium text-[var(--navy)] bg-[var(--surface)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--azure)]/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
                      CVV
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="***"
                      maxLength={3}
                      value={card.cvv}
                      onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-medium text-[var(--navy)] bg-[var(--surface)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--azure)]/30 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paying}
                  className="w-full py-4 rounded-xl font-bold text-base text-white
                             bg-gradient-to-r from-[var(--azure)] to-[var(--teal)]
                             shadow-lg shadow-[var(--azure)]/25 hover:shadow-[var(--azure)]/40
                             hover:scale-[1.01] active:scale-[0.99]
                             disabled:opacity-60 disabled:hover:scale-100
                             transition-all"
                >
                  {paying ? 'Обработка...' : `Оплатить ${booking.commission.toLocaleString('ru')} ₽`}
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] text-[var(--muted)]">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Безопасная оплата
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
                    Возврат при отмене
                  </span>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
