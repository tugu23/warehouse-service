import { Request } from 'express';
import { translations, Language, Translations } from './translations';

// Default language
const DEFAULT_LANGUAGE: Language = 'mn'; // Changed to Mongolian by default

/**
 * Get language from request headers or default to Mongolian
 */
export function getLanguage(req: Request): Language {
  const lang = req.headers['accept-language'] || req.headers['language'];
  
  if (typeof lang === 'string') {
    const primaryLang = lang.split(',')[0].split('-')[0].toLowerCase();
    if (primaryLang === 'mn' || primaryLang === 'mo') return 'mn';
    if (primaryLang === 'en') return 'en';
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * Get translations for specific language
 */
export function getTranslations(lang: Language = DEFAULT_LANGUAGE): Translations {
  return translations[lang] || translations[DEFAULT_LANGUAGE];
}

/**
 * Get translation function for request
 */
export function t(req: Request): Translations {
  const lang = getLanguage(req);
  return getTranslations(lang);
}

/**
 * Get translation function for specific language
 */
export function tLang(lang: Language = DEFAULT_LANGUAGE): Translations {
  return getTranslations(lang);
}

// Export types and translations
export * from './translations';
export { translations };

