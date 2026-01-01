/**
 * Slug 生成和验证工具
 * 支持中英文混合，提供详细的验证错误信息
 */

// 保留字列表（避免与路由冲突）
const RESERVED_SLUGS = [
  "admin",
  "api",
  "blog",
  "new",
  "edit",
  "delete",
  "login",
  "logout",
  "settings",
  "profile",
  "assets",
  "images",
  "public",
];

/**
 * Slug 验证结果
 */
export interface SlugValidationResult {
  valid: boolean;
  error?: string;
}

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
 * 生成文章 slug（从标题自动生成）
 */
export function generateSlug(title: string): string {
  const slug = toKebabCase(title);
  return slug || "untitled";
}

/**
 * 验证 slug 是否合法（简单版，保持向后兼容）
 */
export function isValidSlug(slug: string): boolean {
  return validateSlug(slug).valid;
}

/**
 * 验证 slug 格式（增强版，返回详细错误信息）
 * @param slug 待验证的 slug
 * @param options 验证选项
 */
export function validateSlug(
  slug: string,
  options: {
    minLength?: number;
    maxLength?: number;
  } = {}
): SlugValidationResult {
  const { minLength = 2, maxLength = 100 } = options;

  // 空值检查
  if (!slug || typeof slug !== "string") {
    return { valid: false, error: "Slug 不能为空" };
  }

  const trimmedSlug = slug.trim();

  // 长度检查
  if (trimmedSlug.length < minLength) {
    return { valid: false, error: `Slug 长度不能少于 ${minLength} 个字符` };
  }

  if (trimmedSlug.length > maxLength) {
    return { valid: false, error: `Slug 长度不能超过 ${maxLength} 个字符` };
  }

  // 格式检查：只允许小写字母、数字、中文和连字符
  const pattern = /^[a-z0-9\u4e00-\u9fa5]+(-[a-z0-9\u4e00-\u9fa5]+)*$/;
  if (!pattern.test(trimmedSlug)) {
    return {
      valid: false,
      error: "Slug 只能包含小写字母、数字、中文和连字符，且不能以连字符开头或结尾",
    };
  }

  // 连续连字符检查
  if (/--/.test(trimmedSlug)) {
    return { valid: false, error: "Slug 不能包含连续的连字符" };
  }

  // 保留字检查
  if (RESERVED_SLUGS.includes(trimmedSlug)) {
    return { valid: false, error: `"${trimmedSlug}" 是保留字，不能作为 slug 使用` };
  }

  return { valid: true };
}

/**
 * 清理和规范化 slug（将用户输入转换为有效格式）
 */
export function sanitizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "-") // 替换非法字符
    .replace(/-+/g, "-") // 合并多个连字符
    .replace(/^-|-$/g, ""); // 去除首尾连字符
}
