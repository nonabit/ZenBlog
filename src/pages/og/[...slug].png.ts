import { getCollection } from 'astro:content';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import fs from 'fs/promises';
import type { CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';
import { OG_FONTS, OG_FONT_PATHS } from '@/config/fonts';

// 1. Define return type for getStaticPaths
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.flatMap((post: CollectionEntry<'blog'>) => {
    // 从 "en/my-2025-summary.md" 或 "zh/my-2025-summary.md" 提取 "my-2025-summary"
    const cleanSlug = post.id.replace(/^(en|zh)\//, "").replace(/\.[^/.]+$/, "");
    return [
      { params: { slug: post.id }, props: post },
      { params: { slug: cleanSlug }, props: post }
    ];
  });
}

export const GET: APIRoute<CollectionEntry<'blog'>> = async ({ props }) => {
  const post = props;

  try {
    // ... markup definition ...
    const markup = html`
    <div style="display: flex; flex-direction: column; width: 1200px; height: 630px; background-color: #09090b; color: #fff; position: relative; overflow: hidden;">
      
      <!-- Background Gradients -->
      <div style="display: flex; position: absolute; top: 0; left: 0; width: 1200px; height: 630px; background-image: radial-gradient(circle at 50% 0%, #27272a 0%, #09090b 70%);"></div>

      <!-- Grid Pattern -->
      <div style="display: flex; position: absolute; top: 0; left: 0; width: 1200px; height: 630px; opacity: 0.1; background-image: linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px); background-size: 40px 40px;"></div>

      <!-- Floating Particles (Static Decoration) -->
      <div style="display: flex; position: absolute; top: 100px; left: 100px; width: 20px; height: 20px; background-color: #d4d4d8; opacity: 0.05; transform: rotate(15deg);"></div>
      <div style="display: flex; position: absolute; bottom: 150px; right: 200px; width: 40px; height: 40px; background-color: #d4d4d8; opacity: 0.03; transform: rotate(-10deg);"></div>
      <div style="display: flex; position: absolute; top: 200px; right: 100px; width: 10px; height: 10px; background-color: #f97316; opacity: 0.2;"></div>
      
      <!-- Planet Decoration (Top Right) -->
      <div style="display: flex; position: absolute; top: 40px; right: 40px; opacity: 0.5;">
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none" stroke="#a1a1aa" stroke-width="0.8">
          <circle cx="50" cy="50" r="24" />
          <ellipse cx="50" cy="50" rx="42" ry="12" transform="rotate(-30 50 50)" />
          <path d="M70 20 L80 10" stroke="#f97316" stroke-width="1.5" />
        </svg>
      </div>
      
      <!-- Main Content Container -->
      <div style="display: flex; flex-direction: column; width: 100%; height: 100%; padding: 80px; justify-content: space-between; z-index: 10;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
           <div style="display: flex; align-items: center; gap: 12px;">
              <div style="display: flex; width: 12px; height: 12px; background-color: #f97316; border-radius: 50%; box-shadow: 0 0 10px #f97316;"></div>
              <div style="display: flex; font-size: 24px; color: #a1a1aa; font-family: '${OG_FONTS.ui}'; letter-spacing: 1px;">SILICON UNIVERSE</div>
           </div>
        </div>

        <!-- Title Section -->
        <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; align-items: flex-start;">
           <div style="display: flex; font-size: 72px; font-family: '${OG_FONTS.heading}', '${OG_FONTS.chinese}'; font-weight: 600; line-height: 1.1; color: #fafafa; margin-bottom: 24px; text-shadow: 0 0 30px rgba(255,255,255,0.1);">
               ${post.data.title}
           </div>
           <div style="display: flex; font-size: 32px; color: #a1a1aa; font-family: '${OG_FONTS.ui}', '${OG_FONTS.chinese}'; line-height: 1.5; max-width: 900px;">
               ${post.data.description}
           </div>
        </div>

        <!-- Footer -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%; border-top: 1px solid #27272a; padding-top: 30px;">
           <div style="display: flex; flex-direction: column;">
               <div style="display: flex; font-size: 16px; color: #52525b; font-family: '${OG_FONTS.ui}'; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 2px;">Published</div>
               <div style="display: flex; font-size: 24px; color: #d4d4d8; font-family: '${OG_FONTS.ui}';">
                  ${post.data.pubDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
               </div>
           </div>

           <div style="display: flex; align-items: center; gap: 8px;">
              <div style="display: flex; font-size: 24px; color: #71717a; font-family: '${OG_FONTS.heading}';">
                  硅基宇宙
              </div>
           </div>
        </div>

      </div>
    </div>
  ` as any;

    // 加载字体文件（路径定义在 src/config/fonts.ts）
    const interFont = await fs.readFile(OG_FONT_PATHS.inter);
    const notoSerifSCFont = await fs.readFile(OG_FONT_PATHS.notoSerifSC);

    const svg: string = await satori(markup, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: OG_FONTS.ui,
          data: interFont,
          style: 'normal',
          weight: 400,
        },
        {
          name: OG_FONTS.heading,
          data: notoSerifSCFont,
          style: 'normal',
          weight: 600,
        },
      ],
    });

    const png: Buffer = await sharp(Buffer.from(svg)).png().toBuffer();

    return new Response(png.buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
    // ... rest of generation code ...
  } catch (e: any) {
    console.error('OG Generation Error:', e);
    return new Response(e?.message || 'Unknown Error', { status: 500 });
  }
};
