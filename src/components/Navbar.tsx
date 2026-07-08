'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, ShoppingBag, BookOpen, Phone, Search, ChevronDown, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/components/SettingsProvider';

// Premium WhatsApp SVG Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.419 9.86-9.86.001-2.636-1.026-5.115-2.89-6.982-1.866-1.866-4.349-2.891-6.987-2.893-5.44 0-9.862 4.418-9.866 9.861-.002 1.724.453 3.411 1.316 4.908l-.988 3.612 3.702-.971zm11.367-5.105c-.32-.16-1.89-.933-2.185-1.04-.294-.11-.51-.16-.723.16-.214.32-.83.104-1.018.32-.188.214-.376.242-.696.08-.32-.16-1.353-.499-2.577-1.59-1.03-.918-1.56-2.107-1.76-2.456-.2-.35-.02-.54.16-.7.162-.144.32-.38.48-.57.16-.19.213-.32.32-.533.11-.21.053-.4-.027-.56-.08-.16-.723-1.74-.993-2.39-.262-.64-.52-.55-.723-.56-.185-.008-.397-.01-.61-.01-.213 0-.56.08-.853.4-.293.32-1.12 1.1-1.12 2.68 0 1.58 1.147 3.11 1.307 3.32.16.213 2.257 3.45 5.47 4.83.763.327 1.36.52 1.824.667.767.244 1.466.21 2.018.128.614-.09 1.89-.77 2.156-1.48.267-.71.267-1.32.187-1.45-.08-.13-.294-.21-.613-.37z"/>
  </svg>
);

