import { motion } from 'framer-motion';
import { RiGithubFill, RiExternalLinkLine } from '@remixicon/react';
import type { ProjectListItem } from '@/types/content';
import type { Language } from '@/i18n/config';
import type { TranslationDictionary, TranslationKey } from '@/shared/i18n/types';

interface HomeProjectsSectionProps {
  projects: ProjectListItem[];
  lang: Language;
  t: TranslationDictionary;
}

export default function HomeProjectsSection({ projects, t }: HomeProjectsSectionProps) {
  const translate = (key: TranslationKey) => t[key] || key;

  if (projects.length === 0) return null;

  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-24 sm:mb-32"
    >
      <div className="mb-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[17px] font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
            {translate('home.projects')}
          </h2>
        </div>
        <p className="mt-4 max-w-4xl text-base font-light leading-8 text-[var(--color-text-primary)]">
          {translate('home.projects.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="border border-zinc-200 dark:border-zinc-800 p-5"
          >
            <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              {project.data.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2">
              {project.data.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {project.data.stack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-0.5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {project.data.github && (
                  <a href={project.data.github} target="_blank" rel="noopener noreferrer"
                    className="text-zinc-400">
                    <RiGithubFill size={16} />
                  </a>
                )}
                {project.data.demo && (
                  <a href={project.data.demo} target="_blank" rel="noopener noreferrer"
                    className="text-zinc-400">
                    <RiExternalLinkLine size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
