import { prisma } from '@/lib/db';
import ProductsClient from './ProductsClient';

export const revalidate = 0; // Disable cache so product updates reflect immediately

export default async function AdminProductsPage() {
  // 1. Fetch categories for forms
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  // 2. Fetch products from database
  const [seeds, fertilizers, pesticides] = await Promise.all([
    prisma.seed.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.fertilizer.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.pesticide.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // 3. Format and combine
  const formattedSeeds = seeds.map(s => ({
    ...s,
    type: 'seed' as const,
  }));

  const formattedFertilizers = fertilizers.map(f => ({
    ...f,
    type: 'fertilizer' as const,
  }));

  const formattedPesticides = pesticides.map(p => ({
    ...p,
    type: 'pesticide' as const,
  }));

  const allProducts = [...formattedSeeds, ...formattedFertilizers, ...formattedPesticides];

  return (
    <ProductsClient initialProducts={allProducts} categories={categories} />
  );
}
