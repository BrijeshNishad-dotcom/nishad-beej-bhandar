'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppTranslation } from '@/lib/translation';

function ResetPasswordForm() {
  const { t } = useAppTranslation();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasToken, setHasToken] = useState(false);

  // Parse and set Supabase session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (!hash) {
      setError(t('admin.resetPassword.errorInvalidToken'));
      setIsLoading(false);
      return;
    }

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const errorCode = params.get('error');
    const errorDescription = params.get('error_description');

    if (errorCode || errorDescription) {
      setError(errorDescription || t('admin.resetPassword.errorInvalidToken'));
      setIsLoading(false);
      return;
    }

    if (!accessToken || !refreshToken) {
      setError(t('admin.resetPassword.errorInvalidToken'));
      setIsLoading(false);
      return;
    }

    const establishSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          setError(sessionError.message || t('admin.resetPassword.errorInvalidToken'));
        } else if (data?.session) {
          setHasToken(true);
        } else {
          setError(t('admin.resetPassword.errorInvalidToken'));
        }
      } catch (err) {
        console.error('Error setting session:', err);
        setError(t('admin.resetPassword.errorInvalidToken'));
      } finally {
        setIsLoading(false);
      }
    };

    establishSession();
  }, [t]);

  // Validate password strength: minimum 8 characters, uppercase, lowercase, number, special char
  const validatePasswordStrength = (password: string) => {
    if (password.length < 8) return false;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    return hasUppercase && hasLowercase && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError(t('admin.resetPassword.errorRequired'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('admin.resetPassword.errorMatch'));
      return;
    }

    if (!validatePasswordStrength(newPassword)) {
      setError(t('admin.resetPassword.errorLength'));
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message || t('admin.resetPassword.errorFailed'));
      } else {
        setSuccess(t('admin.resetPassword.successMessage'));
        
        // Clear Supabase client session (sign out)
        await supabase.auth.signOut();
        
        // Redirect back to Admin Login with a success message banner
        setTimeout(() => {
          router.replace(
            '/admin/login?message=Your password has been successfully reset. Please log in with your new credentials.'
          );
        }, 2000);
      }
    } catch (err) {
      console.error('Reset password submit error:', err);
      setError(t('admin.resetPassword.errorFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
        {/* Logo and Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center bg-agri-green-800 p-3 rounded-2xl text-agri-yellow-500 shadow-md">
            <Leaf className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-agri-dark">
            {t('admin.resetPassword.title')}
          </h1>
          <p className="font-sans text-xs font-semibold text-gray-500 max-w-[280px] mx-auto leading-relaxed">
            {t('admin.resetPassword.subtitle')}
          </p>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-xl text-xs font-bold flex items-start space-x-2.5 mb-6 animate-pulse">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Banner when token is invalid or general error */}
        {error && !hasToken && (
          <div className="space-y-4">
            <div className="bg-red-50 text-red-800 border border-red-150 p-4 rounded-xl text-xs font-semibold flex items-start space-x-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => router.replace('/admin/forgot-password')}
              className="w-full bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold py-2.5 rounded-xl transition-colors text-sm shadow-md"
            >
              {t('admin.forgotPassword.title')}
            </button>
          </div>
        )}

        {/* Reset Password Form */}
        {hasToken && !success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('admin.resetPassword.newPasswordLabel')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('admin.resetPassword.passwordPlaceholder')}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors cursor-pointer"
                  title={showPassword ? t('admin.login.hidePassword') : t('admin.login.showPassword')}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('admin.resetPassword.confirmPasswordLabel')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('admin.resetPassword.passwordPlaceholder')}
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
              disabled={isSubmitting}
              className="w-full bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold py-3 rounded-xl transition-colors text-sm shadow-md flex items-center justify-center space-x-1.5 cursor-pointer disabled:bg-gray-400"
            >
              {isSubmitting
                ? t('admin.resetPassword.resetting')
                : t('admin.resetPassword.resetButton')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  );
}
