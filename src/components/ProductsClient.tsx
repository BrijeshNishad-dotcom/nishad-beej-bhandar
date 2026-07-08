'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MessageSquare, Eye, Search, Leaf, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useSettings } from '@/components/SettingsProvider';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

interface Product {
  id: number;
  name: string;
  company: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  imageUrl: string | null;
  type: string;
  categoryName: string;
  categorySlug: string;
  variety?: string | null;
  weight?: string | null;
  targetDisease?: string | null;
}

interface ProductsClientProps {
  categories: Category[];
  products: Product[];
  selectedCategory?: string;
  searchQuery?: string;
}

export default function ProductsClient({
  categories,
  products,
  selectedCategory,
  searchQuery,
}: ProductsClientProps) {
  const settings = useSettings();
  const { t } = useTranslation();
  const router = useRouter();
  const [searchVal, setSearchVal] = useState(searchQuery || '');

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    if (searchVal.trim()) {
      params.set('search', searchVal.trim());
    }
    router.push(`/products?${params.toString()}`);
  };

  const breadcrumbItems = [{ label: t('breadcrumbs.products') }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Page Header */}
      <div className="text-center md:text-left md:flex md:items-center md:justify-between border-b border-gray-100 pb-6 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-agri-dark">
            {t('productsPage.title')}
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            {t('productsPage.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-4 md:mt-0 flex w-full md:w-80 relative">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder={t('productsPage.search')}
            aria-label="Search catalog products"
            className="w-full bg-white border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 shadow-sm"
          />
          <button type="submit" className="absolute right-2 top-2 text-gray-400 hover:text-agri-green-800 cursor-pointer">
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Categories Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
            <h2 className="font-display font-bold text-sm text-agri-dark uppercase tracking-wider mb-4 flex items-center">
              <Leaf className="h-4.5 w-4.5 text-agri-green-850 mr-1.5" />
              <span>{t('productsPage.categoriesLabel')}</span>
            </h2>
            
            <div className="space-y-1.5 flex flex-col font-sans text-sm">
              <Link
                href="/products"
                className={`px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  !selectedCategory 
                    ? 'bg-agri-green-800 text-white font-bold' 
                    : 'text-gray-600 hover:bg-agri-green-50 hover:text-agri-green-800'
                }`}
              >
                {t('productsPage.allProducts')}
              </Link>
              
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`}
                  className={`px-3 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug 
                      ? 'bg-agri-green-800 text-white font-bold' 
                      : 'text-gray-600 hover:bg-agri-green-50 hover:text-agri-green-800'
                  }`}
                >
                  <span>{cat.icon} {getTranslatedCategoryName(cat.slug, cat.name)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
              <AlertCircle className="h-12 w-12 text-agri-yellow-600 mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-agri-dark mb-1">
                {t('productsPage.noProductsFound')}
              </h3>
              <p className="font-sans text-sm text-gray-500 max-w-sm mx-auto">
                {t('productsPage.noProductsDesc')}
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Link href="/products" className="bg-agri-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  {t('productsPage.browseAll')}
                </Link>
                <a href={`tel:${settings.mobileNumber}`} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold">
                  {t('productsPage.callStore', 'कॉल करें: 6387634500').replace('6387634500', settings.mobileNumber)}
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => {
                const discountPercent = prod.discountPrice 
                  ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)
                  : 0;

                let subText = prod.company;
                if (prod.type === 'seed') {
                  subText = prod.variety ? `${t('productsPage.variety')}${prod.variety}` : prod.company;
                } else if (prod.type === 'fertilizer') {
                  subText = prod.weight ? `${t('productsPage.packaging')}${prod.weight}` : prod.company;
                } else if (prod.type === 'pesticide') {
                  subText = prod.targetDisease ? `${t('productsPage.diseaseControl')}${prod.targetDisease}` : prod.company;
                }

                const whatsappMsg = encodeURIComponent(
                  t('productWhatsappQuery', 'नमस्ते, मुझे {{name}} ({{details}}) के बारे में जानकारी चाहिए।')
                    .replace('{{name}}', prod.name)
                    .replace('{{details}}', subText)
                );
                const whatsappUrl = `https://wa.me/91${settings.whatsappNumber}?text=${whatsappMsg}`;

                return (
                  <div 
                    key={`${prod.type}-${prod.id}`}
                    className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                  >
                    {/* Product Image and Discount Badge */}
                    <div className="relative h-48 bg-gray-50 border-b border-gray-100 overflow-hidden flex flex-col items-center justify-center text-gray-400 select-none w-full">
                      {prod.imageUrl ? (
                        <Image
                          src={prod.imageUrl}
                          alt={`${prod.name} - ${prod.company}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center space-y-1">
                          <span className="font-display font-semibold text-xs sm:text-sm text-gray-400">No Image Available</span>
                          <span className="font-sans text-[10px] text-gray-300">चित्र उपलब्ध नहीं है</span>
                        </div>
                      )}
                      {discountPercent > 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold font-sans px-2.5 py-1 rounded-md z-10">
                          {discountPercent}% {t('productsPage.discountBadge')}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 bg-agri-green-900/80 text-white text-[10px] font-bold font-sans px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
                        {getTranslatedCategoryName(prod.categorySlug, prod.categoryName)}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-sans block mb-1">
                          {prod.company}
                        </span>
                        <h3 className="font-display font-bold text-sm sm:text-base text-agri-dark line-clamp-2 min-h-[44px]">
                          {prod.name}
                        </h3>
                        <p className="font-sans text-xs text-gray-500 mt-2 italic">
                          {subText}
                        </p>
                      </div>

                      {/* Pricing and Stock Status */}
                      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                        <div>
                          {prod.discountPrice ? (
                            <div className="font-sans">
                              <span className="text-agri-green-800 text-base sm:text-lg font-bold">
                                ₹{prod.discountPrice}
                              </span>
                              <span className="text-gray-400 text-xs line-through ml-1.5">
                                ₹{prod.price}
                              </span>
                            </div>
                          ) : (
                            <span className="font-sans text-agri-green-800 text-base sm:text-lg font-bold">
                              ₹{prod.price}
                            </span>
                          )}
                        </div>

                        {/* Stock status */}
                        <div>
                          {prod.stock > 10 ? (
                            <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                              {t('productsPage.inStock')}
                            </span>
                          ) : prod.stock > 0 ? (
                            <span className="bg-yellow-50 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-200 animate-pulse">
                              {t('productsPage.stock')} {prod.stock}
                            </span>
                          ) : (
                            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                              {t('productsPage.outOfStock')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="px-5 pb-5 pt-1 grid grid-cols-2 gap-2 text-center text-xs font-sans font-bold">
                      <Link
                        href={`/products/${prod.id}?type=${prod.type}`}
                        className="bg-gray-100 hover:bg-gray-200 text-agri-dark py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>{t('productsPage.viewDetails')}</span>
                      </Link>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <MessageSquare className="h-4 w-4 fill-current" />
                        <span>{t('productsPage.enquireWhatsApp')}</span>
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
