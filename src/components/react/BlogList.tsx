import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { BlogListItem } from '../../types/content';


export default function BlogList({ posts }: { posts: BlogListItem[] }) {
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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Intro */}
      <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">
          Writing
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
          Sharing thoughts and explorations on backend architecture, AI full-stack development, and new innovations.
        </p>
      </div>

      <div className="space-y-24">
        {years.map((year, yearIndex) => (
          <section key={year} className="relative">
            {/* 年份标签 (Sticky) */}
            <h2 className="font-mono text-sm font-bold text-zinc-400 mb-8 sticky top-24 bg-white/80 dark:bg-black/80 backdrop-blur-sm py-2 z-10">
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
                  <a href={`/blog/${post.slug}`} className="block focus:outline-none no-underline">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                      <h3 className="font-serif text-xl text-zinc-900 dark:text-zinc-100 font-medium group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {post.data.title}
                      </h3>
                      <span className="font-mono text-xs text-zinc-400 shrink-0">
                        {new Date(post.data.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-prose">
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
