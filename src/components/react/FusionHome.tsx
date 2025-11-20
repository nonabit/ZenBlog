import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight, Github, Twitter, Mail, MapPin, Cpu, Send } from 'lucide-react';
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

const STACK = [
  { name: "Astro", icon: "🚀" },
  { name: "React", icon: "⚛" },
  { name: "Tailwind", icon: "🌊" },
  { name: "TypeScript", icon: "TS" }
];

// --- 新增：动态签名组件 ---
const AnimatedSignature = () => (
  <svg width="200" height="60" viewBox="0 0 200 60" className="text-zinc-900 dark:text-zinc-100 opacity-80">
    <motion.path
      d="M10 30 C 40 10, 60 50, 90 30 S 150 0, 190 30" // 这是一个抽象的签名轨迹
      fill="transparent"
      strokeWidth="2"
      stroke="currentColor"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
    />
    {/* 装饰点 */}
    <motion.circle
      cx="195" cy="30" r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 1.7, duration: 0.2 }}
    />
  </svg>
);

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

      {/* ... (保留 Bento Grid Section) ... */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-24"
      >
        <BentoItem className="sm:col-span-2 min-h-[200px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 mb-4 text-sm font-medium uppercase tracking-wider">
              <Cpu size={14} />
              <span>Currently Hacking On</span>
            </div>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">Astro Fusion Theme</h3>
          </div>
          <div className="mt-4">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Migrating from React SPA to Islands Architecture for better performance and SEO.
            </p>
          </div>
        </BentoItem>

        <BentoItem className="flex flex-col justify-center items-center text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full relative z-10"></div>
          </div>
          <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">Available</div>
          <div className="flex items-center gap-1 text-zinc-400 text-xs font-mono">
            <MapPin size={12} />
            <span>Shanghai, CN</span>
          </div>
        </BentoItem>

        <BentoItem className="sm:col-span-1 flex flex-col justify-between group">
          <div className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Connect</div>
          <div className="flex gap-4 mt-4">
            <a href="#" className="p-2 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 hover:scale-110 transition-transform text-zinc-600 dark:text-zinc-300">
              <Twitter size={18} />
            </a>
            <a href="#" className="p-2 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 hover:scale-110 transition-transform text-zinc-600 dark:text-zinc-300">
              <Github size={18} />
            </a>
            <a href="#" className="p-2 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 hover:scale-110 transition-transform text-zinc-600 dark:text-zinc-300">
              <Mail size={18} />
            </a>
          </div>
        </BentoItem>

        <BentoItem className="sm:col-span-2 overflow-hidden flex flex-col justify-center">
          <div className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-4">Toolbox</div>
          <div className="flex flex-wrap gap-3">
            {STACK.map((tech) => (
              <span key={tech.name} className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-xs font-mono text-zinc-600 dark:text-zinc-300 shadow-sm hover:border-zinc-400 transition-colors cursor-default">
                {tech.icon} {tech.name}
              </span>
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

      {/* --- 新增：Footer CTA & Signature (填补右下角空白) --- */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end border-t border-zinc-200 dark:border-zinc-800 pt-16"
      >
        {/* 左侧：订阅框 */}
        <div className="space-y-6">
          <h3 className="font-serif text-3xl font-medium text-zinc-900 dark:text-zinc-100">
            Keep in touch
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm">
            Get notified about new posts and projects. No spam, just code and design thoughts.
          </p>
          <form className="flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-500/20 transition-all"
            />
            <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors flex items-center gap-2">
              <span>Subscribe</span>
              <Send size={14} />
            </button>
          </form>
        </div>

        {/* 右侧：动态签名 (视觉平衡) */}
        <div className="flex flex-col items-start md:items-end justify-end">
          <div className="text-zinc-400 text-xs font-mono mb-4 uppercase tracking-widest">
            Digital Garden of
          </div>
          <AnimatedSignature />
        </div>
      </motion.section>
    </div>
  );
}