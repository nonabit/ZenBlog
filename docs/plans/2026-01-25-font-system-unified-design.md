# 字体系统统一管理设计方案

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标：** 建立单一数据源的字体管理系统，使用 Tailwind CSS 4 的 @theme 指令统一管理所有字体定义

**架构：** CSS 变量作为单一数据源 + JS 常量文件（OG 图片专用）

---

## 设计概述

### 核心原则

1. **单一数据源**：所有字体定义集中在 `typography.css` 的 `@theme` 块中
2. **语义化命名**：使用 `font-heading`、`font-body` 等语义化类名
3. **变量引用**：通过 `var()` 引用避免重复定义
4. **OG 图片分离**：satori 不支持 CSS 变量，使用独立的 JS 常量

### 字体方案

| 场景 | 字体类型 | 字号 | 字重 |
|------|---------|------|------|
| 文章大标题 (H1) | 衬线 | 40px | 700 (bold) |
| 正文中的标题 (H2/H3/H4) | 无衬线 | 26px | 400 (normal) |
| 正文段落 | 无衬线 | 17px | 300 (light) |
| UI 元素 | 无衬线 | 14-16px | 400-500 |
| 代码 | 等宽 | 14px | 400 |

---

## 任务 1: 重构 typography.css 使用 @theme

**文件：** `src/styles/typography.css`

**步骤 1: 将 @layer theme 改为 @theme**

将现有的 `@layer theme { ... }` 改为 Tailwind 4 的 `@theme { ... }` 格式，并使用 `var()` 引用避免重复：

```css
/**
 * 字体系统 - 单一数据源
 * 使用 Tailwind CSS 4 @theme 指令
 */

@theme {
  /* ==================== 基础字体栈 ==================== */

  /* 无衬线字体栈 */
  --font-sans-stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                     "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB",
                     "Microsoft YaHei", "微软雅黑", sans-serif;

  /* 衬线字体栈（文章标题专用） */
  --font-serif-stack: Georgia, "Noto Serif SC", "Source Han Serif SC",
                      "PingFang SC", "Microsoft YaHei", serif;

  /* 等宽字体栈 */
  --font-mono-stack: ui-monospace, "SF Mono", Monaco, "Cascadia Code",
                     Consolas, "Liberation Mono", "Courier New",
                     "PingFang SC", "Microsoft YaHei", monospace;

  /* ==================== 语义化字体族 ==================== */

  --font-ui: var(--font-sans-stack);
  --font-heading: var(--font-sans-stack);
  --font-article-title: var(--font-serif-stack);
  --font-body: var(--font-sans-stack);
  --font-mono: var(--font-mono-stack);

  /* Tailwind 映射 */
  --font-sans: var(--font-sans-stack);
  --font-serif: var(--font-serif-stack);

  /* ==================== 字号系统 ==================== */

  /* 正文 */
  --font-size-body: 1.0625rem;        /* 17px */
  --font-size-body-lg: 1.25rem;       /* 20px */

  /* 正文中的标题 */
  --font-size-prose-heading: 1.625rem; /* 26px */

  /* 文章大标题 */
  --font-size-article-title: 2.5rem;   /* 40px */

  /* UI 字号 */
  --font-size-ui-xs: 0.75rem;          /* 12px */
  --font-size-ui-sm: 0.875rem;         /* 14px */
  --font-size-ui-md: 1rem;             /* 16px */
  --font-size-ui-lg: 1.125rem;         /* 18px */

  /* 代码字号 */
  --font-size-code: 0.875rem;          /* 14px */

  /* ==================== 字重系统 ==================== */

  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* ==================== 行高系统 ==================== */

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;

  /* ==================== 字间距系统 ==================== */

  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.02em;
}
```

**步骤 2: 提交更改**

```bash
git add src/styles/typography.css
git commit -m "refactor(typography): 使用 @theme 重构字体系统为单一数据源"
```

---

## 任务 2: 清理 global.css 重复定义

**文件：** `src/styles/global.css`

**步骤 1: 移除 :root 中的重复字体定义**

删除 `@layer base { :root { ... } }` 中的 `--font-sans` 和 `--font-serif` 定义，因为它们已在 `@theme` 中定义。

**步骤 2: 更新 prose 样式使用新变量**

