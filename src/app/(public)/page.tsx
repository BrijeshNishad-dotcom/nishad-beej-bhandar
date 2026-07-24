import HomeClient from './HomeClient';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { getTranslationServer } from '@/lib/translationServer';

export const revalidate = 0; // Disable cache so changes reflect immediately

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'hi';
  const { t } = await getTranslationServer(language);

  const shopName = t('shopName');
  const heroTitle = t('heroTitle');
  const heroSubtitle = t('heroSubtitle');
  const ownerName = t('ownerName');

  const title = language === 'en' 
    ? `${shopName} - ${heroTitle} | Certified Agriculture Seeds & Fertilizers Store`
    : `${shopName} - ${heroTitle} | प्रमाणित कृषि बीज एवं उर्वरक भंडार`;

  const description = language === 'en' 
    ? `${heroSubtitle} Owner: ${ownerName}`
    : `${heroSubtitle} संचालक: ${ownerName}`;

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: 'https://nishadbeejbhandar.com',
      type: 'website',
    },
    twitter: {
      title,
      description,
    }
  };
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'hi';
  const { t } = await getTranslationServer(language);

  const shopName = t('shopName');
  const ownerName = t('ownerName');
  const mobileNumber = t('mobileNumber');
  const address = t('address');
  const businessHours = t('businessHours');
  const logoPath = t('logoPath');

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': shopName,
    'url': 'https://nishadbeejbhandar.com',
    'logo': `https://nishadbeejbhandar.com${logoPath}`,
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': `+91-${mobileNumber}`,
      'contactType': 'customer service',
      'areaServed': 'IN',
      'availableLanguage': ['Hindi', 'English']
    }
  };

  const businessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': shopName,
    'image': [
      `https://nishadbeejbhandar.com${logoPath}`
    ],
    'telephone': `+91-${mobileNumber}`,
    'priceRange': '$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': address,
      'addressLocality': language === 'en' ? 'Sultanpur' : 'सुल्तानपुर',
      'addressRegion': language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      'postalCode': '228001',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 26.2648,
      'longitude': 82.0727
    },
    'url': 'https://nishadbeejbhandar.com',
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      'opens': '07:00',
      'closes': '20:00'
    }
  };

  const faqJsonLd = language === 'en' ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Are all the seeds at your store certified according to government standards?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Yes, all seeds (such as Paddy, Wheat, Mustard, and vegetable seeds) available at ${shopName} are certified by the Agriculture Department and sealed by registered companies with a minimum guaranteed germination rate of 85%.`
        }
      },
      {
        '@type': 'Question',
        'name': 'Do you offer expert agricultural advice on crop diseases and fertilizers?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Yes, our owner ${ownerName} is a B.Sc Agriculture graduate, and he provides farmers with free scientific advice on crop protection, proper fertilizer schedules (NPK, DAP), and disease prevention at every stage from sowing to harvest.`
        }
      },
      {
        '@type': 'Question',
        'name': 'What is the address and opening hours of the store?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${shopName} is located at ${address}. The store remains open ${businessHours}.`
        }
      }
    ]
  } : {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'क्या आपके यहाँ सभी बीज सरकारी मानकों के अनुसार प्रमाणित हैं?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `हाँ, ${shopName} पर उपलब्ध सभी प्रकार के बीज (जैसे धान, गेहूं, सरसों व सब्जी के बीज) कृषि विभाग द्वारा प्रमाणित और रजिस्टर्ड कंपनियों द्वारा सील पैक्ड होते हैं जिनकी अंकुरण क्षमता (germination rate) न्यूनतम 85% की गारंटी होती है।`
        }
      },
      {
        '@type': 'Question',
        'name': 'क्या आपके यहाँ फसल रोगों और खाद के प्रयोग की वैज्ञानिक सलाह मिलती है?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `हाँ, हमारे संचालक ${ownerName} जी बी.एससी. एग्रीकल्चर (B.Sc Agriculture) स्नातक हैं और वह किसानों को बुवाई से लेकर कटाई तक के हर चरण पर फसलों की सुरक्षा, उर्वरक (NPK, DAP) छिड़काव के सही शेड्यूल और रोग निवारण के लिए बिल्कुल मुफ्त वैज्ञानिक सलाह प्रदान करते हैं।`
        }
      },
      {
        '@type': 'Question',
        'name': 'दुकान का पता और खुलने का समय क्या है?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${shopName} उत्तर प्रदेश में ${address} स्थित है। दुकान ${businessHours} खुली रहती है।`
        }
      }
    ]
  };

  // Fetch dynamic gallery items and categories from database
  let galleryItems: { id: number; imageUrl: string; title: string; description: string | null; createdAt: Date }[] = [];
  let categories: { id: number; name: string; nameEn: string | null; slug: string; icon: string; count: number }[] = [];
  try {
    galleryItems = await prisma.gallery.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Fetch categories dynamically with product counts
    const categoriesList = await prisma.category.findMany({
      include: {
        seeds: { select: { id: true } },
        fertilizers: { select: { id: true } },
        pesticides: { select: { id: true } },
      },
      orderBy: { name: 'asc' },
    });

    categories = categoriesList.map((cat: {
      id: number;
      name: string;
      nameEn: string | null;
      slug: string;
      icon: string | null;
      seeds: { id: number }[];
      fertilizers: { id: number }[];
      pesticides: { id: number }[];
    }) => {
      const totalProducts = cat.seeds.length + cat.fertilizers.length + cat.pesticides.length;
      return {
        id: cat.id,
        name: cat.name,
        nameEn: cat.nameEn || null,
        slug: cat.slug,
        icon: cat.icon || '🌱',
        count: totalProducts
      };
    });
  } catch {
    // DB unavailable — use empty defaults
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeClient galleryItems={galleryItems} categories={categories} />
    </>
  );
}
