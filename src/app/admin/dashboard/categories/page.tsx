import { prisma } from '@/lib/db';
import CategoriesClient from './CategoriesClient';

export const revalidate = 0; // Disable cache so category updates reflect instantly

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <CategoriesClient initialCategories={categories} />
  );
}
