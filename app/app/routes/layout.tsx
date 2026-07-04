import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Маршруты прогулок на яхте из Ялты по Крыму',
  description: 'Лучшие маршруты на яхте из Ялты: Ласточкино Гнездо, Форосская церковь, Балаклава, Мыс Айя. Дневные и ночные прогулки по Крыму от 3 до 8 часов.',
  alternates: { canonical: 'https://glissa.ru/routes' },
  openGraph: {
    title: 'Маршруты на яхте по Крыму из Ялты | Glissa',
    description: 'Ласточкино Гнездо, Балаклава, Мыс Айя, Форос. Дневные и ночные прогулки от 3 до 8 часов.',
    url: 'https://glissa.ru/routes',
    siteName: 'Glissa',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/yachts/natatores/03-sunset.jpg', alt: 'Морские прогулки на яхте по Крыму' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Маршруты на яхте по Крыму из Ялты | Glissa',
    description: 'Ласточкино Гнездо, Балаклава, Мыс Айя. Прогулки от 3 до 8 часов.',
    images: ['/yachts/natatores/03-sunset.jpg'],
  },
};

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
