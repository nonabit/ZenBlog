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
      <div className="flex items-baseline justify-between mb-8 max-w-2xl">
        <h2 className="text-sm text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          {translate('home.photography')}
        </h2>
        <a
          href={getPhotographyUrl()}
          className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          {translate('home.viewAll')} →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.slug} className="group relative overflow-hidden rounded-md aspect-[4/3]">
            <img
              src={photo.data.imageSrc}
              alt={photo.data.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {photo.data.location && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                <span className="text-white text-sm px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.data.location}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
