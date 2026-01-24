# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 语言要求

- 交流过程中请使用中文
- 文档使用中文撰写，存放在 `docs/` 目录下
- 代码注释使用中文

## 项目概览

ZenBlog 是一个基于 Astro 5 + React 19 + Tailwind CSS 4 的个人博客与作品集网站，采用静态站点生成（SSG）模式，部署在 Vercel 上。

**网站域名：** https://ninthbit.org

## 常用命令

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (localhost:4321)
npm run build        # 构建生产环境
npm run preview      # 预览构建结果
npm run new:post "标题"     # 创建新博客文章
npm run new:project "标题"  # 创建新项目
```

## 核心架构

### 国际化（i18n）

- 默认语言：英文（无 URL 前缀）
- 中文：使用 `/zh/` 前缀
- 翻译文件：`src/i18n/translations/en.ts` 和 `zh.ts`
- 工具函数：`src/i18n/utils.ts`

### Content Collections

- 博客文章：`src/content/blog/`（.md/.mdx）
- 项目展示：`src/content/projects/`
- Schema 定义：`src/content.config.ts`

### 样式系统

- 全局样式：`src/styles/global.css`
- 字体系统：`src/styles/typography.css`（系统字体栈，零网络请求）
- SCSS 变量：`src/styles/_variables.scss`

### 评论系统

使用 Giscus（基于 GitHub Discussions），配置在 `src/components/react/GiscusComments.tsx`。

## 路径别名

使用 `@/` 指向 `src/` 目录，例如 `@/components/react/Header.tsx`。

## 关键文件

| 文件 | 说明 |
|------|------|
| `astro.config.mjs` | Astro 配置（i18n、Vite 插件等） |
| `src/consts.ts` | 全局常量 |
| `src/content.config.ts` | Content Collections Schema |

## 注意事项

- 修改 `src/content/` 目录后可能需要重启开发服务器
- Slug 必须符合 kebab-case 格式
- 图片路径使用 `../../assets/` 或 `/assets/`
