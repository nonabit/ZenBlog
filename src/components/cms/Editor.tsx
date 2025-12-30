/**
 * Tiptap 富文本编辑器
 * 支持基础格式、图片上传、Markdown互转
 */

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useState, useCallback, useEffect } from "react";
import EditorMenuBar from "./EditorMenuBar";
import ImageUploader from "./ImageUploader";
import { htmlToMarkdown, markdownToHtml } from "../../lib/cms/markdown";

// 创建 lowlight 实例用于代码高亮
const lowlight = createLowlight(common);

interface EditorProps {
  /** 初始 Markdown 内容 */
  initialContent?: string;
  /** 内容变化回调（Markdown格式） */
  onChange?: (markdown: string) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 编辑器高度 */
  minHeight?: string;
}

export default function Editor({
  initialContent = "",
  onChange,
  placeholder = "开始写作...",
  minHeight = "400px",
}: EditorProps) {
  const [showImageUploader, setShowImageUploader] = useState(false);

  // 创建编辑器实例
  const editor = useEditor({
    // SSR 环境需要设置为 false 避免水合不匹配
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // 使用 CodeBlockLowlight 替代
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 dark:text-blue-400 underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "rounded-lg bg-zinc-900 p-4 text-sm overflow-x-auto",
        },
      }),
    ],
    content: markdownToHtml(initialContent),
    editorProps: {
      attributes: {
        class: `prose prose-zinc dark:prose-invert max-w-none focus:outline-none p-4`,
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML();
        const markdown = htmlToMarkdown(html);
        onChange(markdown);
      }
    },
  });

  // 处理图片上传成功
  const handleImageUpload = useCallback(
    (url: string) => {
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      setShowImageUploader(false);
    },
    [editor]
  );

  // 处理粘贴图片
  useEffect(() => {
    if (!editor) return;

    const handlePaste = async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          event.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;

          // 上传图片
          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", "blog");

          try {
            const response = await fetch("/api/admin/upload", {
              method: "POST",
              body: formData,
            });

            const data = await response.json();
            if (response.ok && data.success) {
              editor.chain().focus().setImage({ src: data.url }).run();
            }
          } catch (error) {
            console.error("粘贴图片上传失败:", error);
          }
        }
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener("paste", handlePaste);

    return () => {
      editorElement.removeEventListener("paste", handlePaste);
    };
  }, [editor]);

  // 处理拖拽图片
  useEffect(() => {
    if (!editor) return;

    const handleDrop = async (event: DragEvent) => {
      const files = event.dataTransfer?.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      if (!file.type.startsWith("image/")) return;

      event.preventDefault();

      // 上传图片
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "blog");

      try {
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (response.ok && data.success) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (error) {
        console.error("拖拽图片上传失败:", error);
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener("drop", handleDrop);

    return () => {
      editorElement.removeEventListener("drop", handleDrop);
    };
  }, [editor]);

  return (
    <div>
      {/* 工具栏 */}
      <EditorMenuBar
        editor={editor}
        onImageUpload={() => setShowImageUploader(true)}
      />

      {/* 图片上传弹窗 */}
      {showImageUploader && (
        <div className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
          <ImageUploader
            onUploadSuccess={handleImageUpload}
            onClose={() => setShowImageUploader(false)}
            type="blog"
          />
        </div>
      )}

      {/* 编辑器内容 */}
      <EditorContent editor={editor} />
    </div>
  );
}
