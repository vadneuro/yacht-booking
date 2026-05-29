'use client';

import { useState } from 'react';
import type { BlockedSlot } from '@/lib/data';

interface Props {
  yachtId: string;
  onAdd: (slot: Omit<BlockedSlot, 'id'>) => void;
}

export default function BlockSlotForm({ yachtId, onAdd }: Props) {
  const [date, setDate] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [note, setNote] = useState('');
  const [allDay, setAllDay] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      yachtId,
      date,
      timeStart: allDay ? undefined : timeStart || undefined,
      timeEnd: allDay ? undefined : timeEnd || undefined,
      note: note || undefined,
    });
    setDate(''); setTimeStart(''); setTimeEnd(''); setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-black/3 rounded-xl">
      <p className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>ЗАБЛОКИРОВАТЬ ДАТУ</p>

      <input
        type="date"
        required
        value={date}
        onChange={e => setDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
        className="w-full px-3 py-2 rounded-lg border border-black/12 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={allDay} onChange={e => setAllDay(e.target.checked)}
          className="w-4 h-4 rounded" />
        <span style={{ color: 'var(--navy)' }}>Весь день</span>
      </label>

      {!allDay && (
        <div className="grid grid-cols-2 gap-2">
          <input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)}
            className="px-3 py-2 rounded-lg border border-black/12 text-sm bg-white focus:outline-none" placeholder="Начало" />
          <input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)}
            className="px-3 py-2 rounded-lg border border-black/12 text-sm bg-white focus:outline-none" placeholder="Конец" />
        </div>
      )}

      <input
        type="text"
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Причина (необязательно)"
        className="w-full px-3 py-2 rounded-lg border border-black/12 text-sm bg-white focus:outline-none"
      />

      <button type="submit"
        className="w-full py-2 text-sm font-semibold rounded-lg text-white transition-colors"
        style={{ background: 'var(--navy)' }}
      >
        Заблокировать
      </button>
    </form>
  );
}
