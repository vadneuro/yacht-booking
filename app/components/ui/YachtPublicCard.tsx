'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Yacht } from '@/lib/data';

interface Props {
  yacht: Yacht;
  index?: number;
}

export default function YachtPublicCard({ yacht, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/yacht/${yacht.id}`} className="group block">
        <div className="rounded-2xl overflow-hidden bg-white border border-black/[0.04] hover-lift card-shine">
          {/* Image */}
          <div className="relative aspect-[16/11] overflow-hidden bg-[#051d35]">
            <img
              src={yacht.photos[0]}
              alt={yacht.name}
              className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{ objectPosition: yacht.thumbnailPosition ?? 'center' }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Type badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[var(--navy)] shadow-sm">
                {yacht.type === 'sailing' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M2 12l10-10 10 10"/></svg>
                )}
                {yacht.type === 'motor' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/><polygon points="12 15 17 21 7 21 12 15"/></svg>
                )}
                {yacht.typeLabel}
              </span>
            </div>

            {/* Quick info on hover */}
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <div className="flex items-center gap-2">
                {yacht.features.slice(0, 3).map(f => (
                  <span key={f} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[var(--navy)]">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-bold text-lg text-[var(--navy)] group-hover:text-[var(--azure)] transition-colors">
                  {yacht.name}
                </h3>
                <p className="text-sm text-[var(--muted)] mt-0.5 line-clamp-1">
                  {yacht.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-black/[0.05]">
              <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  до {yacht.capacity}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  от 2 ч
                </span>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-[var(--navy)]">
                  {yacht.pricePerHour.toLocaleString('ru')} <span className="text-sm font-medium text-[var(--muted)]">₽/ч</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
