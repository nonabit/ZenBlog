/**
 * Tiptap 编辑器菜单栏
 * 现代简约风格，参考 TipTap Simple Editor
 */

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link,
  Image,
  Code2,
  Heading,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface EditorMenuBarProps {
  editor: Editor | null;
  onImageUpload?: () => void;
}

// 工具栏按钮组件
function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-1.5 rounded transition-colors
        ${isActive
          ? "bg-zinc-200 text-zinc-900"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
        }
        ${disabled ? "opacity-30 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  );
}

// 分隔线组件
function Divider() {
  return <div className="w-px h-5 bg-zinc-200 mx-1" />;
}

// 标题下拉菜单
function HeadingDropdown({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCurrentHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
    return "H";
  };

  const headingOptions = [
    { level: 1, label: "Heading 1", shortcut: "H1" },
    { level: 2, label: "Heading 2", shortcut: "H2" },
    { level: 3, label: "Heading 3", shortcut: "H3" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-1 px-2 py-1.5 rounded transition-colors
          ${editor.isActive("heading")
            ? "bg-zinc-200 text-zinc-900"
            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
          }
        `}
      >
        <Heading size={16} />
        <span className="text-xs font-medium">{getCurrentHeading()}</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50">
          {headingOptions.map((option) => (
            <button
              key={option.level}
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: option.level as 1 | 2 | 3 }).run();
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-3 py-2 text-sm
                ${editor.isActive("heading", { level: option.level })
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-50"
                }
              `}
            >
              <span>{option.label}</span>
              <span className="text-xs text-zinc-400">{option.shortcut}</span>
            </button>
          ))}
          <div className="border-t border-zinc-100 my-1" />
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().setParagraph().run();
              setIsOpen(false);
            }}
            className="w-full flex items-center px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
          >
            Paragraph
          </button>
        </div>
      )}
    </div>
  );
}

export default function EditorMenuBar({ editor, onImageUpload }: EditorMenuBarProps) {
  if (!editor) {
    return null;
  }

  // 添加链接
  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex items-center justify-center gap-0.5 py-2 px-4 border-b border-zinc-200 bg-white">
      {/* 撤销/重做 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo size={16} />
      </ToolbarButton>

      <Divider />

      {/* 标题下拉 */}
      <HeadingDropdown editor={editor} />

      <Divider />

      {/* 列表 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Numbered list"
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <Divider />

      {/* 文本格式 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="Inline code"
      >
        <Code size={16} />
      </ToolbarButton>

      <Divider />

      {/* 块级元素 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Quote"
      >
        <Quote size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        title="Code block"
      >
        <Code2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Divider"
      >
        <Minus size={16} />
      </ToolbarButton>

      <Divider />

      {/* 链接和图片 */}
      <ToolbarButton
        onClick={addLink}
        isActive={editor.isActive("link")}
        title="Insert link"
      >
        <Link size={16} />
      </ToolbarButton>
      {onImageUpload && (
        <ToolbarButton onClick={onImageUpload} title="Insert image">
          <Image size={16} />
        </ToolbarButton>
      )}
    </div>
  );
}
