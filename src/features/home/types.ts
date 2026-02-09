import type { BlogListItem } from '@/types/content';
import type { Language } from '@/i18n/config';
import type { TranslationDictionary } from '@/shared/i18n/types';

export interface HomeLandingProps {
  posts: BlogListItem[];
  lang: Language;
  t: TranslationDictionary;
}
