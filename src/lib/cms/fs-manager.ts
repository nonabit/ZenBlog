/**
 * 文件系统管理器
 * 负责读写 Markdown 内容文件
 */

import { readFile, writeFile, unlink, readdir, stat, mkdir, open } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import matter from "gray-matter";
import { generateSlug, isValidSlug, validateSlug } from "./slug";

// 内容目录路径
const CONTENT_DIR = join(process.cwd(), "src", "content");
const BLOG_DIR = join(CONTENT_DIR, "blog");
const PROJECTS_DIR = join(CONTENT_DIR, "projects");
const UPLOADS_DIR = join(process.cwd(), "public", "assets", "cms-uploads");

// 类型定义
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  heroImage?: string;
  showOnHome: boolean;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  order: number;
  heroImage?: string;
  stack: string[];
  github?: string;
  demo?: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 转换相对图片路径为公共可访问路径
 * 例如：../../assets/image.jpg -> /src/assets/image.jpg
 */
function normalizeImagePath(imagePath: string | undefined): string {
  if (!imagePath) return "";

  // 如果已经是绝对路径或公共路径，直接返回
  if (imagePath.startsWith("/") || imagePath.startsWith("http")) {
    return imagePath;
  }

  // 处理相对路径 ../../assets/xxx -> /src/assets/xxx
  if (imagePath.includes("../assets/")) {
    const filename = imagePath.split("/").pop();
    return `/src/assets/${filename}`;
  }

  return imagePath;
}

/**
 * 查找文件路径（支持 .md 和 .mdx）
 * 包含安全验证，防止路径遍历攻击
 */
async function findFilePath(dir: string, slug: string): Promise<string | null> {
  // 安全验证：防止路径遍历攻击
  if (!slug || !isValidSlug(slug) || slug.includes("..") || slug.includes("/") || slug.includes("\\")) {
    return null;
  }

  const mdPath = join(dir, `${slug}.md`);
  const mdxPath = join(dir, `${slug}.mdx`);

  if (existsSync(mdPath)) return mdPath;
  if (existsSync(mdxPath)) return mdxPath;
  return null;
}

// ==================== Blog 操作 ====================

/**
 * 检查 slug 是否已存在
 * @param slug 待检查的 slug
 * @param excludeSlug 排除的 slug（编辑模式下排除当前文章）
 */
export async function slugExists(
  slug: string,
  excludeSlug?: string
): Promise<boolean> {
  if (slug === excludeSlug) return false;
  const filePath = await findFilePath(BLOG_DIR, slug);
  return filePath !== null;
}

/**
 * 获取所有博客文章列表
 */
export async function listBlogPosts(): Promise<BlogPost[]> {
  const files = await readdir(BLOG_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts = await Promise.all(
    mdFiles.map(async (file) => {
      const slug = file.replace(/\.(md|mdx)$/, "");
      return readBlogPost(slug);
    })
  );

  // 过滤掉 null 值并按发布日期排序
  return posts
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

/**
 * 读取单篇博客文章
 */
export async function readBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = await findFilePath(BLOG_DIR, slug);
    if (!filePath) return null;

    const raw = await readFile(filePath, "utf-8");
    const { data, content } = matter(raw);
    const stats = await stat(filePath);

    return {
      slug,
      title: data.title || "",
      description: data.description || "",
      pubDate: data.pubDate
        ? formatDate(new Date(data.pubDate))
        : formatDate(new Date()),
      heroImage: normalizeImagePath(data.heroImage),
      showOnHome: data.showOnHome || false,
      content: content.trim(),
      createdAt: stats.birthtime,
      updatedAt: stats.mtime,
    };
  } catch (error) {
    console.error(`读取文章失败: ${slug}`, error);
    return null;
  }
}

/**
 * 创建新博客文章
 * 使用原子操作确保文件创建的安全性
 * @param data 文章数据，可包含自定义 slug
 */
