/**
 * 文章编辑表单组件
 * 简化布局 - 单行顶部操作栏
 */

import { useState } from "react";
import { Save, ExternalLink, Trash2, Loader2, FileText, Settings } from "lucide-react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import MetadataPanel from "./MetadataPanel";

interface PostFormData {
  title: string;
  description: string;
  pubDate: string;
  heroImage: string;
  showOnHome: boolean;
  content: string;
}

interface PostFormProps {
  initialData?: PostFormData;
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
  });

  // UI 状态
  const [activeTab, setActiveTab] = useState<"content" | "metadata">("content");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 处理表单字段变化
  const handleChange = (field: keyof PostFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
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

    setSaving(true);
    setError(null);

    try {
      const url = "/api/admin/posts";
      const method = mode === "create" ? "POST" : "PUT";
      const body = mode === "create" ? formData : { slug, ...formData };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(mode === "create" ? "Post created!" : "Changes saved!");
        if (mode === "create" && data.slug) {
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
            slug={slug}
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
}
