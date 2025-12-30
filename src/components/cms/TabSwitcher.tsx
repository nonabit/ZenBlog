/**
 * Content/Metadata 标签切换组件
 * Backstage 风格 - 简约黑白设计
 */

import { Pencil, Settings } from "lucide-react";

interface TabSwitcherProps {
  activeTab: "content" | "metadata";
  onTabChange: (tab: "content" | "metadata") => void;
}

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  const tabs = [
    { id: "content" as const, label: "Content", icon: Pencil },
    { id: "metadata" as const, label: "Metadata", icon: Settings },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-zinc-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 py-3 text-sm font-medium
              transition-colors duration-150 ease-out
              ${isActive
                ? "text-zinc-900"
                : "text-zinc-400 hover:text-zinc-600"
              }
            `}
          >
            <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
            <span>{tab.label}</span>

            {/* 激活状态下划线 */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900" />
            )}
          </button>
        );
      })}
    </div>
  );
}
