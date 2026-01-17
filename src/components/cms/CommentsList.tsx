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
