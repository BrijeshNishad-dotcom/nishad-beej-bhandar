'use client';

import Image from 'next/image';
import { useSettings } from '@/components/SettingsProvider';
import { Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * MobileBrandBanner
 * Shown ONLY on mobile (< sm breakpoint) to display the shop name and owner
 * that are hidden inside the navbar logo area on small screens.
 * Rendered invisible on sm+ screens — desktop layout is untouched.
 */
export default function MobileBrandBanner() {
  const { t, i18n } = useTranslation();
  const settings = useSettings();
  const shopName = i18n.language === 'hi' ? 'निषाद बीज भंडार' : (settings.shopName || 'Nishad Beej Bhandar');
  const ownerName = settings.ownerName || 'Abhay Nishad';

  return (
    <div className="sm:hidden w-full bg-gradient-to-r from-agri-green-900 via-agri-green-800 to-agri-dark border-b border-agri-green-700/60">
      <div className="flex items-center justify-center gap-3 px-4 py-3.5">
        {/* Logo mark */}
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-white/20">
          <Image
            src="/brand-logo.png"
            alt={`${shopName} Logo`}
            fill
            sizes="36px"
            className="object-contain"
          />
        </div>

        {/* Text block */}
        <div className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-extrabold text-white tracking-tight leading-snug">
            {shopName}
          </span>
          <span className="font-sans text-[11px] font-semibold text-agri-yellow-500 tracking-wide mt-0.5 flex items-center gap-1">
            <Leaf className="h-3 w-3 shrink-0" />
            {ownerName}
          </span>
        </div>
      </div>
    </div>
  );
}
