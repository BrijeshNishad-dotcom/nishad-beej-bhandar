'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Phone, ArrowLeft, ShieldCheck, HelpCircle, Check, Award, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useSettings } from '@/components/SettingsProvider';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  variety?: string | null;
  company: string;
  cropType?: string | null;
  description: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  imageUrl: string | null;
  germination?: number | null;
  seedRate?: string | null;
  maturityDuration?: string | null;
  yield?: string | null;
  benefits?: string | null;
  usageInstructions?: string | null;
  dosage?: string | null;
  category: Category;
  weight?: string | null;
  targetDisease?: string | null;
  pesticideType?: string | null;
  activeIngredient?: string | null;
  formulation?: string | null;
  targetCrop?: string | null;
  applicationMethod?: string | null;
  waitingPeriod?: string | null;
  toxicityClass?: string | null;
  safetyPrecautions?: string | null;
  packSize?: string | null;
  manufacturingCompany?: string | null;
  registrationNumber?: string | null;
  storageInstructions?: string | null;
}

interface ProductDetailClientProps {
  product: Product;
  type: string;
}

export default function ProductDetailClient({ product, type }: ProductDetailClientProps) {
  const settings = useSettings();
  const { t } = useTranslation();

  const getTranslatedCategoryName = (slug: string, defaultName: string) => {
    const keyMap: { [key: string]: string } = {
      'paddy-seeds': 'categories.paddy',
      'wheat-seeds': 'categories.wheat',
      'maize-seeds': 'categories.maize',
      'vegetable-seeds': 'categories.vegetable',
      'fruit-seeds': 'categories.fruit',
      'mustard-seeds': 'categories.mustard',
      'pulse-seeds': 'categories.pulse',
      'fertilizers': 'categories.fertilizers',
      'urea': 'categories.urea',
      'dap': 'categories.dap',
      'muriate-of-potash-mop': 'categories.mop',
      'single-super-phosphate-ssp': 'categories.ssp',
      'npk-fertilizers': 'categories.npk',
      'zinc-sulphate': 'categories.zinc',
      'gypsum': 'categories.gypsum',
      'farmyard-manure-fym': 'categories.fym',
      'vermicompost': 'categories.vermicompost',
      'pesticides': 'categories.pesticides',
      'plant-growth-promoters': 'categories.growthPromoters',
    };
    const key = keyMap[slug];
    return key ? t(key) : defaultName;
  };

  const isSeed = type === 'seed';
  const isFertilizer = type === 'fertilizer';
  const isPesticide = type === 'pesticide';

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentDetails = isSeed 
    ? (product.variety ? `${t('productDetails.variety')}: ${product.variety}` : product.company)
    : isFertilizer
      ? `${t('productDetails.packaging')}: ${product.weight || ''}`
      : `${t('productDetails.diseaseControl')}: ${product.targetDisease || ''}`;

  const whatsappMsg = encodeURIComponent(
    t('productWhatsappQuery', 'नमस्ते अभय जी, मुझे आपके दुकान पर उपलब्ध "{{name}}" के बारे में अधिक जानकारी चाहिए और मैं इसे खरीदना चाहता हूँ।')
      .replace('{{name}}', product.name)
      .replace('{{details}}', currentDetails)
  );
  const whatsappUrl = `https://wa.me/91${settings.whatsappNumber}?text=${whatsappMsg}`;

  const breadcrumbItems = [
    { label: t('breadcrumbs.products'), href: '/products' },
    { label: product.name }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-agri-green-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t('productDetails.backToCatalog')}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm">
        
        {/* Left Column: Image and Badges */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative h-[300px] sm:h-[400px] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-150 flex flex-col items-center justify-center text-gray-400 select-none">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={`${product.name} - ${product.company}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                <span className="font-display font-bold text-sm sm:text-base text-gray-400">No Image Available</span>
                <span className="font-sans text-xs text-gray-300">इस उत्पाद का चित्र उपलब्ध नहीं है</span>
              </div>
            )}
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold font-sans px-3 py-1 rounded-md shadow-md z-10">
                {discountPercent}% {t('productDetails.discountBadge')}
              </span>
            )}
          </div>

          {/* Core Trust Badges */}
          <div className="grid grid-cols-3 gap-3 text-center text-[10px] sm:text-xs font-sans font-semibold text-gray-500">
            <div className="bg-agri-green-50/50 p-3 rounded-xl border border-agri-green-100/50 flex flex-col items-center">
              <Award className="h-5 w-5 text-agri-green-800 mb-1" />
              <span>{t('productDetails.genuine')}</span>
            </div>
            <div className="bg-agri-green-50/50 p-3 rounded-xl border border-agri-green-100/50 flex flex-col items-center">
              <Sprout className="h-5 w-5 text-agri-green-800 mb-1" />
              <span>{t('productDetails.germination')}</span>
            </div>
            <div className="bg-agri-green-50/50 p-3 rounded-xl border border-agri-green-100/50 flex flex-col items-center">
              <ShieldCheck className="h-5 w-5 text-agri-green-800 mb-1" />
              <span>{t('productDetails.sealed')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications and Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Company and Category Header */}
          <div className="flex items-center space-x-2">
            <span className="bg-agri-green-800 text-white text-xs font-bold font-sans px-2.5 py-0.5 rounded-full">
              {getTranslatedCategoryName(product.category.slug, product.category.name)}
            </span>
            <span className="text-sm text-gray-400 font-sans">
              {t('productDetails.manufacturer')}{product.company}
            </span>
          </div>

          {/* Product Title */}
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-agri-dark">
              {product.name}
            </h1>
            {isSeed && product.variety && (
              <p className="font-sans text-sm font-semibold text-agri-yellow-700 mt-1">
                {t('productDetails.variety')}: {product.variety}
              </p>
            )}
            {isFertilizer && product.weight && (
              <p className="font-sans text-sm font-semibold text-agri-yellow-700 mt-1">
                {t('productDetails.packaging')}: {product.weight}
              </p>
            )}
            {isPesticide && product.targetDisease && (
              <p className="font-sans text-sm font-semibold text-red-600 mt-1">
                {t('productDetails.diseaseControl')}: {product.targetDisease}
              </p>
            )}
          </div>

          {/* Pricing and Stock Status */}
          <div className="flex items-center justify-between border-y border-gray-100 py-4">
            <div>
              <span className="text-xs text-gray-400 font-sans block mb-1">{t('productDetails.price')}</span>
              {product.discountPrice ? (
                <div className="flex items-baseline space-x-2">
                  <span className="text-agri-green-800 text-2xl sm:text-3xl font-extrabold font-sans">
                    ₹{product.discountPrice}
                  </span>
                  <span className="text-gray-400 text-sm line-through font-sans">
                    {t('productDetails.originalPrice')}₹{product.price}
                  </span>
                </div>
              ) : (
                <span className="text-agri-green-800 text-2xl sm:text-3xl font-extrabold font-sans">
                  ₹{product.price}
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 font-sans block mb-1">{t('productDetails.stock')}</span>
              {product.stock > 10 ? (
                <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 inline-block">
                  {t('productDetails.inStock')}
                </span>
              ) : product.stock > 0 ? (
                <span className="bg-yellow-50 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200 inline-block animate-pulse">
                  {t('productsPage.stock')} {product.stock}
                </span>
              ) : (
                <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200 inline-block">
                  {t('productDetails.outOfStock')}
                </span>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <h3 className="font-display text-sm uppercase tracking-wider text-agri-dark font-bold">
              {t('productDetails.description')}
            </h3>
            <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed">
              {product.description || t('productDetails.noDescFallback', 'इस उत्पाद के लिए कोई अतिरिक्त विवरण उपलब्ध नहीं है। अधिक जानकारी के लिए सीधे संपर्क करें।')}
            </p>
          </div>

          {/* Seed Technical Specifications Grid */}
          {isSeed && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-agri-dark font-bold border-b border-gray-200 pb-2">
                {t('productDetails.technicalSpecs', 'तकनीकी विशिष्टता')}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
                {product.cropType && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">{t('productDetails.cropSeason', 'फसल का मौसम:')}</span>
                    <span className="font-bold text-agri-dark">{product.cropType}</span>
                  </div>
                )}
                {product.germination && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">{t('productDetails.germinationPercent', 'अंकुरण प्रतिशत:')}</span>
                    <span className="font-bold text-agri-green-800">{t('productDetails.minGermination', 'न्यूनतम')} {product.germination}%</span>
                  </div>
                )}
                {product.seedRate && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">{t('productDetails.seedRatePerAcre', 'बीज दर (प्रति एकड़):')}</span>
                    <span className="font-bold text-agri-dark">{product.seedRate}</span>
                  </div>
                )}
                {product.maturityDuration && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">{t('productDetails.maturityDurationLabel', 'तैयार होने की अवधि:')}</span>
                    <span className="font-bold text-agri-dark">{product.maturityDuration}</span>
                  </div>
                )}
                {product.yield && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">{t('productDetails.averageYield', 'औसत पैदावार:')}</span>
                    <span className="font-bold text-agri-green-900">{product.yield}</span>
                  </div>
                )}
              </div>

              {/* Seed Extra Fields */}
              {product.benefits && (
                <div className="pt-2 text-sm">
                  <span className="font-bold text-agri-dark block mb-1">{t('productDetails.cropBenefits', 'फसल के मुख्य लाभ:')}</span>
                  <div className="flex flex-wrap gap-2">
                    {product.benefits.split(',').map((b: string, i: number) => (
                      <span key={i} className="bg-agri-green-50 text-agri-green-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-agri-green-100 flex items-center">
                        <Check className="h-3.5 w-3.5 mr-1" />
                        <span>{b.trim()}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.usageInstructions && (
                <div className="pt-2 text-sm">
                  <span className="font-bold text-agri-dark block mb-1">{t('productDetails.usageInstructions', 'बुवाई के निर्देश:')}</span>
                  <p className="text-gray-500 text-xs leading-relaxed">{product.usageInstructions}</p>
                </div>
              )}

              {product.dosage && (
                <div className="pt-2 text-sm">
                  <span className="font-bold text-agri-dark block mb-1">{t('productDetails.seedDosage', 'बीज उपचार / खुराक:')}</span>
                  <p className="text-gray-500 text-xs leading-relaxed">{product.dosage}</p>
                </div>
              )}
            </div>
          )}

          {/* Pesticide Technical Specifications Grid */}
          {isPesticide && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-150 space-y-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-agri-dark font-bold border-b border-gray-200 pb-2">
                {t('productDetails.pesticideSpecs', 'तकनीकी विशिष्टता (Technical Specifications)')}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
                {product.pesticideType && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">प्रकार (Type):</span>
                    <span className="font-bold text-agri-dark">{product.pesticideType}</span>
                  </div>
                )}
                {product.activeIngredient && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">सक्रिय तत्व (Active Ingredient):</span>
                    <span className="font-bold text-agri-dark">{product.activeIngredient}</span>
                  </div>
                )}
                {product.formulation && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">फॉर्मूलेशन (Formulation):</span>
                    <span className="font-bold text-agri-dark">{product.formulation}</span>
                  </div>
                )}
                {product.targetCrop && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">लक्षित फसल (Target Crop):</span>
                    <span className="font-bold text-agri-dark">{product.targetCrop}</span>
                  </div>
                )}
                {product.targetDisease && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">लक्षित कीट/रोग (Target Pest/Disease):</span>
                    <span className="font-bold text-red-600">{product.targetDisease}</span>
                  </div>
                )}
                {product.dosage && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">खुराक (Dosage):</span>
                    <span className="font-bold text-agri-dark">{product.dosage}</span>
                  </div>
                )}
                {product.applicationMethod && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">छिड़काव विधि (Method):</span>
                    <span className="font-bold text-agri-dark">{product.applicationMethod}</span>
                  </div>
                )}
                {product.waitingPeriod && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">प्रतीक्षा अवधि (PHI):</span>
                    <span className="font-bold text-agri-dark">{product.waitingPeriod}</span>
                  </div>
                )}
                {product.toxicityClass && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">विषाक्तता वर्ग (Toxicity):</span>
                    <span className="font-bold text-agri-dark">{product.toxicityClass}</span>
                  </div>
                )}
                {product.packSize && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2">
                    <span className="text-gray-500">पैकिंग (Pack Size):</span>
                    <span className="font-bold text-agri-dark">{product.packSize}</span>
                  </div>
                )}
                {product.registrationNumber && (
                  <div className="flex justify-between border-b border-gray-200/50 pb-2 col-span-1 sm:col-span-2">
                    <span className="text-gray-500">पंजीकरण संख्या (Reg No):</span>
                    <span className="font-bold text-agri-dark">{product.registrationNumber}</span>
                  </div>
                )}
              </div>

              {product.safetyPrecautions && (
                <div className="pt-2 text-sm">
                  <span className="font-bold text-red-600 block mb-1">सुरक्षा सावधानियां (Safety Precautions):</span>
                  <p className="text-gray-500 text-xs leading-relaxed">{product.safetyPrecautions}</p>
                </div>
              )}

              {product.storageInstructions && (
                <div className="pt-2 text-sm">
                  <span className="font-bold text-agri-dark block mb-1">भंडारण निर्देश (Storage Instructions):</span>
                  <p className="text-gray-500 text-xs leading-relaxed">{product.storageInstructions}</p>
                </div>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-sans font-bold py-3.5 rounded-xl shadow-md text-center transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <MessageSquare className="h-5 w-5 fill-current shrink-0" />
              <span>{t('productDetails.whatsappBtn')}</span>
            </a>

            <a
              href={`tel:${settings.mobileNumber}`}
              className="flex-1 bg-agri-yellow-500 hover:bg-agri-yellow-600 text-agri-dark font-sans font-bold py-3.5 rounded-xl shadow-md text-center transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Phone className="h-4.5 w-4.5 shrink-0" />
              <span>{t('productDetails.callBtn')}</span>
            </a>
          </div>

          {/* Expert Note */}
          <div className="bg-agri-green-50/30 rounded-xl p-4 border border-agri-green-100/30 text-xs sm:text-sm text-gray-500 flex items-start space-x-2.5">
            <HelpCircle className="h-5 w-5 text-agri-green-800 shrink-0 mt-0.5" />
            <p className="leading-normal">
              <strong>{t('productDetails.expertAdviceNoteLabel', 'कृषि सलाह नोट:')}</strong> {t('productDetails.expertAdviceNoteText', 'बीजों की बुवाई के समय मिट्टी की नमी और तापमान का विशेष ध्यान रखें। किसी भी प्रकार की बीमारी के लक्षण दिखने पर संचालक अभय निषाद (B.Sc Ag) को कॉल करें।').replace('अभय निषाद (B.Sc Ag)', settings.ownerName).replace('Abhay Nishad', settings.ownerName)}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
