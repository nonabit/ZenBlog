import { motion } from 'framer-motion';
import { Clock, Code2, Cpu, Disc, MapPin, PenTool, Server } from 'lucide-react';
import BentoItem from '@/features/home/components/BentoItem.client';
import TechDeck from '@/features/home/components/TechDeck.client';
import TimeDisplay from '@/features/home/components/TimeDisplay.client';
import type { TranslationDictionary, TranslationKey } from '@/shared/i18n/types';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const musicWave = [
  { heights: [4, 12, 6, 14, 4], duration: 0.6, delay: 0 },
  { heights: [8, 4, 14, 6, 8], duration: 0.7, delay: 0.1 },
  { heights: [6, 14, 4, 10, 6], duration: 0.5, delay: 0.2 },
  { heights: [12, 6, 10, 4, 12], duration: 0.8, delay: 0.3 },
];

const STACK_GROUPS = [
  { title: 'Frontend', icon: Code2, items: ['React', 'Astro', 'Next.js', 'Tailwind', 'TypeScript', 'Framer Motion'] },
  { title: 'Backend', icon: Server, items: ['Rust', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'Go', 'Cpp'] },
  { title: 'Toolkit', icon: PenTool, items: ['Neovim', 'Git', 'Gemini', 'YouMind', 'Muset', 'ChatGPT', 'Vercel'] },
];

interface HomeBentoSectionProps {
  t: TranslationDictionary;
}

export default function HomeBentoSection({ t }: HomeBentoSectionProps) {
  const translate = (key: TranslationKey) => t[key] || key;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-24"
    >
      <BentoItem className="sm:col-span-2 min-h-[200px] flex flex-col justify-between relative">
        <div
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08] pointer-events-none text-zinc-900 dark:text-zinc-100"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            maskImage: 'radial-gradient(circle at top right, black 0%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at top right, black 0%, transparent 80%)',
          }}
        />

        <div>
          <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold font-mono uppercase tracking-widest opacity-80">
            <Cpu size={14} />
            <span>{translate('home.building')}</span>
          </div>
          <h3 className="text-3xl font-heading text-zinc-900 dark:text-zinc-100 relative z-10 tracking-tight">
            {translate('home.building.title')}
          </h3>
        </div>

        <div className="mt-4 relative z-10 w-full sm:w-full">
          <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
            {translate('home.building.desc')}
          </p>
        </div>
      </BentoItem>

      <BentoItem className="flex flex-col justify-center items-center text-center">
        <div className="absolute top-3 right-3">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-2">
            <MapPin size={20} className="text-zinc-600 dark:text-zinc-300" />
          </div>
          <div className="font-medium text-zinc-900 dark:text-zinc-100">{translate('home.location')}</div>
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
            <Clock size={10} />
            <TimeDisplay />
          </div>
        </div>
      </BentoItem>

      <BentoItem className="sm:col-span-1 flex flex-col justify-between group overflow-hidden relative">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-zinc-500/10 rounded-full blur-2xl group-hover:bg-zinc-500/20 transition-colors" />

        <div className="flex justify-between items-start">
          <div className="text-zinc-400 text-xs font-bold font-mono uppercase tracking-widest flex items-center gap-2">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
              <Disc size={14} />
            </motion.div>
            <span>{translate('home.music')}</span>
          </div>

          <div className="flex items-end gap-0.5 h-4">
            {musicWave.map((wave, index) => (
              <motion.div
                key={index}
                className="w-1 bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-500 dark:group-hover:bg-zinc-400 transition-colors rounded-t-sm"
                animate={{ height: wave.heights }}
                transition={{
                  duration: wave.duration,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: wave.delay,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-4">
          <div className="font-heading text-lg font-medium text-zinc-900 dark:text-zinc-100 truncate tracking-tight">
            Cornfield Chase
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1 font-medium tracking-wide">
            Hans Zimmer • Interstellar
          </div>
        </div>
      </BentoItem>

      <BentoItem className="sm:col-span-2 flex flex-col justify-center">
        <div className="grid grid-cols-3 gap-4 h-full">
          {STACK_GROUPS.map((group, index) => (
            <TechDeck key={group.title} group={group} delay={index * 200} />
          ))}
        </div>
      </BentoItem>
    </motion.section>
  );
}
