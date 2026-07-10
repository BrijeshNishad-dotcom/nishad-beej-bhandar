'use client';

import React, { createContext, useContext } from 'react';

export const DEFAULT_SETTINGS: Record<string, string> = {
  shopName: "Nishad Beej Bhandar",
  ownerName: "Abhay Nishad",
  mobileNumber: "6387634500",
  whatsappNumber: "6387634500",
  address: "Birlmalpur Road, Korona Chauraha, Sultanpur, Uttar Pradesh, India",
  businessHours: "Monday - Sunday: 8:00 AM - 8:00 PM",
  aboutText: "We provide premium quality seeds, highly effective fertilizers, and original pesticides to help Indian farmers maximize their yield. Led by Abhay Nishad, a B.Sc Agriculture graduate, we offer expert scientific guidance and genuine brand-name products.",
  heroTitle: "अच्छे बीज, अच्छी फसल की शुरुआत",
  heroSubtitle: "धान, गेहूं, मक्का, सरसों, और सब्जियों के उन्नत बीज, सर्वोत्तम उर्वरक खाद एवं कीटनाशक दवाइयाँ उचित सरकारी रेट पर उपलब्ध हैं。"
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

export function getLocalizedAddress(address: string, lang: string): string {
  if (!address) return '';
  let result = address;
  if (lang === 'hi') {
    result = result
      .replace(/Birlmalpur Road/g, 'बिरमलपुर रोड')
      .replace(/Birlmalpur/g, 'बिरमलपुर')
      .replace(/Korona Chauraha/g, 'कोरोना चौराहा')
      .replace(/Korona/g, 'कोरोना')
      .replace(/Chauraha/g, 'चौराहा')
      .replace(/Sultanpur/g, 'सुल्तानपुर')
      .replace(/Uttar Pradesh/g, 'उत्तर प्रदेश')
      .replace(/India/g, 'भारत')
      .replace(/Main Market Road/g, 'मुख्य बाजार मार्ग')
      .replace(/Main Market/g, 'मुख्य बाजार')
      .replace(/Near Agriculture Office/g, 'कृषि कार्यालय के पास')
      .replace(/-\s*/g, ', ')
      .replace(/,\s*,/g, ',');
  } else {
    // English mode
    result = result
      .replace(/बिरमलपुर रोड/g, 'Birlmalpur Road')
      .replace(/बिरमलपुर/g, 'Birlmalpur')
      .replace(/कोरोना चौराहा/g, 'Korona Chauraha')
      .replace(/कोरोना/g, 'Korona')
      .replace(/चौराहा/g, 'Chauraha')
      .replace(/सुल्तानपुर/g, 'Sultanpur')
      .replace(/उत्तर प्रदेश/g, 'Uttar Pradesh')
      .replace(/भारत/g, 'India')
      .replace(/मुख्य बाजार मार्ग/g, 'Main Market Road')
      .replace(/मुख्य बाजार/g, 'Main Market')
      .replace(/कृषि कार्यालय के पास/g, 'Near Agriculture Office')
      .replace(/-\s*/g, ', ')
      .replace(/,\s*,/g, ',');
  }
  return result;
}
