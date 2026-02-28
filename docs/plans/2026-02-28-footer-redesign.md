# 页脚重设计实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将当前单行简单页脚升级为左重右轻的非对称三栏布局，增加站点导航和更清晰的信息架构

**Architecture:** 保持现有的 React 客户端组件架构，使用 Tailwind CSS Grid 实现响应式三栏布局，保留 Magnetic 磁吸效果和所有现有交互功能

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, @remixicon/react, framer-motion

---

## Task 1: 更新翻译字典

**Files:**
- Modify: `src/i18n/translations/zh.ts:70-72`
- Modify: `src/i18n/translations/en.ts:70-72`

**Step 1: 添加中文翻译键**

在 `src/i18n/translations/zh.ts` 的页脚部分添加新的翻译键：

```typescript
// 页脚
'footer.rights': '版权所有',
'footer.navigate': '导航',
'footer.connect': '联系',
'footer.backToTop': '回到顶部',
'footer.systemStatus': '系统运行正常',
```

**Step 2: 添加英文翻译键**

在 `src/i18n/translations/en.ts` 的页脚部分添加新的翻译键：

```typescript
// Footer
'footer.rights': 'All rights reserved',
'footer.navigate': 'Navigate',
'footer.connect': 'Connect',
'footer.backToTop': 'Back to Top',
'footer.systemStatus': 'All Systems Normal',
```

**Step 3: 验证翻译键**

运行开发服务器确认没有 TypeScript 错误：

```bash
bun run dev
```

Expected: 开发服务器正常启动，无类型错误

**Step 4: 提交翻译更新**

```bash
git add src/i18n/translations/zh.ts src/i18n/translations/en.ts
git commit -m "feat(i18n): 添加页脚新翻译键"
```

---

## Task 2: 重构 SiteFooter 组件 - 数据层

**Files:**
- Modify: `src/shared/components/layout/SiteFooter.client.tsx:1-100`

**Step 1: 添加导航链接常量**

在 `SOCIAL_LINKS` 常量之前添加导航链接配置：

```typescript
const NAV_LINKS = [
  { href: '/blog', labelKey: 'nav.blog' as const },
  { href: '/photography', labelKey: 'nav.photography' as const },
  { href: '/projects', labelKey: 'nav.projects' as const },
  { href: '/about', labelKey: 'nav.about' as const },
] as const;
```

**Step 2: 创建生成本地化路径的辅助函数**

在组件内部添加路径生成函数：

```typescript
const getLocalizedPath = (path: string) => {
  return lang === 'zh' ? `/zh${path}` : path;
};
```

**Step 3: 验证数据结构**

运行开发服务器确认没有类型错误：

```bash
bun run dev
```

Expected: 无 TypeScript 错误

**Step 4: 提交数据层更改**

```bash
git add src/shared/components/layout/SiteFooter.client.tsx
git commit -m "feat(footer): 添加导航链接数据结构"
```

---

## Task 3: 重构 SiteFooter 组件 - 布局结构

**Files:**
- Modify: `src/shared/components/layout/SiteFooter.client.tsx:20-80`

**Step 1: 替换 footer 容器结构**

将现有的 `<footer>` 内容替换为新的三栏布局结构：

```tsx
return (
  <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
    <div className="max-w-[84rem] mx-auto px-6 py-16">
      {/* 主体三栏区 */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-8 lg:gap-12">
        {/* 左栏：品牌区 - 占 5 列 */}
        <div className="md:col-span-5">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Silicon Universe
          </h2>
        </div>

        {/* 中栏：导航区 - 占 2.5 列 */}
        <div className="md:col-span-2">
          <h3 className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
            {t['footer.navigate']}
          </h3>
          <nav className="flex flex-col space-y-2">
            {/* 导航链接将在下一步添加 */}
          </nav>
        </div>

        {/* 右栏：社交区 - 占 2.5 列 */}
        <div className="md:col-span-3">
          <h3 className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
            {t['footer.connect']}
          </h3>
          <div className="flex flex-col space-y-2">
            {/* 社交图标将在下一步添加 */}
          </div>
        </div>
      </div>

      {/* 底部信息行 */}
      <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* 版权和状态信息将在下一步添加 */}
      </div>
    </div>
  </footer>
);
```

**Step 2: 验证布局结构**

```bash
bun run dev
```

