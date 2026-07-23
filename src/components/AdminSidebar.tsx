'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, ShoppingBag, FolderOpen, MailOpen, 
  Image as ImageIcon, Settings, Globe
} from 'lucide-react';
import { useLocalizedSettings } from '@/components/SettingsProvider';
import AdminLogoutButton from '@/components/AdminLogoutButton';

export default function AdminSidebar() {
  const { t } = useTranslation();
  const settings = useLocalizedSettings();

  const menuItems = [
    { name: t('admin.overview', 'Overview'), href: '/admin/dashboard', icon: LayoutDashboard },
    { name: t('admin.products', 'Products'), href: '/admin/dashboard/products', icon: ShoppingBag },
    { name: t('admin.categories', 'Categories'), href: '/admin/dashboard/categories', icon: FolderOpen },
    { name: t('admin.enquiries', 'Enquiries'), href: '/admin/dashboard/enquiries', icon: MailOpen },
    { name: t('admin.gallery', 'Gallery & Banners'), href: '/admin/dashboard/gallery', icon: ImageIcon },
    { name: t('admin.settings', 'Settings'), href: '/admin/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-agri-dark text-white shrink-0 flex flex-col justify-between p-6">
      <div className="space-y-8">
        {/* Brand Logo */}
        <Link href="/admin/dashboard" className="flex items-center space-x-2.5">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-sm">
            <Image
              src={settings.logoPath}
              alt="Nishad Beej Bhandar Logo"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-display text-base font-bold block leading-none">
              {t('admin.title', 'Nishad Admin')}
            </span>
            <span className="text-[10px] text-agri-yellow-500 font-semibold block mt-1">
              {t('admin.subtitle', 'Agricultural Store Control Panel')}
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex flex-col space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Icon className="h-5 w-5 text-agri-yellow-500 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-gray-800 flex flex-col space-y-3 mt-6">
        <Link
          href="/"
          className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Globe className="h-4.5 w-4.5 shrink-0 text-blue-400" />
          <span>{t('admin.viewSite', 'View Site')}</span>
        </Link>
        
        <AdminLogoutButton />
      </div>
    </aside>
  );
}
