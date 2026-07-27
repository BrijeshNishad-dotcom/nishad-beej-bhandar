'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';

export default function ResetPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      router.replace(`/admin/reset-password${hash}`);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f1f8e9] flex items-center justify-center font-sans">
      <div className="text-center space-y-3">
        <Leaf className="h-10 w-10 text-agri-green-800 animate-bounce mx-auto" />
        <p className="text-sm font-semibold text-gray-500">Redirecting to reset password page...</p>
      </div>
    </div>
  );
}
