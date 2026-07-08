import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hiTranslations from './translations/hi.json';
import enTranslations from './translations/en.json';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        hi: { translation: hiTranslations },
        en: { translation: enTranslations },
      },
      lng: 'hi',
      fallbackLng: 'hi',
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
