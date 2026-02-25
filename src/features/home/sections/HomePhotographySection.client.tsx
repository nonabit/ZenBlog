import { motion } from 'framer-motion';
import type { PhotographyPhotoItem } from '@/types/content';
import type { Language } from '@/i18n/config';
import type { TranslationDictionary, TranslationKey } from '@/shared/i18n/types';

interface HomePhotographySectionProps {
  photos: PhotographyPhotoItem[];
  lang: Language;
  t: TranslationDictionary;
}

export default function HomePhotographySection({ photos, lang, t }: HomePhotographySectionProps) {
  const translate = (key: TranslationKey) => t[key] || key;
  const getPhotographyUrl = () => (lang === 'zh' ? '/zh/photography' : '/photography');

  if (photos.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-24 sm:mb-32"
    >
      <div className="mb-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[17px] font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
            {translate('home.photography')}
          </h2>
          <a
            href={getPhotographyUrl()}
            className="text-sm text-zinc-400"
          >
            {translate('home.viewAll')} →
          </a>
        </div>
        <p className="mt-4 max-w-4xl text-base font-light leading-8 text-zinc-600 dark:text-zinc-400">
          {translate('home.photography.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.slug} className="relative overflow-hidden aspect-[4/3]">
            <img
              src={photo.data.imageSrc}
              alt={photo.data.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
