'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { type Booking, STATUS_LABELS } from '@/lib/data';

interface Props {
  params: Promise<{ id: string }>;
}

export default function BookingStatusPage({ params }: Props) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(r => r.json())
      .then(d => { setBooking(d.booking); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      <Header />
      <div className="h-[72px]" />

      <div className="flex-1 flex items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {loading ? (
            <div className="text-center text-[var(--muted)]">Загрузка...</div>
          ) : !booking ? (
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--navy)] mb-4">Бронирование не найдено</p>
              <Link href="/catalog" className="text-[var(--azure)] font-semibold hover:underline">Перейти в каталог</Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-black/[0.06] shadow-xl p-8">
              <StatusTimeline status={booking.status} type={booking.type} />

              <div className="mt-8 space-y-4">
                <h2 className="text-xl font-bold text-[var(--navy)]">{booking.yachtName}</h2>

                {booking.date && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-[var(--surface)]">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-1">Дата</p>
                      <p className="text-sm font-bold text-[var(--navy)]">{booking.date}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--surface)]">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-1">Время</p>
                      <p className="text-sm font-bold text-[var(--navy)]">{booking.timeStart}–{booking.timeEnd}</p>
                    </div>
                  </div>
                )}

                {booking.amount > 0 && (
                  <div className="p-4 rounded-xl bg-[var(--azure-light)] border border-[var(--azure)]/10">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--muted)]">Стоимость прогулки</span>
                      <span className="font-bold text-[var(--navy)]">{booking.amount.toLocaleString('ru')} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--azure)] font-medium">Бронь (15%)</span>
                      <span className="font-bold text-[var(--azure)]">{booking.commission.toLocaleString('ru')} ₽</span>
                    </div>
                  </div>
                )}

                {booking.status === 'pending' && booking.type === 'standard' && (
                  <a
                    href={`/booking/${id}/pay`}
                    className="flex items-center justify-center w-full py-4 rounded-xl font-bold text-white
                               bg-gradient-to-r from-[var(--azure)] to-[var(--teal)]
                               shadow-lg shadow-[var(--azure)]/25 hover:shadow-[var(--azure)]/40
                               hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Оплатить бронь {booking.commission.toLocaleString('ru')} ₽
                  </a>
                )}

                {booking.status === 'commission_paid' && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <p className="text-sm font-semibold text-emerald-800">Бронь оплачена!</p>
                    <p className="text-xs text-emerald-600 mt-1">Менеджер подтвердит бронирование в ближайшее время.</p>
                  </div>
                )}

                {booking.status === 'confirmed' && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                    <p className="text-sm font-semibold text-blue-800">Подтверждено!</p>
                    <p className="text-xs text-blue-600 mt-1">Встречайтесь с капитаном в марине. Приятного путешествия!</p>
                  </div>
                )}

                {booking.status === 'cancelled' && (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-sm font-semibold text-gray-600">Бронирование отменено</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-black/[0.06] text-center">
                <Link href="/catalog" className="text-sm font-semibold text-[var(--azure)] hover:underline">
                  Вернуться в каталог
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

function StatusTimeline({ status, type }: { status: string; type: string }) {
  const steps = type === 'inquiry'
    ? [
        { key: 'pending', label: 'Заявка принята' },
        { key: 'confirmed', label: 'Менеджер связался' },
        { key: 'completed', label: 'Завершено' },
      ]
    : [
        { key: 'pending', label: 'Заявка создана' },
        { key: 'commission_paid', label: 'Бронь оплачена' },
        { key: 'confirmed', label: 'Подтверждено' },
        { key: 'completed', label: 'Завершено' },
      ];

  const statusOrder = steps.map(s => s.key);
  const currentIdx = statusOrder.indexOf(status);
  const isCancelled = status === 'cancelled';

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, i) => {
        const done = !isCancelled && currentIdx >= i;
        const active = !isCancelled && currentIdx === i;
        return (
          <div key={step.key} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              done ? 'bg-[var(--azure)] text-white' : 'bg-gray-100 text-gray-400'
            } ${active ? 'ring-4 ring-[var(--azure)]/20' : ''}`}>
              {done && !active ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                i + 1
              )}
            </div>
            <p className={`text-[10px] mt-2 text-center font-medium ${done ? 'text-[var(--navy)]' : 'text-gray-400'}`}>
              {isCancelled && i === currentIdx ? 'Отменено' : step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
