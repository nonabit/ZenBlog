**目标**

* 将站内所有中文字符优先使用 `LXGW WenKai`，英文仍分别使用 `Inter`（正文）/`Newsreader`（标题），代码使用 `JetBrains Mono`。

* 保持现有暗色/亮色主题与版式不变，仅替换中文字符的字体回退顺序。

**现状定位**

* 字体加载：`src/components/BaseHead.astro:55–57` 通过 Google Fonts 加载 `Inter`、`Newsreader`、`JetBrains Mono`、`Noto Sans/Serif SC`。

* 字体栈定义：`src/styles/global.css:5–7` 中 `@theme` 定义了 `--font-serif`、`--font-sans`、`--font-mono`，正文 `body` 使用 `font-sans`，标题 `h1–h6` 使用 `font-serif`（见 `src/styles/global.css:25–38`）。

**实施步骤**

* 加载 LXGW WenKai：

  * 在 `src/components/BaseHead.astro:57` 的 Google Fonts 链接中追加 `LXGW WenKai`（示例）：

    * `https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,wght@0,400..700;1,400..700&family=Noto+Sans+SC:wght@300..700&family=Noto+Serif+SC:wght@400..700&family=LXGW+WenKai:wght@300;400;500;700&display=swap`

  * 若目标网络下 Google Fonts 不可用，采用自托管备用方案：将 `LXGW WenKai` 的 `woff2` 文件置于 `public/fonts/`，并在 `src/styles/global.css` 增加 `@font-face`（`font-display: swap`），`font-family: "LXGW WenKai"`。

* 更新字体栈：

  * 修改 `src/styles/global.css:5–7`，将 `"LXGW WenKai"` 插入到中文字体优先位置，使中文字符优先匹配该字体：

    * `--font-sans: "Inter", "LXGW WenKai", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;`

    * `--font-serif: "Newsreader", "LXGW WenKai", "Noto Serif SC", "PingFang SC", "Microsoft YaHei", serif;`

  * `--font-mono` 保持不变。

* 验证：

  * 刷新开发预览，检查首页与博客页中文是否呈现为 `LXGW WenKai`，英文仍为 `Inter/Newsreader`，代码块不受影响。

  * 重点验证中文文章示例：`src/content/blog/《穷查理宝典》：血泪铸就的智慧.md` 在列表与详情页的显示效果。

**兼容与回退**

* 若 `LXGW WenKai` 未能加载，栈会自动回退到 `Noto Sans/Serif SC → PingFang/Microsoft YaHei`，不影响可读性。

* 不改动字距与权重设置（正文 `tracking-wide`、标题 `tracking-normal`）。如后续需要，可为中文细调。

**可选增强（按需）**

* 仅对中文应用字体：在 `@layer base` 中添加 `:lang(zh)`/`:lang(zh-CN)` 选择器，用 `font-family` 定向覆盖中文内容。

* 如需更稳定的加载，在自托管方案下为不同权重（Regular/Medium/SemiBold）分别声明 `@font-face`。

