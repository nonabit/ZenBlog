import { motion } from 'framer-motion';
import { RiGithubFill, RiTwitterXFill, RiMailLine } from '@remixicon/react';
import type { TranslationDictionary, TranslationKey } from '@/shared/i18n/types';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

interface HomeHeroSectionProps {
  t: TranslationDictionary;
}

export default function HomeHeroSection({ t }: HomeHeroSectionProps) {
  const translate = (key: TranslationKey) => t[key] || key;

  return (
    <section className="mb-24 sm:mb-32">
      <motion.h1
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100"
      >
        {translate('home.hero.name')}
      </motion.h1>
      <motion.p
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mt-3 text-base text-zinc-500 dark:text-zinc-400"
      >
        {translate('home.hero.tagline')}
      </motion.p>
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mt-4 flex items-center gap-4"
      >
        <a href="https://github.com/99byte" target="_blank" rel="noopener noreferrer"
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          <RiGithubFill size={18} />
        </a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer"
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          <RiTwitterXFill size={18} />
        </a>
        <a href="mailto:contact@ninthbit.org"
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          <RiMailLine size={18} />
        </a>
      </motion.div>
    </section>
  );
}
