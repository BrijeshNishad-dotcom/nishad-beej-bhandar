'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Leaf } from 'lucide-react';

export default function AdminSessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      const isSessionActive = sessionStorage.getItem('admin_session_active');
      if (!isSessionActive) {
        // Tab session is not active, force clear NextAuth persistent cookies
        signOut({ callbackUrl: '/admin/login' });
      } else {
        setIsVerified(true);
      }
    } else if (status === 'unauthenticated') {
      setIsVerified(false);
    }
  }, [status, session]);

  // Hide page content and display loading screen during verification
  if (!isVerified && status === 'authenticated') {
    return (
      <div className="min-h-screen bg-[#f1f8e9] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Leaf className="h-10 w-10 text-agri-green-800 animate-bounce mx-auto" />
          <p className="text-sm font-semibold text-gray-500">सत्यापित किया जा रहा है (Verifying session)...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
