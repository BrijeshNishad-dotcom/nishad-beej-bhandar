import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getSettings } from '@/lib/settings';
import { DEFAULT_SETTINGS } from '@/components/SettingsProvider';
import ProductsClient from '@/components/ProductsClient';
import { cookies } from 'next/headers';

export const revalidate = 0; // Force dynamic rendering for fresh settings/products

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'hi';
  const isEn = language === 'en';

  const settings = await getSettings();

  const shopName = isEn ? (settings.shopNameEn || DEFAULT_SETTINGS.shopNameEn) : (settings.shopName || DEFAULT_SETTINGS.shopName);

  const title = isEn
    ? `Agricultural Products Catalog - Seeds, Fertilizers & Pesticides | ${shopName}`
    : `कृषि उत्पाद सूची - बीज, खाद और कीटनाशक दवाइयाँ | ${shopName}`;

  const description = isEn
    ? `Browse premium quality paddy, wheat, vegetable seeds, genuine fertilizers, and branded pesticides available at ${shopName} at reasonable prices.`
    : `हमारे यहाँ उपलब्ध उच्च गुणवत्ता वाले धान, गेहूं, मक्का, सरसों व सब्जी के उन्नत हाइब्रिड बीज, रासायनिक और जैविक खाद, एवं ब्रांडेड कंपनियों की कीटनाशक दवाइयाँ देखें।`;

  return {
    title,
    description,
    alternates: {
      canonical: '/products',
    },
    openGraph: {
      title,
      description,
      url: 'https://nishadbeejbhandar.com/products',
    }
  };
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ProductsPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const selectedCategory = searchParams.category as string | undefined;
  const searchQuery = searchParams.search as string | undefined;

  // 1. Fetch categories
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  // 2. Resolve category filter
  let categoryId: number | undefined;
  if (selectedCategory) {
    const matchedCategory = categories.find(c => c.slug === selectedCategory);
    if (matchedCategory) {
      categoryId = matchedCategory.id;
    }
  }

  // 3. Build database filter query
  const filter: any = {};
  if (categoryId) {
    filter.categoryId = categoryId;
  }
  if (searchQuery) {
    filter.name = { contains: searchQuery };
  }

  // 4. Fetch products from database
  const [seeds, fertilizers, pesticides] = await Promise.all([
    prisma.seed.findMany({
      where: filter,
      include: { category: true },
    }),
    prisma.fertilizer.findMany({
      where: filter,
      include: { category: true },
    }),
    prisma.pesticide.findMany({
      where: filter,
      include: { category: true },
    }),
  ]);

  // 5. Format and combine products with raw fields for client translation
  const formattedSeeds = seeds.map(s => ({
    id: s.id,
    name: s.name,
    nameEn: s.nameEn || null,
    company: s.company,
    price: s.price,
    discountPrice: s.discountPrice,
    stock: s.stock,
    imageUrl: s.imageUrl,
    type: 'seed',
    categoryName: s.category.name,
    categoryNameEn: s.category.nameEn || null,
    categorySlug: s.category.slug,
    variety: s.variety,
    varietyEn: s.varietyEn || null,
  }));

  const formattedFertilizers = fertilizers.map(f => ({
    id: f.id,
    name: f.name,
    nameEn: f.nameEn || null,
    company: f.company,
    price: f.price,
    discountPrice: f.discountPrice,
    stock: f.stock,
    imageUrl: f.imageUrl,
    type: 'fertilizer',
    categoryName: f.category.name,
    categoryNameEn: f.category.nameEn || null,
    categorySlug: f.category.slug,
    weight: f.weight,
  }));

  const formattedPesticides = pesticides.map(p => ({
    id: p.id,
    name: p.name,
    nameEn: p.nameEn || null,
    company: p.company,
    price: p.price,
    discountPrice: p.discountPrice,
    stock: p.stock,
    imageUrl: p.imageUrl,
    type: 'pesticide',
    categoryName: p.category.name,
    categoryNameEn: p.category.nameEn || null,
    categorySlug: p.category.slug,
    targetDisease: p.targetDisease,
    targetDiseaseEn: p.targetDiseaseEn || null,
  }));

  const products = [...formattedSeeds, ...formattedFertilizers, ...formattedPesticides];

  return (
    <ProductsClient
      categories={categories}
      products={products}
      selectedCategory={selectedCategory}
      searchQuery={searchQuery}
    />
  );
}
