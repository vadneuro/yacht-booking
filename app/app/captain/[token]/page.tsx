'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  getOwnerByToken, getYachtsByOwner, getBookingsForOwner,
  addBlockedSlot, getBlockedSlots, removeBlockedSlot,
  type Booking, type BookingStatus, type Yacht, type BlockedSlot,
  STATUS_LABELS, STATUS_COLORS,
} from '@/lib/data';
import CaptainBookingCard from '@/components/CaptainBookingCard';
import BookingCalendar from '@/components/BookingCalendar';
import BlockSlotForm from '@/components/BlockSlotForm';

interface Props { params: Promise<{ token: string }> }

export default function CaptainPage({ params }: Props) {
  const { token } = use(params);
  const owner = getOwnerByToken(token);

  if (!owner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-4xl">🚫</p>
          <p className="font-semibold" style={{ color: 'var(--navy)' }}>Ссылка недействительна</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Обратитесь к администратору за новой ссылкой.</p>
        </div>
      </div>
    );
  }

  const yachts = getYachtsByOwner(owner.id);
  const [bookings, setBookings] = useState<Booking[]>(() => getBookingsForOwner(owner.id));
  const [selectedYacht, setSelectedYacht] = useState<Yacht>(yachts[0]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>(() =>
    getBlockedSlots(yachts[0]?.id ?? '')
  );
  const [activeTab, setActiveTab] = useState<'bookings' | 'calendar' | 'block'>('bookings');
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);

  const pending = bookings.filter(b => b.status === 'pending' && yachts.some(y => y.id === b.yachtId));

  const handleStatusChange = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleAddBlock = (slot: Omit<BlockedSlot, 'id'>) => {
    const added = addBlockedSlot(slot);
    setBlockedSlots(prev => [...prev, added]);
  };

  const handleRemoveBlock = (id: string) => {
    removeBlockedSlot(id);
    setBlockedSlots(prev => prev.filter(s => s.id !== id));
  };

  const selectYacht = (yacht: Yacht) => {
    setSelectedYacht(yacht);
    setBlockedSlots(getBlockedSlots(yacht.id));
  };

  const yachtBookings = bookings.filter(b => b.yachtId === selectedYacht?.id);
  const calBookings = yachtBookings.filter(b => {
    const prefix = `${calYear}-${String(calMonth).padStart(2,'0')}`;
    return b.date.startsWith(prefix);
  });

  const now = new Date();
  const upcomingBookings = yachtBookings
    .filter(b => b.date >= now.toISOString().slice(0,10) && b.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/8 bg-white/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <div>
            <span className="font-bold text-sm" style={{ color: 'var(--navy)' }}>
              Аренда<span style={{ color: 'var(--gold)' }}>Яхт</span>Ялта
            </span>
            <span className="text-xs ml-2" style={{ color: 'var(--muted)' }}>
              Кабинет капитана
            </span>
          </div>
          <div className="flex items-center gap-2">
            {pending.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                {pending.length} новых
              </span>
            )}
            <span className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
              {owner.name}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Yacht selector */}
        {yachts.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {yachts.map(y => (
              <button
                key={y.id}
                onClick={() => selectYacht(y)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  selectedYacht?.id === y.id
                    ? 'text-white shadow-sm'
                    : 'bg-white border border-black/8 hover:border-black/20'
                }`}
                style={selectedYacht?.id === y.id ? { background: 'var(--navy)' } : { color: 'var(--navy)' }}
              >
                {y.name}
                <span className="ml-1.5 opacity-60 font-normal">{y.typeLabel}</span>
              </button>
            ))}
          </div>
        )}

        {selectedYacht && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Yacht info card */}
            <div className="bg-white rounded-xl border border-black/8 overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img src={selectedYacht.photos[0]} alt={selectedYacht.name}
                  className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>{selectedYacht.name}</h2>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{selectedYacht.typeLabel} · {selectedYacht.capacity} чел.</p>
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--blue)' }}>
                  {selectedYacht.pricePerHour.toLocaleString('ru')} ₽/час
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/4 rounded-lg px-3 py-2 text-center">
                    <p className="font-bold text-lg" style={{ color: 'var(--navy)' }}>
                      {upcomingBookings.length}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>предстоящих</p>
                  </div>
                  <div className="bg-black/4 rounded-lg px-3 py-2 text-center">
                    <p className="font-bold text-lg" style={{ color: 'var(--navy)' }}>
                      {yachtBookings.filter(b => b.status === 'pending').length}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>ожидают</p>
                  </div>
                </div>

                {/* Blocked slots list */}
                {blockedSlots.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>ЗАБЛОКИРОВАНО</p>
                    {blockedSlots.map(s => (
                      <div key={s.id}
                        className="flex items-center justify-between gap-2 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        <span>
                          {s.date.split('-').reverse().join('.')}
                          {s.timeStart && ` ${s.timeStart}–${s.timeEnd}`}
                          {s.note && ` · ${s.note}`}
                        </span>
                        <button onClick={() => handleRemoveBlock(s.id)}
                          className="text-red-400 hover:text-red-600 font-bold leading-none">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right panel */}
            <div className="lg:col-span-2 space-y-4">
              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-black/5 rounded-xl w-fit">
                {([
                  ['bookings', 'Заявки'],
                  ['calendar', 'Календарь'],
                  ['block', 'Заблокировать'],
                ] as const).map(([tab, label]) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === tab ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                    }`}
                    style={{ color: activeTab === tab ? 'var(--navy)' : 'var(--muted)' }}>
                    {label}
                    {tab === 'bookings' && pending.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-yellow-400 text-yellow-900">
                        {pending.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-black/8 p-5">
                {/* BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                  <div className="space-y-3">
                    {/* Pending first */}
                    {pending.filter(b => b.yachtId === selectedYacht.id).length > 0 && (
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>
                          ТРЕБУЮТ ПОДТВЕРЖДЕНИЯ
                        </p>
                        {pending.filter(b => b.yachtId === selectedYacht.id).map(b => (
                          <CaptainBookingCard key={b.id} booking={b} onStatusChange={handleStatusChange} />
                        ))}
                      </div>
                    )}

                    {/* Upcoming */}
                    {upcomingBookings.filter(b => b.status !== 'pending').length > 0 && (
                      <div>
                        <p className="text-xs font-semibold mb-2 mt-4" style={{ color: 'var(--muted)' }}>
                          ПРЕДСТОЯЩИЕ
                        </p>
                        <div className="space-y-2">
                          {upcomingBookings.filter(b => b.status !== 'pending').map(b => (
                            <CaptainBookingCard key={b.id} booking={b} onStatusChange={handleStatusChange} />
                          ))}
                        </div>
                      </div>
                    )}

                    {upcomingBookings.length === 0 && (
                      <div className="py-10 text-center">
                        <p className="text-3xl mb-2">⚓</p>
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>Нет предстоящих броней</p>
                      </div>
                    )}
                  </div>
                )}

                {/* CALENDAR TAB */}
                {activeTab === 'calendar' && (
                  <BookingCalendar
                    yachtId={selectedYacht.id}
                    bookings={calBookings}
                    year={calYear}
                    month={calMonth}
                    onMonthChange={(y, m) => { setCalYear(y); setCalMonth(m); }}
                  />
                )}

                {/* BLOCK TAB */}
                {activeTab === 'block' && (
                  <BlockSlotForm yachtId={selectedYacht.id} onAdd={handleAddBlock} />
                )}
              </div>
            </div>
          </div>
        )}

        {yachts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-3xl mb-2">🚢</p>
            <p className="font-semibold" style={{ color: 'var(--navy)' }}>Нет яхт</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              Обратитесь к администратору для добавления яхты.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
