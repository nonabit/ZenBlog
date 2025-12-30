/**
 * CMS 类型定义
 */

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// 文章列表项
export interface PostListItem {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  showOnHome: boolean;
  heroImage?: string;
}

// 项目列表项
export interface ProjectListItem {
  slug: string;
  title: string;
  description: string;
  order: number;
  stack: string[];
  heroImage?: string;
  github?: string;
  demo?: string;
}

// 文章详情
export interface PostDetail extends PostListItem {
  content: string;
}

// 项目详情
export interface ProjectDetail extends ProjectListItem {
  content: string;
}

// 创建文章请求
export interface CreatePostRequest {
  title: string;
  description: string;
  pubDate: string;
  heroImage?: string;
  showOnHome: boolean;
  content: string;
}

// 更新文章请求
export interface UpdatePostRequest {
  slug: string;
  title?: string;
  description?: string;
  pubDate?: string;
  heroImage?: string;
  showOnHome?: boolean;
  content?: string;
}

// 创建项目请求
export interface CreateProjectRequest {
  title: string;
  description: string;
  order: number;
  heroImage?: string;
  stack: string[];
  github?: string;
  demo?: string;
  content: string;
}

// 更新项目请求
export interface UpdateProjectRequest {
  slug: string;
  title?: string;
  description?: string;
  order?: number;
  heroImage?: string;
  stack?: string[];
  github?: string;
  demo?: string;
  content?: string;
}

// 上传响应
export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}
