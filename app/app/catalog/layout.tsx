import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Каталог яхт в Ялте - аренда моторных и парусных яхт 2026',
  description: 'Каталог яхт и катамаранов для аренды в Ялте. Моторные, парусные яхты и катамараны от 8 000 руб/час. Опытные капитаны, мгновенное бронирование. Крым 2026.',
  alternates: { canonical: 'https://glissa.ru/catalog' },
  openGraph: {
    title: 'Каталог яхт в Ялте 2026 | Glissa',
    description: 'Каталог яхт и катамаранов для аренды в Ялте. От 8 000 руб/час. Мгновенное бронирование.',
    url: 'https://glissa.ru/catalog',
    siteName: 'Glissa',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/yachts/manunu/01-exterior.jpg', alt: 'Каталог яхт для аренды в Ялте' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Каталог яхт в Ялте 2026 | Glissa',
    description: 'Каталог яхт и катамаранов для аренды в Ялте. От 8 000 руб/час.',
    images: ['/yachts/manunu/01-exterior.jpg'],
  },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
