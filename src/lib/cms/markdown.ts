/**
 * Markdown 与 HTML 双向转换工具
 */

import TurndownService from "turndown";

// 创建 Turndown 实例，用于 HTML -> Markdown 转换
const turndown = new TurndownService({
  headingStyle: "atx", // 使用 # 风格的标题
  codeBlockStyle: "fenced", // 使用 ``` 代码块
  bulletListMarker: "-", // 使用 - 作为列表标记
});

// 自定义规则：保留图片 alt 和 src
turndown.addRule("images", {
  filter: "img",
  replacement: (_content, node) => {
    const img = node as HTMLImageElement;
    const alt = img.alt || "";
    const src = img.src || "";
    return `![${alt}](${src})`;
  },
});

/**
 * 将 HTML 转换为 Markdown
 */
export function htmlToMarkdown(html: string): string {
  if (!html || html.trim() === "") {
    return "";
  }
  return turndown.turndown(html);
}

/**
 * 简单的 Markdown 转 HTML（用于编辑器初始化）
 * 注意：Tiptap 会自己处理 Markdown，这里只是基础转换
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || markdown.trim() === "") {
    return "";
  }

  // 基础转换规则（注意：图片必须在链接之前处理，否则会被链接正则错误匹配）
  let html = markdown
    // 代码块
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    // 行内代码
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // 标题
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // 粗体
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // 斜体
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // 图片（必须在链接之前！）
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // 无序列表
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // 引用
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // 段落
    .replace(/\n\n/g, "</p><p>")
    // 换行
    .replace(/\n/g, "<br />");

  // 包装列表项
  html = html.replace(/(<li>.*<\/li>)+/g, "<ul>$&</ul>");

  // 包装在段落中
  if (!html.startsWith("<")) {
    html = `<p>${html}</p>`;
  }

  return html;
}
