'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Leaf, Lock, Mail, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('कृपया ईमेल और पासवर्ड दोनों भरें।');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('अमान्य ईमेल या पासवर्ड। कृपया दोबारा जांचें।');
      } else if (res?.ok) {
        // Session cookie is now set by NextAuth. Use router.replace so the
        // login page is removed from history and cannot be navigated back to.
        router.replace('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('लॉगिन करते समय कोई तकनीकी समस्या आई।');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f1f8e9] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Leaf className="h-10 w-10 text-agri-green-800 animate-bounce mx-auto" />
          <p className="text-sm font-semibold text-gray-500">प्रतीक्षा करें...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f8e9] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background visual crop accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-agri-green-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-agri-yellow-100 rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-150 p-8 shadow-xl relative z-10">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-400 hover:text-agri-green-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>मुख्य वेबसाइट पर जाएं (Home)</span>
        </Link>

        {/* Logo and Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center bg-agri-green-800 p-3 rounded-2xl text-agri-yellow-500 shadow-md">
            <Leaf className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-agri-dark">
            Nishad Beej Bhandar
          </h1>
          <p className="font-sans text-xs font-semibold text-agri-yellow-700">
            एडमिन पोर्टल लॉगिन (Admin Access)
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">ईमेल (Email Address)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:border-agri-green-800"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">पासवर्ड (Password)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm font-sans focus:outline-none focus:border-agri-green-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors cursor-pointer"
                title={showPassword ? 'पासवर्ड छिपाएं' : 'पासवर्ड देखें'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-800 border border-red-150 p-3 rounded-lg text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold py-3 rounded-xl transition-colors text-sm shadow-md flex items-center justify-center space-x-1.5 cursor-pointer disabled:bg-gray-400"
          >
            {isLoading ? 'सत्यापित किया जा रहा है...' : 'लॉगिन करें (Sign In)'}
          </button>
        </form>

      </div>
    </div>
  );
}
