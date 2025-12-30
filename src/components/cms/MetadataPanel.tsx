/**
 * 文章元数据设置面板
 * Backstage 风格 - 简约表单布局
 */

import { useState } from "react";
import { Calendar, Hash, Home, Image, X } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface PostFormData {
  title: string;
  description: string;
  pubDate: string;
  heroImage: string;
  showOnHome: boolean;
}

interface MetadataPanelProps {
  formData: PostFormData;
  slug?: string;
  onChange: (field: keyof PostFormData, value: string | boolean) => void;
}

export default function MetadataPanel({
  formData,
  slug,
  onChange,
}: MetadataPanelProps) {
  const [showImageUploader, setShowImageUploader] = useState(false);

  return (
    <div className="p-8 max-w-3xl">
      {/* 文章标识信息 */}
      {slug && (
        <div className="mb-8 pb-8 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
            <Hash size={14} />
            <span>Slug</span>
          </div>
          <p className="font-mono text-zinc-600">{slug}</p>
        </div>
      )}

      {/* 基本信息 */}
      <div className="space-y-6">
        {/* 标题 */}
        <div>
          <label className="block text-sm text-zinc-500 mb-2">
            Title <span className="text-zinc-300">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Enter post title"
            className="w-full px-0 py-2 bg-transparent border-0 border-b border-zinc-200
                       text-zinc-900 text-lg font-medium
                       placeholder:text-zinc-300
                       focus:outline-none focus:border-zinc-900
                       transition-colors"
          />
        </div>

        {/* 描述 */}
        <div>
          <label className="block text-sm text-zinc-500 mb-2">
            Description <span className="text-zinc-300">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Brief description of this post"
            rows={3}
            className="w-full px-0 py-2 bg-transparent border-0 border-b border-zinc-200
                       text-zinc-900
                       placeholder:text-zinc-300
                       focus:outline-none focus:border-zinc-900
                       transition-colors resize-none"
          />
        </div>

        {/* 发布日期 */}
        <div>
          <label className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
            <Calendar size={14} />
            <span>Publish Date</span>
          </label>
          <input
            type="date"
            value={formData.pubDate}
            onChange={(e) => onChange("pubDate", e.target.value)}
            className="px-0 py-2 bg-transparent border-0 border-b border-zinc-200
                       text-zinc-900
                       focus:outline-none focus:border-zinc-900
                       transition-colors"
          />
        </div>

        {/* 首页显示 */}
        <div className="flex items-center gap-3 py-2">
          <button
            type="button"
            onClick={() => onChange("showOnHome", !formData.showOnHome)}
            className={`
              relative w-10 h-6 rounded-full transition-colors duration-200
              ${formData.showOnHome ? "bg-zinc-900" : "bg-zinc-200"}
            `}
          >
            <span
              className={`
                absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm
                transition-transform duration-200
                ${formData.showOnHome ? "left-5" : "left-1"}
              `}
            />
          </button>
          <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
            <Home size={14} />
            <span>Show on homepage</span>
          </label>
        </div>

        {/* 封面图片 */}
        <div className="pt-4">
          <label className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Image size={14} />
            <span>Cover Image</span>
          </label>

          {formData.heroImage ? (
            <div className="relative group">
              <img
                src={formData.heroImage}
                alt="Cover"
                className="w-full max-w-md aspect-video object-cover rounded-lg"
              />
              <button
                onClick={() => onChange("heroImage", "")}
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full
                           text-zinc-500 hover:text-zinc-900
                           opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ) : showImageUploader ? (
            <div className="max-w-md">
              <ImageUploader
                onUploadSuccess={(url) => {
                  onChange("heroImage", url);
                  setShowImageUploader(false);
                }}
                onClose={() => setShowImageUploader(false)}
                type="blog"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowImageUploader(true)}
              className="flex items-center gap-2 px-4 py-2
                         border border-dashed border-zinc-300 rounded-lg
                         text-sm text-zinc-500
                         hover:border-zinc-400 hover:text-zinc-600
                         transition-colors"
            >
              <Image size={16} />
              <span>Upload cover image</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
