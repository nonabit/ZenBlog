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
