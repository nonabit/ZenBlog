/**
 * 图片上传 API
 * 仅在开发环境可用
 */

import type { APIRoute } from "astro";
import { saveUploadedImage } from "../../../lib/cms/fs-manager";

// 允许静态构建；该接口仅用于本地开发，生产环境由代码分支直接拒绝访问
export const prerender = true;

/**
 * POST /api/admin/upload - 上传图片
 */
export const POST: APIRoute = async ({ request }) => {
  // 开发环境检查
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: "仅在开发环境可用" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as "blog" | "project" | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "未提供文件" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 验证文件类型
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({
          error: "不支持的文件类型，仅支持 JPEG、PNG、GIF、WebP、SVG",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 验证文件大小（最大 10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: "文件过大，最大支持 10MB" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 保存文件
    const url = await saveUploadedImage(file, type || "blog");

    return new Response(JSON.stringify({ success: true, url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "上传失败";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
