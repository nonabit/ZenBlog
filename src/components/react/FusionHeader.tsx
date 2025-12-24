import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Search, ArrowUpRight, Moon, Sun, Rss } from 'lucide-react';
import Magnetic from './Magnetic'; // 引入我们刚写的磁吸组件

// 定义 Props 接口
interface CmdKModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Cmd+K 模态框组件
const CmdKModal: React.FC<CmdKModalProps> = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-50"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-50 overflow-hidden"
        >
          <div className="flex items-center px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <Search className="w-5 h-5 text-zinc-400 mr-3" />
            <input
              type="text"
              placeholder="Type a command or search..."
              className="w-full bg-transparent outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 font-mono text-sm"
              autoFocus
            />
            <div className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">ESC</div>
          </div>
          <div className="p-2">
            <div className="px-2 py-1.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">Suggestions</div>
            {/* Cmd+K 菜单中的链接一般不需要磁吸，保持简单列表即可 */}
            {['Home', 'Blog', 'Projects', 'Now', 'About'].map((item, i) => (
              <a key={i} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer group transition-colors no-underline">
                <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">{item}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors" />
              </a>
            ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function FusionHeader() {
  const [darkMode, setDarkMode] = useState(false);
  const [cmdKOpen, setCmdKOpen] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdKOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <CmdKModal isOpen={cmdKOpen} onClose={() => setCmdKOpen(false)} />
      {/* 
        修改：更硬朗的黑色线条 (border-zinc-900/10 用于浅色模式，保持锐利但不过分突兀； dark:border-zinc-100/10 用于深色)
        或者如果用户想要极致的黑线，可以用 border-black 搭配 opacity-5
      */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-900/80 dark:border-zinc-50/20 transition-all duration-300">
        {/* 背景处理：毛玻璃 + 噪点 + 饱和度提升 */}
        <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-xl backdrop-saturate-150 supports-backdrop-filter:bg-white/60"></div>
        {/* 噪点纹理层 - 可选，这里用 CSS pattern 模拟 subtle noise */}
        <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E")' }}></div>

        <div className="relative max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo 也可以加上轻微磁吸，但通常 Logo 保持稳重 */}
          <a href="/" className="font-serif font-bold text-xl tracking-tight flex items-center gap-2 no-underline text-zinc-900 dark:text-zinc-100 leading-none">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse translate-y-[-2px]"></span>
            9Byte.Dev
          </a>

          <nav className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {/* 改造 1：给导航链接加上 Magnetic 包裹 */}
              {['Blog', 'Projects', 'Now', 'About'].map(item => (
                <Magnetic key={item} strength={0.2}>
                  <a href={`/${item.toLowerCase()}`} className="block px-2 py-2 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors relative group no-underline">
                    {item}
                    {/* 下划线也需要跟着动，所以它在 Magnetic 内部 */}
                    <span className="absolute bottom-1 left-2 w-0 h-px bg-zinc-400 transition-all group-hover:w-[calc(100%-16px)] opacity-50"></span>
                  </a>
                </Magnetic>
              ))}
            </div>

            <div className="flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-6">
              <Magnetic>
                <a
                  href="/rss.xml"
                  target="_blank"
                  className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-orange-500 transition-colors"
                  aria-label="RSS Feed"
                >
                  <Rss size={18} />
                </a>
              </Magnetic>
              {/* 改造 2：给按钮加上 Magnetic 包裹 */}
              <Magnetic>
                <button
                  onClick={() => setCmdKOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-2 py-1.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <Command size={12} />
                  <span>K</span>
                </button>
              </Magnetic>

              <Magnetic>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </Magnetic>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