export async function createBlogPost(
  data: Omit<BlogPost, "createdAt" | "updatedAt"> & { slug?: string }
): Promise<string> {
  // 使用用户提供的 slug，或从标题自动生成
  const slug = data.slug?.trim() || generateSlug(data.title);

  // 验证 slug 格式
  const validation = validateSlug(slug);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const filePath = join(BLOG_DIR, `${slug}.md`);

  const frontmatter = {
    title: data.title,
    description: data.description,
    pubDate: data.pubDate,
    heroImage: data.heroImage || "",
    showOnHome: data.showOnHome,
  };

  const fileContent = matter.stringify(data.content, frontmatter);

  // 使用 'wx' 标志确保文件不存在时才创建（原子操作）
  try {
    const handle = await open(filePath, "wx");
    await handle.writeFile(fileContent, "utf-8");
    await handle.close();
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new Error(`slug "${slug}" 已被使用，请选择其他名称`);
    }
    throw error;
  }

  return slug;
}

/**
 * 更新博客文章
 * 支持 slug 变更（文件重命名）
 * @param originalSlug 原始 slug
 * @param data 更新数据，可包含 newSlug 用于重命名
 */
export async function updateBlogPost(
  originalSlug: string,
  data: Partial<BlogPost> & { newSlug?: string }
): Promise<{ slug: string; renamed: boolean }> {
  const filePath = await findFilePath(BLOG_DIR, originalSlug);
  if (!filePath) {
    throw new Error(`文章不存在: ${originalSlug}`);
  }

  const existing = await readBlogPost(originalSlug);
  if (!existing) {
    throw new Error(`文章不存在: ${originalSlug}`);
  }

  // 检查是否需要重命名
  const newSlug = data.newSlug?.trim();
  const needsRename = newSlug && newSlug !== originalSlug;

  if (needsRename) {
    // 验证新 slug 格式
    const validation = validateSlug(newSlug);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 检查新 slug 是否已存在
    if (await slugExists(newSlug, originalSlug)) {
      throw new Error(`slug "${newSlug}" 已被使用，请选择其他名称`);
    }
  }

  const frontmatter = {
    title: data.title ?? existing.title,
    description: data.description ?? existing.description,
    pubDate: data.pubDate ?? existing.pubDate,
    heroImage: data.heroImage ?? existing.heroImage,
    showOnHome: data.showOnHome ?? existing.showOnHome,
  };

  const content = data.content ?? existing.content;
  const fileContent = matter.stringify(content, frontmatter);

  if (needsRename) {
    // 先创建新文件，再删除旧文件（安全起见）
    const newFilePath = join(BLOG_DIR, `${newSlug}.md`);

    try {
      const handle = await open(newFilePath, "wx");
      await handle.writeFile(fileContent, "utf-8");
      await handle.close();
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") {
        throw new Error(`slug "${newSlug}" 已被使用`);
      }
      throw error;
    }

    // 删除旧文件
    await unlink(filePath);

    return { slug: newSlug!, renamed: true };
  } else {
    // 仅更新内容
    await writeFile(filePath, fileContent, "utf-8");
    return { slug: originalSlug, renamed: false };
  }
}

/**
 * 删除博客文章
 */
export async function deleteBlogPost(slug: string): Promise<void> {
  const filePath = await findFilePath(BLOG_DIR, slug);
  if (!filePath) {
    throw new Error(`文章不存在: ${slug}`);
  }
  await unlink(filePath);
}

// ==================== Projects 操作 ====================

/**
 * 获取所有项目列表
 */
