'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/ui/Header';
import YachtPublicCard from '@/components/ui/YachtPublicCard';
import Footer from '@/components/ui/Footer';
import TiltCard from '@/components/ui/TiltCard';
import ScrollProgress from '@/components/ui/ScrollProgress';
import ContactHub from '@/components/ui/ContactHub';
import { getYachts, type YachtType } from '@/lib/data';

const TYPE_OPTIONS: { value: YachtType | ''; label: string }[] = [
  { value: '', label: 'Все типы' },
  { value: 'motor', label: 'Моторные' },
  { value: 'sailing', label: 'Парусные' },
  { value: 'catamaran', label: 'Катамараны' },
];

const CAPACITY_OPTIONS = [
  { value: 0, label: 'Любая вместимость' },
  { value: 4, label: 'до 4 чел.' },
  { value: 6, label: 'до 6 чел.' },
  { value: 8, label: 'до 8 чел.' },
  { value: 10, label: 'до 10 чел.' },
  { value: 12, label: '10+ чел.' },
];

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'capacity-desc', label: 'Вместимость: больше' },
];

export default function CatalogPage() {
  const allYachts = getYachts();
  const [typeFilter, setTypeFilter] = useState<YachtType | ''>('');
  const [capacityFilter, setCapacityFilter] = useState(0);
  const [sort, setSort] = useState('price-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    let result = [...allYachts];

    if (typeFilter) {
      result = result.filter(y => y.type === typeFilter);
    }

    if (capacityFilter > 0) {
      if (capacityFilter === 12) {
        result = result.filter(y => y.capacity >= 10);
      } else {
        result = result.filter(y => y.capacity <= capacityFilter);
      }
    }

    if (sort === 'price-asc') result.sort((a, b) => a.pricePerHour - b.pricePerHour);
    else if (sort === 'price-desc') result.sort((a, b) => b.pricePerHour - a.pricePerHour);
    else if (sort === 'capacity-desc') result.sort((a, b) => b.capacity - a.capacity);

    return result;
  }, [allYachts, typeFilter, capacityFilter, sort]);

  const activeFiltersCount = [typeFilter, capacityFilter > 0].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      <ScrollProgress />
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-[72px]" />

      {/* Page header */}
      <div className="bg-white border-b border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--navy)] mb-2">
              Каталог яхт
            </h1>
            <p className="text-[var(--muted)]">
              {allYachts.length} яхт доступно для аренды
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Type filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTypeFilter(opt.value as YachtType | '')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    typeFilter === opt.value
                      ? 'bg-[var(--navy)] text-white shadow-md shadow-[var(--navy)]/20'
                      : 'bg-black/[0.04] text-[var(--navy)] hover:bg-black/[0.08]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-black/10 hidden sm:block" />

            {/* Capacity */}
            <select
              value={capacityFilter}
              onChange={e => setCapacityFilter(Number(e.target.value))}
              className="px-4 py-2 rounded-full text-sm font-medium bg-black/[0.04] text-[var(--navy)] border-0 outline-none cursor-pointer appearance-none hover:bg-black/[0.08] transition-colors"
            >
              {CAPACITY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-black/[0.04] text-[var(--navy)] border-0 outline-none cursor-pointer appearance-none hover:bg-black/[0.08] transition-colors ml-auto"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* View mode toggle */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-black/[0.04]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={viewMode === 'grid' ? 'var(--navy)' : 'var(--muted)'} strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={viewMode === 'list' ? 'var(--navy)' : 'var(--muted)'} strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Active filters indicator */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-[var(--muted)]">
                Найдено: {filtered.length} из {allYachts.length}
              </span>
              <button
                onClick={() => { setTypeFilter(''); setCapacityFilter(0); }}
                className="text-xs font-medium text-[var(--azure)] hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 max-w-7xl mx-auto px-5 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${typeFilter}-${capacityFilter}-${sort}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'grid grid-cols-1 gap-4'
              }
            >
              {filtered.map((yacht, i) => (
                <TiltCard key={yacht.id} intensity={4}>
                  <YachtPublicCard yacht={yacht} index={i} />
                </TiltCard>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--azure-light)] text-[var(--azure)] flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--navy)] mb-2">Ничего не найдено</h3>
              <p className="text-[var(--muted)] text-sm mb-4">Попробуйте изменить параметры фильтра</p>
              <button
                onClick={() => { setTypeFilter(''); setCapacityFilter(0); }}
                className="px-5 py-2.5 rounded-full bg-[var(--azure)] text-white text-sm font-semibold hover:bg-[var(--azure)]/90 transition-colors"
              >
                Сбросить фильтры
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
      <ContactHub />
    </div>
  );
}
