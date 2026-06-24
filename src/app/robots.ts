import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin-login', '/api/'],
      },
    ],
    sitemap: 'https://devphoenix.tech/sitemap.xml',
    host: 'https://devphoenix.tech',
  };
}
