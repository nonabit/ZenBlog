import { RiGithubFill, RiTwitterXFill, RiMailLine, RiRssLine, RiArrowUpLine } from '@remixicon/react';
import type { Language } from '@/i18n/config';
import type { TranslationDictionary } from '@/shared/i18n/types';
import Magnetic from '@/components/react/Magnetic';

// TODO: 考虑将导航数据提取到 src/shared/constants/navigation.ts
// 以便与 SiteHeader 共享，避免重复定义
const NAV_LINKS = [
  { href: '/blog', labelKey: 'nav.blog' as const },
  { href: '/photography', labelKey: 'nav.photography' as const },
  { href: '/projects', labelKey: 'nav.projects' as const },
  { href: '/about', labelKey: 'nav.about' as const },
] as const;

const SOCIAL_LINKS = [
  { icon: RiGithubFill, href: 'https://github.com/99byte', label: 'GitHub' },
  { icon: RiTwitterXFill, href: 'https://twitter.com/ninthbit_ai', label: 'Twitter' },
  { icon: RiMailLine, href: 'mailto:oldmeatovo@gmail.com', label: 'Email' },
  { icon: RiRssLine, href: '/rss.xml', label: 'RSS Feed' },
];

interface SiteFooterProps {
  lang: Language;
  t: TranslationDictionary;
}

export default function SiteFooter({ lang, t }: SiteFooterProps) {
  const getLocalizedPath = (path: string) => {
    return lang === 'zh' ? `/zh${path}` : path;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="max-w-[84rem] mx-auto px-6 py-16">
        {/* 主体三栏区 */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-8 lg:gap-12">
          {/* 左栏：品牌区 - 占 5 列 */}
          <div className="md:col-span-5">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              Silicon Universe
            </h2>
          </div>

          {/* 中栏：导航区 - 占 2 列 */}
          <div className="md:col-span-2">
            <h3 className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
              {t['footer.navigate']}
            </h3>
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={getLocalizedPath(link.href)}
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  {t[link.labelKey]}
                </a>
              ))}
            </nav>
          </div>

          {/* 右栏：社交区 - 占 3 列 */}
          <div className="md:col-span-3">
            <h3 className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
              {t['footer.connect']}
            </h3>
            <div className="flex flex-col space-y-2">
              {SOCIAL_LINKS.map((link) => (
                <Magnetic key={link.label} strength={0.2}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    aria-label={link.label}
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>

        {/* 底部信息行 */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 左侧：版权和系统状态 */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-xs text-zinc-400">
              © {new Date().getFullYear()} Silicon Universe · {t['footer.rights']}
            </p>
            <span className="hidden md:block text-zinc-300 dark:text-zinc-700">·</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {t['footer.systemStatus']}
              </span>
            </div>
          </div>

          {/* 右侧：回到顶部按钮 */}
          <Magnetic>
            <button
              onClick={scrollToTop}
              className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label={t['footer.backToTop']}
            >
              <RiArrowUpLine size={20} />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
