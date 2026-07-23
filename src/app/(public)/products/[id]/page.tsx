import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import ProductDetailClient from '@/components/ProductDetailClient';
import { cookies } from 'next/headers';

export const revalidate = 0; // Force dynamic rendering for fresh settings/products

type PageParams = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata(props: PageParams): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'hi';
  const isEn = language === 'en';

  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const type = searchParams.type;

  // Fetch settings dynamically
  const settingsList = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach((s: { key: string; value: string }) => {
    settings[s.key] = s.value;
  });
  const shopName = isEn ? (settings.shopNameEn || "Nishad Beej Bhandar") : (settings.shopName || "निषाद बीज भंडार");

  const productId = parseInt(id, 10);
  if (isNaN(productId) || !type || !['seed', 'fertilizer', 'pesticide'].includes(type)) {
    return {
      title: isEn ? `Agricultural Product Details | ${shopName}` : `कृषि उत्पाद विवरण | ${shopName}`,
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
      title: isEn ? `Product Not Found | ${shopName}` : `उत्पाद नहीं मिला | ${shopName}`,
    };
  }

  // Translate category fallback
  const getTranslatedCat = (slug: string, defName: string) => {
    if (isEn) {
      const enMap: Record<string, string> = {
        'paddy-seeds': 'Paddy',
        'wheat-seeds': 'Wheat',
        'maize-seeds': 'Maize',
        'vegetable-seeds': 'Vegetables',
        'fruit-seeds': 'Fruits',
        'mustard-seeds': 'Mustard',
        'pulse-seeds': 'Pulses',
        'onion-seeds': 'Onion',
        'tomato-seeds': 'Tomato',
        'cucumber-seeds': 'Cucumber',
        'carrot-seeds': 'Carrot',
        'millet-seeds': 'Millet',
        'fodder-seeds': 'Fodder',
        'fertilizers': 'Fertilizers',
        'urea': 'Urea',
        'dap': 'DAP',
        'muriate-of-potash-mop': 'MOP',
        'single-super-phosphate-ssp': 'SSP',
        'npk-fertilizers': 'NPK',
        'zinc-sulphate': 'Zinc',
        'gypsum': 'Gypsum',
        'farmyard-manure-fym': 'FYM',
        'vermicompost': 'Vermicompost',
        'pesticides': 'Pesticides',
        'plant-growth-promoters': 'Growth Promoters',
      };
      return enMap[slug] || defName;
    } else {
      const hiMap: Record<string, string> = {
        'paddy-seeds': 'धान (Paddy)',
        'wheat-seeds': 'गेहूँ (Wheat)',
        'maize-seeds': 'मक्का (Maize)',
        'vegetable-seeds': 'सब्जियां (Vegetables)',
        'fruit-seeds': 'फल (Fruits)',
        'mustard-seeds': 'सरसों (Mustard)',
        'pulse-seeds': 'दलहन (Pulses)',
        'onion-seeds': 'प्याज़ (Onion)',
        'tomato-seeds': 'टमाटर (Tomato)',
        'cucumber-seeds': 'खीरा (Cucumber)',
        'carrot-seeds': 'गाजर (Carrot)',
        'millet-seeds': 'बाजरा (Millet)',
        'fodder-seeds': 'चारा (Fodder)',
        'fertilizers': 'उर्वरक (Fertilizers)',
        'urea': 'यूरिया (Urea)',
        'dap': 'डीएपी (DAP)',
        'muriate-of-potash-mop': 'पोटाश (MOP)',
        'single-super-phosphate-ssp': 'एसएसपी (SSP)',
        'npk-fertilizers': 'एनपीके (NPK)',
        'zinc-sulphate': 'जिंक (Zinc)',
        'gypsum': 'जिप्सम (Gypsum)',
        'farmyard-manure-fym': 'गोबर खाद (FYM)',
        'vermicompost': 'वर्मीकंपोस्ट (Vermicompost)',
        'pesticides': 'कीटनाशक (Pesticides)',
        'plant-growth-promoters': 'टॉनिक (Growth Promoters)',
      };
      return hiMap[slug] || defName;
    }
  };

  const categoryName = getTranslatedCat(product.category?.slug, product.category?.name || (isEn ? 'Products' : 'कृषि उत्पाद'));
  const title = `${product.name} - ${product.company} (${categoryName}) | ${shopName}`;
  const description = isEn
    ? `${product.name} - ${product.description || ''}. Manufacturer: ${product.company}. Available at ${shopName} at a reasonable price.`
    : `${product.name} - ${product.description || ''}. निर्माता: ${product.company}. ${shopName} पर उचित रेट पर उपलब्ध है।`;
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
