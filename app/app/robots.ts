import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/captain/'] },
    sitemap: 'https://arenda-yaht-yalta.ru/sitemap.xml',
  };
}
