import hiTranslations from './translations/hi.json';
import enTranslations from './translations/en.json';
import { getSettings } from '@/lib/settings';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { getLocalizedField, getLocalizedCategory } from './translationUtils';

/**
 * Server-side helper to fetch localized settings and translations without React Context.
 */
export async function getTranslationServer(language: string) {
  const settings = await getSettings();
  const translations = language === 'en' ? enTranslations : hiTranslations;
  
  const t = (key: string, options?: any): string => {
    const isHi = language === 'hi';
    
    // 1. Resolve shop settings keys dynamically
    if (key === 'shopName') return (isHi ? (settings.shopName || DEFAULT_SETTINGS.shopName) : (settings.shopNameEn || DEFAULT_SETTINGS.shopNameEn)) as string;
    if (key === 'ownerName') return (isHi ? (settings.ownerName || DEFAULT_SETTINGS.ownerName) : (settings.ownerNameEn || DEFAULT_SETTINGS.ownerNameEn)) as string;
    if (key === 'address') return (isHi ? (settings.address || DEFAULT_SETTINGS.address) : (settings.addressEn || DEFAULT_SETTINGS.addressEn)) as string;
    if (key === 'businessHours') return (isHi ? (settings.businessHours || DEFAULT_SETTINGS.businessHours) : (settings.businessHoursEn || DEFAULT_SETTINGS.businessHoursEn)) as string;
    if (key === 'aboutText') return (isHi ? (settings.aboutText || DEFAULT_SETTINGS.aboutText) : (settings.aboutTextEn || DEFAULT_SETTINGS.aboutTextEn)) as string;
    if (key === 'heroTitle') return (isHi ? (settings.heroTitle || DEFAULT_SETTINGS.heroTitle) : (settings.heroTitleEn || DEFAULT_SETTINGS.heroTitleEn)) as string;
    if (key === 'heroSubtitle') return (isHi ? (settings.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle) : (settings.heroSubtitleEn || DEFAULT_SETTINGS.heroSubtitleEn)) as string;
    
    // 2. Direct settings that don't vary by language
    if (settings[key] !== undefined) {
      return (settings[key] || DEFAULT_SETTINGS[key] || '') as string;
    }
    
    // 3. Look up path inside static JSON translation resources
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        result = undefined;
        break;
      }
    }
    
    if (typeof result === 'string') {
      if (options) {
        let val = result;
        Object.entries(options).forEach(([k, v]) => {
          val = val.replace(`{{${k}}}`, String(v));
        });
        return val as string;
      }
      return result as string;
    }
    
    return key;
  };
  
  const tField = (obj: any, fieldName: string) => {
    return getLocalizedField(obj, fieldName, language);
  };
  
  const tCategory = (cat: any) => {
    return getLocalizedCategory(cat, language, t);
  };
  
  return { t, tField, tCategory };
}