export async function listProjects(): Promise<Project[]> {
  const files = await readdir(PROJECTS_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const projects = await Promise.all(
    mdFiles.map(async (file) => {
      const slug = file.replace(/\.(md|mdx)$/, "");
      return readProject(slug);
    })
  );

  // 过滤掉 null 值并按 order 排序
  return projects
    .filter((p): p is Project => p !== null)
    .sort((a, b) => a.order - b.order);
}

/**
 * 读取单个项目
 */
export async function readProject(slug: string): Promise<Project | null> {
  try {
    const filePath = await findFilePath(PROJECTS_DIR, slug);
    if (!filePath) return null;

    const raw = await readFile(filePath, "utf-8");
    const { data, content } = matter(raw);
    const stats = await stat(filePath);

    return {
      slug,
      title: data.title || "",
      description: data.description || "",
      order: data.order || 0,
      heroImage: normalizeImagePath(data.heroImage),
      stack: data.stack || [],
      github: data.github || "",
      demo: data.demo || "",
      content: content.trim(),
      createdAt: stats.birthtime,
      updatedAt: stats.mtime,
    };
  } catch (error) {
    console.error(`读取项目失败: ${slug}`, error);
    return null;
  }
}

/**
 * 创建新项目
 * 使用原子操作确保文件创建的安全性
 */
export async function createProject(
  data: Omit<Project, "slug" | "createdAt" | "updatedAt">
): Promise<string> {
  const slug = generateSlug(data.title);
  const filePath = join(PROJECTS_DIR, `${slug}.md`);

  const frontmatter = {
    title: data.title,
    description: data.description,
    order: data.order,
    heroImage: data.heroImage || "",
    stack: data.stack,
    github: data.github || "",
    demo: data.demo || "",
  };

  const fileContent = matter.stringify(data.content, frontmatter);

  // 使用 'wx' 标志确保文件不存在时才创建（原子操作）
  try {
    const handle = await open(filePath, "wx");
    await handle.writeFile(fileContent, "utf-8");
    await handle.close();
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new Error(`项目已存在: ${slug}`);
    }
    throw error;
  }

  return slug;
}

/**
 * 更新项目
 */
export async function updateProject(
  slug: string,
  data: Partial<Project>
): Promise<void> {
  const filePath = await findFilePath(PROJECTS_DIR, slug);
  if (!filePath) {
    throw new Error(`项目不存在: ${slug}`);
  }

  const existing = await readProject(slug);
  if (!existing) {
    throw new Error(`项目不存在: ${slug}`);
  }

  const frontmatter = {
    title: data.title ?? existing.title,
    description: data.description ?? existing.description,
    order: data.order ?? existing.order,
    heroImage: data.heroImage ?? existing.heroImage,
    stack: data.stack ?? existing.stack,
    github: data.github ?? existing.github,
    demo: data.demo ?? existing.demo,
  };

  const content = data.content ?? existing.content;
  const fileContent = matter.stringify(content, frontmatter);
  await writeFile(filePath, fileContent, "utf-8");
}

/**
 * 删除项目
 */
export async function deleteProject(slug: string): Promise<void> {
  const filePath = await findFilePath(PROJECTS_DIR, slug);
  if (!filePath) {
    throw new Error(`项目不存在: ${slug}`);
  }
  await unlink(filePath);
}

// ==================== 图片上传 ====================

// 允许的图片扩展名
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

/**
 * 保存上传的图片
 * 包含安全验证，防止文件名注入
 */
export async function saveUploadedImage(
  file: File,
  _type: "blog" | "project" = "blog"
): Promise<string> {
  // 确保上传目录存在
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }

  // 提取并验证文件扩展名
  const originalName = file.name;
  const ext = originalName.split(".").pop()?.toLowerCase() || "";

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`不支持的文件扩展名: ${ext}`);
  }

  // 安全的文件名：只保留字母数字和连字符
  const baseName = originalName
    .replace(/\.[^.]+$/, "") // 移除扩展名
    .replace(/[^a-zA-Z0-9-]/g, "_") // 替换危险字符
    .substring(0, 50); // 限制长度

  // 生成最终文件名：时间戳 + 安全基础名 + 扩展名
  const timestamp = Date.now();
  const filename = `${timestamp}-${baseName}.${ext}`;
  const filePath = join(UPLOADS_DIR, filename);

  // 保存文件
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  // 返回公开访问路径
  return `/assets/cms-uploads/${filename}`;
}
