import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, Folder } from 'lucide-react';
import type { ProjectListItem } from '../../types/content';
import React, { useRef } from 'react';

interface ProjectCardProps {
  project: ProjectListItem;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { data } = project;

  // 3D Tilt Logic
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  // 光照效果：随鼠标移动的反光
  const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "200%"]);
  const sheenY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "200%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    // 计算鼠标相对于卡片中心的归一化坐标 (-0.5 到 0.5)
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative flex flex-col bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden h-full shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-black/60 transition-shadow duration-300 perspective-1000"
    >
      {/* 3D Sheen Light Effect - 模拟表面反光 */}
      <motion.div
        style={{
          background: `radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)`,
          left: sheenX,
          top: sheenY,
          opacity: useTransform(mouseXSpring, (val) => Math.abs(val) > 0.01 ? 0.05 : 0), // 只有移动时才明显
        }}
        className="absolute w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 mix-blend-overlay"
      />

      {/* 封面区域 */}
      <div className="relative h-48 overflow-hidden border-b border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 group-hover:border-zinc-200 dark:group-hover:border-zinc-700 transition-colors">
        {data.heroImage ? (
          <img
            src={data.heroImage}
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-600">
            <Folder size={48} strokeWidth={1} />
          </div>
        )}

        {/* 悬停浮层：链接 */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
          {data.github && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white text-zinc-900 rounded-full hover:shadow-lg transition-transform z-30"
              aria-label="GitHub Repo"
            >
              <Github size={20} />
            </motion.a>
          )}
          {data.demo && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href={data.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white text-zinc-900 rounded-full hover:shadow-lg transition-transform z-30"
              aria-label=" Live Demo"
            >
              <ExternalLink size={20} />
            </motion.a>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 flex flex-col grow relative z-10 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {data.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 grow">
          {data.description}
        </p>

        {/* Tech Stack - 电路板胶囊风格 */}
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
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 border border-zinc-200 dark:border-zinc-500 group-hover:bg-orange-400 transition-colors"></span>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
