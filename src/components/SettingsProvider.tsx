'use client';

import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_SETTINGS } from '@/lib/constants';

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
