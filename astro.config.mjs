import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://ninthbit.org',
  // 静态模式，适用于纯静态站点
  output: 'static',
  adapter: vercel(),
  integrations: [
    mdx(),
    sitemap(),
    react()
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
