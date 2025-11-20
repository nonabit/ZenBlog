import type { ImageMetadata } from 'astro';

export interface BlogListItem {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    heroImage?: ImageMetadata;
  };
}

export interface ProjectListItem {
  slug: string;
  data: {
    title: string;
    description: string;
    heroImage?: string;
    stack: string[];
    github?: string;
    demo?: string;
  };
}