```css
@layer components {
  .prose {
    font-family: var(--font-body);
    font-size: var(--font-size-body);
    font-weight: var(--font-weight-light);  /* 300 */
    line-height: var(--line-height-relaxed);
  }

  /* 文章大标题：衬线 + 粗体 */
  .prose h1 {
    font-family: var(--font-article-title);
    font-size: var(--font-size-article-title);
    font-weight: var(--font-weight-bold);  /* 700 */
  }

  /* 正文中的标题：无衬线 + 正常字重 */
  .prose h2,
  .prose h3,
  .prose h4 {
    font-family: var(--font-heading);
    font-size: var(--font-size-prose-heading);
    font-weight: var(--font-weight-normal);  /* 400 */
  }
}
```

**步骤 3: 提交更改**

```bash
git add src/styles/global.css
git commit -m "refactor(typography): 清理 global.css 重复定义，更新 prose 样式"
```

---

## 任务 3: 创建 JS 字体常量文件

**文件：** `src/config/fonts.ts`（新建）

**步骤 1: 创建字体常量文件**

```typescript
/**
 * 字体常量配置
 *
 * 注意：CSS 变量是单一数据源（src/styles/typography.css）
 * 此文件仅用于不支持 CSS 变量的场景（如 OG 图片生成）
 */

// OG 图片专用字体（satori 需要具体字体名，不支持系统字体）
export const OG_FONTS = {
  heading: 'Inter',
  body: 'Inter',
  chinese: 'Noto Sans SC',
} as const;

// 字体文件路径（OG 图片生成用）
export const OG_FONT_FILES = {
  inter: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
  notoSansSC: 'https://fonts.gstatic.com/s/notosanssc/v36/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYxNbPzS5HE.woff2',
} as const;
```

**步骤 2: 提交更改**

```bash
git add src/config/fonts.ts
git commit -m "feat(typography): 添加 OG 图片专用字体常量"
```

---

## 任务 4: 更新 OG 图片生成使用常量

**文件：** `src/pages/og/[...slug].png.ts`

**步骤 1: 导入字体常量**

```typescript
import { OG_FONTS } from '@/config/fonts';
```

**步骤 2: 替换硬编码字体名**

将所有硬编码的 `'Inter'`、`'Newsreader'` 等替换为 `OG_FONTS.heading`、`OG_FONTS.body`。

**步骤 3: 提交更改**

```bash
git add src/pages/og/[...slug].png.ts
git commit -m "refactor(og): 使用字体常量替换硬编码字体名"
```

---

## 任务 5: 批量替换组件中的字体类

**文件：** `src/components/**/*.tsx`

**步骤 1: 执行批量替换**

| 查找 | 替换为 | 说明 |
|------|--------|------|
| `font-serif` | `font-heading` | 标题使用语义化类名 |
| `font-sans` | `font-ui` | UI 元素使用语义化类名 |

注意：`font-mono` 保持不变。

**步骤 2: 手动检查文章标题**

在博客文章页面的 H1 标题处，使用 `font-article-title` 类：

```tsx
<h1 className="font-article-title text-[40px] font-bold">文章标题</h1>
```

**步骤 3: 提交更改**

```bash
git add src/components/
git commit -m "refactor(components): 使用语义化字体类名"
```

---

## 任务 6: 更新文档

**文件：** `docs/typography-system.md`

更新文档反映新的字体系统架构和使用方式。

---

## 任务 7: 测试验证

**步骤 1: 启动开发服务器**

```bash
npm run dev
```

**步骤 2: 检查页面**

1. 首页：UI 元素使用无衬线字体
2. 博客列表：标题使用无衬线字体
3. 文章详情：
   - H1 大标题：衬线字体，40px，700 字重
   - H2/H3/H4：无衬线字体，26px，400 字重
   - 正文：无衬线字体，17px，300 字重

**步骤 3: 构建测试**

```bash
npm run build
```

---

## 完成检查清单

- [ ] 重构 typography.css 使用 @theme
- [ ] 清理 global.css 重复定义
- [ ] 创建 fonts.ts 常量文件
- [ ] 更新 OG 图片生成
- [ ] 批量替换组件字体类
- [ ] 更新文档
- [ ] 测试验证

---

## 预期效果

### 修改字体的体验

**之前**：需要修改 typography.css + global.css + 各组件
**之后**：只需修改 typography.css 中的 `@theme` 块

### 文件结构

```
src/
├── config/
│   └── fonts.ts              # OG 图片专用常量
├── styles/
│   ├── typography.css        # 单一数据源（@theme）
│   └── global.css            # 导入 typography.css
└── components/
    └── **/*.tsx              # 使用 font-heading、font-body 等
```
