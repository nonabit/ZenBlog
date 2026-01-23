import { defaultLang, type Language } from './config';
import { translations } from './translations';

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang === 'zh') return 'zh';
  return defaultLang;
}

export function useTranslations(lang: Language) {
  return function t(key: string): string {
    return translations[lang][key] || key;
  };
}
