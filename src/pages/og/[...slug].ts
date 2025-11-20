import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import type { CollectionEntry } from 'astro:content';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import { type BlogListItem } from '../../types/content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}

export const GET = async ({ props }: APIContext) => {
  const post = props as CollectionEntry<'blog'>;

  // 定义卡片样式 (Tailwind-like inline styles)
  // 注意：Satori 支持 Flexbox，但不支持所有 CSS
  const markup = html`
    <div style="display: flex; flex-direction: column; width: 1200px; height: 630px; background-color: #18181b; color: #fff; padding: 80px; justify-content: space-between;">
      
      <div style="display: flex; flex-direction: column;">
         <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 10px; height: 10px; background-color: #4ade80; border-radius: 50%; margin-right: 12px;"></div>
            <div style="font-size: 24px; color: #a1a1aa; font-family: 'Inter'; text-transform: uppercase; letter-spacing: 2px;">
                9Byte.dev
            </div>
         </div>

         <div style="font-size: 72px; font-family: 'Newsreader'; font-weight: 600; line-height: 1.1; margin-bottom: 24px; color: #fafafa;">
            ${post.data.title}
         </div>

         <div style="font-size: 32px; color: #a1a1aa; font-family: 'Inter'; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${post.data.description}
         </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
         <div style="display: flex; flex-direction: column;">
             <div style="font-size: 24px; color: #71717a; font-family: 'Inter'; margin-bottom: 8px;">Published</div>
             <div style="font-size: 28px; color: #e4e4e7; font-family: 'Inter';">
                ${post.data.pubDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
             </div>
         </div>
         
         <div style="display: flex; align-items: center;">
            <div style="font-size: 24px; color: #52525b; font-family: 'Inter';">
                fusion-theme.9Byte.dev
            </div>
         </div>
      </div>
    </div>
  `;

  // 获取字体数据 (这里简化处理，使用 fetch 获取 Google Fonts 或本地文件)
  // 为了演示稳定，我们这里使用 fetch 获取在线字体 Buffer
  const interFont = await fetch('https://github.com/google/fonts/raw/main/ofl/inter/Inter-Regular.ttf').then((res) => res.arrayBuffer());
  const newsreaderFont = await fetch('https://github.com/google/fonts/raw/main/ofl/newsreader/Newsreader-SemiBold.ttf').then((res) => res.arrayBuffer());

  const svg = await satori(markup as any, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: interFont,
        style: 'normal',
        weight: 400,
      },
      {
        name: 'Newsreader',
        data: newsreaderFont,
        style: 'normal',
        weight: 600,
      },
    ],
  });

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  const pngUint8 = new Uint8Array(pngBuffer);

  return new Response(pngUint8, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};