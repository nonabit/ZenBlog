/**
 * 项目 CRUD API
 * 仅在开发环境可用
 */

import type { APIRoute } from "astro";
import {
  listProjects,
  readProject,
  createProject,
  updateProject,
  deleteProject,
} from "../../../lib/cms/fs-manager";

// 禁用预渲染，在服务端执行
export const prerender = false;

// 开发环境检查
function checkDevEnv(): Response | null {
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: "仅在开发环境可用" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

/**
 * GET /api/admin/projects - 获取项目列表
 * GET /api/admin/projects?slug=xxx - 获取单个项目
 */
export const GET: APIRoute = async ({ request }) => {
  const devCheck = checkDevEnv();
  if (devCheck) return devCheck;

  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (slug) {
      // 获取单个项目
      const project = await readProject(slug);
      if (!project) {
        return new Response(JSON.stringify({ error: "项目不存在" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ success: true, data: project }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // 获取项目列表
      const projects = await listProjects();
      return new Response(JSON.stringify({ success: true, data: projects }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * POST /api/admin/projects - 创建新项目
 */
export const POST: APIRoute = async ({ request }) => {
  const devCheck = checkDevEnv();
  if (devCheck) return devCheck;

  try {
    const data = await request.json();

    // 验证必填字段
    if (!data.title || !data.description) {
      return new Response(
        JSON.stringify({ error: "标题和描述为必填项" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const slug = await createProject({
      title: data.title,
      description: data.description,
      order: data.order || 0,
      heroImage: data.heroImage || "",
      stack: data.stack || [],
      github: data.github || "",
      demo: data.demo || "",
      content: data.content || "",
    });

    return new Response(JSON.stringify({ success: true, slug }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建失败";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * PUT /api/admin/projects - 更新项目
 */
export const PUT: APIRoute = async ({ request }) => {
  const devCheck = checkDevEnv();
  if (devCheck) return devCheck;

  try {
    const data = await request.json();

    if (!data.slug) {
      return new Response(JSON.stringify({ error: "缺少 slug 参数" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await updateProject(data.slug, {
      title: data.title,
      description: data.description,
      order: data.order,
      heroImage: data.heroImage,
      stack: data.stack,
      github: data.github,
      demo: data.demo,
      content: data.content,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新失败";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * DELETE /api/admin/projects?slug=xxx - 删除项目
 */
export const DELETE: APIRoute = async ({ request }) => {
  const devCheck = checkDevEnv();
  if (devCheck) return devCheck;

  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({ error: "缺少 slug 参数" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await deleteProject(slug);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
