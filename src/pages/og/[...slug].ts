import { getCollection } from 'astro:content';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import fs from 'fs/promises';
import type { CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';

// 1. Define return type for getStaticPaths
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post: CollectionEntry<'blog'>) => ({
    params: { slug: post.id },
    props: post,
  }));
}

export const GET: APIRoute<CollectionEntry<'blog'>> = async ({ props }) => {
  const post = props;

  // FIX: 
  // 1. Added display: flex to EVERY div.
  // 2. Removed some nested divs to simplify the tree.
  // 3. Ensure style strings are clean.
  const markup = html`
    <div style="display: flex; flex-direction: column; width: 1200px; height: 630px; background-color: #18181b; color: #fff; padding: 80px; justify-content: space-between;">
      
      <div style="display: flex; flex-direction: column;">
         <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; width: 10px; height: 10px; background-color: #f97316; border-radius: 50%; margin-right: 12px;"></div>
            <div style="display: flex; font-size: 24px; color: #a1a1aa; font-family: 'Inter'; text-transform: uppercase; letter-spacing: 2px;">
                9Byte.Dev
            </div>
         </div>

         <div style="display: flex; flex-direction: column; margin-bottom: 24px;">
            <div style="display: flex; font-size: 72px; font-family: 'Newsreader', 'LXGW WenKai'; font-weight: 600; line-height: 1.1; color: #fafafa;">
                ${post.data.title}
            </div>
         </div>

         <div style="display: flex; flex-direction: column;">
            <div style="display: flex; font-size: 32px; color: #a1a1aa; font-family: 'Inter', 'LXGW WenKai'; line-height: 1.5; overflow: hidden;">
                ${post.data.description}
            </div>
         </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
         <div style="display: flex; flex-direction: column;">
             <div style="display: flex; font-size: 24px; color: #71717a; font-family: 'Inter', 'LXGW WenKai'; margin-bottom: 8px;">Published</div>
             <div style="display: flex; font-size: 28px; color: #e4e4e7; font-family: 'Inter', 'LXGW WenKai';">
                ${post.data.pubDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
             </div>
         </div>
         
         <div style="display: flex; align-items: center;">
            <div style="display: flex; font-size: 24px; color: #52525b; font-family: 'Inter', 'LXGW WenKai';">
                fusion-theme.9Byte.Dev
            </div>
         </div>
      </div>
    </div>
  ` as any;

  // Load fonts from the public directory
  // Ensure these files exist in your project at public/fonts/
  const interFont = await fs.readFile('./public/fonts/Inter-Regular.ttf');
  const newsreaderFont = await fs.readFile('./public/fonts/Newsreader-SemiBold.ttf');
  const wenkaiFont = await fs.readFile('./public/fonts/LXGWWenKai-Regular.ttf');

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
      {
        name: 'LXGW WenKai',
        data: wenkaiFont,
        style: 'normal',
        weight: 400,
      },
    ],
  });

  const png: Buffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png.toString('base64'), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};
