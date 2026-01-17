/**
 * 评论详情组件
 * 显示单个讨论的所有评论
 */

import { useState, useEffect } from "react";
import {
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
