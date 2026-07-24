'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, ArrowRight, MessageSquare, Facebook, Youtube, Lock } from 'lucide-react';
import { useAppTranslation } from '@/lib/translation';
import { useSession, signOut } from 'next-auth/react';

export default function Footer() {
  const { t } = useAppTranslation();
  const currentYear = new Date().getFullYear();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = mounted && status === 'authenticated' && session?.user;

  const quickLinks = [
    { name: t('navbar.home'), href: '/' },
    { name: t('footer.aboutUs'), href: '/#about' },
    { name: t('navbar.cropGuide'), href: '/#crop-guide' },
    { name: t('footer.photoGallery'), href: '/#gallery' },
    { name: t('footer.contactUs'), href: '/#contact' },
  ];

  const categoriesList = [
    { name: `🌾 ${t('navbar.seeds')}`, href: '/products?category=paddy-seeds' },
    { name: `💧 ${t('navbar.fertilizers')}`, href: '/products?category=urea' },
    { name: `🐛 ${t('navbar.pesticides')}`, href: '/products?category=pesticides' },
  ];

  return (
    <footer className="bg-agri-dark text-gray-300 pt-16 pb-8 border-t-4 border-agri-yellow-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-sm">
                <Image
                  src={t('logoPath')}
                  alt={`${t('logo.subtitle')} Logo`}
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-bold text-white leading-none">
                {t('shopName')}
                </span>
              </div>
            </Link>
            <p className="font-sans text-sm text-gray-400 leading-relaxed">
              {t('aboutText')}
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href={`https://wa.me/91${t('whatsappNumber')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-agri-green-900/50 hover:bg-agri-green-800 flex items-center justify-center text-green-400 hover:text-white transition-colors"
                title="WhatsApp"
                aria-label="WhatsApp Contact"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
              <a
                href={`tel:${t('mobileNumber')}`}
                className="w-9 h-9 rounded-full bg-agri-green-900/50 hover:bg-agri-green-800 flex items-center justify-center text-agri-yellow-500 hover:text-white transition-colors"
                title="Call"
                aria-label="Call Phone Number"
              >
                <Phone className="h-5 w-5" />
              </a>
              <a
                href={t('facebookUrl')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-agri-green-900/50 hover:bg-agri-green-800 flex items-center justify-center text-blue-400 hover:text-white transition-colors"
                title="Facebook"
                aria-label="Facebook Page"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={t('youtubeUrl')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-agri-green-900/50 hover:bg-agri-green-800 flex items-center justify-center text-red-500 hover:text-white transition-colors"
                title="YouTube"
                aria-label="YouTube Channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-display text-white text-base font-bold mb-5 flex items-center">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-agri-yellow-500 hover:underline transition-colors flex items-center space-x-1.5"
                  >
                    <ArrowRight className="h-3 w-3 text-agri-green-500" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="font-display text-white text-base font-bold mb-5 flex items-center">
              {t('footer.productCategories')}
            </h3>
            <ul className="space-y-3 text-sm">
              {categoriesList.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="hover:text-agri-yellow-500 hover:underline transition-colors flex items-center space-x-1"
                  >
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="font-display text-white text-base font-bold mb-5">
              {t('footer.contactInfo')}
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-agri-yellow-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="block text-white font-bold">
                    {t('shopName')}
                  </strong>
                  {t('address')}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-agri-yellow-500 shrink-0" />
                <div>
                  <a href={`tel:${t('mobileNumber')}`} className="hover:text-white text-gray-300 font-bold block">
                    {t('mobileNumber')}
                  </a>
                  <span className="text-xs">
                    {t('footer.ownerLabel', 'Owner:')} {t('ownerName')}
                  </span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-agri-yellow-500 shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">
                  {t('businessHours')}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {currentYear} {t('shopName')}. {t('footer.allRightsReservedText', 'All Rights Reserved.')}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-xs">
              {t('footer.guidanceByLabel', 'Expert Guidance by')} {t('ownerName')}
            </span>
            {isAdmin ? (
              <div className="flex items-center space-x-4">
                <Link href="/admin/dashboard" className="hover:text-white underline text-xs text-agri-yellow-500 font-semibold transition-colors">
                  {t('footer.adminDashboard')}
                </Link>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem('admin_session_active');
                    }
                    signOut({ callbackUrl: '/' });
                  }}
                  className="hover:text-red-300 underline text-xs text-red-400 font-semibold transition-colors cursor-pointer"
                >
                  {t('footer.logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="inline-flex items-center space-x-1 text-gray-300 hover:text-white font-medium underline decoration-gray-600 hover:decoration-gray-400 text-xs transition-colors duration-200 group"
              >
                <Lock className="h-3 w-3 text-gray-400 group-hover:text-gray-200 transition-colors duration-200" />
                <span>{t('footer.adminLogin')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
