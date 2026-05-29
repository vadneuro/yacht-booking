import Link from 'next/link';
import type { Yacht } from '@/lib/data';

interface Props {
  yacht: Yacht;
  bookedDaysThisMonth?: number;
}

export default function YachtCard({ yacht, bookedDaysThisMonth = 0 }: Props) {
  return (
    <Link href={`/yachts/${yacht.id}`} className="group block">
      <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-black/5 hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={yacht.photos[0]}
            alt={yacht.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
              {yacht.typeLabel}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              yacht.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
            }`}>
              {yacht.isActive ? 'Активна' : 'Неактивна'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg leading-tight" style={{ color: 'var(--navy)' }}>
              {yacht.name}
            </h3>
            <span className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--blue)' }}>
              {yacht.pricePerHour.toLocaleString('ru')} ₽/ч
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm mb-3" style={{ color: 'var(--muted)' }}>
            <span>👥 {yacht.capacity} чел.</span>
            {bookedDaysThisMonth > 0 && (
              <span>📅 {bookedDaysThisMonth} брони в месяце</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {yacht.features.slice(0, 3).map(f => (
              <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-black/5" style={{ color: 'var(--navy)' }}>
                {f}
              </span>
            ))}
            {yacht.features.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 text-gray-500">
                +{yacht.features.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
