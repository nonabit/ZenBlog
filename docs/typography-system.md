# 字体系统文档

## 概述

本博客采用**现代系统字体栈（System Font Stack）**方案，完全依赖各平台原生字体，实现：

- ✅ **零网络请求**：无需加载 Web Font，首屏加载更快
- ✅ **原生体验**：使用用户熟悉的系统字体，阅读更舒适
- ✅ **高兼容性**：支持 macOS、Windows、Android、Linux 等所有平台
- ✅ **单一数据源**：所有字体定义集中在 `typography.css` 的 `@theme` 块中

## 架构

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

## 字体方案

| 场景 | 字体类型 | 字号 | 字重 | Tailwind 类 |
|------|---------|------|------|-------------|
| 文章大标题 (H1) | 衬线 | 40px | 700 | `font-article-title` |
| 正文中的标题 (H2/H3/H4) | 无衬线 | 26px | 400 | `font-heading` |
| 正文段落 | 无衬线 | 17px | 300 | `font-body` |
| UI 元素 | 无衬线 | 14-16px | 400-500 | `font-ui` |
| 代码 | 等宽 | 14px | 400 | `font-mono` |

## 字体栈配置

### 无衬线字体栈

用于 UI、标题、正文等。

```css
--font-sans-stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                   "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB",
                   "Microsoft YaHei", "微软雅黑", sans-serif;
```

**平台映射：**
- macOS/iOS: San Francisco + PingFang SC
- Windows: Segoe UI + Microsoft YaHei
- Android: Roboto + Noto Sans CJK SC
- Linux: Roboto + Noto Sans CJK SC

### 衬线字体栈

用于文章大标题，增加经典感。

```css
--font-serif-stack: Georgia, "Noto Serif SC", "Source Han Serif SC",
                    "PingFang SC", "Microsoft YaHei", serif;
```

### 等宽字体栈

用于代码块和行内代码。

```css
--font-mono-stack: ui-monospace, "SF Mono", Monaco, "Cascadia Code",
                   Consolas, "Liberation Mono", "Courier New",
                   "PingFang SC", "Microsoft YaHei", monospace;
```

## 语义化字体变量

```css
@theme {
  --font-ui: var(--font-sans-stack);           /* UI 元素 */
  --font-heading: var(--font-sans-stack);      /* 通用标题 */
  --font-article-title: var(--font-serif-stack); /* 文章大标题 */
  --font-body: var(--font-sans-stack);         /* 正文 */
  --font-mono: var(--font-mono-stack);         /* 代码 */
}
```

## 字号系统

| 用途 | CSS 变量 | 大小 |
|------|---------|------|
| 文章大标题 | `--font-size-article-title` | 40px |
| 正文标题 | `--font-size-prose-heading` | 26px |
| 正文 | `--font-size-body` | 17px |
| 正文大号 | `--font-size-body-lg` | 20px |
| UI XS | `--font-size-ui-xs` | 12px |
| UI SM | `--font-size-ui-sm` | 14px |
| UI MD | `--font-size-ui-md` | 16px |
| UI LG | `--font-size-ui-lg` | 18px |
| 代码 | `--font-size-code` | 14px |

## 使用指南

### 在 Tailwind 中使用（推荐）

```html
<!-- UI 元素 -->
<nav class="font-ui text-sm">导航</nav>

<!-- 通用标题 -->
<h2 class="font-heading text-2xl">标题</h2>

<!-- 文章大标题 -->
<h1 class="font-article-title text-4xl font-bold">文章标题</h1>

<!-- 正文 -->
<p class="font-body text-base font-light">正文内容</p>

<!-- 代码 -->
<code class="font-mono text-sm">代码</code>
```

### 在 CSS 中使用

```css
.my-component {
  font-family: var(--font-heading);
  font-size: var(--font-size-prose-heading);
  font-weight: var(--font-weight-normal);
}
```

### 在 React/TSX 中使用

```tsx
<div style={{
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--font-size-body)',
  fontWeight: 'var(--font-weight-light)',
}}>
  文章内容
</div>
```

## OG 图片字体

OG 图片使用 satori 生成，不支持 CSS 变量，需要使用 `src/config/fonts.ts` 中的常量：

```typescript
import { OG_FONTS, OG_FONT_PATHS } from '@/config/fonts';

// 使用字体名
<div style={{ fontFamily: OG_FONTS.heading }}>标题</div>

// 加载字体文件
const font = await fs.readFile(OG_FONT_PATHS.inter);
```

## 维护指南

### 修改字体

只需修改 `src/styles/typography.css` 中的 `@theme` 块，所有页面自动生效。

### 添加新字体变量

```css
@theme {
  --font-custom: var(--font-sans-stack);
}
```

Tailwind 会自动生成 `font-custom` 工具类。

### 测试字体显示

在不同平台测试：
1. macOS Safari/Chrome
2. Windows Chrome/Edge
3. Android Chrome
4. iOS Safari

## 性能优势

相比 Web Font 方案：

- **首屏加载时间减少 ~200ms**（无需下载字体文件）
- **减少 ~100KB 网络传输**（无字体文件）
- **FOUT/FOIT 问题消失**（无字体加载闪烁）
- **离线完全可用**（不依赖 CDN）

## 参考资料

- [System Font Stack](https://systemfontstack.com/)
- [Modern Font Stacks](https://modernfontstacks.com/)
- [Tailwind CSS v4 @theme](https://tailwindcss.com/docs/theme)
