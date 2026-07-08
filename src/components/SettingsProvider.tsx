'use client';

import React, { createContext, useContext } from 'react';

export const DEFAULT_SETTINGS: Record<string, string> = {
  shopName: "Nishad Beej Bhandar",
  ownerName: "Abhay Nishad",
  mobileNumber: "6387634500",
  whatsappNumber: "6387634500",
  address: "Main Market Road, Near Agriculture Office, Uttar Pradesh, India",
  businessHours: "Monday - Sunday: 8:00 AM - 8:00 PM",
  aboutText: "We provide premium quality seeds, highly effective fertilizers, and original pesticides to help Indian farmers maximize their yield. Led by Abhay Nishad, a B.Sc Agriculture graduate, we offer expert scientific guidance and genuine brand-name products.",
  heroTitle: "अच्छे बीज, अच्छी फसल की शुरुआत",
  heroSubtitle: "धान, गेहूं, मक्का, सरसों, सब्जियों के बीज, उर्वरक खाद एवं कीटनाशक दवाइयाँ उचित मूल्य पर उपलब्ध हैं।"
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
