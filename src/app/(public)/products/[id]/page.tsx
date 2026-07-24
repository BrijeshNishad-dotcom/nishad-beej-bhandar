import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import ProductDetailClient from '@/components/ProductDetailClient';
import { cookies } from 'next/headers';
import { getTranslationServer } from '@/lib/translationServer';

export const revalidate = 0; // Force dynamic rendering for fresh settings/products

type PageParams = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata(props: PageParams): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'hi';
  const { t, tField, tCategory } = await getTranslationServer(language);

  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const type = searchParams.type;

  const shopName = t('shopName');

  const productId = parseInt(id, 10);
  if (isNaN(productId) || !type || !['seed', 'fertilizer', 'pesticide'].includes(type)) {
    return {
      title: language === 'en' ? `Agricultural Product Details | ${shopName}` : `कृषि उत्पाद विवरण | ${shopName}`,
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
      title: language === 'en' ? `Product Not Found | ${shopName}` : `उत्पाद नहीं मिला | ${shopName}`,
    };
  }

  const productName = tField(product, 'name');
  const categoryName = tCategory(product.category);

  const title = `${productName} - ${product.company} (${categoryName}) | ${shopName}`;
  const description = language === 'en'
    ? `${productName} - ${product.description || ''}. Manufacturer: ${product.company}. Available at ${shopName} at a reasonable price.`
    : `${productName} - ${product.description || ''}. निर्माता: ${product.company}. ${shopName} पर उचित रेट पर उपलब्ध है।`;
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
