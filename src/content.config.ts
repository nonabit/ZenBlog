import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: image().optional(),
    showOnHome: z.boolean().optional(),
    lang: z.enum(['en', 'zh']).default('zh'),  // 语言标识，默认中文
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    heroImage: image().optional(),
    stack: z.array(z.string()),
    github: z.string().optional(),
    demo: z.string().optional(),
  }),
});

export const collections = {
  blog,
  projects,
};
