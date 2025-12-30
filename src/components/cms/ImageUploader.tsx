/**
 * 图片上传组件
 * 支持拖拽上传
 */

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  onClose?: () => void;
  type?: "blog" | "project";
}

export default function ImageUploader({
  onUploadSuccess,
  onClose,
  type = "blog",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // 显示预览
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 上传文件
      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.success) {
          onUploadSuccess(data.url);
          if (onClose) onClose();
        } else {
          setError(data.error || "上传失败");
        }
      } catch (err) {
        setError("网络错误，请重试");
      } finally {
        setUploading(false);
      }
    },
    [onUploadSuccess, onClose, type]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="p-4">
      {/* 关闭按钮 */}
      {onClose && (
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* 上传区域 */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500"
          }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="预览"
              className="max-w-full max-h-48 mx-auto rounded"
            />
            {uploading && (
              <div className="flex items-center justify-center gap-2 text-zinc-500">
                <Loader2 size={20} className="animate-spin" />
                <span>上传中...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Upload
              size={40}
              className="mx-auto text-zinc-400 dark:text-zinc-500"
            />
            <p className="text-zinc-600 dark:text-zinc-400">
              {isDragActive ? "松开以上传图片" : "拖拽图片到这里，或点击选择"}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              支持 JPEG、PNG、GIF、WebP、SVG，最大 10MB
            </p>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
