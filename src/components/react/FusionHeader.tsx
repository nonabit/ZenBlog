import { Rss } from 'lucide-react';
import Magnetic from './Magnetic';
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

  // 判断是否为当前页面
  const isActive = (item: string) => {
    const path = currentPath.toLowerCase();
    const itemPath = `/${item.toLowerCase()}`;
    return path === itemPath || path.startsWith(`${itemPath}/`);
  };

  const navItems = [
    { key: 'blog', label: t('nav.blog') },
    { key: 'projects', label: t('nav.projects') },
    { key: 'about', label: t('nav.about') },
  ];

  return (
    <header className="relative z-40 w-full border-b border-zinc-900/80 dark:border-zinc-50/20 transition-all duration-300">
      {/* 背景处理：毛玻璃 + 噪点 + 饱和度提升 */}
      <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-xl backdrop-saturate-150 supports-backdrop-filter:bg-white/60"></div>
      {/* 噪点纹理层 */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E")' }}></div>

      <div className="relative max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href={lang === 'zh' ? '/zh' : '/'} className="font-serif font-bold text-xl tracking-tight flex items-center gap-2 no-underline text-zinc-900 dark:text-zinc-100 leading-none">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse translate-y-[-2px]"></span>
          Silicon Universe
        </a>

        <nav className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {navItems.map(item => {
              const active = isActive(item.key);
              const href = lang === 'zh' ? `/zh/${item.key}` : `/${item.key}`;
              return (
                <Magnetic key={item.key} strength={0.2}>
                  <a
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
                </Magnetic>
              );
            })}
          </div>

          <div className="flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-6">
            <Magnetic>
              <LanguageSwitcher currentLang={lang} currentPath={currentPath} />
            </Magnetic>
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
          </div>
        </nav>
      </div>
    </header>
  );
}
