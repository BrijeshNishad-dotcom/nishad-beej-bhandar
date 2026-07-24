'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Leaf, Lock, Mail, AlertCircle, ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import Link from 'next/link';
import { useAppTranslation } from '@/lib/translation';

function AdminLoginForm() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const { t } = useAppTranslation();
  
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
      setError(t('admin.login.errorRequired'));
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
        setError(t('admin.login.errorInvalid'));
      } else if (res?.ok) {
        router.replace('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(t('admin.login.errorTechnical'));
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f1f8e9] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Leaf className="h-10 w-10 text-agri-green-800 animate-bounce mx-auto" />
          <p className="text-sm font-semibold text-gray-500">{t('admin.login.pleaseWait')}</p>
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
          <span>{t('admin.login.goHome')}</span>
        </Link>

        {/* Logo and Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center bg-agri-green-800 p-3 rounded-2xl text-agri-yellow-500 shadow-md">
            <Leaf className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-agri-dark">
            {t('shopName')}
          </h1>
          <p className="font-sans text-xs font-semibold text-agri-yellow-700">
            {t('admin.login.portal')}
          </p>
        </div>

        {/* Success Message Banner */}
        {message && (
          <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-xl text-xs font-bold flex items-start space-x-2.5 mb-6">
            <Check className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">{t('admin.login.email')}</label>
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
            <label className="block text-xs font-bold text-gray-700 mb-1.5">{t('admin.login.password')}</label>
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
                title={showPassword ? t('admin.login.hidePassword') : t('admin.login.showPassword')}
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
            {isLoading 
              ? t('admin.login.verifying') 
              : t('admin.login.signIn')
            }
          </button>
        </form>

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  const { t } = useAppTranslation();
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f1f8e9] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Leaf className="h-10 w-10 text-agri-green-800 animate-bounce mx-auto" />
          <p className="text-sm font-semibold text-gray-500">{t('admin.login.pleaseWait')}</p>
        </div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
