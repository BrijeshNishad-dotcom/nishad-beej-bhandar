'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { 
  Save, RefreshCw, Check, Sparkles, AlertCircle, 
  Image as ImageIcon, Lock, Mail, Eye, EyeOff, ShieldCheck, Key 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type SettingsClientProps = {
  initialSettings: Record<string, string>;
  currentAdminEmail?: string;
};

export default function SettingsClient({ initialSettings, currentAdminEmail = '' }: SettingsClientProps) {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  
  // Shop Settings States
  const [isSavingShop, setIsSavingShop] = useState(false);
  const [shopSaveStatus, setShopSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [shopName, setShopName] = useState(settings.shopName || '');
  const [shopNameEn, setShopNameEn] = useState(settings.shopNameEn || '');
  const [ownerName, setOwnerName] = useState(settings.ownerName || '');
  const [ownerNameEn, setOwnerNameEn] = useState(settings.ownerNameEn || '');
  const [mobileNumber, setMobileNumber] = useState(settings.mobileNumber || '');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '');
  const [address, setAddress] = useState(settings.address || '');
  const [addressEn, setAddressEn] = useState(settings.addressEn || '');
  const [businessHours, setBusinessHours] = useState(settings.businessHours || '');
  const [businessHoursEn, setBusinessHoursEn] = useState(settings.businessHoursEn || '');
  const [aboutText, setAboutText] = useState(settings.aboutText || '');
  const [aboutTextEn, setAboutTextEn] = useState(settings.aboutTextEn || '');
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || '');
  const [heroTitleEn, setHeroTitleEn] = useState(settings.heroTitleEn || '');
  const [heroSubtitleEn, setHeroSubtitleEn] = useState(settings.heroSubtitleEn || '');

  // Admin Account Settings States
  const [currentPasswordEmail, setCurrentPasswordEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [showPasswordEmailCurrent, setShowPasswordEmailCurrent] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');

  const [currentPasswordPass, setCurrentPasswordPass] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordPassCurrent, setShowPasswordPassCurrent] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [passwordError, setPasswordError] = useState('');

  // Helper to translate server-side Hindi errors in English mode
  const translateServerError = (err: string | null | undefined, isEnglish: boolean) => {
    if (!err || !isEnglish) return err || '';
    const map: Record<string, string> = {
      'अनधिकृत प्रवेश (Unauthorized)': 'Unauthorized access.',
      'वर्तमान पासवर्ड आवश्यक है।': 'Current password is required.',
      'उपयोगकर्ता नहीं मिला।': 'User not found.',
      'गलत वर्तमान पासवर्ड।': 'Incorrect current password.',
      'कृपया एक मान्य ईमेल पता दर्ज करें।': 'Please enter a valid email address.',
      'नया ईमेल वर्तमान ईमेल के समान नहीं हो सकता।': 'New email cannot be the same as the current email.',
      'यह ईमेल पहले से ही किसी अन्य खाते द्वारा उपयोग में है।': 'This email is already in use by another account.',
      'पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।': 'New password and confirmation do not match.',
      'नया पासवर्ड कम से कम 8 वर्णों का होना चाहिए और उसमें कम से कम एक अपरकेस अक्षर, एक लोअरकेस अक्षर, एक अंक और एक विशेष वर्ण होना चाहिए।':
        'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    };
    return map[err] || err;
  };

  // Validate Email
  const validateEmailFormat = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate Password Strength
  const validatePasswordStrength = (password: string) => {
    if (password.length < 8) return false;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    return hasUppercase && hasLowercase && hasNumber && hasSpecial;
  };

  // Submit Shop Settings
  const handleShopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingShop(true);
    setShopSaveStatus('idle');

    const payload = {
      shopName,
      shopNameEn,
      ownerName,
      ownerNameEn,
      mobileNumber,
      whatsappNumber,
      address,
      addressEn,
      businessHours,
      businessHoursEn,
      aboutText,
      aboutTextEn,
      heroTitle,
      heroSubtitle,
      heroTitleEn,
      heroSubtitleEn,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShopSaveStatus('success');
        setSettings(payload);
      } else {
        setShopSaveStatus('error');
      }
    } catch (err) {
      console.error(err);
      setShopSaveStatus('error');
    } finally {
      setIsSavingShop(false);
    }
  };

  // Submit Email Update
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailStatus('loading');

    if (!currentPasswordEmail) {
      setEmailError(isEn ? 'Current password is required.' : 'वर्तमान पासवर्ड दर्ज करना आवश्यक है।');
      setEmailStatus('error');
      return;
    }

    if (!newEmail || !validateEmailFormat(newEmail)) {
      setEmailError(isEn ? 'Please enter a valid email address.' : 'कृपया एक वैध ईमेल पता दर्ज करें।');
      setEmailStatus('error');
      return;
    }

    if (newEmail.trim().toLowerCase() === currentAdminEmail.toLowerCase()) {
      setEmailError(isEn ? 'New email cannot be the same as current email.' : 'नया ईमेल वर्तमान ईमेल के समान नहीं हो सकता।');
      setEmailStatus('error');
      return;
    }

    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-email',
          currentPassword: currentPasswordEmail,
          newEmail: newEmail.trim()
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEmailError(translateServerError(data.error, isEn) || (isEn ? 'Failed to update email.' : 'ईमेल अपडेट करने में तकनीकी समस्या आई।'));
        setEmailStatus('error');
        return;
      }

      setEmailStatus('success');
      // Supabase requires re-authentication, trigger sign out & redirect to login with success message
      setTimeout(() => {
        signOut({
          callbackUrl: '/admin/login?message=Your account credentials have been updated successfully. Please sign in again.'
        });
      }, 1500);

    } catch (err) {
      console.error(err);
      setEmailError(isEn ? 'Network error. Please try again later.' : 'नेटवर्क त्रुटि। कृपया बाद में प्रयास करें।');
      setEmailStatus('error');
    }
  };

  // Submit Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordStatus('loading');

    if (!currentPasswordPass) {
      setPasswordError(isEn ? 'Current password is required.' : 'वर्तमान पासवर्ड दर्ज करना आवश्यक है।');
      setPasswordStatus('error');
      return;
    }

    if (!newPassword || !validatePasswordStrength(newPassword)) {
      setPasswordError(isEn ? 'Password must be at least 8 characters and contain uppercase, lowercase, numeric, and special characters.' : 'नया पासवर्ड कम से कम 8 वर्णों का होना चाहिए और उसमें कम से कम एक अपरकेस अक्षर, एक लोअरकेस अक्षर, एक अंक और एक विशेष वर्ण होना चाहिए।');
      setPasswordStatus('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(isEn ? 'New password and confirmation do not match.' : 'नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।');
      setPasswordStatus('error');
      return;
    }

    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-password',
          currentPassword: currentPasswordPass,
          newPassword,
          confirmPassword
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(translateServerError(data.error, isEn) || (isEn ? 'Failed to update password.' : 'पासवर्ड अपडेट करने में तकनीकी समस्या आई।'));
        setPasswordStatus('error');
        return;
      }

      setPasswordStatus('success');
      // Trigger sign out & redirect to login with success message
      setTimeout(() => {
        signOut({
          callbackUrl: '/admin/login?message=Your account credentials have been updated successfully. Please sign in again.'
        });
      }, 1500);

    } catch (err) {
      console.error(err);
      setPasswordError(isEn ? 'Network error. Please try again later.' : 'नेटवर्क त्रुटि। कृपया बाद में प्रयास करें।');
      setPasswordStatus('error');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-agri-dark">
          {isEn ? 'Shop & Security Settings' : 'वेबसाइट सेटिंग्स'}
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-1">
          {isEn ? 'Manage shop details and administrator credentials' : 'दुकान की जानकारी एवं एडमिन क्रेडेंशियल प्रबंधित करें'}
        </p>
      </div>

      {/* CARD 1: SHOP SETTINGS */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="font-display font-extrabold text-lg text-agri-dark flex items-center">
            <Sparkles className="h-5 w-5 text-agri-yellow-500 mr-2" />
            <span>{isEn ? 'Shop Settings' : 'दुकान सेटिंग्स'}</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEn ? 'Modify shop name, contact details, and homepage banner text' : 'दुकान का नाम, संपर्क विवरण और होमपेज बैनर बदलें'}
          </p>
        </div>

        <form onSubmit={handleShopSubmit} className="space-y-6">
          {/* Shop Details Sub-section */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-agri-green-800">
              {isEn ? 'Shop & Contact Details' : 'दुकान एवं सम्पर्क विवरण'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Shop Name (Hindi) *' : 'दुकान का नाम - हिंदी *'}</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder={isEn ? "e.g., निषाद बीज भंडार" : "जैसे: निषाद बीज भंडार"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Shop Name (English) *' : 'दुकान का नाम - English *'}</label>
                <input
                  type="text"
                  required
                  value={shopNameEn}
                  onChange={(e) => setShopNameEn(e.target.value)}
                  placeholder="e.g., Nishad Beej Bhandar"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Owner Name (Hindi) *' : 'संचालक का नाम - हिंदी *'}</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder={isEn ? "e.g., अभय निषाद" : "जैसे: अभय निषाद"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Owner Name (English) *' : 'संचालक का नाम - English *'}</label>
                <input
                  type="text"
                  required
                  value={ownerNameEn}
                  onChange={(e) => setOwnerNameEn(e.target.value)}
                  placeholder="e.g., Abhay Nishad (B.Sc Ag)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Call Mobile *' : 'मोबाइल नंबर *'}</label>
                <input
                  type="text"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g., 6387634500"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'WhatsApp Number *' : 'व्हाट्सएप नंबर *'}</label>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g., 6387634500"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Shop Address (Hindi) *' : 'दुकान का पता - हिंदी *'}</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isEn ? "Enter address in Hindi..." : "दुकान का पूरा पता हिंदी में दर्ज करें..."}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Shop Address (English) *' : 'दुकान का पता - English *'}</label>
                <input
                  type="text"
                  required
                  value={addressEn}
                  onChange={(e) => setAddressEn(e.target.value)}
                  placeholder="Enter full address in English..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Business Hours (Hindi)' : 'कार्यकाल समय - हिंदी'}</label>
                <input
                  type="text"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  placeholder={isEn ? "e.g., सोमवार - रविवार: सुबह 7:00 बजे - रात 8:00 बजे" : "जैसे: सोमवार - रविवार: सुबह 7:00 बजे - रात 8:00 बजे"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Business Hours (English)' : 'कार्यकाल समय - English'}</label>
                <input
                  type="text"
                  value={businessHoursEn}
                  onChange={(e) => setBusinessHoursEn(e.target.value)}
                  placeholder="e.g., Monday - Sunday: 7:00 AM - 8:00 PM"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'About Bio (Hindi)' : 'परिचय विवरण - हिंदी'}</label>
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  rows={4}
                  placeholder={isEn ? "Describe your shop in Hindi..." : "दुकान के बारे में और आप किसानों को कैसे लाभ पहुंचाते हैं..."}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'About Bio (English)' : 'परिचय विवरण - English'}</label>
                <textarea
                  value={aboutTextEn}
                  onChange={(e) => setAboutTextEn(e.target.value)}
                  rows={4}
                  placeholder="Enter shop description in English..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Banner Sub-section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-display font-bold text-sm text-agri-green-800 flex items-center">
              <ImageIcon className="h-4.5 w-4.5 mr-1.5 shrink-0" />
              <span>{isEn ? 'Homepage Hero Banner' : 'होमपेज बैनर टेक्स्ट'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Hero Title (Hindi) *' : 'मुख्य हेडिंग - हिंदी *'}</label>
                <input
                  type="text"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder={isEn ? "e.g., अच्छे बीज, अच्छी फसल की शुरुआत" : "जैसे: अच्छे बीज, अच्छी फसल की शुरुआत"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Hero Title (English) *' : 'मुख्य हेडिंग - English *'}</label>
                <input
                  type="text"
                  required
                  value={heroTitleEn}
                  onChange={(e) => setHeroTitleEn(e.target.value)}
                  placeholder="e.g., Good Seeds, Beginning of a Good Crop"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Hero Subtitle (Hindi) *' : 'उप-हेडिंग - हिंदी *'}</label>
                <textarea
                  required
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  rows={3}
                  placeholder={isEn ? "Paddy, wheat, maize, mustard, vegetable seeds..." : "धान, गेहूं, मक्का, सरसों, सब्जियों के बीज..."}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Hero Subtitle (English) *' : 'उप-हेडिंग - English *'}</label>
                <textarea
                  required
                  value={heroSubtitleEn}
                  onChange={(e) => setHeroSubtitleEn(e.target.value)}
                  rows={3}
                  placeholder="High-quality seeds for paddy, wheat..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Feedback alerts */}
          {shopSaveStatus === 'success' && (
            <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-xl text-sm font-semibold flex items-center space-x-2">
              <Check className="h-5 w-5 shrink-0" />
              <span>{isEn ? '✓ Shop settings saved successfully!' : '✓ दुकान की सभी सेटिंग्स सफलतापूर्वक सहेज ली गई हैं!'}</span>
            </div>
          )}

          {shopSaveStatus === 'error' && (
            <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-xl text-sm font-semibold flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{isEn ? '⚠ Error updating settings. Please try again.' : '⚠ सेटिंग्स अपडेट करने में तकनीकी समस्या आई।'}</span>
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingShop}
              className="bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold py-3.5 px-8 rounded-xl text-sm flex items-center space-x-2 cursor-pointer shadow-md disabled:bg-gray-400 transition-colors"
            >
              {isSavingShop ? (
                <RefreshCw className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <Save className="h-4.5 w-4.5" />
              )}
              <span>{isEn ? 'Save Shop Settings' : 'दुकान सेटिंग्स सहेजें'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* CARD 2: ADMIN ACCOUNT SETTINGS */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="font-display font-extrabold text-lg text-agri-dark flex items-center">
            <Lock className="h-5 w-5 text-red-500 mr-2" />
            <span>{isEn ? '🔐 Admin Account Settings' : '🔐 एडमिन अकाउंट सेटिंग्स'}</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEn ? 'Change administrator login credentials (Supabase Auth)' : 'एडमिनिस्ट्रेटर लॉगिन क्रेडेंशियल बदलें (Supabase Auth)'}
          </p>
        </div>

        {/* Current Admin Email Info */}
        <div className="bg-blue-50 border border-blue-150 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-700">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{isEn ? 'Current Admin Email' : 'वर्तमान एडमिन ईमेल'}</p>
              <p className="text-sm font-sans font-bold text-blue-900">{currentAdminEmail || (isEn ? 'Loading...' : 'लोड हो रहा है...')}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-blue-700 font-bold bg-blue-100/50 px-3 py-1.5 rounded-lg border border-blue-100">
            <ShieldCheck className="h-4 w-4" />
            <span>Supabase Auth Secured</span>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Sub-Card A: Change Email */}
          <div className="space-y-4 border border-gray-100 p-5 rounded-2xl bg-gray-50/50">
            <h3 className="font-display font-extrabold text-sm text-agri-dark border-b border-gray-100 pb-2 flex items-center">
              <Mail className="h-4.5 w-4.5 text-agri-green-800 mr-1.5" />
              <span>{isEn ? 'Change Email' : 'ईमेल बदलें'}</span>
            </h3>

            <form onSubmit={handleUpdateEmail} className="space-y-4">
              {/* Current Password Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Current Password *' : 'वर्तमान पासवर्ड *'}</label>
                <div className="relative">
                  <input
                    type={showPasswordEmailCurrent ? 'text' : 'password'}
                    required
                    value={currentPasswordEmail}
                    onChange={(e) => setCurrentPasswordEmail(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordEmailCurrent(!showPasswordEmailCurrent)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  >
                    {showPasswordEmailCurrent ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* New Email Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'New Email Address *' : 'नया ईमेल *'}</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new-admin@example.com"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                />
              </div>

              {/* Status & Messages */}
              {emailStatus === 'error' && (
                <div className="bg-red-50 text-red-800 border border-red-150 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{emailError}</span>
                </div>
              )}

              {emailStatus === 'success' && (
                <div className="bg-green-50 text-green-800 border border-green-200 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <Check className="h-4.5 w-4.5 shrink-0" />
                  <span>{isEn ? 'Email updated! Logging out...' : 'ईमेल बदला गया! लॉगआउट किया जा रहा है...'}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={emailStatus === 'loading' || emailStatus === 'success'}
                className="w-full bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors disabled:bg-gray-400"
              >
                {emailStatus === 'loading' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                <span>{isEn ? 'Update Email' : 'ईमेल अपडेट करें'}</span>
              </button>
            </form>
          </div>

          {/* Sub-Card B: Change Password */}
          <div className="space-y-4 border border-gray-100 p-5 rounded-2xl bg-gray-50/50">
            <h3 className="font-display font-extrabold text-sm text-agri-dark border-b border-gray-100 pb-2 flex items-center">
              <Key className="h-4.5 w-4.5 text-agri-green-800 mr-1.5" />
              <span>{isEn ? 'Change Password' : 'पासवर्ड बदलें'}</span>
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Current Password Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Current Password *' : 'वर्तमान पासवर्ड *'}</label>
                <div className="relative">
                  <input
                    type={showPasswordPassCurrent ? 'text' : 'password'}
                    required
                    value={currentPasswordPass}
                    onChange={(e) => setCurrentPasswordPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordPassCurrent(!showPasswordPassCurrent)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  >
                    {showPasswordPassCurrent ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'New Password *' : 'नया पासवर्ड *'}</label>
                <div className="relative">
                  <input
                    type={showPasswordNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordNew(!showPasswordNew)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  >
                    {showPasswordNew ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Confirm New Password *' : 'नए पासवर्ड की पुष्टि *'}</label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm font-sans focus:outline-none focus:border-agri-green-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  >
                    {showPasswordConfirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Status & Messages */}
              {passwordStatus === 'error' && (
                <div className="bg-red-50 text-red-800 border border-red-150 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordStatus === 'success' && (
                <div className="bg-green-50 text-green-800 border border-green-200 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <Check className="h-4.5 w-4.5 shrink-0" />
                  <span>{isEn ? 'Password updated! Logging out...' : 'पासवर्ड बदला गया! लॉगआउट किया जा रहा है...'}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={passwordStatus === 'loading' || passwordStatus === 'success'}
                className="w-full bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors disabled:bg-gray-400"
              >
                {passwordStatus === 'loading' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Key className="h-4 w-4" />
                )}
                <span>{isEn ? 'Update Password' : 'पासवर्ड अपडेट करें'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
