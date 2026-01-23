import { Languages } from 'lucide-react';
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

  return (
    <div className="relative group">
      <button
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        aria-label="Switch Language"
      >
        <Languages size={18} />
      </button>

      <div className="absolute right-0 top-full mt-2 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[120px]">
        {Object.entries(languages).map(([lang, label]) => (
          <a
            key={lang}
            href={getLocalizedPath(lang as Language)}
            className={`block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors no-underline ${
              currentLang === lang
                ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