在浏览器中访问 http://localhost:4321，检查页脚是否显示三栏布局框架

Expected: 页脚显示品牌名和两个小标题，布局正确

**Step 3: 提交布局结构**

```bash
git add src/shared/components/layout/SiteFooter.client.tsx
git commit -m "feat(footer): 实现三栏布局结构"
```

---

## Task 4: 实现导航链接区域

**Files:**
- Modify: `src/shared/components/layout/SiteFooter.client.tsx:35-42`

**Step 1: 添加导航链接渲染**

在导航区的 `<nav>` 标签内添加链接列表：

```tsx
<nav className="flex flex-col space-y-2">
  {NAV_LINKS.map((link) => (
    <a
      key={link.href}
      href={getLocalizedPath(link.href)}
      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
    >
      {t[link.labelKey]}
    </a>
  ))}
</nav>
```

**Step 2: 验证导航链接**

```bash
bun run dev
```

在浏览器中检查：
- 导航链接是否正确显示
- Hover 效果是否正常
- 中英文切换是否正确
- 链接路径是否正确（英文无前缀，中文有 `/zh/` 前缀）

Expected: 所有导航链接正常工作

**Step 3: 提交导航链接**

```bash
git add src/shared/components/layout/SiteFooter.client.tsx
git commit -m "feat(footer): 实现导航链接区域"
```

---

## Task 5: 实现社交图标区域

**Files:**
- Modify: `src/shared/components/layout/SiteFooter.client.tsx:45-60`

**Step 1: 添加社交图标渲染**

在社交区的 `<div>` 标签内添加图标列表：

```tsx
<div className="flex flex-col space-y-2">
  {SOCIAL_LINKS.map((link) => (
    <Magnetic key={link.label} strength={0.2}>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        aria-label={link.label}
      >
        <link.icon size={20} />
        <span>{link.label}</span>
      </a>
    </Magnetic>
  ))}
</div>
```

**Step 2: 验证社交图标**

```bash
bun run dev
```

在浏览器中检查：
- 社交图标是否正确显示
- Magnetic 磁吸效果是否正常
- Hover 效果是否正常
- 图标和文字是否对齐

Expected: 所有社交图标正常工作，Magnetic 效果流畅

**Step 3: 提交社交图标**

```bash
git add src/shared/components/layout/SiteFooter.client.tsx
git commit -m "feat(footer): 实现社交图标区域"
```

---

## Task 6: 实现底部信息行

**Files:**
- Modify: `src/shared/components/layout/SiteFooter.client.tsx:65-90`

**Step 1: 添加底部信息行内容**

在底部信息行的 `<div>` 标签内添加版权和状态信息：

```tsx
<div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
  {/* 左侧：版权和系统状态 */}
  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
    <p className="text-xs text-zinc-400">
      © {new Date().getFullYear()} Silicon Universe · {t['footer.rights']}
    </p>
    <span className="hidden md:block text-zinc-300 dark:text-zinc-700">·</span>
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="text-xs text-zinc-500 font-mono">
        {t['footer.systemStatus']}
      </span>
    </div>
  </div>

  {/* 右侧：回到顶部按钮 */}
  <Magnetic>
    <button
      onClick={scrollToTop}
      className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      aria-label={t['footer.backToTop']}
    >
      <RiArrowUpLine size={20} />
    </button>
  </Magnetic>
</div>
```

**Step 2: 验证底部信息行**

```bash
bun run dev
```

在浏览器中检查：
- 版权信息是否正确显示
- 系统状态指示器是否正常（绿色脉动圆点）
- 回到顶部按钮是否正常工作
- 响应式布局是否正确（移动端垂直堆叠，桌面端水平排列）

Expected: 底部信息行完整显示，所有功能正常

**Step 3: 提交底部信息行**

```bash
git add src/shared/components/layout/SiteFooter.client.tsx
git commit -m "feat(footer): 实现底部信息行"
```

---

## Task 7: 响应式测试和优化

**Files:**
- Modify: `src/shared/components/layout/SiteFooter.client.tsx` (如需调整)

**Step 1: 测试桌面端布局**

```bash
bun run dev
```

在浏览器中以桌面端视口（>1024px）检查：
- 三栏是否水平排列
- 比例是否约为 5:2.5:2.5
- 间距是否合适

Expected: 桌面端布局正确

