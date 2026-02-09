import type { Language } from '@/i18n/config';
import { translations } from '@/i18n/translations';

export type TranslationDictionary = (typeof translations)[Language];
export type TranslationKey = keyof TranslationDictionary;

export function getTranslationDictionary(lang: Language): TranslationDictionary {
  return translations[lang];
}