export default function Navbar() {
  const settings = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  
  // Mobile accordion states
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();



  // Change background & padding on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const productDropdownItems = [
    { name: t('navbar.seeds'), href: '/products?category=paddy-seeds' },
    { name: t('navbar.fertilizers'), href: '/products?category=urea' },
    { name: t('navbar.pesticides'), href: '/products?category=pesticides' },
  ];

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    
    if (href.startsWith('/#')) {
      const elementId = href.split('#')[1];
      if (pathname === '/') {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setIsOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-md py-2.5 border-b border-gray-150'
            : 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* 1. Logo (Left) */}
            <Link href="/" className="flex items-center space-x-2 group shrink-0">
              <div className="relative h-10 w-10 overflow-hidden transition-all duration-300 group-hover:scale-105 shadow-sm rounded-xl">
                <Image
                  src="/brand-logo.png"
                  alt={`${settings.shopName} Logo`}
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-base lg:text-lg font-extrabold text-agri-green-900 leading-none block">
                  {settings.shopName}
                </span>
                <span className="font-sans text-[10px] lg:text-xs text-agri-yellow-700 font-bold block mt-0.5">
                  {settings.ownerName}
                </span>
              </div>
            </Link>

            {/* 2. Search Bar (Center-Left) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs lg:max-w-md w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={t('navbar.searchPlaceholder')}
                  aria-label={t('navbar.searchPlaceholder')}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-full pl-10 pr-4 py-1.5 text-xs lg:text-sm font-sans focus:outline-none focus:bg-white focus:border-agri-green-800 focus:ring-2 focus:ring-agri-green-800/15 transition-all"
                />
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </form>

            {/* 3. Navigation Links (Center-Right) */}
            <nav className="hidden lg:flex items-center space-x-8 font-sans text-sm font-medium">
              
              {/* Home */}
              <Link
                href="/"
                className="relative py-1.5 flex items-center space-x-1.5 text-gray-600 hover:text-agri-green-800 transition-colors duration-200"
              >
                <Home className="h-4 w-4" />
                <span>{t('navbar.home')}</span>
                {pathname === '/' && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-agri-green-700 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              {/* Products Dropdown */}
              <div 
                className="relative py-1.5"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                <button
                  className={`flex items-center space-x-1 hover:text-agri-green-800 transition-colors duration-200 cursor-pointer ${
                    pathname.startsWith('/products') ? 'text-agri-green-800 font-bold' : 'text-gray-600'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{t('navbar.products')}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProductsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                    >
                      {productDropdownItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleLinkClick(item.href)}
                          className="w-full text-left px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-agri-green-50 hover:text-agri-green-900 transition-colors cursor-pointer"
                        >
                          {item.name}
                        </button>
                      ))}
                      <div className="border-t border-gray-50 my-1" />
                      <button
                        onClick={() => handleLinkClick('/products')}
                        className="w-full text-left px-4 py-2 text-xs lg:text-sm text-agri-green-800 hover:bg-agri-green-50 font-bold transition-colors cursor-pointer"
                      >
                        {t('navbar.allProductsMixed')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                {pathname.startsWith('/products') && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-agri-green-700 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </div>

              {/* Crop Guide */}
              <button
                onClick={() => handleLinkClick('/#crop-guide')}
                className="relative py-1.5 flex items-center space-x-1.5 text-gray-600 hover:text-agri-green-800 transition-colors duration-200 cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span>{t('navbar.cropGuide')}</span>
              </button>

              {/* Contact */}
              <button
                onClick={() => handleLinkClick('/#contact')}
                className="relative py-1.5 flex items-center space-x-1.5 text-gray-600 hover:text-agri-green-800 transition-colors duration-200 cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                <span>{t('navbar.contact')}</span>
              </button>

            </nav>

            {/* 4. Action Buttons (Right) */}
            <div className="flex items-center space-x-3 shrink-0">
              
              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/91${settings.whatsappNumber}?text=Hello%20${encodeURIComponent(settings.shopName)},%20I%20have%20an%20enquiry...`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-2 rounded-full shadow-sm hover:shadow transition-all hover:scale-105 active:scale-95 duration-200"
                title="Chat on WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4 lg:h-4.5 lg:w-4.5" />
              </a>

              {/* Call Store Button */}
              <a
                href={`tel:${settings.mobileNumber}`}
                className="flex items-center space-x-1.5 bg-agri-yellow-500 hover:bg-agri-yellow-600 text-agri-dark font-sans font-bold px-3.5 py-2 rounded-full text-xs lg:text-sm shadow-sm hover:shadow transition-all hover:scale-102 active:scale-95 duration-200"
              >
                <Phone className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                <span>{t('navbar.callStore')}</span>
              </a>



              {/* Language Switcher */}
              <div className="flex items-center space-x-1 bg-gray-50 hover:bg-gray-100/80 border border-gray-205 rounded-full px-3 py-1.5 transition-all text-xs font-sans shadow-xs font-semibold">
                <span className="text-gray-400 select-none mr-0.5">🌐</span>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    language === 'hi' ? 'text-agri-green-900 font-black' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  हिन्दी
                </button>
                <span className="text-gray-300 select-none mx-0.5">|</span>
                <button
                  onClick={() => setLanguage('en')}
                  className={`transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    language === 'en' ? 'text-agri-green-900 font-black' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  English
                </button>
              </div>

              {/* Hamburger Button (Mobile Only) */}
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 text-gray-700 hover:text-agri-green-800 border border-gray-150 hover:border-agri-green-800 rounded-full transition-all cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* 5. Mobile Drawer Menu (Slides in from Left) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Slide-In Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="absolute top-0 left-0 bottom-0 w-[290px] max-w-[85vw] bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
            >
              <div className="space-y-6">
                
                {/* Header of Drawer */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 group">
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-sm">
                      <Image
                        src="/brand-logo.png"
                        alt={`${settings.shopName} Logo`}
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-display text-sm font-extrabold text-agri-green-900 leading-none block">
                        {settings.shopName}
                      </span>
                      <span className="font-sans text-[9px] text-agri-yellow-700 font-bold block mt-0.5">
                        {settings.ownerName}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Search in Drawer */}
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder={t('navbar.searchPlaceholder')}
                    aria-label="Search seeds and products"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm font-sans focus:outline-none focus:bg-white focus:border-agri-green-800"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </form>

                {/* Links list */}
                <div className="space-y-1.5 font-sans text-base font-medium">
                  
                  {/* Home */}
                  <button
                    onClick={() => handleLinkClick('/')}
                    className="w-full flex items-center space-x-3 text-gray-700 hover:text-agri-green-800 hover:bg-agri-green-50/50 px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <Home className="h-5 w-5 text-gray-400" />
                    <span>{t('navbar.home')}</span>
                  </button>

                  {/* Products Dropdown Accordion */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                      className="w-full flex items-center justify-between text-gray-700 hover:text-agri-green-800 hover:bg-agri-green-50/50 px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <ShoppingBag className="h-5 w-5 text-gray-400" />
                        <span>{t('navbar.products')}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {mobileProductsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-11 pr-2 overflow-hidden space-y-1"
                        >
                          {productDropdownItems.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => handleLinkClick(item.href)}
                              className="w-full text-left py-2 text-sm text-gray-600 hover:text-agri-green-800 block cursor-pointer"
                            >
                              {item.name}
                            </button>
                          ))}
                          <button
                            onClick={() => handleLinkClick('/products')}
                            className="w-full text-left py-2 text-sm font-bold text-agri-green-800 block cursor-pointer"
                          >
                            {t('navbar.allProductsMixed')}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Crop Guide */}
                  <button
                    onClick={() => handleLinkClick('/#crop-guide')}
                    className="w-full flex items-center space-x-3 text-gray-700 hover:text-agri-green-800 hover:bg-agri-green-50/50 px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <BookOpen className="h-5 w-5 text-gray-400" />
                    <span>{t('navbar.cropGuide')}</span>
                  </button>

                  {/* Contact */}
                  <button
                    onClick={() => handleLinkClick('/#contact')}
                    className="w-full flex items-center space-x-3 text-gray-700 hover:text-agri-green-800 hover:bg-agri-green-50/50 px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{t('navbar.contact')}</span>
                  </button>

                  {/* Mobile Drawer Language Switcher */}
                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-xs font-bold text-gray-500 flex items-center space-x-1.5">
                      <span>🌐 Language / भाषा:</span>
                    </span>
                    <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold">
                      <button
                        onClick={() => setLanguage('hi')}
                        className={`transition-all cursor-pointer ${
                          language === 'hi' ? 'text-agri-green-850 font-extrabold' : 'text-gray-400'
                        }`}
                      >
                        हिन्दी
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => setLanguage('en')}
                        className={`transition-all cursor-pointer ${
                          language === 'en' ? 'text-agri-green-850 font-extrabold' : 'text-gray-400'
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </div>



                </div>

              </div>

              {/* Drawer Footer Call & WhatsApp Actions */}
              <div className="border-t border-gray-100 pt-6 mt-6 space-y-3 font-sans">
                <div className="flex gap-2.5">
                  <a
                    href={`https://wa.me/91${settings.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-xl shadow-sm text-sm font-bold transition-colors"
                  >
                    <WhatsAppIcon className="h-4.5 w-4.5" />
                    <span>{t('navbar.whatsapp')}</span>
                  </a>
                  <a
                    href={`tel:${settings.mobileNumber}`}
                    className="flex-1 flex items-center justify-center space-x-2 bg-agri-yellow-500 hover:bg-agri-yellow-600 text-agri-dark py-3 rounded-xl shadow-sm text-sm font-bold transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{t('navbar.callStore')}</span>
                  </a>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-400">© 2026 {settings.shopName}. {t('footer.allRightsReservedText', 'All Rights Reserved.')}</p>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
