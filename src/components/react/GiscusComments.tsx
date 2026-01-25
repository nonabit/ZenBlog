import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

// Giscus 评论组件 - 支持暗色模式
export default function GiscusComments() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // 初始化时检测当前主题
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setTheme(isDark ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Giscus
      repo="nonabit/ZenBlog"
      repoId="R_kgDOQZxLYQ"
      category="Announcements"
      categoryId="DIC_kwDOQZxLYc4C04o7"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={theme}
      lang="zh-CN"
      loading="eager"
    />
  );
}
