import Giscus from "@giscus/react";

// Giscus 评论组件
export default function GiscusComments() {
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
      theme="light"
      lang="zh-CN"
      loading="eager"
    />
  );
}
