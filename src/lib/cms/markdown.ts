/**
 * Markdown 与 HTML 双向转换工具
 */

import TurndownService from "turndown";
import { marked } from "marked";

// 配置 marked
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: false, // 不将单个换行转换为 <br>
});

// 创建 Turndown 实例，用于 HTML -> Markdown 转换
const turndown = new TurndownService({
  headingStyle: "atx", // 使用 # 风格的标题
  codeBlockStyle: "fenced", // 使用 ``` 代码块
  bulletListMarker: "-", // 使用 - 作为列表标记
  emDelimiter: "*", // 使用 * 作为斜体标记
  strongDelimiter: "**", // 使用 ** 作为粗体标记
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

// 自定义规则：处理任务列表
turndown.addRule("taskListItem", {
  filter: (node) => {
    return (
      node.nodeName === "LI" &&
      node.getAttribute("data-type") === "taskItem"
    );
  },
  replacement: (content, node) => {
    const li = node as HTMLLIElement;
    const checked = li.getAttribute("data-checked") === "true";
    const checkbox = checked ? "[x]" : "[ ]";
    return `- ${checkbox} ${content.trim()}\n`;
  },
});

// 移除空白段落的规则
turndown.addRule("emptyParagraph", {
  filter: (node) => {
    return (
      node.nodeName === "P" &&
      node.textContent?.trim() === "" &&
      node.children.length === 0
    );
  },
  replacement: () => "\n",
});

/**
 * 将 HTML 转换为 Markdown
 */
export function htmlToMarkdown(html: string): string {
  if (!html || html.trim() === "") {
    return "";
  }

  // 清理 HTML 中的空白
  let cleanHtml = html
    // 移除段落之间的多余空白
    .replace(/<\/p>\s*<p>/g, "</p><p>")
    // 移除空段落
    .replace(/<p>\s*<\/p>/g, "")
    // 移除 <br> 后的空白
    .replace(/<br\s*\/?>\s*/g, "<br>");

  let markdown = turndown.turndown(cleanHtml);

  // 清理转换后的 Markdown
  markdown = markdown
    // 移除多余的空行（保留最多2个连续换行）
    .replace(/\n{3,}/g, "\n\n")
    // 移除行尾空格
    .replace(/[ \t]+$/gm, "")
    // 移除开头和结尾的空白
    .trim();

  return markdown;
}

/**
 * 将 Markdown 转换为 HTML（用于编辑器初始化）
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || markdown.trim() === "") {
    return "";
  }

  // 使用 marked 进行转换
  const html = marked.parse(markdown, { async: false }) as string;

  return html;
}
