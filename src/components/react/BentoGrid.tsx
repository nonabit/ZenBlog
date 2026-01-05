import { cn } from "@/lib/tiptap-utils";
import {
  Clipboard,
  FileX,
  PenLine,
  LayoutGrid,
  TrendingUp,
  Box,
  Layers,
} from "lucide-react";

// ==================== BentoGrid 容器组件 ====================
interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-4xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

// ==================== BentoGridItem 通用卡片组件 ====================
interface BentoGridItemProps {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: BentoGridItemProps) {
  return (
    <div
      className={cn(
        "row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className
      )}
    >
      {header}
      <div>
        {icon}
        <div className="mt-2 mb-2 font-sans font-bold text-zinc-600 dark:text-zinc-200">
          {title}
        </div>
        <div className="font-sans text-xs font-normal text-zinc-600 dark:text-zinc-300">
          {description}
        </div>
      </div>
    </div>
  );
}

// ==================== 占位骨架组件 ====================
export function Skeleton() {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-zinc-200 dark:from-zinc-900 dark:to-zinc-800 to-zinc-100" />
  );
}

// ==================== Demo 组件（带占位数据）====================
const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    icon: <Clipboard className="h-4 w-4 text-zinc-500" />,
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    icon: <FileX className="h-4 w-4 text-zinc-500" />,
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty of thoughtful and functional design.",
    icon: <PenLine className="h-4 w-4 text-zinc-500" />,
  },
  {
    title: "The Power of Communication",
    description:
      "Understand the impact of effective communication in our lives.",
    icon: <LayoutGrid className="h-4 w-4 text-zinc-500" />,
  },
  {
    title: "The Pursuit of Knowledge",
    description: "Join the quest for understanding and enlightenment.",
    icon: <TrendingUp className="h-4 w-4 text-zinc-500" />,
  },
  {
    title: "The Joy of Creation",
    description: "Experience the thrill of bringing ideas to life.",
    icon: <Box className="h-4 w-4 text-zinc-500" />,
  },
  {
    title: "The Spirit of Adventure",
    description: "Embark on exciting journeys and thrilling discoveries.",
    icon: <Layers className="h-4 w-4 text-zinc-500" />,
  },
];

export function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={<Skeleton />}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
