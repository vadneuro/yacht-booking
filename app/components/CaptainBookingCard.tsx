'use client';

import { useState } from 'react';
import type { Booking, BookingStatus } from '@/lib/data';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/data';

interface Props {
  booking: Booking;
  onStatusChange: (id: string, status: BookingStatus) => void;
}

export default function CaptainBookingCard({ booking, onStatusChange }: Props) {
  const [loading, setLoading] = useState(false);

  const handle = async (status: BookingStatus) => {
    setLoading(true);
    await fetch(`/api/bookings/${booking.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    onStatusChange(booking.id, status);
    setLoading(false);
  };

  const dateFormatted = booking.date.split('-').reverse().join('.');

  return (
    <div className="bg-white rounded-xl border border-black/8 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>
            {booking.clientName}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {dateFormatted} · {booking.timeStart}–{booking.timeEnd}
          </p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{booking.clientPhone}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[booking.status]}`}>
            {STATUS_LABELS[booking.status]}
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--blue)' }}>
            {booking.amount.toLocaleString('ru')} ₽
          </span>
        </div>
      </div>

      {booking.notes && (
        <p className="text-xs text-gray-500 border-t pt-2">{booking.notes}</p>
      )}

      {/* Actions */}
      {(booking.status === 'pending' || booking.status === 'confirmed') && (
        <div className="flex gap-2 pt-1">
          {booking.status === 'pending' && (
            <button
              onClick={() => handle('confirmed')}
              disabled={loading}
              className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              Подтвердить
            </button>
          )}
          {booking.status === 'confirmed' && (
            <button
              onClick={() => handle('completed')}
              disabled={loading}
              className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              Завершить
            </button>
          )}
          <button
            onClick={() => handle('cancelled')}
            disabled={loading}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-black/6 hover:bg-black/10 disabled:opacity-50 transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            Отменить
          </button>
        </div>
      )}
      {booking.status === 'commission_paid' && (
        <button
          onClick={() => handle('completed')}
          disabled={loading}
          className="w-full py-1.5 text-xs font-semibold rounded-lg bg-black/5 hover:bg-black/8 disabled:opacity-50 transition-colors"
          style={{ color: 'var(--muted)' }}
        >
          Завершить рейс
        </button>
      )}
    </div>
  );
}
