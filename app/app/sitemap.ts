import { MetadataRoute } from 'next';
import { getYachts } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://glissa.ru';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/catalog`, lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/routes`,  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const yachtPages: MetadataRoute.Sitemap = getYachts().map(yacht => ({
    url: `${base}/yacht/${yacht.slug ?? yacht.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...yachtPages];
}
