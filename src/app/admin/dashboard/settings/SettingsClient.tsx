'use client';

import { useState } from 'react';
import { Save, RefreshCw, Check, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';

type SettingsClientProps = {
  initialSettings: Record<string, string>;
};

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Input States
  const [shopName, setShopName] = useState(settings.shopName || '');
  const [ownerName, setOwnerName] = useState(settings.ownerName || '');
  const [mobileNumber, setMobileNumber] = useState(settings.mobileNumber || '');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '');
  const [address, setAddress] = useState(settings.address || '');
  const [businessHours, setBusinessHours] = useState(settings.businessHours || '');
  const [aboutText, setAboutText] = useState(settings.aboutText || '');
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    const payload = {
      shopName,
      ownerName,
      mobileNumber,
      whatsappNumber,
      address,
      businessHours,
      aboutText,
      heroTitle,
      heroSubtitle,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveStatus('success');
        setSettings(payload);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-agri-dark">
          वेबसाइट सेटिंग्स (Shop Settings)
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-1">
          दुकान का नाम, मोबाइल नंबर, संपर्क पता, और होमपेज बैनर टेक्स्ट बदलें
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        
        {/* Card 1: Shop & Contact Info */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-base text-agri-dark border-b border-gray-100 pb-2.5 flex items-center">
            <Sparkles className="h-5 w-5 text-agri-yellow-500 mr-2" />
            <span>दुकान एवं सम्पर्क विवरण (Shop Details)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">दुकान का नाम (Shop Name) *</label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="जैसे: Nishad Beej Bhandar"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">संचालक का नाम (Owner Name) *</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="जैसे: Abhay Nishad (B.Sc Ag)"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">मोबाइल नंबर (Call Mobile) *</label>
              <input
                type="text"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="जैसे: 6387634500"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">व्हाट्सएप नंबर (WhatsApp Mobile) *</label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="जैसे: 6387634500"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">दुकान का पता (Shop Address) *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="दुकान का पूरा पता दर्ज करें..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">कार्यकाल समय (Business Hours)</label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="जैसे: Monday - Sunday: 8:00 AM - 8:00 PM"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">परिचय विवरण (About Text Bio)</label>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={4}
              placeholder="दुकान के बारे में और आप किसानों को कैसे लाभ पहुंचाते हैं..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 resize-none"
            />
          </div>
        </div>

        {/* Card 2: Homepage Hero banner Text */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-base text-agri-dark border-b border-gray-100 pb-2.5 flex items-center">
            <ImageIcon className="h-5 w-5 text-agri-green-700 mr-2 shrink-0" />
            <span>होमपेज बैनर टेक्स्ट (Homepage Hero Banner)</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">मुख्य हेडिंग (Hero Title) *</label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="जैसे: अच्छे बीज, अच्छी फसल की शुरुआत"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">उप-हेडिंग (Hero Subtitle) *</label>
            <textarea
              required
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={3}
              placeholder="धान, गेहूं, मक्का, सरसों, सब्जियों के बीज..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-agri-green-800 resize-none"
            />
          </div>
        </div>

        {/* Feedback alerts */}
        {saveStatus === 'success' && (
          <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-xl text-sm font-semibold flex items-center space-x-2">
            <Check className="h-5 w-5 shrink-0" />
            <span>✓ सभी सेटिंग्स सफलतापूर्वक सहेज ली गई हैं!</span>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-xl text-sm font-semibold flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>⚠ सेटिंग्स अपडेट करने में तकनीकी समस्या आई।</span>
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-agri-green-800 hover:bg-agri-green-900 text-white font-sans font-bold py-3.5 px-8 rounded-xl text-sm flex items-center space-x-2 cursor-pointer shadow-md disabled:bg-gray-400"
          >
            {isSaving ? (
              <RefreshCw className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <Save className="h-4.5 w-4.5" />
            )}
            <span>सेटिंग्स सहेजें (Save Settings)</span>
          </button>
        </div>

      </form>

    </div>
  );
}
