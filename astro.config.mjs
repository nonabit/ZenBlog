import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [
    mdx(),
    sitemap(),
    // 必须确保这两个插件在这里：
    tailwind({
      // 这一行确保 tailwind 的基础样式被注入
      applyBaseStyles: false,
    }),
    react()
  ],
});