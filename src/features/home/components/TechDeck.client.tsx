import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import type { RemixiconComponentType } from '@remixicon/react';

interface TechDeckGroup {
  title: string;
  icon: RemixiconComponentType;
  items: string[];
}

interface TechDeckProps {
  group: TechDeckGroup;
  delay?: number;
}

export default function TechDeck({ group, delay = 0 }: TechDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView || hasPlayedIntro || isHovering) return;

    let interval: NodeJS.Timeout;

    const startTimeout = setTimeout(() => {
      let count = 0;
      const maxCount = group.items.length;

      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % group.items.length);
        count += 1;

        if (count >= maxCount) {
          setHasPlayedIntro(true);
          clearInterval(interval);
        }
      }, 600);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [delay, group.items.length, hasPlayedIntro, isHovering, isInView]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHovering) {
      setHasPlayedIntro(true);
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % group.items.length);
      }, 600);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [group.items.length, isHovering]);

  const currentTech = group.items[currentIndex];

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center gap-2 text-zinc-400 mb-3 text-[10px] font-bold font-mono uppercase tracking-widest select-none">
        <group.icon size={12} />
        <span>{group.title}</span>
      </div>

      <div className="relative flex-1 min-h-[60px] flex items-center">
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-xl rotate-3 scale-90 opacity-50 border border-zinc-300 dark:border-zinc-700 transition-transform duration-300 group-hover:rotate-6" />
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-xl -rotate-2 scale-95 opacity-70 border border-zinc-300 dark:border-zinc-700 transition-transform duration-300 group-hover:-rotate-3" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTech}
            initial={{ y: 20, opacity: 0, scale: 0.9, rotateX: -15 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ y: -20, opacity: 0, scale: 0.9, rotateX: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute inset-0 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl flex items-center justify-center shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:shadow-black/40 z-10 select-none cursor-default"
          >
            <span className="font-mono font-bold text-zinc-700 dark:text-zinc-200 text-sm tracking-tight">
              {currentTech}
            </span>
            <div
              className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                !hasPlayedIntro || isHovering
                  ? 'bg-zinc-500 dark:bg-zinc-400 animate-pulse'
                  : 'bg-zinc-200 dark:bg-zinc-800'
              }`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="h-1 bg-zinc-100 dark:bg-zinc-800 mt-3 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-zinc-300 dark:bg-zinc-600"
          animate={{ width: `${((currentIndex + 1) / group.items.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
