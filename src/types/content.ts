import type { ImageMetadata } from 'astro';

export interface BlogAuthor {
  name: string;
  title?: string;
  avatar?: string;
}

export interface BlogListItem {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    heroImage?: ImageMetadata | '';
    author?: BlogAuthor;
    showOnHome?: boolean;
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
