/**
 * 评论管理 API
 * GET /api/admin/comments - 获取讨论列表
 * GET /api/admin/comments?number=xxx - 获取单个讨论详情
 * GET /api/admin/comments?stats=true - 获取统计数据
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
