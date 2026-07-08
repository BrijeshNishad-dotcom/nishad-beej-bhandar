import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nishadbeejbhandar.com';

  // Fetch all seeds, fertilizers, pesticides, and categories to generate dynamic sitemap links
  const [seeds, fertilizers, pesticides, categories] = await Promise.all([
    prisma.seed.findMany({ select: { id: true, updatedAt: true } }),
    prisma.fertilizer.findMany({ select: { id: true, updatedAt: true } }),
    prisma.pesticide.findMany({ select: { id: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  const productUrls = [
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

  const categoryUrls = categories.map((c) => ({
    url: `${baseUrl}/products?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
