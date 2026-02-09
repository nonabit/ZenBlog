import { motion, type Variants } from 'framer-motion';

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

interface BentoItemProps {
  className?: string;
  children: React.ReactNode;
}

export default function BentoItem({ className = '', children }: BentoItemProps) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: 'easeOut' } }}
      className={`
        bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md
        border border-zinc-200/60 dark:border-zinc-800/60
        rounded-3xl p-6 relative overflow-hidden group
        shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50
        transition-all duration-500
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-zinc-100/40 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      {children}
    </motion.div>
  );
}
