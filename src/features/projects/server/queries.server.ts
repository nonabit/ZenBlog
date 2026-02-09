import { getCollection, type CollectionEntry } from 'astro:content';
import type { ProjectListItem } from '@/types/content';

export type ProjectEntry = CollectionEntry<'projects'>;

export function mapProjectListItem(project: ProjectEntry): ProjectListItem {
  return {
    slug: project.id,
    data: {
      title: project.data.title,
      description: project.data.description,
      heroImage: project.data.heroImage ? project.data.heroImage.src : undefined,
      stack: project.data.stack,
      github: project.data.github,
      demo: project.data.demo,
    },
  };
}

export async function getProjects(): Promise<ProjectListItem[]> {
  const allProjects = (await getCollection('projects')).sort(
    (a, b) => a.data.order - b.data.order,
  );

  return allProjects.map(mapProjectListItem);
}
