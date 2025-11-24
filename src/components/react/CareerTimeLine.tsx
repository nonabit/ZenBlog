import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';

const EXPERIENCES = [
  {
    id: 1,
    role: "Senior Frontend Engineer",
    company: "Tech Corp",
    period: "2022 - Present",
    type: "work",
    description: "Leading the design system migration and building the next-gen dashboard using React and Astro."
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "StartUp Inc.",
    period: "2020 - 2022",
    type: "work",
    description: "Shipped the MVP in 3 months. Handled everything from Postgres DB design to Tailwind UI components."
  },
  {
    id: 3,
    role: "Computer Science Degree",
    company: "University of Technology",
    period: "2016 - 2020",
    type: "education",
    description: "Major in Software Engineering. Specialized in Human-Computer Interaction."
  }
];

export default function CareerTimeline() {
  return (
    <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 space-y-12 py-4">
      {EXPERIENCES.map((item, index) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
          className="relative pl-8 group"
        >
          {/* Timeline Dot (像电路节点一样) */}
          <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-white dark:border-black group-hover:scale-150 group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 transition-all duration-300 shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_black]" />
          
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
            <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {item.role}
            </h3>
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1 shrink-0">
              <Calendar size={12} />
              {item.period}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            {item.type === 'work' ? <Briefcase size={14} /> : <GraduationCap size={14} />}
            <span>{item.company}</span>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-prose">
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
