/**
 * CMS 布局组件
 * 侧边栏导航 + 主内容区
 */

import { useState, useEffect, type ReactNode } from "react";
import { FileText, FolderKanban, LayoutDashboard, ArrowLeft, Sun, Moon } from "lucide-react";

interface CMSLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

// 导航项
const navItems = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/posts", label: "文章管理", icon: FileText },
  { href: "/admin/projects", label: "项目管理", icon: FolderKanban },
];

export default function CMSLayout({
  children,
  title,
  showBackButton = false,
  backUrl = "/admin",
}: CMSLayoutProps) {
  const [isDark, setIsDark] = useState(false);

  // 初始化主题
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(theme === "dark" || (!theme && prefersDark));
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

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
    <div className="min-h-screen">
      {/* 侧边栏 - 固定定位 */}
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-40">
        {/* Logo - 与右侧 Header 高度对齐 */}
        <div className="h-[73px] px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center">
          <a href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              ZenBlog
            </span>
            <span className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded">
              CMS
            </span>
          </a>
        </div>

        {/* 导航 */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                  ${active
                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* 底部操作 */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          {/* 主题切换 */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{isDark ? "浅色模式" : "深色模式"}</span>
          </button>

          {/* 返回网站 */}
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">返回网站</span>
          </a>
        </div>
      </aside>

      {/* 主内容区 - 留出侧边栏宽度 */}
      <main className="ml-64 min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* 顶部标题栏 - 与左侧 Logo 高度对齐 */}
        <header className="h-[73px] bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 flex items-center">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <a
                href={backUrl}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft size={20} />
              </a>
            )}
            {title && (
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {title}
              </h1>
            )}
          </div>
        </header>

        {/* 内容区域 */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
