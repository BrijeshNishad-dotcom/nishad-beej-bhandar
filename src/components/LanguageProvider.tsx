'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import '@/lib/i18n'; // Ensure i18n is initialized

type Language = 'hi' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>('hi');
  const [isMounted, setIsMounted] = useState(false);

  // Sync state with localStorage and i18n on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'hi' || savedLang === 'en')) {
      setLanguageState(savedLang);
      i18n.changeLanguage(savedLang);
    } else {
      localStorage.setItem('language', 'hi');
      i18n.changeLanguage('hi');
    }
    setIsMounted(true);
  }, [i18n]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isMounted }}>
      <motion.div
        key={language}
        initial={isMounted ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="w-full min-h-full flex flex-col flex-grow"
      >
        {children}
      </motion.div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
