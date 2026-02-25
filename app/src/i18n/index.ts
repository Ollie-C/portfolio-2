import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import jaTranslations from './locales/ja.json';

function getDefaultLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || '';
  if (browserLang && (browserLang.startsWith('ja') || browserLang === 'ja')) return 'ja';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Tokyo' || tz?.startsWith('Japan')) return 'ja';
  } catch {
    // ignore
  }
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    ja: {
      translation: jaTranslations,
    },
  },
  lng: getDefaultLanguage(),
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',

  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
