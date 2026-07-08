'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { t } = useTranslation();

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-sans font-medium text-gray-400 flex-wrap gap-y-1">
        <li className="flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-agri-green-800 transition-colors"
          >
            <Home className="h-4 w-4 mr-1.5 shrink-0 text-gray-400" />
            <span>{t('breadcrumbs.home')}</span>
          </Link>
        </li>
        
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center">
              <ChevronRight className="h-3.5 w-3.5 text-gray-300 mx-1 shrink-0" />
              {isLast || !item.href ? (
                <span className="text-agri-green-850 font-bold truncate max-w-[180px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-agri-green-800 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
