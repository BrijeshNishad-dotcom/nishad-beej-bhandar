'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_session_active');
    }
    signOut({ callbackUrl: '/' });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left cursor-pointer"
    >
      <LogOut className="h-4.5 w-4.5 shrink-0" />
      <span>लॉगआउट (Logout)</span>
    </button>
  );
}
