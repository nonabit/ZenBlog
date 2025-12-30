/**
 * 最近文章列表组件
 * Backstage 风格 - 侧边栏快捷导航
 */

import { FileText } from "lucide-react";

interface RecentPost {
  slug: string;
  title: string;
}

interface RecentPostsProps {
  posts: RecentPost[];
  currentSlug?: string;
  maxItems?: number;
}

export default function RecentPosts({
  posts,
  currentSlug,
  maxItems = 8,
}: RecentPostsProps) {
  const displayPosts = posts.slice(0, maxItems);

  if (displayPosts.length === 0) {
    return (
      <div className="px-4 py-2 text-sm text-zinc-400">
        No posts yet
      </div>
    );
  }

  return (
    <nav className="space-y-0.5">
      {displayPosts.map((post) => {
        const isActive = post.slug === currentSlug;

        return (
          <a
            key={post.slug}
            href={`/admin/posts/${post.slug}`}
            className={`
              flex items-center gap-2.5 px-4 py-2 text-sm
              transition-colors duration-100
              ${isActive
                ? "text-zinc-900 bg-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              }
            `}
          >
            <FileText
              size={16}
              className={isActive ? "text-zinc-700" : "text-zinc-400"}
            />
            <span className="truncate">{post.title}</span>
          </a>
        );
      })}
    </nav>
  );
}
