import { Rss, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import type { Language } from '@/i18n/config';

interface FusionHeaderProps {
  currentPath?: string;
  lang?: Language;
  translations?: Record<string, string>;
}

export default function FusionHeader({
  currentPath = '',
  lang = 'en',
  translations = {}
}: FusionHeaderProps) {
  const t = (key: string) => translations[key] || key;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 判断是否为当前页面
  const isActive = (item: string) => {
    const path = currentPath.toLowerCase();
    // 处理中文路径：/zh/blog 或英文路径：/blog
    const itemPath = lang === 'zh' ? `/zh/${item.toLowerCase()}` : `/${item.toLowerCase()}`;
    return path === itemPath || path.startsWith(`${itemPath}/`);
  };

  const navItems = [
    { key: 'blog', label: t('nav.blog') },
    { key: 'projects', label: t('nav.projects') },
    { key: 'about', label: t('nav.about') },
  ];

  return (
    <header className="relative z-40 w-full transition-all duration-300">
      {/* 背景处理：毛玻璃效果 */}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md"></div>

      <div className="relative max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href={lang === 'zh' ? '/zh' : '/'} className="font-heading font-bold text-xl tracking-tight flex items-center gap-2 no-underline text-zinc-900 dark:text-zinc-100 leading-none">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse translate-y-[-2px]"></span>
          Silicon Universe
        </a>

        <nav className="flex items-center gap-6">
          {/* 桌面端导航 */}
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {navItems.map(item => {
              const active = isActive(item.key);
              const href = lang === 'zh' ? `/zh/${item.key}` : `/${item.key}`;
              return (
                <a
                  key={item.key}
                  href={href}
                  className={`block px-2 py-2 transition-colors relative group no-underline ${
                    active ? 'text-zinc-900 dark:text-zinc-100' : 'hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-1 left-2 h-px bg-zinc-900 dark:bg-zinc-100 transition-all ${
                      active ? 'w-[calc(100%-16px)]' : 'w-0 group-hover:w-[calc(100%-16px)] opacity-50'
                    }`}
                  />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-6">
            <LanguageSwitcher currentLang={lang} currentPath={currentPath} />
            <a
              href="/rss.xml"
              target="_blank"
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-orange-500 transition-colors"
              aria-label="RSS Feed"
            >
              <Rss size={18} />
            </a>

            {/* 移动端汉堡菜单按钮 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* 移动端下拉菜单 */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-black relative z-50">
          {/* 菜单内容区域 */}
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-4 space-y-2">
              {navItems.map(item => {
                const active = isActive(item.key);
                const href = lang === 'zh' ? `/zh/${item.key}` : `/${item.key}`;
                return (
                  <a
                    key={item.key}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-6 py-4 rounded-2xl text-lg font-medium transition-colors no-underline ${
                      active
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
