'use client';

import { useState } from 'react';
import type { Booking } from '@/lib/data';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/data';

interface Props {
  yachtId: string;
  bookings: Booking[];
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
}

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                 'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const DOW = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

export default function BookingCalendar({ bookings, year, month, onMonthChange }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  // Monday-based offset (0=Mon, 6=Sun)
  const startOffset = (firstDay.getDay() + 6) % 7;

  // Build map: date -> bookings
  const byDate = new Map<string, Booking[]>();
  for (const b of bookings) {
    if (!byDate.has(b.date)) byDate.set(b.date, []);
    byDate.get(b.date)!.push(b);
  }

  const dateStr = (day: number) =>
    `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  const prevMonth = () => month === 1 ? onMonthChange(year - 1, 12) : onMonthChange(year, month - 1);
  const nextMonth = () => month === 12 ? onMonthChange(year + 1, 1) : onMonthChange(year, month + 1);

  const selectedBookings = selectedDate ? (byDate.get(selectedDate) ?? []) : [];

  return (
    <div className="space-y-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/8 transition-colors text-lg">
          ‹
        </button>
        <span className="font-semibold text-base" style={{ color: 'var(--navy)' }}>
          {MONTHS[month - 1]} {year}
        </span>
        <button onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/8 transition-colors text-lg">
          ›
        </button>
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 gap-1">
        {DOW.map(d => (
          <div key={d} className="text-center text-xs font-semibold py-1"
            style={{ color: 'var(--muted)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const ds = dateStr(day);
          const dayBookings = byDate.get(ds) ?? [];
          const hasBooking = dayBookings.length > 0;
          const isSelected = selectedDate === ds;
          const isToday = ds === new Date().toISOString().slice(0, 10);

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : ds)}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium
                transition-all duration-150
                ${isSelected
                  ? 'text-white shadow-sm'
                  : hasBooking
                    ? 'hover:bg-blue-50'
                    : 'hover:bg-black/5'
                }
              `}
              style={{
                background: isSelected ? 'var(--navy)' : undefined,
                color: isSelected ? 'white' : hasBooking ? 'var(--blue)' : 'var(--navy)',
                fontWeight: isToday ? 700 : undefined,
                outline: isToday && !isSelected ? '2px solid var(--gold)' : undefined,
              }}
            >
              {day}
              {hasBooking && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {dayBookings.slice(0, 3).map((_, j) => (
                    <span key={j} className="w-1 h-1 rounded-full"
                      style={{ background: isSelected ? 'white' : 'var(--blue)' }} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day bookings */}
      {selectedDate && (
        <div className="border-t pt-4 mt-2 space-y-2">
          <p className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
            {selectedDate.split('-').reverse().slice(0, 2).join('.')} —{' '}
            {selectedBookings.length > 0
              ? `${selectedBookings.length} бронирование${selectedBookings.length > 1 ? 'й' : ''}`
              : 'нет бронирований'}
          </p>
          {selectedBookings.map(b => (
            <div key={b.id} className="p-3 rounded-lg bg-white border border-black/8 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{b.clientName}</p>
                  <p style={{ color: 'var(--muted)' }}>{b.timeStart}–{b.timeEnd} · {b.clientPhone}</p>
                  {b.notes && <p className="text-xs mt-1 text-gray-500">{b.notes}</p>}
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[b.status]}`}>
                  {STATUS_LABELS[b.status]}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--blue)' }}>
                {b.amount.toLocaleString('ru')} ₽
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
