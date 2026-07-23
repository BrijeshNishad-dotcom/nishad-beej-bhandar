import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';
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

  return (
    <AdminSessionGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
        
        {/* Sidebar Navigation */}
        <AdminSidebar />

        {/* Main Workspace Area */}
        <main className="flex-grow p-6 sm:p-10 overflow-y-auto max-h-screen">
          {children}
        </main>

      </div>
    </AdminSessionGuard>
  );
}
