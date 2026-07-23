'use client';

import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

export const DEFAULT_SETTINGS: Record<string, string> = {
  shopName: "निषाद बीज भंडार",
  shopNameEn: "Nishad Beej Bhandar",
  ownerName: "अभय निषाद",
  ownerNameEn: "Abhay Nishad",
  mobileNumber: "6387634500",
  whatsappNumber: "6387634500",
  address: "बिरमलपुर रोड, कोरोना चौराहा, सुल्तानपुर, उत्तर प्रदेश, भारत",
  addressEn: "Birlmalpur Road, Korona Chauraha, Sultanpur, Uttar Pradesh, India",
  businessHours: "सोमवार - रविवार: सुबह 7:00 बजे - रात 8:00 बजे",
  businessHoursEn: "Monday - Sunday: 7:00 AM - 8:00 PM",
  aboutText: "हम भारतीय किसानों को उनकी उपज बढ़ाने में मदद करने के लिए उत्कृष्ट गुणवत्ता वाले बीज, अत्यधिक प्रभावी उर्वरक और असली कीटनाशक प्रदान करते हैं। कृषि स्नातक (B.Sc Agriculture) अभय निषाद के नेतृत्व में, हम वैज्ञानिक मार्गदर्शन और असली ब्रांडेड उत्पाद प्रदान करते हैं।",
  aboutTextEn: "We provide premium quality seeds, highly effective fertilizers, and original pesticides to help Indian farmers maximize their yield. Led by Abhay Nishad, a B.Sc Agriculture graduate, we offer expert scientific guidance and genuine brand-name products.",
  heroTitle: "अच्छे बीज, अच्छी फसल की शुरुआत",
  heroSubtitle: "धान, गेहूं, मक्का, सरसों, और सब्जियों के उन्नत बीज, सर्वोत्तम उर्वरक खाद एवं कीटनाशक दवाइयाँ उचित सरकारी रेट पर उपलब्ध हैं।",
  heroTitleEn: "Good Seeds, Beginning of a Good Crop",
  heroSubtitleEn: "High-quality seeds for paddy, wheat, maize, mustard, and vegetables, along with premium fertilizers and top-grade pesticides are available at reasonable prices.",
  logoPath: "/brand-logo.png",
  facebookUrl: "https://facebook.com",
  youtubeUrl: "https://youtube.com",
};

const SettingsContext = createContext<Record<string, string>>(DEFAULT_SETTINGS);

export default function SettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: Record<string, string>;
}) {
  return (
    <SettingsContext.Provider value={{ ...DEFAULT_SETTINGS, ...initialSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export function useLocalizedSettings() {
  const settings = useContext(SettingsContext);
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  return {
    shopName: isHi ? (settings.shopName || DEFAULT_SETTINGS.shopName) : (settings.shopNameEn || DEFAULT_SETTINGS.shopNameEn),
    ownerName: isHi ? (settings.ownerName || DEFAULT_SETTINGS.ownerName) : (settings.ownerNameEn || DEFAULT_SETTINGS.ownerNameEn),
    address: isHi ? (settings.address || DEFAULT_SETTINGS.address) : (settings.addressEn || DEFAULT_SETTINGS.addressEn),
    businessHours: isHi ? (settings.businessHours || DEFAULT_SETTINGS.businessHours) : (settings.businessHoursEn || DEFAULT_SETTINGS.businessHoursEn),
    aboutText: isHi ? (settings.aboutText || DEFAULT_SETTINGS.aboutText) : (settings.aboutTextEn || DEFAULT_SETTINGS.aboutTextEn),
    heroTitle: isHi ? (settings.heroTitle || DEFAULT_SETTINGS.heroTitle) : (settings.heroTitleEn || DEFAULT_SETTINGS.heroTitleEn),
    heroSubtitle: isHi ? (settings.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle) : (settings.heroSubtitleEn || DEFAULT_SETTINGS.heroSubtitleEn),
    mobileNumber: settings.mobileNumber || DEFAULT_SETTINGS.mobileNumber,
    whatsappNumber: settings.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
    logoPath: settings.logoPath || DEFAULT_SETTINGS.logoPath,
    facebookUrl: settings.facebookUrl || DEFAULT_SETTINGS.facebookUrl,
    youtubeUrl: settings.youtubeUrl || DEFAULT_SETTINGS.youtubeUrl,
  };
}
