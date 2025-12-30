/**
 * 文章编辑表单组件
 * Backstage 风格 - Content/Metadata 标签切换布局
 */

import { useState } from "react";
import { Save, ExternalLink, Trash2, Loader2 } from "lucide-react";
import Editor from "./Editor";
import TabSwitcher from "./TabSwitcher";
import MetadataPanel from "./MetadataPanel";
import HeaderBar from "./HeaderBar";

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

  // 操作按钮组
  const ActionButtons = (
    <>
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
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* 顶部操作栏 */}
      <HeaderBar
        greeting="Hi, Admin."
        actions={ActionButtons}
      />

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

      {/* 标签切换 */}
      <div className="px-6">
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 内容区域 */}
      <div className="flex-1">
        {activeTab === "content" ? (
          <div className="p-6">
            {/* 文章信息摘要 */}
            {slug && (
              <div className="mb-6 space-y-1">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <span className="font-mono">{slug}</span>
                </div>
                <h1 className="text-2xl font-bold text-zinc-900">
                  {formData.title || "Untitled"}
                </h1>
              </div>
            )}

            {/* 编辑器 */}
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <Editor
                initialContent={formData.content}
                onChange={(content) => handleChange("content", content)}
                placeholder="Start writing..."
                minHeight="500px"
              />
            </div>
          </div>
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
