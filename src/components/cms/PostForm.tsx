/**
 * 文章编辑表单组件
 * 简化布局 - 单行顶部操作栏
 */

import { useState } from "react";
import { Save, ExternalLink, Trash2, Loader2, FileText, Settings } from "lucide-react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import MetadataPanel from "./MetadataPanel";
import { generateSlug } from "@/lib/cms/slug";

interface PostFormData {
  title: string;
  description: string;
  pubDate: string;
  heroImage: string;
  showOnHome: boolean;
  content: string;
  slug: string;
}

interface PostFormProps {
  initialData?: Omit<PostFormData, "slug">;
  slug?: string;
  mode: "create" | "edit";
}

export default function PostForm({ initialData, slug, mode }: PostFormProps) {
  // 表单状态
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    pubDate: initialData?.pubDate || new Date().toISOString().split("T")[0],
    heroImage: initialData?.heroImage || "",
    showOnHome: initialData?.showOnHome || false,
    content: initialData?.content || "",
    slug: slug || "", // 编辑模式使用传入的 slug，创建模式为空
  });

  // UI 状态
  const [activeTab, setActiveTab] = useState<"content" | "metadata">("content");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // 处理表单字段变化
  const handleChange = (field: keyof PostFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  // 自动生成 slug（从标题）
  const handleAutoGenerateSlug = () => {
    if (formData.title.trim()) {
      const newSlug = generateSlug(formData.title);
      handleChange("slug", newSlug);
    }
  };

  // AI 翻译生成 slug
  const handleTranslateSlug = async () => {
    if (!formData.title.trim()) return;

    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/translate-slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formData.title }),
      });

      const data = await response.json();

      if (response.ok && data.slug) {
        handleChange("slug", data.slug);
        setSuccess("Slug 翻译成功！");
      } else {
        setError(data.error || "AI 翻译失败");
      }
    } catch (err) {
      setError("AI 翻译服务不可用");
    } finally {
      setIsTranslating(false);
    }
  };

  // 保存文章
  const handleSave = async () => {
    if (!formData.title.trim()) {
      setActiveTab("metadata");
      setError("Please enter a title");
      return;
    }
    if (!formData.description.trim()) {
      setActiveTab("metadata");
      setError("Please enter a description");
      return;
    }

    // 创建模式下，如果没有 slug 则自动生成
    let slugToUse = formData.slug.trim();
    if (mode === "create" && !slugToUse) {
      slugToUse = generateSlug(formData.title);
    }

    // 验证 slug
    if (!slugToUse) {
      setActiveTab("metadata");
      setError("Please enter a slug");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const url = "/api/admin/posts";
      const method = mode === "create" ? "POST" : "PUT";

      // 构建请求体
      let body;
      if (mode === "create") {
        body = { ...formData, slug: slugToUse };
      } else {
        // 编辑模式：检查 slug 是否变更
        const slugChanged = formData.slug !== slug;
        body = {
          slug, // 原始 slug
          ...(slugChanged ? { newSlug: formData.slug } : {}), // 新 slug（如果变更）
          title: formData.title,
          description: formData.description,
          pubDate: formData.pubDate,
          heroImage: formData.heroImage,
          showOnHome: formData.showOnHome,
          content: formData.content,
        };
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(mode === "create" ? "Post created!" : "Changes saved!");

        // 处理页面跳转
        if (mode === "create" && data.slug) {
          setTimeout(() => {
            window.location.href = `/admin/posts/${data.slug}`;
          }, 1000);
        } else if (mode === "edit" && data.renamed && data.slug) {
          // slug 变更后跳转到新地址
          setTimeout(() => {
            window.location.href = `/admin/posts/${data.slug}`;
          }, 1000);
        }
      } else {
        setError(data.error || "Failed to save");
      }
    } catch (err) {
      setError("Network error, please retry");
    } finally {
      setSaving(false);
    }
  };

  // 删除文章
  const handleDelete = async () => {
    if (!slug) return;
    if (!confirm("Delete this post? This action cannot be undone.")) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/posts?slug=${slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.href = "/admin/posts";
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete");
      }
    } catch (err) {
      setError("Network error, please retry");
    } finally {
      setDeleting(false);
    }
  };

  // 标签配置
  const tabs = [
    { id: "content" as const, label: "Content", icon: FileText },
    { id: "metadata" as const, label: "Metadata", icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 单行顶部操作栏：标签 + slug + 按钮 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 bg-white">
        {/* 左侧：标签切换 */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2 px-4 py-2 text-sm font-medium
                transition-colors rounded-md
                ${activeTab === tab.id
                  ? "text-zinc-900 bg-zinc-100"
                  : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                }
              `}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 中间：slug（仅编辑模式显示） */}
        {slug && (
          <span className="text-sm text-zinc-400 font-mono">{slug}</span>
        )}

        {/* 右侧：操作按钮 */}
        <div className="flex items-center gap-2">
          {mode === "edit" && (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2
                         border border-zinc-300 rounded-md
                         text-sm font-medium text-zinc-700
                         hover:bg-zinc-50 transition-colors"
            >
              <ExternalLink size={16} />
              <span>View</span>
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2
                       bg-zinc-900 rounded-md
                       text-sm font-medium text-white
                       hover:bg-zinc-800 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>Save</span>
          </button>
          {mode === "edit" && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-3 py-2
                         text-zinc-400 hover:text-red-600
                         transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete post"
            >
              {deleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* 消息提示 */}
      {(error || success) && (
        <div
          className={`px-6 py-3 text-sm ${
            error
              ? "bg-red-50 text-red-600 border-b border-red-100"
              : "bg-green-50 text-green-600 border-b border-green-100"
          }`}
        >
          {error || success}
        </div>
      )}

      {/* 内容区域 */}
      <div className="flex-1">
        {activeTab === "content" ? (
          <SimpleEditor
            initialContent={formData.content}
            onChange={(content) => handleChange("content", content)}
            minHeight="calc(100vh - 120px)"
          />
        ) : (
          <MetadataPanel
            formData={formData}
            originalSlug={slug}
            mode={mode}
            onChange={handleChange}
            onAutoGenerateSlug={handleAutoGenerateSlug}
            onTranslateSlug={handleTranslateSlug}
            isTranslating={isTranslating}
          />
        )}
      </div>
    </div>
  );
}
