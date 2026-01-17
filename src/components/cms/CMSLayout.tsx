/**
 * CMS 布局组件
 * Backstage 风格 - 简约黑白设计
 */

import { type ReactNode } from "react";
import {
  LayoutDashboard,
  FileText,
  Plus,
  ArrowLeft,
  Layers,
  MessageSquare,
} from "lucide-react";
import RecentPosts from "./RecentPosts";

interface RecentPost {
  slug: string;
  title: string;
}

interface CMSLayoutProps {
  children: ReactNode;
  recentPosts?: RecentPost[];
  currentSlug?: string;
}

// 导航项
const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
];

export default function CMSLayout({
  children,
  recentPosts = [],
  currentSlug,
}: CMSLayoutProps) {
  // 检查当前路径是否匹配
  const isActive = (href: string) => {
    if (typeof window === "undefined") return false;
    const path = window.location.pathname;
    if (href === "/admin") {
      return path === "/admin" || path === "/admin/";
    }
    return path.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 侧边栏 - 固定定位 */}
      <aside className="fixed top-0 left-0 w-[260px] h-screen bg-white border-r border-zinc-200 flex flex-col z-40">
        {/* Logo 区域 */}
        <div className="h-16 px-5 border-b border-zinc-100 flex items-center gap-2.5">
          <div className="w-7 h-7 bg-zinc-900 rounded flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <a href="/admin" className="font-serif text-lg font-semibold text-zinc-900 tracking-tight">
            Silicon Universe
          </a>
        </div>

        {/* 导航分组 - Admin */}
        <div className="pt-6 pb-2">
          <div className="px-5 mb-2">
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              Admin
            </span>
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2.5 px-5 py-2 text-sm
                    transition-colors duration-100
                    ${active
                      ? "text-zinc-900 bg-zinc-100"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    className={active ? "text-zinc-700" : "text-zinc-400"}
                  />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Recent Posts 分组 */}
        <div className="pt-4 flex-1 overflow-hidden flex flex-col">
          <div className="px-5 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              Recent Posts
            </span>
            <a
              href="/admin/posts/new"
              className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
              title="New post"
            >
              <Plus size={16} />
            </a>
          </div>
          <div className="flex-1 overflow-y-auto">
            <RecentPosts posts={recentPosts} currentSlug={currentSlug} />
          </div>
        </div>

        {/* 底部区域 */}
        <div className="p-4 border-t border-zinc-100">
          <a
            href="/"
            className="flex items-center gap-2.5 px-2 py-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to site</span>
          </a>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="ml-[260px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
