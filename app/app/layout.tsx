import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://glissa.ru'),
  title: {
    default: 'Аренда яхт в Ялте 2026 | Glissa - прогулки на яхте по Крыму',
    template: '%s | Glissa',
  },
  description: 'Аренда яхт в Ялте 2026. Моторные и парусные яхты, катамараны от 8 000 руб/час. Опытные капитаны, удобное онлайн-бронирование. Прогулки по Крыму.',
  keywords: 'аренда яхт, яхта в аренду, яхтенная прогулка, прокат яхт, Ялта, Крым',
  alternates: { canonical: 'https://glissa.ru' },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
  openGraph: {
    title: 'Аренда яхт в Ялте 2026 | Glissa',
    description: 'Аренда яхт в Ялте 2026. Моторные и парусные яхты, катамараны от 8 000 руб/час. Опытные капитаны.',
    url: 'https://glissa.ru',
    siteName: 'Glissa',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/yachts/palassa/01-exterior.jpg', alt: 'Аренда яхт в Ялте - Glissa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Аренда яхт в Ялте 2026 | Glissa',
    description: 'Аренда яхт в Ялте. Моторные, парусные яхты и катамараны. Опытные капитаны.',
    images: ['/yachts/palassa/01-exterior.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`h-full ${inter.className}`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
