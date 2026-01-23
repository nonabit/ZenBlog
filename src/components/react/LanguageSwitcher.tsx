import { languages, type Language } from '@/i18n/config';

interface LanguageSwitcherProps {
  currentLang: Language;
  currentPath: string;
}

export default function LanguageSwitcher({ currentLang, currentPath }: LanguageSwitcherProps) {
  const getLocalizedPath = (lang: Language) => {
    // 移除当前语言前缀
    let path = currentPath;
    if (path.startsWith('/zh/')) {
      path = path.replace('/zh/', '/');
    } else if (path.startsWith('/zh')) {
      path = path.replace('/zh', '/');
    }

    // 添加新语言前缀（英文不需要前缀）
    if (lang === 'zh') {
      return `/zh${path === '/' ? '' : path}`;
    }
    return path;
  };

  // 获取另一种语言
  const otherLang = currentLang === 'en' ? 'zh' : 'en';
  const otherLangLabel = currentLang === 'en' ? '中' : 'EN';

  return (
    <a
      href={getLocalizedPath(otherLang)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-sm font-medium no-underline"
      aria-label={`Switch to ${languages[otherLang]}`}
    >
      <span className="font-mono">{otherLangLabel}</span>
    </a>
  );
}
