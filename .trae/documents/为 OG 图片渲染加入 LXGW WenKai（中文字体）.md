**目标**

* 让 OG 图片中的中文标题与描述使用 `LXGW WenKai`（本地字体），英文保持 `Inter/Newsreader`。

**改动文件**

* `src/pages/og/[...slug].ts`

**实现步骤**

* 读取本地字体：在 `public/fonts/` 读取 `LXGWWenKai-Regular.ttf`。

* 注册到 satori：在 `fonts` 数组追加 `{ name: 'LXGW WenKai', data: <buffer>, style: 'normal', weight: 400 }`。

* 更新内联样式的 `font-family`：

  * 标题处：`'Newsreader', 'LXGW WenKai'`

  * 描述/时间等正文：`'Inter', 'LXGW WenKai'`

**验证**

* 访问任意文章的 OG 路由（例如博客文章对应的 `/og/<slug>`），检查中文是否为楷体，英文保持原样。

