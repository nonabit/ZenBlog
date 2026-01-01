/**
 * Slug 翻译 API
 * 使用 DeepSeek AI 将中文标题翻译为英文 slug
 */

import type { APIRoute } from "astro";
import { sanitizeSlug } from "../../../lib/cms/slug";

// 禁用预渲染，在服务端执行
export const prerender = false;

// DeepSeek API 配置
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

// 翻译 prompt - 专门优化生成简洁的英文 slug
const TRANSLATION_PROMPT = `你是一个专门将中文标题翻译为 URL slug 的助手。
请将以下标题翻译成简洁的英文 slug，遵循以下规则：
1. 使用 kebab-case 格式（小写字母，单词用连字符分隔）
2. 只保留核心语义，去除冗余词汇
3. 长度控制在 3-6 个单词之间
4. 不要包含特殊字符，只使用字母、数字和连字符
5. 直接返回 slug，不要任何解释或引号

示例：
输入：如何使用 React 构建现代化 Web 应用
输出：building-modern-web-apps-with-react

输入：深入理解 JavaScript 闭包机制
输出：understanding-javascript-closures

输入：2025 年终总结
输出：2025-year-end-summary

请翻译以下标题：`;

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

export const POST: APIRoute = async ({ request }) => {
  const devCheck = checkDevEnv();
  if (devCheck) return devCheck;

  try {
    const { title } = await request.json();

    if (!title || typeof title !== "string" || !title.trim()) {
      return new Response(
        JSON.stringify({ error: "标题不能为空" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 检查 API Key
    const apiKey = import.meta.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "未配置 DEEPSEEK_API_KEY，请在 .env 文件中设置"
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // 调用 DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: "user", content: TRANSLATION_PROMPT + title.trim() }
        ],
        max_tokens: 100,
        temperature: 0.3, // 低温度以获得更一致的结果
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API 错误:", errorText);
      return new Response(
        JSON.stringify({ error: `AI 服务调用失败: ${response.status}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const rawSlug = data.choices?.[0]?.message?.content || "";

    // 清理和规范化 slug
    const slug = sanitizeSlug(rawSlug);

    if (!slug) {
      return new Response(
        JSON.stringify({ error: "AI 翻译返回了无效的 slug" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, slug }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("翻译 API 错误:", error);
    const message = error instanceof Error ? error.message : "翻译失败";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
