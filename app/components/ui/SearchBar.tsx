'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  variant?: 'hero' | 'inline';
}

export default function SearchBar({ variant = 'hero' }: Props) {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  const [type, setType] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (guests) params.set('guests', guests);
    if (type) params.set('type', type);
    router.push(`/catalog?${params.toString()}`);
  };

  if (variant === 'hero') {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="glass rounded-2xl p-2 shadow-2xl shadow-black/10">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2">
            {/* Date */}
            <div className="px-4 py-3 rounded-xl hover:bg-black/[0.03] transition-colors cursor-pointer">
              <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
                Когда
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full text-sm font-medium text-[var(--navy)] bg-transparent border-0 outline-none cursor-pointer"
                placeholder="Выберите дату"
              />
            </div>

            {/* Guests */}
            <div className="px-4 py-3 rounded-xl hover:bg-black/[0.03] transition-colors">
              <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
                Гости
              </label>
              <select
                value={guests}
                onChange={e => setGuests(e.target.value)}
                className="w-full text-sm font-medium text-[var(--navy)] bg-transparent border-0 outline-none cursor-pointer appearance-none"
              >
                <option value="">Сколько?</option>
                <option value="2">1–2 гостя</option>
                <option value="4">3–4 гостя</option>
                <option value="6">5–6 гостей</option>
                <option value="8">7–8 гостей</option>
                <option value="10">9–10 гостей</option>
                <option value="12">11–12 гостей</option>
              </select>
            </div>

            {/* Type */}
            <div className="px-4 py-3 rounded-xl hover:bg-black/[0.03] transition-colors">
              <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
                Тип яхты
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full text-sm font-medium text-[var(--navy)] bg-transparent border-0 outline-none cursor-pointer appearance-none"
              >
                <option value="">Любой</option>
                <option value="motor">Моторная</option>
                <option value="sailing">Парусная</option>
                <option value="catamaran">Катамаран</option>
              </select>
            </div>

            {/* Button */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                         bg-gradient-to-r from-[var(--azure)] to-[var(--teal)]
                         text-white font-semibold text-sm
                         shadow-lg shadow-[var(--azure)]/30 hover:shadow-[var(--azure)]/50
                         hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="hidden sm:inline">Найти</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-2xl border border-[var(--border)] bg-white shadow-sm">
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
        className="flex-1 px-3 py-2 text-sm bg-transparent border-0 outline-none"
      />
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="flex-1 px-3 py-2 text-sm bg-transparent border-0 outline-none appearance-none"
      >
        <option value="">Тип яхты</option>
        <option value="motor">Моторная</option>
        <option value="sailing">Парусная</option>
        <option value="catamaran">Катамаран</option>
      </select>
      <button
        onClick={handleSearch}
        className="px-5 py-2.5 rounded-xl bg-[var(--azure)] text-white text-sm font-semibold hover:bg-[var(--azure)]/90 transition-colors"
      >
        Найти
      </button>
    </div>
  );
}
