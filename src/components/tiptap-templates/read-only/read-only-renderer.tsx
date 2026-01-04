"use client"

import { useEffect, useRef } from "react"
import { EditorContent, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Markdown } from "@tiptap/markdown"

// --- Tiptap Node ---
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"

// --- Node Styles (与编辑器共享) ---
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Styles ---
import "./read-only-renderer.scss"

// --- Types ---
export interface ReadOnlyRendererProps {
  /** Markdown 内容 */
  content: string
  /** 自定义 CSS 类名 */
  className?: string
}

/**
 * Tiptap 只读渲染器
 *
 * 使用与 SimpleEditor 相同的扩展配置，确保编辑和阅读的渲染效果一致。
 * 设置 editable: false 禁用编辑功能，仅作为内容展示。
 */
export function ReadOnlyRenderer({ content, className }: ReadOnlyRendererProps) {
  const hasSetContent = useRef(false)

  const editor = useEditor({
    immediatelyRender: false,
    editable: false, // 关键：只读模式
    editorProps: {
      attributes: {
        class: `read-only-renderer tiptap ${className || ""}`,
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        // 只读模式下链接可以点击打开
        link: {
          openOnClick: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      // 使用官方 Markdown 扩展解析内容
      Markdown,
    ],
    content,
    contentType: "markdown",
  })

  // 处理内容异步加载的情况
  useEffect(() => {
    if (editor && content && !hasSetContent.current && editor.isEmpty) {
      editor.commands.setContent(content, { contentType: "markdown" })
      hasSetContent.current = true
    }
  }, [editor, content])

  return (
    <EditorContent
      editor={editor}
      className="read-only-content"
    />
  )
}

export default ReadOnlyRenderer
