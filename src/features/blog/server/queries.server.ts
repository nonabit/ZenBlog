import { getCollection, type CollectionEntry } from 'astro:content';
import type { Language } from '@/i18n/config';
import type { BlogListItem } from '@/types/content';

export type BlogEntry = CollectionEntry<'blog'>;

interface BlogListOptions {
  homeOnly?: boolean;
  limit?: number;
}

export function extractBlogSlug(id: string, lang: Language): string {
  return id.replace(new RegExp(`^${lang}/`), '').replace(/\.[^/.]+$/, '');
}

export function mapBlogListItem(post: BlogEntry, lang: Language): BlogListItem {
  return {
    slug: extractBlogSlug(post.id, lang),
    data: {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      heroImage: post.data.heroImage,
      author: post.data.author,
      showOnHome: post.data.showOnHome === true,
    },
  };
}

export async function getBlogListByLang(
  lang: Language,
  options: BlogListOptions = {},
): Promise<BlogListItem[]> {
  const allPosts = (await getCollection('blog'))
    .filter((post) => post.id.startsWith(`${lang}/`))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => mapBlogListItem(post, lang));

  const filtered = options.homeOnly
    ? allPosts.filter((post) => post.data.showOnHome === true)
    : allPosts;

  if (typeof options.limit === 'number') {
    return filtered.slice(0, options.limit);
  }

  return filtered;
}

export async function getBlogStaticPathsByLang(lang: Language) {
  const posts = (await getCollection('blog')).filter((post) => post.id.startsWith(`${lang}/`));

  return posts.map((post) => ({
    params: { slug: extractBlogSlug(post.id, lang) },
    props: post,
  }));
}

export function getReadTime(content: string, lang: Language): number {
  const sanitized = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*?\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
    .replace(/[>#*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!sanitized) {
    return 1;
  }

  if (lang === 'zh') {
    const charCount = sanitized.replace(/\s+/g, '').length;
    return Math.max(1, Math.ceil(charCount / 320));
  }

  const wordCount = sanitized.split(' ').length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export function getFallbackHeroImage(content: string): string {
  return content.match(/!\[[^\]]*?\]\(([^)\s]+)(?:\s+"[^"]*")?\)/)?.[1] ?? '';
}
