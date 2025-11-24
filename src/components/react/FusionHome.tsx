import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants, useInView } from 'framer-motion';
import { ArrowUpRight, MapPin, Cpu, Disc, Clock, Code2, Server, PenTool } from 'lucide-react';
import type { BlogListItem } from '../../types/content';

// 定义 Props 接口
// 这里对应 index.astro 中 getCollection 返回的数据结构
interface FusionHomeProps {
  posts: BlogListItem[];
}

// 动画变体
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// ... (保留 BentoItem 组件) ...
const BentoItem: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className={`bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 relative overflow-hidden group ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-zinc-100/50 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    {children}
  </motion.div>
);

// --- 升级：技术栈数据 (分为三组) ---
const STACK_GROUPS = [
  {
    title: "Frontend",
    icon: Code2,
    items: ["React", "Astro", "Next.js", "Tailwind", "TypeScript", "Framer Motion"]
  },
  {
    title: "Backend",
    icon: Server,
    items: ["Rust", "Python", "PostgreSQL", "Redis", "Docker", "Go", "Cpp"]
  },
  {
    title: "Toolkit",
    icon: PenTool,
    items: ["Neovim", "Git", "Gemini", "YouMind", "Muset", "ChatGPT", "Vercel"]
  }
];

// --- 新增：技术栈卡组组件 (Tech Deck) ---
// --- 升级：智能 Tech Deck 组件 ---
const TechDeck = ({ group, delay = 0 }: { group: typeof STACK_GROUPS[0], delay?: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  // 视口检测：只有当组件进入屏幕 50% 时才触发
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });

  // 逻辑 1：开场秀 (Intro Sequence) - 增加了 delay 处理
  useEffect(() => {
    if (!isInView || hasPlayedIntro || isHovering) return;

    let interval: NodeJS.Timeout;

    // 使用 setTimeout 实现错峰启动
    const startTimeout = setTimeout(() => {
      let count = 0;
      const maxCount = group.items.length;

      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % group.items.length);
        count++;

        if (count >= maxCount) {
          setHasPlayedIntro(true);
          clearInterval(interval);
        }
      }, 600);
    }, delay); // 应用传入的延时

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [isInView, hasPlayedIntro, isHovering, group.items.length, delay]);

  // 逻辑 2：悬停轮播 (Hover Loop)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovering) {
      setHasPlayedIntro(true);

      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % group.items.length);
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isHovering, group.items.length]);

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
        {/* 背景堆叠暗示 */}
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-xl rotate-3 scale-90 opacity-50 border border-zinc-300 dark:border-zinc-700 transition-transform duration-300 group-hover:rotate-6"></div>
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-xl -rotate-2 scale-95 opacity-70 border border-zinc-300 dark:border-zinc-700 transition-transform duration-300 group-hover:-rotate-3"></div>

        {/* 前台卡片 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTech}
            initial={{ y: 10, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl flex items-center justify-center shadow-sm z-10 select-none cursor-default"
          >
            <span className="font-mono font-bold text-zinc-700 dark:text-zinc-200 text-sm">
              {currentTech}
            </span>
            {/* 状态指示灯 */}
            <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${(!hasPlayedIntro || isHovering) ? 'bg-orange-500 animate-pulse' : 'bg-zinc-200 dark:bg-zinc-800'}`}></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 进度指示条 */}
      <div className="h-1 bg-zinc-100 dark:bg-zinc-800 mt-3 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-zinc-300 dark:bg-zinc-600"
          animate={{ width: `${((currentIndex + 1) / group.items.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

// --- 新增：实时时钟组件 ---
const TimeDisplay = () => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // 客户端才执行，避免 SSR 水合不匹配
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Shanghai' // 替换为你的时区
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 初始渲染占位，防止布局跳动
  if (!time) return <span className="opacity-0">00:00 PM</span>;

  return <span>{time}</span>;
};

export default function FusionHome({ posts }: FusionHomeProps) {
  return (
    <div className="max-w-screen-lg mx-auto px-6 py-16 sm:py-24">
      {/* ... (保留 Hero Section) ... */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mb-24"
      >
        <motion.h1
          variants={fadeInUp}
          className="font-serif text-5xl sm:text-7xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-8 leading-[1.1]"
        >
          Crafting digital <br />
          <span className="italic text-zinc-400 dark:text-zinc-600">artifacts</span> & stories.
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed font-light"
        >
          I'm a design engineer obsessed with the intersection of typography and code. Currently building interfaces that feel human.
        </motion.p>
      </motion.section>

      {/* --- Bento Grid Section (升级版) --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-24"
      >
        {/* Card 1: Currently Hacking (全覆盖点阵背景 + 蒙版淡出) */}
        <BentoItem className="sm:col-span-2 min-h-[200px] flex flex-col justify-between relative">
          {/* 装饰性背景：覆盖全卡片，但在文字区域淡出 */}
          <div
            className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08] pointer-events-none text-zinc-900 dark:text-zinc-100"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              // 使用 Mask 遮罩：右上角不透明，向左下角逐渐透明，避免干扰文字
              maskImage: 'radial-gradient(circle at top right, black 0%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at top right, black 0%, transparent 80%)'
            }}
          ></div>

          <div>
            <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs font-bold font-mono uppercase tracking-widest">
              <Cpu size={14} />
              <span>Building</span>
            </div>
            <h3 className="text-2xl font-serif text-zinc-900 dark:text-zinc-100 relative z-10">Astro Fusion Theme</h3>
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm">
              Migrating from React SPA to Islands Architecture for better performance and SEO.
            </p>
          </div>
        </BentoItem>

        {/* Card 2: Location / Status (增加时钟) */}
        <BentoItem className="flex flex-col justify-center items-center text-center">
          <div className="absolute top-3 right-3">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-2">
              <MapPin size={20} className="text-zinc-600 dark:text-zinc-300" />
            </div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">Shanghai, CN</div>
            {/* 实时时钟显示 */}
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
              <Clock size={10} />
              <TimeDisplay />
            </div>
          </div>
        </BentoItem>

        {/* Card 3: Sonic Music (替代了原来的 Connect) 
             展示最近在听的音乐，带有波形动画，增加生活气息和视觉律动
          */}
        <BentoItem className="sm:col-span-1 flex flex-col justify-between group overflow-hidden relative">
          {/* 背景装饰：橙色光晕 */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors"></div>

          <div className="flex justify-between items-start">
            <div className="text-zinc-400 text-xs font-bold font-mono uppercase tracking-widest flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Disc size={14} />
              </motion.div>
              <span>Music</span>
            </div>
            {/* 动态波形 (Audio Visualizer Animation) */}
            <div className="flex items-end gap-0.5 h-4">
              <motion.div
                className="w-1 bg-zinc-300 dark:bg-zinc-700 group-hover:bg-orange-500 transition-colors rounded-t-sm"
                animate={{ height: [4, 12, 6, 14, 4] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.div
                className="w-1 bg-zinc-300 dark:bg-zinc-700 group-hover:bg-orange-500 transition-colors rounded-t-sm"
                animate={{ height: [8, 4, 14, 6, 8] }}
                transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse", delay: 0.1 }}
              />
              <motion.div
                className="w-1 bg-zinc-300 dark:bg-zinc-700 group-hover:bg-orange-500 transition-colors rounded-t-sm"
                animate={{ height: [6, 14, 4, 10, 6] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
              />
              <motion.div
                className="w-1 bg-zinc-300 dark:bg-zinc-700 group-hover:bg-orange-500 transition-colors rounded-t-sm"
                animate={{ height: [12, 6, 10, 4, 12] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
              />
            </div>
          </div>

          <div className="relative z-10 mt-4">
            {/* 你可以手动更新这首歌，或者后续接入 Spotify API */}
            <div className="font-serif text-lg font-medium text-zinc-900 dark:text-zinc-100 truncate">
              Cornfield Chase
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              Hans Zimmer • Interstellar
            </div>
          </div>
        </BentoItem>

        {/* Card 4: Toolbox (Upgraded to Tech Deck) */}
        <BentoItem className="sm:col-span-2 flex flex-col justify-center">
          {/* 使用 Grid 将三组卡组并排显示 */}
          <div className="grid grid-cols-3 gap-4 h-full">
            {/* 修改：传入 delay 参数，每组间隔 200ms */}
            {STACK_GROUPS.map((group, index) => (
              <TechDeck key={group.title} group={group} delay={index * 200} />
            ))}
          </div>
        </BentoItem>
      </motion.section>

      {/* --- Writings List --- */}
      <section className="max-w-2xl mb-32">
        <div className="flex items-baseline justify-between mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="font-serif text-3xl text-zinc-900 dark:text-zinc-100">Selected Writing</h2>
          <a href="/blog" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">View All</a>
        </div>

        <div className="space-y-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <a href={`/blog/${post.slug}`} className="block no-underline">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline decoration-zinc-300 underline-offset-4 decoration-1 transition-all">
                    {post.data.title}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400 shrink-0 mt-1 sm:mt-0">
                    {new Date(post.data.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm max-w-lg">
                  {post.data.description}
                </p>
                <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all ease-out duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    Read <ArrowUpRight size={12} />
                  </span>
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
