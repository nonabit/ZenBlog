import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

// --- 新增：Projects 集合 (适配 Astro 5.0 loader API) ---
const projects = defineCollection({
    loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            order: z.number().default(0),
            heroImage: image().optional(),
            stack: z.array(z.string()).default([]),
            github: z.string().optional(),
            demo: z.string().optional(),
        }),
});

export const collections = { blog, projects };