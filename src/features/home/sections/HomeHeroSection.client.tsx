import { motion, type Variants } from 'framer-motion';
import type { TranslationDictionary, TranslationKey } from '@/shared/i18n/types';
import { Cover } from '@/components/ui/cover';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 100,
      mass: 0.5,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

interface HomeHeroSectionProps {
  t: TranslationDictionary;
}

export default function HomeHeroSection({ t }: HomeHeroSectionProps) {
  const translate = (key: TranslationKey) => t[key] || key;

  return (
    <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="mb-32">
      <motion.h1
        variants={fadeInUp}
        className="font-heading text-6xl sm:text-8xl font-medium tracking-tighter text-zinc-900 dark:text-zinc-50 mb-8 leading-[1]"
      >
        {translate('home.hero.title1')} <br />
        <Cover shakeIntensity={1} scaleDuration={3}>{translate('home.hero.title2')}</Cover>{' '}
        {translate('home.hero.title3')}
      </motion.h1>
      <motion.p
        variants={fadeInUp}
        className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed font-light tracking-wide"
      >
        {translate('home.hero.subtitle')}
      </motion.p>
    </motion.section>
  );
}
