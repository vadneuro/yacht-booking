'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getYachtById, getBookingsForMonth, createBooking, STATUS_LABELS, STATUS_COLORS } from '@/lib/data';
import BookingCalendar from '@/components/BookingCalendar';
import BookingForm, { type BookingData } from '@/components/BookingForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default function YachtPage({ params }: Props) {
  const { id } = use(params);
  const yacht = getYachtById(id);
  if (!yacht) notFound();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [bookings, setBookings] = useState(() => getBookingsForMonth(id, year, month));
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'book'>('calendar');

  const handleMonthChange = (y: number, m: number) => {
    setYear(y);
    setMonth(m);
    setBookings(getBookingsForMonth(id, y, m));
  };

  const handleNewBooking = (data: BookingData) => {
    const booking = createBooking({
      yachtId: yacht.id,
      yachtName: yacht.name,
      date: data.date,
      timeStart: data.timeStart,
      timeEnd: data.timeEnd,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      notes: data.notes,
      amount: Math.round(
        ((parseInt(data.timeEnd) - parseInt(data.timeStart)) * yacht.pricePerHour)
      ),
      type: 'standard',
      source: 'form',
    });
    const bMonth = parseInt(data.date.split('-')[1]);
    const bYear = parseInt(data.date.split('-')[0]);
    if (bYear === year && bMonth === month) {
      setBookings(getBookingsForMonth(id, year, month));
    }
    return booking;
  };

  const allBookings = getBookingsForMonth(id, year, month);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/8 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <Link href="/" className="text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'var(--muted)' }}>
            ← Назад
          </Link>
          <span className="text-black/20">|</span>
          <span className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>
            {yacht.name}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            {yacht.typeLabel}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: yacht info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-xl overflow-hidden bg-white border border-black/8">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  fill
                  src={yacht.photos[0]}
                  alt={yacht.name}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h1 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>{yacht.name}</h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{yacht.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-black/4 rounded-lg px-3 py-2">
                    <p style={{ color: 'var(--muted)' }} className="text-xs">Вместимость</p>
                    <p className="font-semibold mt-0.5">{yacht.capacity} чел.</p>
                  </div>
                  <div className="bg-black/4 rounded-lg px-3 py-2">
                    <p style={{ color: 'var(--muted)' }} className="text-xs">Цена/час</p>
                    <p className="font-semibold mt-0.5" style={{ color: 'var(--blue)' }}>
                      {yacht.pricePerHour.toLocaleString('ru')} ₽
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Оснащение</p>
                  <div className="flex flex-wrap gap-1">
                    {yacht.features.map(f => (
                      <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-black/5">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: tabs */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-black/5 rounded-xl mb-5 w-fit">
              {([
                ['calendar', 'Шахматка'],
                ['list', 'Список броней'],
                ['book', 'Новая бронь'],
              ] as const).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                  }`}
                  style={{ color: activeTab === tab ? 'var(--navy)' : 'var(--muted)' }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-black/8 p-5">
              {activeTab === 'calendar' && (
                <BookingCalendar
                  yachtId={yacht.id}
                  bookings={bookings}
                  year={year}
                  month={month}
                  onMonthChange={handleMonthChange}
                />
              )}

              {activeTab === 'list' && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
                    {allBookings.length > 0
                      ? `${allBookings.length} броней в этом месяце`
                      : 'Нет броней в этом месяце'}
                  </p>
                  {allBookings.map(b => (
                    <div key={b.id}
                      className="p-3.5 rounded-xl border border-black/8 text-sm space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold">{b.clientName}</p>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[b.status]}`}>
                          {STATUS_LABELS[b.status]}
                        </span>
                      </div>
                      <p style={{ color: 'var(--muted)' }}>
                        {b.date.split('-').reverse().join('.')} · {b.timeStart}–{b.timeEnd}
                      </p>
                      <div className="flex items-center justify-between">
                        <p style={{ color: 'var(--muted)' }}>{b.clientPhone}</p>
                        <p className="font-semibold" style={{ color: 'var(--blue)' }}>
                          {b.amount.toLocaleString('ru')} ₽
                        </p>
                      </div>
                      {b.notes && (
                        <p className="text-xs text-gray-500 border-t pt-1">{b.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'book' && (
                <div>
                  <p className="text-sm font-semibold mb-4" style={{ color: 'var(--navy)' }}>
                    Новая заявка на бронирование
                  </p>
                  <BookingForm yacht={yacht} onSubmit={handleNewBooking} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
