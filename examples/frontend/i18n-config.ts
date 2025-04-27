import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define supported languages
const supportedLngs = ['en', 'hi', 'es', 'fr', 'zh', 'ar'];

// Define language namespaces
const ns = ['common', 'auth', 'dashboard', 'moderation'];
const defaultNS = 'common';

/**
 * Initialize i18next with configuration for Birbal AI
 * This setup enables multilingual support across the application
 */
i18n
  // Load translations from backend
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Default language
    lng: 'en',
    // Fallback language if translation is missing
    fallbackLng: 'en',
    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',
    // Namespaces configuration
    ns,
    defaultNS,
    // Supported languages
    supportedLngs,
    // Backend configuration
    backend: {
      // Path to load translations from
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // Interpolation configuration
    interpolation: {
      // React already safes from XSS
      escapeValue: false,
    },
    // React configuration
    react: {
      // Wait for translations to be loaded
      wait: true,
      // Use Suspense for loading
      useSuspense: true,
    },
  });

/**
 * Example of language resources structure:
 * 
 * /public/locales/en/common.json
 * {
 *   "welcome": "Welcome to Birbal AI",
 *   "language": "Language",
 *   "settings": "Settings"
 * }
 * 
 * /public/locales/hi/common.json
 * {
 *   "welcome": "बिरबल एआई में आपका स्वागत है",
 *   "language": "भाषा",
 *   "settings": "सेटिंग्स"
 * }
 */

/**
 * Helper function to change language
 */
export const changeLanguage = async (lng: string) => {
  if (supportedLngs.includes(lng)) {
    await i18n.changeLanguage(lng);
    // Update document direction for RTL languages
    document.documentElement.dir = ['ar', 'he', 'ur'].includes(lng) ? 'rtl' : 'ltr';
    // Store language preference
    localStorage.setItem('i18nextLng', lng);
  }
};

/**
 * Export configured i18n instance
 */
export default i18n;
