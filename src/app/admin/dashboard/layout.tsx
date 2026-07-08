import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, ShoppingBag, FolderOpen, MailOpen, 
  Image as ImageIcon, Settings, Globe
} from 'lucide-react';
import AdminLogoutButton from '@/components/AdminLogoutButton';

import AdminSessionGuard from '@/components/AdminSessionGuard';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Secure server-side session check
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  const menuItems = [
    { name: 'Overview (मुख्य)', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products (उत्पाद)', href: '/admin/dashboard/products', icon: ShoppingBag },
    { name: 'Categories (श्रेणियां)', href: '/admin/dashboard/categories', icon: FolderOpen },
    { name: 'Enquiries (पूछताछ)', href: '/admin/dashboard/enquiries', icon: MailOpen },
    { name: 'Gallery & Banners', href: '/admin/dashboard/gallery', icon: ImageIcon },
    { name: 'Settings (सेटिंग्स)', href: '/admin/dashboard/settings', icon: Settings },
  ];

  return (
    <AdminSessionGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-agri-dark text-white shrink-0 flex flex-col justify-between p-6">
          <div className="space-y-8">
            {/* Brand Logo */}
            <Link href="/admin/dashboard" className="flex items-center space-x-2.5">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-sm">
                <Image
                  src="/brand-logo.png"
                  alt="Nishad Beej Bhandar Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-display text-base font-bold block leading-none">
                  Nishad Admin
                </span>
                <span className="text-[10px] text-agri-yellow-500 font-semibold block">
                  कृषि स्टोर नियंत्रण कक्ष
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
              <span>वेबसाइट देखें (View Site)</span>
            </Link>
            
            <AdminLogoutButton />
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-grow p-6 sm:p-10 overflow-y-auto max-h-screen">
          {children}
        </main>

      </div>
    </AdminSessionGuard>
  );
}
