import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://arenda-yaht-yalta.ru';
  const yachtIds = ['mariya', 'poseidon', 'briz', 'afina'];

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...yachtIds.map(id => ({
      url: `${base}/yachts/${id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
