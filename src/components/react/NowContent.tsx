import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Bike, Mountain, Camera, Coffee } from 'lucide-react';

// --- 数据：生活微日志 (纯文本版) ---
const LIFE_LOGS = [
  {
    date: "Nov 10",
    icon: Bike,
    content: "Weekend cycling along the Huangpu River. 50km done. The autumn wind in Shanghai is something else."
  },
  {
    date: "Oct 24",
    icon: Mountain,
    content: "Climbed Mount Huangshan. Caught the sunrise at 5:30 AM. The sea of clouds was worth the sore legs."
  },
  {
    date: "Oct 05",
    icon: Camera,
    content: "Street photography walk in the old French Concession. Trying to capture light and shadow with monochrome film."
  },
  {
    date: "Sep 18",
    icon: Coffee,
    content: "Finally dialed in the espresso grind size for the new beans. The perfect shot at 28 seconds."
  }
];

// --- 数据：媒体清单 (Media Diet) ---
const MEDIA_LOG = [
  {
    type: "Book",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    rating: 5,
    status: "Reading",
    comment: "Slowly digesting chapter 5. The bible for distributed systems."
  },
  {
    type: "Movie",
    title: "Oppenheimer",
    author: "Christopher Nolan",
    rating: 5,
    status: "Watched",
    comment: "A masterpiece of sound and vision. The tension is palpable."
  },
  {
    type: "Game",
    title: "Factorio",
    author: "Wube Software",
    rating: 5,
    status: "Playing",
    comment: "The factory must grow. Optimized my red circuit production."
  },
  {
    type: "Book",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    rating: 4,
    status: "Finished",
    comment: "Complex character. Great insight into product obsession."
  },
  {
    type: "Movie",
    title: "Silicon Valley",
    author: "HBO",
    rating: 5,
    status: "Rewatching",
    comment: "Still the most accurate documentary about tech startups."
  },
  {
    type: "Game",
    title: "Baldur's Gate 3",
    author: "Larian Studios",
    rating: 5,
    status: "Finished",
    comment: "Setting a new standard for RPGs. The freedom is overwhelming."
  }
];

// 定义 Tab 类型
const TABS = ["All", "Book", "Movie", "Game"];

export default function NowContent() {
  const [activeTab, setActiveTab] = useState("All");

  // 过滤逻辑
  const filteredMedia = activeTab === "All"
    ? MEDIA_LOG
    : MEDIA_LOG.filter(item => item.type === activeTab);

  return (
    <div className="space-y-24">

      {/* 1. The Status (Focus) - 保持宁静的纯文本 */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
            Last updated: November 21, 2024
          </span>
        </div>

        <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
          <p className="font-serif text-2xl leading-relaxed text-zinc-700 dark:text-zinc-200">
            Currently working as a Senior Frontend Engineer at Tech Corp. We are in the middle of a major migration to Next.js, which takes up most of my brain cycles during the week.
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 text-base mt-4 leading-loose">
            On the side, I'm diving deep into <strong>Rust</strong>. It's frustrating but rewarding. I'm trying to build a small CLI tool for image optimization just to get my hands dirty. Simplicity is the ultimate sophistication.
          </p>
        </div>
      </section>

      <hr className="border-zinc-100 dark:border-zinc-800" />

      {/* 2. Life Log (Text Only) - 极简时间轴 */}
      <section>
        <h2 className="font-serif text-2xl text-zinc-900 dark:text-zinc-100 mb-8 flex items-center gap-2">
          <MapPin size={20} className="text-zinc-400" />
          <span>Life Log</span>
        </h2>

        <div className="space-y-8 border-l border-zinc-200 dark:border-zinc-800 ml-3 py-2">
          {LIFE_LOGS.map((item, index) => (
            <div key={index} className="relative pl-8 group">
              {/* 时间轴节点 */}
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors duration-300"></div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                <span className="font-mono text-xs text-zinc-400 w-16 shrink-0">{item.date}</span>
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-medium">
                  <item.icon size={14} className="text-zinc-400" />
                  {/* 简单的标题或直接显示内容，这里直接显示内容更像日记 */}
                </div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-zinc-100 dark:border-zinc-800" />

      {/* 3. Media Diet (Tabbed Table) - 分页清单 */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h2 className="font-serif text-2xl text-zinc-900 dark:text-zinc-100">Media Diet</h2>

          {/* Tabs 切换器 */}
          <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg overflow-hidden">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-300 relative ${activeTab === tab
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white dark:bg-zinc-700 shadow-sm rounded-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 表头 */}
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          <div className="col-span-7 md:col-span-5">Title</div>
          <div className="col-span-2 text-right md:text-left">Rating</div>
          <div className="hidden md:block col-span-5">Comment</div>
          <div className="col-span-3 md:hidden text-right">Status</div>
        </div>

        {/* 列表内容 (带过滤动画) */}
        <div className="flex flex-col min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {filteredMedia.map((item, index) => (
              <motion.div
                layout
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="grid grid-cols-12 gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 items-center text-sm group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 -mx-4 px-4 rounded-lg transition-colors"
              >
                {/* Title & Author */}
                <div className="col-span-7 md:col-span-5">
                  <div className="font-serif text-base text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate pr-4">
                    {item.title}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                    <span>{item.author}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 hidden md:block"></span>
                    <span className="hidden md:block text-zinc-300 dark:text-zinc-600">{item.status}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="col-span-2 flex justify-end md:justify-start text-zinc-300 dark:text-zinc-700 group-hover:text-orange-400 transition-colors">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < item.rating ? "currentColor" : "none"}
                      className={i < item.rating ? "" : "opacity-30"}
                    />
                  ))}
                </div>

                {/* Comment (Desktop) */}
                <div className="hidden md:block col-span-5 text-zinc-500 dark:text-zinc-400 italic truncate pr-2 text-xs">
                  "{item.comment}"
                </div>

                {/* Status (Mobile) */}
                <div className="col-span-3 md:hidden text-right text-xs font-mono text-zinc-400">
                  {item.status}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredMedia.length === 0 && (
            <div className="py-12 text-center text-zinc-400 text-sm italic">
              No records found in this category.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
