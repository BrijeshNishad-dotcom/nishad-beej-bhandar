import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import ProductDetailClient from '@/components/ProductDetailClient';

export const revalidate = 0; // Force dynamic rendering for fresh settings/products

type PageParams = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata(props: PageParams): Promise<Metadata> {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const type = searchParams.type;

  // Fetch settings dynamically
  const settingsList = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach(s => {
    settings[s.key] = s.value;
  });
  const shopName = settings.shopName || "Nishad Beej Bhandar";

  const productId = parseInt(id, 10);
  if (isNaN(productId) || !type || !['seed', 'fertilizer', 'pesticide'].includes(type)) {
    return {
      title: `कृषि उत्पाद विवरण | ${shopName}`,
    };
  }

  let product: any = null;
  if (type === 'seed') {
    product = await prisma.seed.findUnique({
      where: { id: productId },
      include: { category: true },
    });
  } else if (type === 'fertilizer') {
    product = await prisma.fertilizer.findUnique({
      where: { id: productId },
      include: { category: true },
    });
  } else {
    product = await prisma.pesticide.findUnique({
      where: { id: productId },
      include: { category: true },
    });
  }

  if (!product) {
    return {
      title: `उत्पाद नहीं मिला | ${shopName}`,
    };
  }

  const categoryName = product.category?.name || 'कृषि उत्पाद';
  const title = `${product.name} - ${product.company} (${categoryName}) | ${shopName}`;
  const description = `${product.name} - ${product.description || ''}. निर्माता: ${product.company}. ${shopName} पर उचित रेट पर उपलब्ध है।`;
  const canonicalUrl = `https://nishadbeejbhandar.com/products/${id}?type=${type}`;
  const imageUrl = product.imageUrl || 'https://nishadbeejbhandar.com/android-chrome-512x512.png';

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${id}?type=${type}`,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [{ url: imageUrl, alt: product.name }],
      type: 'website',
    },
    twitter: {
      title,
      description,
      images: [imageUrl],
    }
  };
}

export default async function ProductDetailPage(props: PageParams) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const type = searchParams.type;

  const productId = parseInt(id, 10);
  if (isNaN(productId) || !type || !['seed', 'fertilizer', 'pesticide'].includes(type)) {
    notFound();
  }

  let product: any = null;

  if (type === 'seed') {
    product = await prisma.seed.findUnique({
      where: { id: productId },
      include: { category: true },
    });
  } else if (type === 'fertilizer') {
    product = await prisma.fertilizer.findUnique({
      where: { id: productId },
      include: { category: true },
    });
  } else {
    product = await prisma.pesticide.findUnique({
      where: { id: productId },
      include: { category: true },
    });
  }

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailClient
      product={product}
      type={type}
    />
  );
}
