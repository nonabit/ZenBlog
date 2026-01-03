/**
 * 顶部操作栏组件
 * Backstage 风格 - 简约头部设计
 */

import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

interface HeaderBarProps {
  title?: string;
  greeting?: string;
  showBackButton?: boolean;
  backUrl?: string;
  actions?: ReactNode;
}

export default function HeaderBar({
  title,
  greeting = "Hi, Admin.",
  showBackButton = false,
  backUrl = "/admin",
  actions,
}: HeaderBarProps) {
  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-zinc-100">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <a
            href={backUrl}
            className="p-1.5 -ml-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <ChevronLeft size={20} />
          </a>
        )}

        {title ? (
          <h1 className="text-lg font-medium text-zinc-900">{title}</h1>
        ) : (
          <span className="font-serif text-lg">{greeting}</span>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}
