'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sprout, ShieldCheck, Award, ThumbsUp, Users, CheckCircle, 
  MapPin, Phone, MessageSquare, Clock, Calendar, Star, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/components/SettingsProvider';

interface GalleryItem {
  id: number;
  imageUrl: string;
  title: string;
  description?: string | null;
}

interface HomeCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

interface HomeClientProps {
  galleryItems?: GalleryItem[];
  categories: HomeCategory[];
}

export default function HomeClient({ galleryItems = [], categories }: HomeClientProps) {
  const settings = useSettings();
  const { t } = useTranslation();

  const getInitials = (name: string) => {
    if (!name) return 'AN';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return 'AN';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const renderHeroTitle = () => {
    const title = settings.heroTitle || 'अच्छे बीज, अच्छी फसल की शुरुआत';
    const parts = title.split(',');
    if (parts.length > 1) {
      return (
        <>
          {parts[0].trim()},{' '}
          <br />
          <span className="text-agri-yellow-500">{parts.slice(1).join(',').trim()}</span>
        </>
      );
    }
    const words = title.split(' ');
    if (words.length > 3) {
      const mid = Math.ceil(words.length / 2);
      return (
        <>
          {words.slice(0, mid).join(' ')}{' '}
          <br />
          <span className="text-agri-yellow-500">{words.slice(mid).join(' ')}</span>
        </>
      );
    }
    return <span className="text-agri-yellow-500">{title}</span>;
  };

  const [activeTab, setActiveTab] = useState<'kharif' | 'rabi' | 'zaid'>('kharif');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    village: '',
    cropName: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Trigger visitor tracking on mount
  useEffect(() => {
    fetch('/api/visitor', { method: 'POST' }).catch((err) => console.error('Visitor log failed:', err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.village || !formData.message) {
      alert(t('enquiry.error'));
      return;
    }

    setSubmitStatus('submitting');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', mobile: '', village: '', cropName: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    }
  };

  const getTranslatedCategoryName = (slug: string, defaultName: string) => {
    const keyMap: { [key: string]: string } = {
      'paddy-seeds': 'categories.paddy',
      'wheat-seeds': 'categories.wheat',
      'maize-seeds': 'categories.maize',
      'vegetable-seeds': 'categories.vegetable',
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
      'fruit-seeds': 'categories.fruit',
    };
    const key = keyMap[slug];
    return key ? t(key) : defaultName;
  };

  const getCategoryCountText = (slug: string, count: number) => {
    if (slug.includes('seeds')) {
      return count > 0 
        ? `${count} ${t('categories.varieties')}` 
        : `10+ ${t('categories.varieties')}`;
    }
    if (slug === 'fertilizers') {
      return count > 0 
        ? `${count} ${t('categories.brands')}` 
        : `12+ ${t('categories.brands')}`;
    }
    return count > 0 
      ? `${count} ${t('categories.products')}` 
      : `15+ ${t('categories.products')}`;
  };

  const features = [
    { title: t('features.f1_title'), desc: t('features.f1_desc'), icon: Award },
    { title: t('features.f2_title'), desc: t('features.f2_desc'), icon: ShieldCheck },
    { title: t('features.f3_title'), desc: t('features.f3_desc'), icon: Sprout },
    { title: t('features.f4_title'), desc: t('features.f4_desc'), icon: Users },
    { title: t('features.f5_title'), desc: t('features.f5_desc'), icon: ThumbsUp },
    { title: t('features.f6_title'), desc: t('features.f6_desc'), icon: CheckCircle },
  ];

  const cropAdvisory = {
    kharif: {
      title: t('cropGuide.kharif_title'),
      time: t('cropGuide.kharif_time'),
      seeds: t('cropGuide.kharif_seeds'),
      fertilizer: t('cropGuide.kharif_fertilizer'),
      tips: t('cropGuide.kharif_tips')
    },
    rabi: {
      title: t('cropGuide.rabi_title'),
      time: t('cropGuide.rabi_time'),
      seeds: t('cropGuide.rabi_seeds'),
      fertilizer: t('cropGuide.rabi_fertilizer'),
      tips: t('cropGuide.rabi_tips')
    },
    zaid: {
      title: t('cropGuide.zaid_title'),
      time: t('cropGuide.zaid_time'),
      seeds: t('cropGuide.zaid_seeds'),
      fertilizer: t('cropGuide.zaid_fertilizer'),
      tips: t('cropGuide.zaid_tips')
    }
  };

  const reviews = [
    { name: t('reviews.r1_name'), village: t('reviews.r1_village'), comment: t('reviews.r1_comment'), rating: 5 },
    { name: t('reviews.r2_name'), village: t('reviews.r2_village'), comment: t('reviews.r2_comment'), rating: 5 },
    { name: t('reviews.r3_name'), village: t('reviews.r3_village'), comment: t('reviews.r3_comment'), rating: 5 }
  ];

  // Fallback default gallery images if database is empty
  const defaultGalleryImages = [
    { title: 'Paddy Crops', url: '/uploads/paddy-crop.jpg' },
    { title: 'Tomato Field', url: '/uploads/tomato-field.jpg' },
    { title: 'Fertilizers Bags', url: '/uploads/fertilizer-bags.png' },
    { title: 'Wheat Field', url: '/uploads/wheat-field.jpg' },
    { title: 'Seeds Stock', url: '/uploads/seeds-stock.jpg' },
    { title: 'Shop Front', url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80' }
  ];

  const displayGallery = galleryItems.length > 0 
    ? galleryItems.map(item => ({ title: item.title, url: item.imageUrl }))
    : defaultGalleryImages;

  // Search for updated shop front image from database
  const shopFrontItem = galleryItems.find(
    (item) => item.title === 'Nishad Beej Bhandar Shop Front'
  );
  const shopFrontImageUrl = shopFrontItem?.imageUrl || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-black overflow-hidden pt-12">
        {/* Background Image with agricultural field overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80" 
            alt="Indian agricultural green field at Nishad Beej Bhandar seed store"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-agri-dark via-agri-dark/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-agri-green-900/60 border border-agri-green-500/30 px-3 py-1.5 rounded-full text-agri-yellow-100 text-xs sm:text-sm font-semibold"
              >
                <Sprout className="h-4 w-4 text-agri-yellow-500 animate-pulse" />
                <span>{t('hero.guarantee')}</span>
              </motion.div>

              {/* Mobile-only: shop name shown here since navbar hides it on small screens */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="sm:hidden font-display text-sm font-bold text-agri-yellow-400 tracking-wide uppercase"
              >
                {settings.shopName}
              </motion.p>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
              >
                {renderHeroTitle()}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-sans text-base sm:text-lg text-gray-200 max-w-xl leading-relaxed"
              >
                {settings.heroSubtitle}
              </motion.p>

              {/* Owner Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 max-w-sm"
              >
                <div className="w-10 h-10 rounded-full bg-agri-yellow-500 flex items-center justify-center font-display font-bold text-agri-dark text-sm">
                  {getInitials(settings.ownerName)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{settings.ownerName}</h4>
                  <p className="text-xs text-agri-yellow-500 font-semibold">{t('hero.ownerTitle')}</p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link
                  href="/products"
                  className="bg-agri-green-700 hover:bg-agri-green-800 text-white font-sans font-bold px-6 py-3.5 rounded-lg text-sm sm:text-base transition-colors shadow-lg shadow-agri-green-950/20 flex items-center space-x-2"
                >
                  <span>{t('hero.viewProducts')}</span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <a
                  href="#contact"
                  className="bg-white hover:bg-gray-100 text-agri-dark font-sans font-bold px-6 py-3.5 rounded-lg text-sm sm:text-base transition-colors shadow-md flex items-center space-x-1.5"
                >
                  <span>{t('hero.contact')}</span>
                </a>
                <a
                  href={`https://wa.me/91${settings.whatsappNumber}?text=${encodeURIComponent(t('whatsappMessage'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-sans font-bold px-6 py-3.5 rounded-lg text-sm sm:text-base transition-colors shadow-md flex items-center space-x-1.5"
                >
                  <MessageSquare className="h-5 w-5 fill-current" />
                  <span>{t('hero.whatsapp')}</span>
                </a>
              </motion.div>
            </div>

            {/* Right Side Visual */}
            <div className="hidden lg:block lg:col-span-5 relative h-[500px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 rounded-2xl overflow-hidden border-4 border-agri-yellow-500/40 shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                  alt="Quality seed bags and agricultural products at Nishad Beej Bhandar store"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-sm bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <span className="text-agri-yellow-500 font-bold block mb-1">{t('hero.farmerCardTitle')}</span>
                  {t('hero.farmerCardText')}
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="py-12 bg-white relative z-20 -mt-8 rounded-t-3xl border-t border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-agri-green-50/50 border border-agri-green-100/50 transition-all hover:bg-agri-green-50 shadow-sm">
                  <div className="w-12 h-12 bg-agri-green-800 text-agri-yellow-500 rounded-full flex items-center justify-center mb-3">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-xs sm:text-sm text-agri-dark mb-1 leading-tight">
                    {feat.title}
                  </h3>
                  <p className="font-sans text-[10px] sm:text-xs text-gray-500 leading-snug">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Product Categories Section */}
      <section id="categories" className="py-16 bg-[#f7faf4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-extrabold text-agri-dark">
              {t('categories.title')}
            </h2>
            <div className="h-1.5 w-24 bg-agri-yellow-500 mx-auto mt-3 rounded-full" />
            <p className="font-sans text-sm sm:text-base text-gray-600 mt-4">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 text-center hover:shadow-md transition-all group"
              >
                <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-agri-dark">
                  {getTranslatedCategoryName(cat.slug, cat.name)}
                </h3>
                <span className="text-xs text-gray-400 block mt-1">{getCategoryCountText(cat.slug, cat.count)}</span>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="inline-flex items-center space-x-1 mt-4 text-xs font-bold text-agri-green-800 hover:text-agri-yellow-600"
                >
                  <span>{t('categories.browse')}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. About Owner Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image Column */}
            <div className="lg:col-span-5 relative h-[450px]">
              <div className="absolute inset-0 bg-agri-yellow-500 rounded-3xl rotate-3 scale-95" />
              <div className="absolute inset-0 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src={shopFrontImageUrl}
                  alt="Shop owner Abhay Nishad (B.Sc Ag) at Nishad Beej Bhandar"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* Right Text Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="font-sans font-bold text-agri-green-800 text-sm uppercase tracking-wider block">
                {t('about.label')}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-agri-dark">
                {settings.ownerName}
              </h2>
              <div className="h-1.5 w-20 bg-agri-yellow-500 rounded-full" />
              
              <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                {settings.aboutText}
              </p>

              {/* Owner Certifications */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-agri-green-700 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-agri-dark">{t('about.bullet1')}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-agri-green-700 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-agri-dark">{t('about.bullet2')}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-agri-green-700 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-agri-dark">{t('about.bullet3')}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-agri-green-700 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-agri-dark">{t('about.bullet4')}</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="#contact"
                  className="inline-flex items-center space-x-2 bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold px-6 py-3 rounded-lg text-sm transition-colors"
                >
                  <span>{t('about.button')}</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Farmer Benefits Section */}
      <section className="py-16 bg-agri-green-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-agri-yellow-500 font-bold block mb-1">
              {t('benefits.label')}
            </span>
            <h2 className="font-display text-3xl font-extrabold">
              {t('benefits.title')}
            </h2>
            <div className="h-1.5 w-16 bg-agri-yellow-500 mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: t('benefits.b1_title'), desc: t('benefits.b1_desc') },
              { title: t('benefits.b2_title'), desc: t('benefits.b2_desc') },
              { title: t('benefits.b3_title'), desc: t('benefits.b3_desc') },
              { title: t('benefits.b4_title'), desc: t('benefits.b4_desc') },
              { title: t('benefits.b5_title'), desc: t('benefits.b5_desc') },
              { title: t('benefits.b6_title'), desc: t('benefits.b6_desc') }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-agri-yellow-500 text-agri-dark flex items-center justify-center font-bold text-base mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-display text-lg font-bold text-agri-yellow-500 mb-2">
                  {benefit.title}
                </h3>
                <p className="font-sans text-sm text-gray-300 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Crop Advisory Section */}
      <section id="crop-guide" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-agri-green-800 font-bold block mb-1">
              {t('cropGuide.label')}
            </span>
            <h2 className="font-display text-3xl font-extrabold text-agri-dark">
              {t('cropGuide.title')}
            </h2>
            <div className="h-1.5 w-24 bg-agri-yellow-500 mx-auto mt-3 rounded-full" />
            <p className="font-sans text-sm text-gray-500 mt-4">
              {t('cropGuide.subtitle')}
            </p>
          </div>

          {/* Tabs header */}
          <div className="flex justify-center space-x-4 mb-10 border-b border-gray-100 pb-2">
            {(['kharif', 'rabi', 'zaid'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-display font-bold text-sm sm:text-base border-b-4 transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'border-agri-green-800 text-agri-green-800 bg-agri-green-50/50' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'kharif' ? t('cropGuide.tabKharif') : tab === 'rabi' ? t('cropGuide.tabRabi') : t('cropGuide.tabZaid')}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#fcfdfe] border border-gray-150 rounded-2xl p-8 max-w-4xl mx-auto shadow-sm"
          >
            <h3 className="font-display text-xl font-bold text-agri-green-900 flex items-center mb-6">
              <Calendar className="h-5 w-5 text-agri-yellow-500 mr-2 shrink-0" />
              <span>{cropAdvisory[activeTab].title}</span>
            </h3>
            
            <div className="space-y-6 text-sm sm:text-base font-sans">
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-agri-yellow-500">
                <span className="font-bold text-agri-dark block mb-1">{t('cropGuide.timeLabel')}</span>
                <p className="text-gray-600">{cropAdvisory[activeTab].time}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-agri-green-800">
                <span className="font-bold text-agri-dark block mb-1">{t('cropGuide.seedsLabel')}</span>
                <p className="text-gray-600">{cropAdvisory[activeTab].seeds}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <span className="font-bold text-agri-dark block mb-1">{t('cropGuide.fertilizerLabel')}</span>
                <p className="text-gray-600">{cropAdvisory[activeTab].fertilizer}</p>
              </div>

              <div className="p-4 bg-red-50/50 rounded-lg border-l-4 border-red-500">
                <span className="font-bold text-red-950 block mb-1">{t('cropGuide.pestLabel')}</span>
                <p className="text-red-900">{cropAdvisory[activeTab].tips}</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-agri-green-800 hover:text-agri-yellow-600"
              >
                <span>{t('cropGuide.actionLink')}</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 7. Image Gallery Section */}
      <section id="gallery" className="py-16 bg-[#f7faf4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-extrabold text-agri-dark">
              {t('gallery.title')}
            </h2>
            <div className="h-1.5 w-24 bg-agri-yellow-500 mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {displayGallery.map((img, idx) => (
              <div 
                key={idx} 
                className="relative h-[250px] rounded-2xl overflow-hidden shadow-sm group border border-white"
              >
                <Image
                  src={img.url}
                  alt={`${img.title} - Agriculture Field and Stock at Nishad Beej Bhandar`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4" />
                <span className="absolute bottom-4 left-4 text-white text-xs font-bold font-sans bg-agri-green-900/80 px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-agri-green-800 font-bold block mb-1">
              {t('reviews.label')}
            </span>
            <h2 className="font-display text-3xl font-extrabold text-agri-dark">
              {t('reviews.title')}
            </h2>
            <div className="h-1.5 w-20 bg-agri-yellow-500 mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 relative flex flex-col justify-between">
                <div>
                  <div className="flex space-x-1 text-agri-yellow-500 mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="font-sans text-sm text-gray-600 italic leading-relaxed mb-6">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 border-t border-gray-200 pt-4">
                  <div className="w-10 h-10 rounded-full bg-agri-green-800 text-white flex items-center justify-center font-display font-bold text-sm">
                    {rev.name[0]}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-agri-dark">{rev.name}</h4>
                    <span className="font-sans text-xs text-gray-400 flex items-center">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1 shrink-0" />
                      <span>{t('reviews.villagePrefix')} {rev.village}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. Contact Section */}
      <section id="contact" className="py-20 bg-[#f7faf4] relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Contact Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-sans font-bold text-agri-green-800 text-sm uppercase tracking-wider block">
                {t('contact.label')}
              </span>
              <h2 className="font-display text-3xl font-extrabold text-agri-dark">
                {t('contact.title')}
              </h2>
              <div className="h-1.5 w-16 bg-agri-yellow-500 rounded-full mb-6" />

              <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed">
                {t('contact.desc')}
              </p>

              {/* Owner and Details */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="bg-agri-green-800/10 p-2.5 rounded-lg text-agri-green-800 shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase font-sans">{t('contact.specialistLabel')}</h4>
                    <p className="text-sm sm:text-base font-bold text-agri-dark">{settings.ownerName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="bg-agri-green-800/10 p-2.5 rounded-lg text-agri-green-800 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase font-sans">{t('contact.callLabel')}</h4>
                    <a href={`tel:${settings.mobileNumber}`} className="text-sm sm:text-base font-bold text-agri-dark hover:underline hover:text-agri-green-800">
                      {settings.mobileNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="bg-agri-green-800/10 p-2.5 rounded-lg text-agri-green-800 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase font-sans">{t('contact.addressLabel')}</h4>
                    <p className="text-xs sm:text-sm font-semibold text-agri-dark">
                      {settings.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="bg-agri-green-800/10 p-2.5 rounded-lg text-agri-green-800 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase font-sans">{t('contact.hoursLabel')}</h4>
                    <p className="text-sm font-semibold text-agri-dark">{settings.businessHours}</p>
                  </div>
                </div>
              </div>

              {/* Instant Call & WhatsApp Large Buttons */}
              <div className="flex gap-4 pt-4">
                <a
                  href={`tel:${settings.mobileNumber}`}
                  className="flex-1 flex items-center justify-center space-x-2 bg-agri-yellow-500 hover:bg-agri-yellow-600 text-agri-dark font-sans font-bold py-3.5 px-4 rounded-xl shadow-md text-center transition-all"
                >
                  <Phone className="h-5 w-5 shrink-0" />
                  <span>{t('contact.callBtn')}</span>
                </a>
                <a
                  href={`https://wa.me/91${settings.whatsappNumber}?text=${encodeURIComponent(t('whatsappMessage'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-sans font-bold py-3.5 px-4 rounded-xl shadow-md text-center transition-all"
                >
                  <MessageSquare className="h-5 w-5 shrink-0 fill-current" />
                  <span>{t('contact.whatsappBtn')}</span>
                </a>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-gray-150 shadow-sm">
              <h3 className="font-display text-xl font-bold text-agri-dark mb-2">
                {t('enquiry.title')}
              </h3>
              <p className="font-sans text-xs text-gray-500 mb-6">
                {t('enquiry.subtitle')}
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form-name" className="block text-xs font-bold text-gray-700 mb-1.5">{t('enquiry.farmerName')}</label>
                    <input
                      id="form-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder={t('enquiry.farmerNamePlaceholder')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-mobile" className="block text-xs font-bold text-gray-700 mb-1.5">{t('enquiry.mobileNumber')}</label>
                    <input
                      id="form-mobile"
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{10}"
                      placeholder={t('enquiry.mobileNumberPlaceholder')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form-village" className="block text-xs font-bold text-gray-700 mb-1.5">{t('enquiry.village')}</label>
                    <input
                      id="form-village"
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleInputChange}
                      required
                      placeholder={t('enquiry.villagePlaceholder')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-cropName" className="block text-xs font-bold text-gray-700 mb-1.5">{t('enquiry.cropName')}</label>
                    <input
                      id="form-cropName"
                      type="text"
                      name="cropName"
                      value={formData.cropName}
                      onChange={handleInputChange}
                      placeholder={t('enquiry.cropNamePlaceholder')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="form-message" className="block text-xs font-bold text-gray-700 mb-1.5">{t('enquiry.message')}</label>
                  <textarea
                    id="form-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder={t('enquiry.messagePlaceholder')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 resize-none"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-xl text-sm font-semibold flex items-center space-x-2 animate-fade-in">
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <span>{t('enquiry.success', 'अभय निषाद').replace('अभय निषाद', settings.ownerName).replace('Abhay Nishad', settings.ownerName)}</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 text-red-800 border border-red-200 p-3 rounded-lg text-sm font-semibold">
                    {t('enquiry.error')}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitStatus === 'submitting'}
                  className="w-full bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold py-3.5 rounded-lg transition-colors text-sm shadow-md flex items-center justify-center space-x-1.5 cursor-pointer disabled:bg-gray-400"
                >
                  {submitStatus === 'submitting' ? t('enquiry.submitting') : t('enquiry.submit')}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
