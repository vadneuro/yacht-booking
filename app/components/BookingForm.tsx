'use client';

import { useState } from 'react';
import type { Yacht } from '@/lib/data';

interface Props {
  yacht: Yacht;
  onSubmit: (data: BookingData) => void;
}

export interface BookingData {
  date: string;
  timeStart: string;
  timeEnd: string;
  clientName: string;
  clientPhone: string;
  notes: string;
}

export default function BookingForm({ yacht, onSubmit }: Props) {
  const [form, setForm] = useState<BookingData>({
    date: '',
    timeStart: '10:00',
    timeEnd: '14:00',
    clientName: '',
    clientPhone: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const hours = () => {
    if (!form.timeStart || !form.timeEnd) return 0;
    const [sh, sm] = form.timeStart.split(':').map(Number);
    const [eh, em] = form.timeEnd.split(':').map(Number);
    return Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
  };

  const total = Math.round(hours() * yacht.pricePerHour);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hours() <= 0) return;
    onSubmit(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-xl bg-green-50 border border-green-200 text-center">
        <div className="text-3xl mb-2">✅</div>
        <p className="font-semibold text-green-800">Заявка принята</p>
        <p className="text-sm text-green-700 mt-1">Мы свяжемся с вами для подтверждения.</p>
        <button onClick={() => setSubmitted(false)}
          className="mt-3 text-sm underline text-green-700">
          Новая заявка
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
          ДАТА
        </label>
        <input
          type="date"
          required
          value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2.5 rounded-lg border border-black/15 text-sm focus:outline-none focus:ring-2 bg-white"
          style={{ '--tw-ring-color': 'var(--blue)' } as React.CSSProperties}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
            НАЧАЛО
          </label>
          <input
            type="time"
            required
            value={form.timeStart}
            onChange={e => setForm(f => ({ ...f, timeStart: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg border border-black/15 text-sm focus:outline-none focus:ring-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
            КОНЕЦ
          </label>
          <input
            type="time"
            required
            value={form.timeEnd}
            onChange={e => setForm(f => ({ ...f, timeEnd: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg border border-black/15 text-sm focus:outline-none focus:ring-2 bg-white"
          />
        </div>
      </div>

      {total > 0 && (
        <div className="px-3 py-2.5 rounded-lg text-sm font-semibold flex justify-between"
          style={{ background: 'var(--surface)', color: 'var(--navy)' }}>
          <span>{hours()} ч × {yacht.pricePerHour.toLocaleString('ru')} ₽</span>
          <span style={{ color: 'var(--blue)' }}>{total.toLocaleString('ru')} ₽</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
          ИМЯ КЛИЕНТА
        </label>
        <input
          type="text"
          required
          placeholder="Имя и фамилия"
          value={form.clientName}
          onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-lg border border-black/15 text-sm focus:outline-none focus:ring-2 bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
          ТЕЛЕФОН
        </label>
        <input
          type="tel"
          required
          placeholder="+7 900 000-00-00"
          value={form.clientPhone}
          onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-lg border border-black/15 text-sm focus:outline-none focus:ring-2 bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
          ПОЖЕЛАНИЯ (необязательно)
        </label>
        <textarea
          rows={2}
          placeholder="День рождения, корпоратив, снорклинг..."
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-lg border border-black/15 text-sm focus:outline-none focus:ring-2 bg-white resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={hours() <= 0}
        className="w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-40"
        style={{ background: 'var(--navy)', color: 'white' }}
      >
        Отправить заявку
      </button>
    </form>
  );
}
