import { RiGithubFill, RiTwitterXFill, RiMailLine, RiRssLine, RiArrowUpLine } from '@remixicon/react';
import type { Language } from '@/i18n/config';
import type { TranslationDictionary } from '@/shared/i18n/types';
import Magnetic from '@/components/react/Magnetic';

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
      <div className="max-w-[84rem] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            <span>© {new Date().getFullYear()} Silicon Universe</span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs text-zinc-500 font-mono">{statusText}</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400">{builtText}</p>
          <p className="text-xs text-zinc-400">{rightsText}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((link) => (
              <Magnetic key={link.label} strength={0.2}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  aria-label={link.label}
                >
                  <link.icon size={20} />
                </a>
              </Magnetic>
            ))}
          </div>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-2 hidden md:block" />

          <Magnetic>
            <button
              onClick={scrollToTop}
              className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label={lang === 'zh' ? '回到顶部' : 'Back to Top'}
            >
              <RiArrowUpLine size={20} />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
