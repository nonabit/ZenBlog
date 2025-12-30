/**
 * 文章编辑表单组件
 */

import { useState } from "react";
import Editor from "./Editor";
import ImageUploader from "./ImageUploader";
import { Save, Trash2, Eye, Image, X, Loader2 } from "lucide-react";

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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showHeroUploader, setShowHeroUploader] = useState(false);
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
      setError("请输入文章标题");
      return;
    }
    if (!formData.description.trim()) {
      setError("请输入文章描述");
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
        setSuccess(mode === "create" ? "文章创建成功！" : "文章保存成功！");
        if (mode === "create" && data.slug) {
          setTimeout(() => {
            window.location.href = `/admin/posts/${data.slug}`;
          }, 1000);
        }
      } else {
        setError(data.error || "保存失败");
      }
    } catch (err) {
      setError("网络错误，请重试");
    } finally {
      setSaving(false);
    }
  };

  // 删除文章
  const handleDelete = async () => {
    if (!slug) return;
    if (!confirm("确定要删除这篇文章吗？此操作不可撤销。")) return;

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
        setError(data.error || "删除失败");
      }
    } catch (err) {
      setError("网络错误，请重试");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 提示消息 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* 主编辑区 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 标题 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              文章标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="输入文章标题"
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
            />
          </div>

          {/* 描述 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              文章描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="简短描述文章内容"
              rows={3}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 resize-none"
            />
          </div>

          {/* 内容编辑器 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                文章内容
              </label>
            </div>
            <Editor
              initialContent={formData.content}
              onChange={(content) => handleChange("content", content)}
              placeholder="开始写作..."
              minHeight="400px"
            />
          </div>
        </div>

        {/* 侧边栏 - 固定定位 */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* 操作按钮 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "保存中..." : mode === "create" ? "创建文章" : "保存修改"}
            </button>

            {mode === "edit" && (
              <>
                <a
                  href={`/blog/${slug}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
                >
                  <Eye size={18} />
                  预览文章
                </a>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  {deleting ? "删除中..." : "删除文章"}
                </button>
              </>
            )}
          </div>

          {/* 发布设置 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">发布设置</h3>

            {/* 发布日期 */}
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                发布日期
              </label>
              <input
                type="date"
                value={formData.pubDate}
                onChange={(e) => handleChange("pubDate", e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
              />
            </div>

            {/* 首页显示 */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showOnHome}
                onChange={(e) => handleChange("showOnHome", e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">在首页显示</span>
            </label>
          </div>

          {/* 封面图片 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">封面图片</h3>
              {formData.heroImage && (
                <button
                  onClick={() => handleChange("heroImage", "")}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {formData.heroImage ? (
              <img
                src={formData.heroImage}
                alt="封面"
                className="w-full aspect-video object-cover rounded-lg"
              />
            ) : showHeroUploader ? (
              <ImageUploader
                onUploadSuccess={(url) => {
                  handleChange("heroImage", url);
                  setShowHeroUploader(false);
                }}
                onClose={() => setShowHeroUploader(false)}
                type="blog"
              />
            ) : (
              <button
                onClick={() => setShowHeroUploader(true)}
                className="w-full aspect-video flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-400 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-500 transition-colors"
              >
                <Image size={24} />
                <span className="text-sm">上传封面图片</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
