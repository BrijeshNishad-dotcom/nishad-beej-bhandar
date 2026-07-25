'use client';

import { useState, Suspense } from 'react';
import { Leaf, Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAppTranslation } from '@/lib/translation';

function ForgotPasswordForm() {
  const { t } = useAppTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(t('admin.forgotPassword.errorEmail'));
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('admin.forgotPassword.errorFailed'));
      } else {
        setSuccess(t('admin.forgotPassword.successMessage'));
        setEmail('');
      }
    } catch (err) {
      console.error(err);
      setError(t('admin.forgotPassword.errorFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f8e9] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background visual crop accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-agri-green-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-agri-yellow-100 rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-150 p-8 shadow-xl relative z-10">
        {/* Back to Login Link */}
        <Link
          href="/admin/login"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-400 hover:text-agri-green-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('admin.forgotPassword.backToLogin')}</span>
        </Link>

        {/* Logo and Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center bg-agri-green-800 p-3 rounded-2xl text-agri-yellow-500 shadow-md">
            <Leaf className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-agri-dark">
            {t('admin.forgotPassword.title')}
          </h1>
          <p className="font-sans text-xs font-semibold text-gray-500 max-w-[280px] mx-auto leading-relaxed">
            {t('admin.forgotPassword.subtitle')}
          </p>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-xl text-xs font-bold flex items-start space-x-2.5 mb-6">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Forgot Password Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('admin.forgotPassword.emailLabel')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('admin.forgotPassword.placeholder')}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
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
                ? t('admin.forgotPassword.sending')
                : t('admin.forgotPassword.sendButton')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const { t } = useAppTranslation();
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f1f8e9] flex items-center justify-center font-sans">
          <div className="text-center space-y-3">
            <Leaf className="h-10 w-10 text-agri-green-800 animate-bounce mx-auto" />
            <p className="text-sm font-semibold text-gray-500">{t('admin.login.pleaseWait')}</p>
          </div>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
