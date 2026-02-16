import { motion } from 'framer-motion';
import { RiArrowRightUpLine } from '@remixicon/react';
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
    <section className="max-w-2xl mb-32">
      <div className="flex items-baseline justify-between mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="font-heading text-3xl font-medium text-zinc-900 dark:text-zinc-100">
          {translate('home.writing')}
        </h2>
        <a
          href={getBlogListUrl()}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          {translate('home.viewAll')}
        </a>
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
            <a href={getBlogUrl(post.slug)} className="block no-underline">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                <h3 className="text-lg font-heading font-normal text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors tracking-tight">
                  {post.data.title}
                </h3>
                <span className="text-xs font-mono text-zinc-400 shrink-0 mt-1 sm:mt-0">
                  {new Date(post.data.pubDate).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-base max-w-lg font-light">
                {post.data.description}
              </p>
              <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all ease-out duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  Read <RiArrowRightUpLine size={12} />
                </span>
              </div>
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
