'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageSquare, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/components/SettingsProvider';

export default function FloatingActions() {
  const settings = useSettings();
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const whatsappNumber = settings.whatsappNumber;
  const whatsappMessage = encodeURIComponent(
    t('whatsappMessage', 'नमस्ते, मुझे बीज एवं कृषि उत्पादों के बारे में जानकारी चाहिए।')
  );
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
      {/* WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
        title={t('contact.whatsappBtn')}
        aria-label="WhatsApp Enquiry Chat"
      >
        <MessageSquare className="h-6 w-6 fill-current" />
      </motion.a>

      {/* Direct Call Button */}
      <motion.a
        href={`tel:${settings.mobileNumber}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 bg-agri-yellow-500 hover:bg-agri-yellow-600 text-agri-dark rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
        title={t('contact.callBtn')}
        aria-label="Call Owner directly"
      >
        <Phone className="h-5 w-5 fill-current" />
      </motion.a>

      {/* Scroll To Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-agri-green-800 hover:bg-agri-green-900 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            title="Scroll to Top"
            aria-label="Scroll to top of page"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