**Step 2: 测试平板端布局**

调整浏览器窗口到平板尺寸（768px-1024px）检查：
- 左栏是否占满一行
- 导航和社交是否并排第二行
- 间距是否合适

Expected: 平板端布局正确

**Step 3: 测试移动端布局**

调整浏览器窗口到移动端尺寸（<768px）检查：
- 所有内容是否垂直堆叠
- 是否居中对齐
- 间距是否合适
- 底部信息行是否垂直堆叠

Expected: 移动端布局正确

**Step 4: 测试暗色模式**

切换到暗色模式检查：
- 所有文字颜色是否正确
- 边框颜色是否正确
- Hover 效果是否正确

Expected: 暗色模式显示正常

**Step 5: 提交优化（如有）**

如果需要调整，提交更改：

```bash
git add src/shared/components/layout/SiteFooter.client.tsx
git commit -m "fix(footer): 优化响应式布局"
```

---

## Task 8: 交互效果验证

**Files:**
- Test: `src/shared/components/layout/SiteFooter.client.tsx`

**Step 1: 验证 Magnetic 磁吸效果**

在浏览器中测试：
- 社交图标的 Magnetic 效果是否流畅
- 回到顶部按钮的 Magnetic 效果是否流畅
- 磁吸强度是否合适（`strength={0.2}`）

Expected: Magnetic 效果流畅自然

**Step 2: 验证回到顶部功能**

测试回到顶部按钮：
- 滚动到页面底部
- 点击回到顶部按钮
- 检查是否平滑滚动到顶部

Expected: 平滑滚动到顶部

**Step 3: 验证链接跳转**

测试所有链接：
- 导航链接是否跳转到正确页面
- 社交链接是否在新窗口打开
- RSS 链接是否正确

Expected: 所有链接正常工作

**Step 4: 验证系统状态指示器**

检查系统状态指示器：
- 绿色圆点是否显示
- 脉动动画是否正常
- 文字是否正确显示

Expected: 系统状态指示器正常

---

## Task 9: 最终验证和清理

**Files:**
- Test: 所有页面

**Step 1: 验证所有页面**

访问所有页面检查页脚：
- 首页（英文和中文）
- 博客列表（英文和中文）
- 摄影页（英文和中文）
- 项目页（英文和中文）
- 关于页（英文和中文）

Expected: 所有页面的页脚显示一致且正常

**Step 2: 运行架构检查**

```bash
bun run check:arch
```

Expected: 无架构边界违规

**Step 3: 构建生产版本**

```bash
bun run build
```

Expected: 构建成功，无错误

**Step 4: 预览生产版本**

```bash
bun run preview
```

在浏览器中检查生产版本的页脚是否正常

Expected: 生产版本页脚正常

**Step 5: 最终提交**

```bash
git add .
git commit -m "feat(footer): 完成页脚重设计"
```

---

## 验收标准

- [ ] 页脚显示三栏非对称布局（左 50%，中 25%，右 25%）
- [ ] 左栏显示品牌名 "Silicon Universe"
- [ ] 中栏显示导航链接（博客、摄影、项目、关于）
- [ ] 右栏显示社交图标（GitHub、Twitter、Email、RSS）
- [ ] 底部显示版权信息、系统状态指示器和回到顶部按钮
- [ ] 所有链接正常工作
- [ ] Magnetic 磁吸效果流畅
- [ ] 回到顶部按钮平滑滚动
- [ ] 响应式布局正确（桌面端、平板端、移动端）
- [ ] 暗色模式显示正常
- [ ] 中英文切换正常
- [ ] 所有页面的页脚显示一致
- [ ] 生产构建成功

---

## 注意事项

1. **保持极简风格**：不添加多余的视觉元素，使用项目现有的颜色系统
2. **保留现有交互**：Magnetic 磁吸效果、平滑滚动、系统状态指示器等特色功能全部保留
3. **响应式优先**：确保在所有设备上都有良好的阅读体验
4. **国际化支持**：所有文字都通过翻译字典获取，支持中英文切换
5. **可访问性**：所有交互元素都有 `aria-label`
6. **DRY 原则**：使用常量和辅助函数避免重复代码
7. **YAGNI 原则**：只添加必要的功能，不过度设计
8. **频繁提交**：每完成一个小任务就提交，保持提交历史清晰
