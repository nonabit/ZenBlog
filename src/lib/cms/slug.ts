/**
 * Slug 生成工具
 * 复用自 scripts/create-post.mjs 的逻辑
 */

/**
 * 将标题转换为 kebab-case slug
 * 支持中英文混合
 */
export function toKebabCase(str: string): string {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * 生成文章 slug
 */
export function generateSlug(title: string): string {
  const slug = toKebabCase(title);
  return slug || "untitled";
}

/**
 * 验证 slug 是否合法
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9\u4e00-\u9fa5-]+$/.test(slug);
}
