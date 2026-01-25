/**
 * 字体常量配置
 *
 * 注意：CSS 变量是单一数据源（src/styles/typography.css）
 * 此文件仅用于不支持 CSS 变量的场景（如 OG 图片生成）
 */

// OG 图片专用字体名（需与 satori fonts 配置中的 name 匹配）
export const OG_FONTS = {
  // 界面/正文字体（英文）
  ui: 'Inter',
  // 标题字体（英文，衬线）
  heading: 'Newsreader',
  // 中文字体
  chinese: 'LXGW WenKai',
} as const;

// OG 图片字体文件路径（相对于项目根目录）
export const OG_FONT_PATHS = {
  inter: './public/fonts/Inter-Regular.ttf',
  newsreader: './public/fonts/Newsreader-SemiBold.ttf',
  wenkai: './public/fonts/LXGWWenKai-Regular.ttf',
} as const;
