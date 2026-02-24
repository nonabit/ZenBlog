import { motion } from 'framer-motion';
import type { BlogListItem } from '@/types/content';
import type { Language } from '@/i18n/config';
import type { TranslationDictionary, TranslationKey } from '@/shared/i18n/types';

interface HomeWritingSectionProps {
  posts: BlogListItem[];
  lang: Language;
  t: TranslationDictionary;
}

export default function HomeWritingSection({ posts, lang, t }: HomeWritingSectionProps) {
  const translate = (key: TranslationKey) => t[key] || key;
  const getBlogUrl = (slug: string) => (lang === 'zh' ? `/zh/blog/${slug}` : `/blog/${slug}`);
  const getBlogListUrl = () => (lang === 'zh' ? '/zh/blog' : '/blog');

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-24 sm:mb-32"
    >
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-sm text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          {translate('home.writing')}
        </h2>
        <a
          href={getBlogListUrl()}
          className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          {translate('home.viewAll')} →
        </a>
      </div>

      <div className="space-y-0 divide-y divide-zinc-100 dark:divide-zinc-800/50">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={getBlogUrl(post.slug)}
            className="group flex items-baseline justify-between py-3 no-underline transition-transform hover:translate-x-0.5"
          >
            <span className="text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors truncate mr-4">
              {post.data.title}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0 font-mono tabular-nums">
              {new Date(post.data.pubDate).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
                year: 'numeric',
                month: 'short',
              })}
            </span>
          </a>
        ))}
      </div>
    </motion.section>
  );
}
