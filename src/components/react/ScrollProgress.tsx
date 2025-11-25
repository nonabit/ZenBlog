import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

// --- 子组件：单个刻度线 (Tick) ---
const Tick = ({ 
  index, 
  total, 
  progress,
  velocity
}: { 
  index: number; 
  total: number; 
  progress: MotionValue<number>;
  velocity: MotionValue<number>;
}) => {
  const position = index / (total - 1);
  const threshold = 0.05;
  const isLong = index % 5 === 0;

  // 1. 计算基础长度 (保持之前的加长版)
  // 短刻度: 12px, 长刻度: 24px
  const baseWidth = isLong ? 24 : 12;

  // 2. 计算波浪的基础形态 (0 ~ 1)
  const waveValue = useTransform(
    progress,
    [position - threshold, position, position + threshold],
    [0, 1, 0]
  );

  // 3. 速度感知逻辑 (保持克制)
  const amplitudeFactor = useTransform(velocity, (v) => {
    const speed = Math.abs(v);
    // 降低灵敏度和上限，只有快速滑动才有明显反馈
    return 1 + Math.min(speed * 0.2, 0.5); 
  });

  // 4. 组合最终宽度
  const width = useTransform(
    [waveValue, amplitudeFactor],
    ([wave, amp]) => {
      const w = wave as number;
      const a = amp as number;
      const extra = isLong ? 8 : 4;
      return baseWidth + (w * extra * a);
    }
  );

  // 5. 颜色逻辑 (静态区分深浅)
  const colorClass = isLong 
    ? "bg-zinc-900 dark:bg-zinc-100" 
    : "bg-zinc-300 dark:bg-zinc-700";

  return (
    <motion.div
      style={{ width }}
      className={`h-px ${colorClass} rounded-full origin-left will-change-transform`}
    />
  );
};

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // 追踪滚动速度
  const scrollVelocity = useVelocity(scrollYProgress);
  
  // 平滑的滚动进度
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 25,
    restDelta: 0.001
  });

  // 平滑的速度值
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 100,
    damping: 30
  });

  const y = useTransform(smoothProgress, (value) => `${value * 100}%`);
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // 修改：回归 31 个刻度
  const totalTicks = 31;
  const ticks = Array.from({ length: totalTicks }).map((_, i) => i);

  return (
    <motion.div 
      className="fixed left-8 top-[50%] -translate-y-1/2 h-[40vh] w-24 z-50 hidden xl:flex flex-col items-start pointer-events-none"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* 标尺背景轴线 */}
      <div className="absolute left-[14px] top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800"></div>
      
      {/* 刻度线容器 */}
      <div className="absolute left-[14px] top-0 bottom-0 flex flex-col justify-between w-full py-[2px]">
        {ticks.map((i) => (
          <Tick 
            key={i} 
            index={i} 
            total={totalTicks} 
            progress={smoothProgress}
            velocity={smoothVelocity}
          />
        ))}
      </div>

      {/* 橙色游标 */}
      <motion.div 
        className="absolute left-0 w-full flex items-center z-10"
        style={{ top: y, translateY: '-50%' }}
      >
         <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-8 border-l-orange-500 drop-shadow-sm"></div>
         <div className="h-px w-12 bg-orange-500 ml-1 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
      </motion.div>
    </motion.div>
  );
}
