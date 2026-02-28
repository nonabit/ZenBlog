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
  currentPath?: string;
}

export default function SiteFooter({ lang, t }: SiteFooterProps) {
  const getLocalizedPath = (path: string) => {
    return lang === 'zh' ? `/zh${path}` : path;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rightsText = t['footer.rights'];
  const statusText = lang === 'zh' ? '系统运行正常' : 'All Systems Normal';
  const builtText =
    lang === 'zh'
      ? 'Built with Astro, React & Tailwind. Crafted in Shanghai.'
      : 'Built with Astro, React & Tailwind. Crafted in Shanghai.';

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

          {/* 中栏：导航区 - 占 2.5 列 */}
          <div className="md:col-span-2">
            <h3 className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
              {t['footer.navigate']}
            </h3>
            <nav className="flex flex-col space-y-2">
              {/* 导航链接将在下一步添加 */}
            </nav>
          </div>

          {/* 右栏：社交区 - 占 2.5 列 */}
          <div className="md:col-span-3">
            <h3 className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
              {t['footer.connect']}
            </h3>
            <div className="flex flex-col space-y-2">
              {/* 社交图标将在下一步添加 */}
            </div>
          </div>
        </div>

        {/* 底部信息行 */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 版权和状态信息将在下一步添加 */}
        </div>
      </div>
    </footer>
  );
}
