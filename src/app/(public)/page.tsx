import HomeClient from './HomeClient';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';

export const revalidate = 0; // Disable cache so changes reflect immediately

export async function generateMetadata(): Promise<Metadata> {
  const settingsList = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach((s: { key: string; value: string }) => {
    settings[s.key] = s.value;
  });

  const shopName = settings.shopName || "Nishad Beej Bhandar";
  const heroTitle = settings.heroTitle || "अच्छे बीज, अच्छी फसल की शुरुआत";
  const heroSubtitle = settings.heroSubtitle || "धान, गेहूं, मक्का, सरसों, और सब्जियों के उन्नत बीज, सर्वोत्तम उर्वरक खाद एवं उच्च गुणवत्ता वाली कीटनाशक दवाइयाँ उचित सरकारी रेट पर उपलब्ध हैं।";
  const ownerName = settings.ownerName || "Abhay Nishad (B.Sc Agriculture)";

  return {
    title: `${shopName} - ${heroTitle} | Certified Agriculture Seeds & Fertilizers Store`,
    description: `${heroSubtitle} संचालक: ${ownerName}`,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `${shopName} - ${heroTitle}`,
      description: `${heroSubtitle} संचालक: ${ownerName}`,
      url: 'https://nishadbeejbhandar.com',
      type: 'website',
    },
    twitter: {
      title: `${shopName} - ${heroTitle}`,
      description: `${heroSubtitle} संचालक: ${ownerName}`,
    }
  };
}

export default async function HomePage() {
  const settingsList = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach((s: { key: string; value: string }) => {
    settings[s.key] = s.value;
  });

  const shopName = settings.shopName || "Nishad Beej Bhandar";
  const ownerName = settings.ownerName || "Abhay Nishad";
  const mobileNumber = settings.mobileNumber || "6387634500";
  const address = settings.address || "मुख्य बाजार मार्ग, कृषि कार्यालय के पास, उत्तर प्रदेश";
  const businessHours = settings.businessHours || "Monday - Sunday: 8:00 AM - 8:00 PM";

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': shopName,
    'url': 'https://nishadbeejbhandar.com',
    'logo': 'https://nishadbeejbhandar.com/android-chrome-512x512.png',
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
      'https://nishadbeejbhandar.com/android-chrome-512x512.png'
    ],
    'telephone': `+91-${mobileNumber}`,
    'priceRange': '$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': address,
      'addressLocality': 'Rampur',
      'addressRegion': 'Uttar Pradesh',
      'postalCode': '274204',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 26.8467,
      'longitude': 80.9462
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
      'opens': '08:00',
      'closes': '20:00'
    }
  };

  const faqJsonLd = {
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

  // Fetch dynamic gallery items from the database
  const galleryItems = await prisma.gallery.findMany({
    orderBy: { createdAt: 'asc' }, // Maintain creation order
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

  const categories = categoriesList.map((cat: {
    id: number;
    name: string;
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
      slug: cat.slug,
      icon: cat.icon || '🌱',
      count: totalProducts
    };
  });

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
