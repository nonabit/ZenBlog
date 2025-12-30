import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://ninthbit.org',
  // 静态模式 + 按需渲染（API 路由使用 prerender = false）
  output: 'static',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    mdx(),
    sitemap(),
    react()
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
