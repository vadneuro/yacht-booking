import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { getYachtBySlug } from '@/lib/data';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const yacht = getYachtBySlug(id);

  if (!yacht) {
    return { title: 'Яхта не найдена' };
  }

  const slug = yacht.slug ?? id;
  const price = yacht.pricePerHour.toLocaleString('ru');
  const desc = yacht.description.length > 130
    ? yacht.description.slice(0, 127) + '...'
    : yacht.description;

  const title = `Аренда яхты ${yacht.name} в Ялте - ${price} руб/час`;
  const description = `${desc} Забронируйте прогулку на яхте ${yacht.name} в Ялте онлайн.`;
  const canonicalUrl = `https://glissa.ru/yacht/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Glissa',
      locale: 'ru_RU',
      type: 'website',
      images: [{
        url: yacht.photos[0],
        alt: `Яхта ${yacht.name} - аренда в Ялте`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [yacht.photos[0]],
    },
  };
}

export default async function YachtLayout({ params, children }: Props) {
  const { id } = await params;
  const yacht = getYachtBySlug(id);

  if (yacht?.slug && id !== yacht.slug) {
    permanentRedirect(`/yacht/${yacht.slug}`);
  }

  return <>{children}</>;
}
