import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { BlogListItem } from '../../types/content';

interface BlogListProps {
  posts: BlogListItem[];
  lang?: 'en' | 'zh';
  translations?: Record<string, string>;
}

export default function BlogList({ posts, lang = 'en', translations = {} }: BlogListProps) {
  // 翻译函数
  const t = (key: string) => translations[key] || key;

  // 按年份分组文章
  const postsByYear = useMemo(() => {
    return posts.reduce((acc, post) => {
      const year = new Date(post.data.pubDate).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(post);
      return acc;
    }, {} as Record<number, BlogListItem[]>);
  }, [posts]);

  // 获取年份列表并倒序排列 (2024, 2023...)
  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  // 根据语言生成博客链接
  const getBlogUrl = (slug: string) => lang === 'zh' ? `/zh/blog/${slug}` : `/blog/${slug}`;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Intro */}
      <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="font-heading text-4xl sm:text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">
          {t('blog.title') || 'Writing'}
        </h1>
        <p className="font-light text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {t('blog.description') || 'Sharing thoughts and explorations on backend architecture, AI full-stack development, and new innovations.'}
        </p>
      </div>

      <div className="space-y-24">
        {years.map((year, yearIndex) => (
          <section key={year} className="relative">
            {/* 年份标签 */}
            <h2 className="font-mono text-sm font-bold text-zinc-400 mb-8">
              {year}
            </h2>

            <div className="space-y-8">
              {postsByYear[Number(year)].map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 + yearIndex * 0.1 }}
                  className="group relative pl-6 border-l border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors duration-300"
                >
                  <a href={getBlogUrl(post.slug)} className="block focus:outline-none no-underline">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                      <h3 className="font-heading text-xl text-zinc-900 dark:text-zinc-100 font-normal group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {post.data.title}
                      </h3>
                      <span className="font-mono text-xs text-zinc-400 shrink-0">
                        {new Date(post.data.pubDate).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-prose font-light">
                      {post.data.description}
                    </p>
                  </a>
                </motion.article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
