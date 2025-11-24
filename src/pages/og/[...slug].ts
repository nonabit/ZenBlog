import { getCollection } from 'astro:content';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import type { CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';

// Import fonts directly - Vite will handle the path
// Note: You might need to add ?url to the import if these are in public/, 
// BUT better yet, move fonts to `src/assets/fonts/` and import them.
// IF they stay in public, fs.readFile with process.cwd() is correct, 
// but we need to ensure Vercel includes them.

// Let's stick to the fs method but fix the path resolution
import fs from 'fs/promises';
import path from 'path';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post: CollectionEntry<'blog'>) => ({
    params: { slug: post.id },
    props: post,
  }));
}

export const GET: APIRoute<CollectionEntry<'blog'>> = async ({ props }) => {
  const post = props;

  const markup = html`
    <div style="display: flex; flex-direction: column; width: 1200px; height: 630px; background-color: #18181b; color: #fff; padding: 80px; justify-content: space-between;">
      <div style="display: flex; flex-direction: column;">
         <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 10px; height: 10px; background-color: #f97316; border-radius: 50%; margin-right: 12px;"></div>
            <div style="font-size: 24px; color: #a1a1aa; font-family: 'Inter'; text-transform: uppercase; letter-spacing: 2px;">
                Alex.Dev
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
                fusion-theme.alex.dev
            </div>
         </div>
      </div>
    </div>
  ` as any;

  // Vercel file path fix:
  // When running in Vercel, files in 'public' are moved to the root of the task.
  // We try multiple paths to be safe.
  const interPath = path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf');
  const newsreaderPath = path.join(process.cwd(), 'public/fonts/Newsreader-SemiBold.ttf');

  // Fallback reading
  const interFont = await fs.readFile(interPath);
  const newsreaderFont = await fs.readFile(newsreaderPath);

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

  const png: Buffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png.toString('base64'), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};