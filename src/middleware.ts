/**
 * Astro 中间件
 * 保护 /admin 路由仅在开发环境可用
 */

import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // 在生产环境中阻止访问 /admin 路由
  if (import.meta.env.PROD && pathname.startsWith("/admin")) {
    // 返回 404 页面，不暴露管理后台存在
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  // 在生产环境中阻止访问 /api/admin 路由
  if (import.meta.env.PROD && pathname.startsWith("/api/admin")) {
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return next();
});
