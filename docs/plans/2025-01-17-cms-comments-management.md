# CMS 评论管理系统实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在现有 CMS 系统中集成评论管理功能，允许管理员查看、管理基于 Giscus (GitHub Discussions) 的博客评论。

**Architecture:** 通过 GitHub GraphQL API 获取 Discussions 数据，在 CMS 侧边栏添加"Comments"导航，创建评论列表和详情页面。评论的实际管理操作（删除、隐藏）将跳转到 GitHub Discussions 页面，因为 Giscus 评论本质上存储在 GitHub 上。

**Tech Stack:** React, TypeScript, Astro SSR, GitHub GraphQL API, @octokit/graphql

---

## 当前状态分析

**CMS 系统现状：**
- 位置：`/src/pages/admin/` 下的 Astro 页面 + `/src/components/cms/` 下的 React 组件
- 导航：`CMSLayout.tsx:28-31` 定义了 navItems 数组 (Dashboard, Posts)
- 侧边栏：固定宽度 260px，包含导航和最近文章列表

**评论系统现状：**
- Giscus 配置：`src/components/react/GiscusComments.tsx`
- 仓库：`nonabit/ZenBlog`，repoId: `R_kgDOQZxLYQ`
- 分类：`Announcements`，categoryId: `DIC_kwDOQZxLYc4C04o7`
- 映射方式：`pathname`（每篇文章按 URL 路径创建独立 Discussion）

**关键约束：**
- Giscus 评论存储在 GitHub Discussions 中，非本地数据库
- 管理操作需要 GitHub 个人访问令牌 (PAT) 或跳转到 GitHub 页面
- 本方案采用「只读查看 + 跳转管理」模式，避免存储敏感的 GitHub 令牌

---

## Task 1: 安装 GitHub GraphQL 客户端依赖

**Files:**
- Modify: `package.json`

**Step 1: 安装 @octokit/graphql 依赖**

```bash
npm install @octokit/graphql
```

**Step 2: 运行 npm install 验证安装成功**

Run: `npm ls @octokit/graphql`
Expected: 显示版本号，无 UNMET PEER DEPENDENCY 错误

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @octokit/graphql for GitHub Discussions API"
```

---

## Task 2: 创建 GitHub Discussions API 服务层

**Files:**
- Create: `src/lib/cms/discussions.ts`
- Modify: `.env.example`

**Step 1: 更新 .env.example 添加 GitHub Token 占位符**

```env
# GitHub Personal Access Token (需要 read:discussion scope)
# 仅用于 CMS 评论管理功能
GITHUB_TOKEN=
```

**Step 2: 创建 discussions.ts 服务文件**

```typescript
/**
 * GitHub Discussions API 服务
 * 用于获取 Giscus 评论数据（只读）
 */

import { graphql } from "@octokit/graphql";

// Giscus 配置（与 GiscusComments.tsx 保持一致）
const REPO_OWNER = "nonabit";
const REPO_NAME = "ZenBlog";
const CATEGORY_ID = "DIC_kwDOQZxLYc4C04o7";

// 类型定义
export interface DiscussionComment {
  id: string;
  author: {
    login: string;
    avatarUrl: string;
  } | null;
  body: string;
  bodyHTML: string;
  createdAt: string;
  url: string;
  replyCount: number;
}

export interface Discussion {
  id: string;
  number: number;
  title: string;
  url: string;
  createdAt: string;
  comments: {
    totalCount: number;
    nodes: DiscussionComment[];
  };
}

export interface DiscussionListItem {
  id: string;
  number: number;
  title: string;
  url: string;
  createdAt: string;
  commentsCount: number;
  // 从 pathname 映射中提取的文章 slug
  blogSlug: string | null;
}

// 创建 GraphQL 客户端
function createClient() {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is required for comments management");
  }
  return graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });
}

