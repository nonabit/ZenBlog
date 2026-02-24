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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-24 sm:mb-32"
    >
      <div className="flex items-baseline justify-between mb-8 max-w-2xl">
        <h2 className="text-sm text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          {translate('home.projects')}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="group border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
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
                    className="text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {project.data.github && (
                  <a href={project.data.github} target="_blank" rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                    <RiGithubFill size={16} />
                  </a>
                )}
                {project.data.demo && (
                  <a href={project.data.demo} target="_blank" rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
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
