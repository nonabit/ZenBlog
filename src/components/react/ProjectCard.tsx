import { motion } from 'framer-motion';
import { Github, ExternalLink, Folder } from 'lucide-react';
import type { ProjectListItem } from '../../types/content';

interface ProjectCardProps {
  project: ProjectListItem;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { data } = project;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden h-full"
    >
      {/* 封面区域 */}
      <div className="relative h-48 overflow-hidden border-b border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
        {data.heroImage ? (
          <img 
            src={data.heroImage} 
            alt={data.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-600">
            <Folder size={48} strokeWidth={1} />
          </div>
        )}
        
        {/* 悬停浮层：链接 */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
          {data.github && (
            <a 
              href={data.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white text-zinc-900 rounded-full hover:scale-110 transition-transform"
              aria-label="GitHub Repo"
            >
              <Github size={20} />
            </a>
          )}
          {data.demo && (
            <a 
              href={data.demo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white text-zinc-900 rounded-full hover:scale-110 transition-transform"
              aria-label="Live Demo"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 flex flex-col grow">
        <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {data.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 grow">
          {data.description}
        </p>

        {/* Tech Stack - 电路板胶囊风格 (Circuit Board Style) */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {data.stack.map((tech) => (
            <span 
              key={tech} 
              className="
                inline-flex items-center gap-1.5 
                px-2.5 py-1 
                text-[10px] font-mono font-bold uppercase tracking-wider
                text-zinc-600 dark:text-zinc-400 
                bg-white dark:bg-zinc-900
                border border-zinc-200 dark:border-zinc-700 
                rounded-full 
                shadow-[0_1px_1px_rgba(0,0,0,0.05)] dark:shadow-none
                select-none
              "
            >
              {/* 模拟电路焊点 */}
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 border border-zinc-200 dark:border-zinc-500"></span>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