// 从 Discussion title 提取博客 slug
// Giscus 使用 pathname 映射时，title 格式为 "/blog/xxx"
function extractBlogSlug(title: string): string | null {
  const match = title.match(/^\/blog\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * 获取所有评论讨论列表
 */
export async function listDiscussions(
  first: number = 20,
  after?: string
): Promise<{ discussions: DiscussionListItem[]; hasNextPage: boolean; endCursor: string | null }> {
  const client = createClient();

  const query = `
    query($owner: String!, $name: String!, $categoryId: ID!, $first: Int!, $after: String) {
      repository(owner: $owner, name: $name) {
        discussions(first: $first, after: $after, categoryId: $categoryId, orderBy: {field: UPDATED_AT, direction: DESC}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            number
            title
            url
            createdAt
            comments {
              totalCount
            }
          }
        }
      }
    }
  `;

  const result: any = await client(query, {
    owner: REPO_OWNER,
    name: REPO_NAME,
    categoryId: CATEGORY_ID,
    first,
    after,
  });

  const discussions = result.repository.discussions.nodes.map((d: any) => ({
    id: d.id,
    number: d.number,
    title: d.title,
    url: d.url,
    createdAt: d.createdAt,
    commentsCount: d.comments.totalCount,
    blogSlug: extractBlogSlug(d.title),
  }));

  return {
    discussions,
    hasNextPage: result.repository.discussions.pageInfo.hasNextPage,
    endCursor: result.repository.discussions.pageInfo.endCursor,
  };
}

/**
 * 获取单个讨论的详情和评论
 */
export async function getDiscussion(
  number: number,
  commentsFirst: number = 50
): Promise<Discussion | null> {
  const client = createClient();

  const query = `
    query($owner: String!, $name: String!, $number: Int!, $commentsFirst: Int!) {
      repository(owner: $owner, name: $name) {
        discussion(number: $number) {
          id
          number
          title
          url
          createdAt
          comments(first: $commentsFirst) {
            totalCount
            nodes {
              id
              author {
                login
                avatarUrl
              }
              body
              bodyHTML
              createdAt
              url
              replies {
                totalCount
              }
            }
          }
        }
      }
    }
  `;

  const result: any = await client(query, {
    owner: REPO_OWNER,
    name: REPO_NAME,
    number,
    commentsFirst,
  });

  const d = result.repository.discussion;
  if (!d) return null;

  return {
    id: d.id,
    number: d.number,
    title: d.title,
    url: d.url,
    createdAt: d.createdAt,
    comments: {
      totalCount: d.comments.totalCount,
      nodes: d.comments.nodes.map((c: any) => ({
        id: c.id,
        author: c.author,
        body: c.body,
        bodyHTML: c.bodyHTML,
        createdAt: c.createdAt,
        url: c.url,
        replyCount: c.replies?.totalCount || 0,
      })),
    },
  };
}

/**
 * 获取评论统计
 */
export async function getCommentsStats(): Promise<{ totalDiscussions: number; totalComments: number }> {
  const client = createClient();

  const query = `
    query($owner: String!, $name: String!, $categoryId: ID!) {
      repository(owner: $owner, name: $name) {
        discussions(categoryId: $categoryId) {
          totalCount
        }
      }
    }
  `;

  const result: any = await client(query, {
    owner: REPO_OWNER,
    name: REPO_NAME,
    categoryId: CATEGORY_ID,
  });

  // 注意：获取总评论数需要遍历所有 discussions，这里只返回讨论数
  return {
    totalDiscussions: result.repository.discussions.totalCount,
    totalComments: 0, // 需要单独查询每个 discussion
  };
}
```

**Step 3: 运行 TypeScript 检查确保无类型错误**

Run: `npx astro check`
Expected: 无错误

**Step 4: Commit**

```bash
git add src/lib/cms/discussions.ts .env.example
git commit -m "feat(cms): add GitHub Discussions API service layer"
```

---

## Task 3: 创建评论管理 API 路由

**Files:**
- Create: `src/pages/api/admin/comments.ts`

**Step 1: 创建 API 路由文件**

```typescript
/**
 * 评论管理 API
 * GET /api/admin/comments - 获取讨论列表
 * GET /api/admin/comments?number=xxx - 获取单个讨论详情
 */

import type { APIRoute } from "astro";
import { listDiscussions, getDiscussion, getCommentsStats } from "../../../lib/cms/discussions";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  // 仅开发环境可用
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const number = url.searchParams.get("number");
    const stats = url.searchParams.get("stats");

    // 获取统计数据
    if (stats === "true") {
      const statsData = await getCommentsStats();
      return new Response(JSON.stringify(statsData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 获取单个讨论详情
    if (number) {
      const discussion = await getDiscussion(parseInt(number, 10));
      if (!discussion) {
        return new Response(JSON.stringify({ error: "Discussion not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(discussion), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 获取讨论列表
    const first = parseInt(url.searchParams.get("first") || "20", 10);
    const after = url.searchParams.get("after") || undefined;
    const data = await listDiscussions(first, after);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isTokenError = message.includes("GITHUB_TOKEN");

    return new Response(
      JSON.stringify({
        error: isTokenError ? "GitHub Token not configured" : message,
        hint: isTokenError ? "Please set GITHUB_TOKEN in .env file" : undefined,
      }),
      {
        status: isTokenError ? 401 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
```

**Step 2: 运行 TypeScript 检查**

Run: `npx astro check`
Expected: 无错误

**Step 3: Commit**

```bash
git add src/pages/api/admin/comments.ts
git commit -m "feat(cms): add comments management API endpoint"
```

---

## Task 4: 更新 CMS 侧边栏导航添加 Comments 入口

**Files:**
- Modify: `src/components/cms/CMSLayout.tsx:28-31`

**Step 1: 在 navItems 数组中添加 Comments 导航项**

```typescript
import {
  LayoutDashboard,
  FileText,
  Plus,
  ArrowLeft,
  Layers,
  MessageSquare,  // 添加导入
} from "lucide-react";

// ...

// 导航项
const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },  // 新增
];
```

**Step 2: 运行开发服务器验证导航显示**

Run: `npm run dev`
访问: `http://localhost:4321/admin`
Expected: 侧边栏显示 Comments 导航项

**Step 3: Commit**

```bash
git add src/components/cms/CMSLayout.tsx
git commit -m "feat(cms): add Comments navigation to sidebar"
```

---

## Task 5: 创建评论列表页面

**Files:**
- Create: `src/pages/admin/comments/index.astro`
- Create: `src/components/cms/CommentsList.tsx`

**Step 1: 创建 CommentsList React 组件**

```typescript
/**
 * 评论列表组件
 * 显示所有博客文章的评论讨论
 */

import { useState, useEffect } from "react";
import {
  MessageSquare,
  ExternalLink,
  FileText,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface DiscussionItem {
  id: string;
  number: number;
  title: string;
  url: string;
  createdAt: string;
  commentsCount: number;
  blogSlug: string | null;
}

interface CommentsListProps {
  initialData?: {
    discussions: DiscussionItem[];
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

export default function CommentsList({ initialData }: CommentsListProps) {
  const [discussions, setDiscussions] = useState<DiscussionItem[]>(
    initialData?.discussions || []
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(initialData?.hasNextPage || false);
  const [endCursor, setEndCursor] = useState(initialData?.endCursor || null);

  const fetchDiscussions = async (refresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (!refresh && endCursor) {
        params.set("after", endCursor);
      }

      const res = await fetch(`/api/admin/comments?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch comments");
      }

      if (refresh) {
        setDiscussions(data.discussions);
      } else {
        setDiscussions((prev) => [...prev, ...data.discussions]);
      }
      setHasNextPage(data.hasNextPage);
      setEndCursor(data.endCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchDiscussions(true);
    }
  }, []);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 错误状态
  if (error) {
    return (
      <div className="border border-red-200 rounded-lg p-8 text-center bg-red-50">
        <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">加载失败</h3>
        <p className="text-red-600 mb-4">{error}</p>
        {error.includes("Token") && (
          <p className="text-sm text-red-500 mb-4">
            请在 .env 文件中配置 GITHUB_TOKEN
          </p>
        )}
        <button
          onClick={() => fetchDiscussions(true)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  // 空状态
  if (!loading && discussions.length === 0) {
    return (
      <div className="border border-zinc-200 rounded-lg p-12 text-center">
        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare size={24} className="text-zinc-400" />
        </div>
        <h3 className="text-lg font-medium text-zinc-900 mb-2">暂无评论</h3>
        <p className="text-zinc-500">
          当读者在博客文章下留言后，评论将在这里显示
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 刷新按钮 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => fetchDiscussions(true)}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          刷新
        </button>
      </div>

      {/* 列表 */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden">
        {/* 表头 */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-zinc-50 border-b border-zinc-200 text-xs font-medium text-zinc-500 uppercase tracking-wider">
          <div className="col-span-6">文章</div>
          <div className="col-span-2">评论数</div>
          <div className="col-span-2">创建时间</div>
          <div className="col-span-2 text-right">操作</div>
        </div>

        {/* 列表项 */}
        {discussions.map((discussion, index) => (
          <div
            key={discussion.id}
            className={`grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-zinc-50 transition-colors ${
              index !== 0 ? "border-t border-zinc-100" : ""
            }`}
          >
            {/* 文章标题 */}
            <div className="col-span-6">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-zinc-400 shrink-0" />
                <div className="min-w-0">
                  {discussion.blogSlug ? (
                    <a
                      href={`/blog/${discussion.blogSlug}`}
                      target="_blank"
                      className="font-medium text-zinc-900 hover:text-zinc-600 transition-colors truncate block"
                    >
                      {discussion.title.replace(/^\/blog\//, "")}
                    </a>
                  ) : (
                    <span className="font-medium text-zinc-900 truncate block">
                      {discussion.title}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 评论数 */}
            <div className="col-span-2">
              <span
                className={`inline-flex items-center gap-1 text-sm ${
                  discussion.commentsCount > 0
                    ? "text-zinc-900 font-medium"
                    : "text-zinc-400"
                }`}
              >
                <MessageSquare size={14} />
                {discussion.commentsCount}
              </span>
            </div>

            {/* 创建时间 */}
            <div className="col-span-2">
              <span className="text-sm text-zinc-500">
                {formatDate(discussion.createdAt)}
              </span>
            </div>

            {/* 操作 */}
            <div className="col-span-2 flex items-center justify-end gap-1">
              <a
                href={`/admin/comments/${discussion.number}`}
                className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
                title="查看详情"
              >
                <MessageSquare size={16} />
              </a>
              <a
                href={discussion.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
                title="在 GitHub 中管理"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      {hasNextPage && (
        <div className="mt-4 text-center">
          <button
            onClick={() => fetchDiscussions()}
            disabled={loading}
            className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "加载中..." : "加载更多"}
          </button>
        </div>
      )}
    </div>
  );
}
```

**Step 2: 创建评论列表 Astro 页面**

```astro
---
/**
 * 评论列表页
 * 显示所有博客评论讨论
 */

import { listBlogPosts } from "../../../lib/cms/fs-manager";
import CMSLayout from "../../../components/cms/CMSLayout";
import CommentsList from "../../../components/cms/CommentsList";
import { MessageSquare, ExternalLink } from "lucide-react";

export const prerender = false;

if (import.meta.env.PROD) {
  return Astro.redirect("/");
}

const posts = await listBlogPosts();
const recentPosts = posts.slice(0, 8).map(p => ({ slug: p.slug, title: p.title }));
---

<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Comments - Silicon Universe</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;600&family=Noto+Serif+SC:wght@400..700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  <body class="bg-white text-zinc-900">
    <CMSLayout recentPosts={recentPosts} client:load>
      <!-- 头部 -->
      <header class="h-16 px-6 flex items-center justify-between border-b border-zinc-100">
        <h1 class="text-lg font-medium text-zinc-900">Comments</h1>
        <a
          href="https://github.com/nonabit/ZenBlog/discussions/categories/announcements"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
        >
          <ExternalLink size={16} />
          <span>GitHub Discussions</span>
        </a>
      </header>

      <div class="p-6">
        <div class="mb-4">
          <p class="text-sm text-zinc-500">
            评论基于 Giscus (GitHub Discussions)，点击外部链接可在 GitHub 中管理评论。
          </p>
        </div>

        <CommentsList client:load />
      </div>
    </CMSLayout>
  </body>
</html>
```

**Step 3: 运行开发服务器验证页面**

Run: `npm run dev`
访问: `http://localhost:4321/admin/comments`
Expected: 显示评论列表（如无 Token 则显示配置提示）

**Step 4: Commit**

```bash
git add src/pages/admin/comments/index.astro src/components/cms/CommentsList.tsx
git commit -m "feat(cms): add comments list page"
```

---

## Task 6: 创建评论详情页面

**Files:**
- Create: `src/pages/admin/comments/[number].astro`
- Create: `src/components/cms/CommentDetail.tsx`

**Step 1: 创建 CommentDetail React 组件**

```typescript
/**
 * 评论详情组件
 * 显示单个讨论的所有评论
 */

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MessageSquare,
  ExternalLink,
  User,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface Comment {
  id: string;
  author: {
    login: string;
    avatarUrl: string;
  } | null;
  body: string;
  bodyHTML: string;
  createdAt: string;
  url: string;
  replyCount: number;
}

interface Discussion {
  id: string;
  number: number;
  title: string;
  url: string;
  createdAt: string;
  comments: {
    totalCount: number;
    nodes: Comment[];
  };
}

interface CommentDetailProps {
  discussionNumber: number;
}

export default function CommentDetail({ discussionNumber }: CommentDetailProps) {
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscussion = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/comments?number=${discussionNumber}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch discussion");
      }

      setDiscussion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussion();
  }, [discussionNumber]);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw size={24} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="border border-red-200 rounded-lg p-8 text-center bg-red-50">
        <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">加载失败</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchDiscussion}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="text-center py-12 text-zinc-500">
        讨论不存在
      </div>
    );
  }

  const blogSlug = discussion.title.match(/^\/blog\/(.+)$/)?.[1];

  return (
    <div>
      {/* 头部信息 */}
      <div className="mb-6 p-4 bg-zinc-50 rounded-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-zinc-900 mb-1">
              {blogSlug || discussion.title}
            </h2>
            <p className="text-sm text-zinc-500">
              创建于 {formatDate(discussion.createdAt)} · {discussion.comments.totalCount} 条评论
            </p>
          </div>
          <div className="flex items-center gap-2">
            {blogSlug && (
              <a
                href={`/blog/${blogSlug}`}
                target="_blank"
                className="px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded transition-colors"
              >
                查看文章
              </a>
            )}
            <a
              href={discussion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors"
            >
              <ExternalLink size={14} />
              在 GitHub 管理
            </a>
          </div>
        </div>
      </div>

      {/* 评论列表 */}
      {discussion.comments.nodes.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <MessageSquare size={32} className="mx-auto mb-4 opacity-50" />
          <p>暂无评论</p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussion.comments.nodes.map((comment) => (
            <div
              key={comment.id}
              className="border border-zinc-200 rounded-lg p-4 hover:border-zinc-300 transition-colors"
            >
              {/* 评论头部 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {comment.author ? (
                    <>
                      <img
                        src={comment.author.avatarUrl}
                        alt={comment.author.login}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <a
                          href={`https://github.com/${comment.author.login}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
                        >
                          {comment.author.login}
                        </a>
                        <p className="text-xs text-zinc-500">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center">
                        <User size={16} className="text-zinc-400" />
                      </div>
                      <div>
                        <span className="font-medium text-zinc-500">匿名用户</span>
                        <p className="text-xs text-zinc-500">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <a
                  href={comment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
                  title="在 GitHub 中查看"
                >
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* 评论内容 */}
              <div
                className="prose prose-sm prose-zinc max-w-none"
                dangerouslySetInnerHTML={{ __html: comment.bodyHTML }}
              />

              {/* 回复数 */}
              {comment.replyCount > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-100">
                  <span className="text-xs text-zinc-500">
                    {comment.replyCount} 条回复 ·{" "}
                    <a
                      href={comment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-600 hover:text-zinc-900"
                    >
                      在 GitHub 查看
                    </a>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: 创建评论详情 Astro 页面**

```astro
---
/**
 * 评论详情页
 * 显示单个讨论的所有评论
 */

import { listBlogPosts } from "../../../lib/cms/fs-manager";
import CMSLayout from "../../../components/cms/CMSLayout";
import CommentDetail from "../../../components/cms/CommentDetail";
import { ArrowLeft } from "lucide-react";

export const prerender = false;

if (import.meta.env.PROD) {
  return Astro.redirect("/");
}

const { number } = Astro.params;
const discussionNumber = parseInt(number || "0", 10);

if (!discussionNumber) {
  return Astro.redirect("/admin/comments");
}

const posts = await listBlogPosts();
const recentPosts = posts.slice(0, 8).map(p => ({ slug: p.slug, title: p.title }));
---

<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Comment Detail - Silicon Universe</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;600&family=Noto+Serif+SC:wght@400..700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  <body class="bg-white text-zinc-900">
    <CMSLayout recentPosts={recentPosts} client:load>
      <!-- 头部 -->
      <header class="h-16 px-6 flex items-center border-b border-zinc-100">
        <a
          href="/admin/comments"
          class="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span class="text-sm">返回评论列表</span>
        </a>
      </header>

      <div class="p-6">
        <CommentDetail discussionNumber={discussionNumber} client:load />
      </div>
    </CMSLayout>
  </body>
</html>
```

**Step 3: 运行开发服务器验证详情页**

Run: `npm run dev`
访问: `http://localhost:4321/admin/comments/1`（使用实际的 discussion number）
Expected: 显示评论详情

**Step 4: Commit**

```bash
git add src/pages/admin/comments/[number].astro src/components/cms/CommentDetail.tsx
git commit -m "feat(cms): add comment detail page"
```

---

## Task 7: 在 Dashboard 添加评论统计卡片

**Files:**
- Modify: `src/pages/admin/index.astro:51-108`

**Step 1: 添加评论统计卡片到 Dashboard**

在 Dashboard 的 Overview 区域添加评论统计卡片，参考现有的文章统计卡片样式：

```astro
<!-- 评论统计卡片 - 添加到 grid 中 -->
<div class="p-6 border border-zinc-200 rounded-lg">
  <div class="flex items-center justify-between mb-4">
    <MessageSquare size={20} className="text-zinc-400" />
    <a
      href="/admin/comments"
      class="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
    >
      <ArrowRight size={16} />
    </a>
  </div>
  <div class="text-3xl font-bold text-zinc-900 mb-1">
    —
  </div>
  <p class="text-sm text-zinc-500">Total comments</p>
  <p class="text-xs text-zinc-400 mt-2">
    View in Comments page
  </p>
</div>
```

注：由于获取总评论数需要配置 GitHub Token 且涉及多个 API 调用，Dashboard 上只显示静态入口，实际统计在 Comments 页面展示。

**Step 2: 添加 MessageSquare 图标导入**

```astro
import { FileText, Plus, ArrowRight, MessageSquare } from "lucide-react";
```

**Step 3: 运行验证**

Run: `npm run dev`
访问: `http://localhost:4321/admin`
Expected: Dashboard 显示评论入口卡片

**Step 4: Commit**

```bash
git add src/pages/admin/index.astro
git commit -m "feat(cms): add comments entry card to dashboard"
```

---

## Task 8: 完整集成测试

**Step 1: 配置 GitHub Token（需要用户操作）**

用户需要创建 GitHub Personal Access Token：
1. 访问 https://github.com/settings/tokens
2. 创建 token，需要 `read:discussion` 权限
3. 在 `.env` 文件中添加 `GITHUB_TOKEN=xxx`

**Step 2: 运行开发服务器测试完整流程**

```bash
npm run dev
```

测试清单：
- [ ] 访问 `/admin` - Dashboard 显示评论入口
- [ ] 侧边栏显示 Comments 导航
- [ ] 点击进入 `/admin/comments` - 显示评论列表
- [ ] 点击某个讨论进入详情页
- [ ] 点击「在 GitHub 管理」跳转正确
- [ ] 无 Token 时显示友好错误提示

**Step 3: TypeScript 检查**

Run: `npx astro check`
Expected: 无类型错误

**Step 4: 构建测试**

Run: `npm run build`
Expected: 构建成功

**Step 5: 最终 Commit**

```bash
git add .
git commit -m "feat(cms): complete comments management integration"
```

---

## 总结

实现的功能：
1. ✅ CMS 侧边栏添加 Comments 导航入口
2. ✅ 评论列表页 - 显示所有文章的评论讨论
3. ✅ 评论详情页 - 显示单个讨论的所有评论
4. ✅ Dashboard 添加评论入口卡片
5. ✅ GitHub Discussions API 集成（只读模式）
6. ✅ 跳转到 GitHub 进行实际管理操作

技术决策说明：
- 采用只读模式，管理操作跳转 GitHub，避免存储敏感 Token
- 评论数据通过 GraphQL API 实时获取，不在本地存储
- 保持与现有 CMS 风格一致（Backstage 简约黑白设计）

