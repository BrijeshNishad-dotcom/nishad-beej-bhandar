import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

// Force dynamic so this is never prerendered at build time
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nishadbeejbhandar.com';

  // Static pages always included
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    // Fetch all dynamic URLs from DB at request time
    const [seeds, fertilizers, pesticides, categories] = await Promise.all([
      prisma.seed.findMany({ select: { id: true, updatedAt: true } }),
      prisma.fertilizer.findMany({ select: { id: true, updatedAt: true } }),
      prisma.pesticide.findMany({ select: { id: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true } }),
    ]);

    const productUrls: MetadataRoute.Sitemap = [
      ...seeds.map((s) => ({
        url: `${baseUrl}/products/${s.id}?type=seed`,
        lastModified: s.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...fertilizers.map((f) => ({
        url: `${baseUrl}/products/${f.id}?type=fertilizer`,
        lastModified: f.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...pesticides.map((p) => ({
        url: `${baseUrl}/products/${p.id}?type=pesticide`,
        lastModified: p.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ];

    const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/products?category=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticUrls, ...categoryUrls, ...productUrls];
  } catch {
    // If DB is unreachable, return only static URLs
    return staticUrls;
  }
}
