import Link from 'next/link';
import { getYachts, getBookings } from '@/lib/data';
import YachtCard from '@/components/YachtCard';

export default function HomePage() {
  const yachts = getYachts();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

  // Считаем брони за текущий месяц по каждой яхте
  const bookingCounts = Object.fromEntries(
    yachts.map(y => {
      const count = getBookings({ yachtId: y.id })
        .filter(b => b.date.startsWith(monthPrefix) && b.status !== 'cancelled').length;
      return [y.id, count];
    })
  );

  const totalBookings = getBookings().filter(b => b.status !== 'cancelled').length;
  const activeYachts = yachts.length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/8 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <div>
            <span className="font-bold text-base leading-none" style={{ color: 'var(--navy)' }}>
              Аренда<span style={{ color: 'var(--gold)' }}>Яхт</span>Ялта
            </span>
            <span className="text-xs ml-2 px-1.5 py-0.5 rounded bg-black/5 font-medium"
              style={{ color: 'var(--muted)' }}>
              Шахматка
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--muted)' }}>
            <span>🛥 {activeYachts} яхт</span>
            <span>📋 {totalBookings} броней</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Яхт в системе', value: activeYachts },
            { label: 'Броней всего', value: totalBookings },
            {
              label: 'Активных в этом месяце',
              value: Object.values(bookingCounts).reduce((a, b) => a + b, 0),
            },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-black/8">
              <p className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>{stat.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Yacht grid */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-xl" style={{ color: 'var(--navy)' }}>Флот</h2>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            Нажми на яхту чтобы открыть шахматку
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {yachts.map(yacht => (
            <YachtCard
              key={yacht.id}
              yacht={yacht}
              bookedDaysThisMonth={bookingCounts[yacht.id] ?? 0}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
