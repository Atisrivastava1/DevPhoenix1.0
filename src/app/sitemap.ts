import { MetadataRoute } from 'next';
import { blogsService, programsService } from "@/services/mongodb/db.service";
import { hasMongoConfig } from "@/services/mongodb/client";

const BASE_URL = 'https://devphoenix.tech';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let programs = [];
  let blogs = [];
  if (hasMongoConfig) {
    try {
      programs = await programsService.getAll();
      blogs = await blogsService.getAll();
    } catch {}
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                  lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/programs`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/blog`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/about`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/mentors`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/showcase`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/community`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE_URL}/learning-paths`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const programPages: MetadataRoute.Sitemap = programs.map((p: any) => ({
    url: `${BASE_URL}/programs/${p.slug || p.id}`,
    lastModified: new Date(p.updated_at || p.created_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogs.map((post: any) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at || post.created_at || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...programPages, ...blogPages];
}
