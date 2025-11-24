import { getCollection } from 'astro:content';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import type { CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';

// 1. 定义 getStaticPaths 的返回类型
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post: CollectionEntry<'blog'>) => ({
    params: { slug: post.id },
    props: post,
  }));
}

// 2. 定义 GET 函数的类型 (APIRoute)
// 这里的 props 类型就是 CollectionEntry<'blog'>
export const GET: APIRoute<CollectionEntry<'blog'>> = async ({ props }) => {
  const post = props;

  // 3. markup 类型通常会被 satori-html 自动推断为 ReactNode-like 对象，
  // 但 TS 可能会报错，因为 satori-html 返回的 VNode 与 React.ReactNode 类型定义不完全一致
  // 这里我们将其断言为 any 以绕过类型检查，因为 satori 实际上是可以处理 satori-html 的输出的
  const markup = html`
    <div style="display: flex; flex-direction: column; width: 1200px; height: 630px; background-color: #18181b; color: #fff; padding: 80px; justify-content: space-between;">
      
      <div style="display: flex; flex-direction: column;">
         <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; width: 10px; height: 10px; background-color: #f97316; border-radius: 50%; margin-right: 12px;"></div>
            <div style="display: flex; font-size: 24px; color: #a1a1aa; font-family: 'Inter'; text-transform: uppercase; letter-spacing: 2px;">
                9Byte.Dev
            </div>
         </div>

         <div style="display: flex; font-size: 72px; font-family: 'Newsreader'; font-weight: 600; line-height: 1.1; margin-bottom: 24px; color: #fafafa;">
            ${post.data.title}
         </div>

         <div style="display: flex; font-size: 32px; color: #a1a1aa; font-family: 'Inter'; line-height: 1.5; overflow: hidden;">
            ${post.data.description}
         </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
         <div style="display: flex; flex-direction: column;">
             <div style="display: flex; font-size: 24px; color: #71717a; font-family: 'Inter'; margin-bottom: 8px;">Published</div>
             <div style="display: flex; font-size: 28px; color: #e4e4e7; font-family: 'Inter';">
                ${post.data.pubDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
             </div>
         </div>
         
         <div style="display: flex; align-items: center;">
            <div style="display: flex; font-size: 24px; color: #52525b; font-family: 'Inter';">
                fusion-theme.9Byte.dev
            </div>
         </div>
      </div>
    </div>
  ` as any; // <--- 关键修改：添加 as any

  const fontPathInter = path.resolve(process.cwd(), 'public/fonts/Inter-Regular.ttf');
  const fontPathNewsreader = path.resolve(process.cwd(), 'public/fonts/Newsreader-SemiBold.ttf');

  // 4. 读取文件 Buffer
  const interFont: Buffer = await fs.readFile(fontPathInter);
  const newsreaderFont: Buffer = await fs.readFile(fontPathNewsreader);

  // 5. 生成 SVG
  const svg: string = await satori(markup, {
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

  // 6. 生成 PNG Buffer
  const png: Buffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png.toString('base64'), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};