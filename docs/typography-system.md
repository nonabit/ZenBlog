# 字体系统文档

## 概述

本博客采用**现代系统字体栈（System Font Stack）**方案，完全依赖各平台原生字体，实现：

- ✅ **零网络请求**：无需加载 Web Font，首屏加载更快
- ✅ **原生体验**：使用用户熟悉的系统字体，阅读更舒适
- ✅ **高兼容性**：支持 macOS、Windows、Android、Linux 等所有平台
- ✅ **自动适配**：根据用户系统自动选择最佳字体

## 字体栈配置

### 界面字体（UI Font）

用于导航、按钮、表单等 UI 元素。

```css
--font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
           "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB",
           "Microsoft YaHei", "微软雅黑", sans-serif;
```

**平台映射：**
- macOS/iOS: San Francisco + PingFang SC
- Windows: Segoe UI + Microsoft YaHei
- Android: Roboto + Noto Sans CJK SC
- Linux: Roboto + Noto Sans CJK SC

### 标题和正文字体（Heading & Body Font）

用于文章标题和正文内容，统一使用无衬线字体。

```css
--font-heading: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "微软雅黑", sans-serif;
--font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB",
             "Microsoft YaHei", "微软雅黑", sans-serif;
```

**平台映射：**
- macOS/iOS: San Francisco + PingFang SC
- Windows: Segoe UI + Microsoft YaHei
- Android: Roboto + Noto Sans CJK SC
- Linux: Roboto + Noto Sans CJK SC

**设计理念：** 全站统一使用无衬线字体，保持现代简洁风格，提升视觉一致性。

### 代码字体（Monospace Font）

用于代码块和行内代码。

```css
--font-mono: ui-monospace, "SF Mono", Monaco, "Cascadia Code",
             Consolas, "Liberation Mono", "Courier New",
             "PingFang SC", "Microsoft YaHei", monospace;
```

**平台映射：**
- macOS: SF Mono
- Windows: Cascadia Code / Consolas
- Linux: Liberation Mono

## 字体大小系统

| 用途 | CSS 变量 | 大小 |
|------|---------|------|
| 界面 XS | `--font-size-ui-xs` | 12px |
| 界面 SM | `--font-size-ui-sm` | 14px |
| 界面 MD | `--font-size-ui-md` | 16px |
| 界面 LG | `--font-size-ui-lg` | 18px |
| 正文 | `--font-size-body` | 18px |
| 正文大号 | `--font-size-body-lg` | 20px |
| 代码 | `--font-size-code` | 14px |
| H1 | `--font-size-h1` | 40px |
| H2 | `--font-size-h2` | 32px |
| H3 | `--font-size-h3` | 24px |
| H4 | `--font-size-h4` | 20px |

## 使用指南

### 在 CSS 中使用

```css
.my-component {
  font-family: var(--font-ui);
  font-size: var(--font-size-ui-md);
  line-height: var(--line-height-normal);
}
```

### 在 Tailwind 中使用

```html
<div class="font-sans text-base">界面文本</div>
<div class="font-serif text-lg">正文内容</div>
<code class="font-mono text-sm">代码</code>
```

### 在 React/TSX 中使用

```tsx
<div style={{
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--font-size-body)',
}}>
  文章内容
</div>
```

## 性能优势

相比 Web Font 方案：

- **首屏加载时间减少 ~200ms**（无需下载字体文件）
- **减少 ~100KB 网络传输**（无字体文件）
- **FOUT/FOIT 问题消失**（无字体加载闪烁）
- **离线完全可用**（不依赖 CDN）

## 维护指南

### 添加新字体变量

在 `src/styles/typography.css` 中添加：

```css
@layer theme {
  --font-custom: var(--font-ui);
}
```

### 修改字体栈

直接修改 `typography.css` 中的字体栈定义，所有页面自动生效。

### 测试字体显示

在不同平台测试：
1. macOS Safari/Chrome
2. Windows Chrome/Edge
3. Android Chrome
4. iOS Safari

## 参考资料

- [System Font Stack](https://systemfontstack.com/)
- [Modern Font Stacks](https://modernfontstacks.com/)
- [CSS Fonts Module Level 4](https://www.w3.org/TR/css-fonts-4/)
