import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import ProductsClient from '@/components/ProductsClient';

export const revalidate = 0; // Force dynamic rendering for fresh settings/products

export async function generateMetadata(): Promise<Metadata> {
  const settingsList = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach(s => {
    settings[s.key] = s.value;
  });

  const shopName = settings.shopName || "Nishad Beej Bhandar";

  return {
    title: `कृषि उत्पाद सूची - बीज, खाद और कीटनाशक दवाइयाँ | ${shopName}`,
    description: 'हमारे यहाँ उपलब्ध उच्च गुणवत्ता वाले धान, गेहूं, मक्का, सरसों व सब्जी के उन्नत हाइब्रिड बीज, रासायनिक और जैविक खाद, एवं ब्रांडेड कंपनियों की कीटनाशक दवाइयाँ देखें।',
    alternates: {
      canonical: '/products',
    },
    openGraph: {
      title: `कृषि उत्पाद सूची - बीज, खाद और कीटनाशक दवाइयाँ | ${shopName}`,
      description: 'उन्नत हाइब्रिड बीज, रासायनिक व जैविक खाद, और रोग सुरक्षा के लिए उत्तम कीटनाशक दवाइयाँ। उचित सरकारी रेट पर उपलब्ध हैं।',
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
    company: s.company,
    price: s.price,
    discountPrice: s.discountPrice,
    stock: s.stock,
    imageUrl: s.imageUrl,
    type: 'seed',
    categoryName: s.category.name,
    categorySlug: s.category.slug,
    variety: s.variety,
  }));

  const formattedFertilizers = fertilizers.map(f => ({
    id: f.id,
    name: f.name,
    company: f.company,
    price: f.price,
    discountPrice: f.discountPrice,
    stock: f.stock,
    imageUrl: f.imageUrl,
    type: 'fertilizer',
    categoryName: f.category.name,
    categorySlug: f.category.slug,
    weight: f.weight,
  }));

  const formattedPesticides = pesticides.map(p => ({
    id: p.id,
    name: p.name,
    company: p.company,
    price: p.price,
    discountPrice: p.discountPrice,
    stock: p.stock,
    imageUrl: p.imageUrl,
    type: 'pesticide',
    categoryName: p.category.name,
    categorySlug: p.category.slug,
    targetDisease: p.targetDisease,
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
