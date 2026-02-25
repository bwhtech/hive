import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import Mention from "@tiptap/extension-mention"
import { useFrappeFileUpload } from "frappe-react-sdk"
import { useRef, useCallback, useMemo, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { createMentionSuggestion } from "./mentionSuggestion"
import type { MentionItem } from "./MentionList"

interface TiptapEditorProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
  onSubmit?: () => void
  mentionSuggestions?: MentionItem[]
}

export function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Write something...",
  className,
  editable = true,
  onSubmit,
  mentionSuggestions,
}: TiptapEditorProps) {
  const { upload } = useFrappeFileUpload()
  const imageInputRef = useRef<HTMLInputElement>(null)

  const mentionItemsRef = useRef<MentionItem[]>(mentionSuggestions ?? [])
  useEffect(() => {
    mentionItemsRef.current = mentionSuggestions ?? []
  }, [mentionSuggestions])

  const mentionConfig = useMemo(
    () => mentionSuggestions !== undefined
      ? createMentionSuggestion(() => mentionItemsRef.current)
      : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mentionSuggestions !== undefined],
  )

  const uploadAndInsertImage = useCallback(
    async (file: File, editor: Editor) => {
      const MAX_IMAGE_SIZE_MB = 10
      const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(`Image too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`)
        return
      }
      try {
        const res = await upload(file, { isPrivate: false })
        const url = (res as { file_url: string }).file_url
        editor.chain().focus().setImage({ src: url }).run()
      } catch {
        toast.error("Failed to upload image")
      }
    },
    [upload],
  )

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [selectedImageAlt, setSelectedImageAlt] = useState<string | null>(null)

  const handleEditorClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (editable) return
      const target = e.target as HTMLElement
      if (target.tagName === "IMG") {
        setLightboxSrc((target as HTMLImageElement).src)
      }
    },
    [editable],
  )

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      Placeholder.configure({ placeholder }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      ...(mentionConfig
        ? [
            Mention.configure({
              HTMLAttributes: { class: "mention" },
              suggestion: mentionConfig,
            }),
          ]
        : []),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html === "<p></p>" ? "" : html)
    },
    editorProps: {
      attributes: {
        class: "tiptap-content outline-none min-h-[80px] px-3 py-2 text-sm",
      },
      handleKeyDown: (_view, event) => {
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault()
          onSubmit?.()
          return true
        }
        return false
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files
        if (!files?.length) return false
        const images = Array.from(files).filter((f) =>
          f.type.startsWith("image/"),
        )
        if (!images.length) return false
        event.preventDefault()
        const editorInstance = view.state
        if (editorInstance) {
          for (const img of images) {
            uploadAndInsertImage(img, editor!)
          }
        }
        return true
      },
      handlePaste: (_view, event) => {
        const files = event.clipboardData?.files
        if (!files?.length) return false
        const images = Array.from(files).filter((f) =>
          f.type.startsWith("image/"),
        )
        if (!images.length) return false
        event.preventDefault()
        for (const img of images) {
          uploadAndInsertImage(img, editor!)
        }
        return true
      },
    },
  })

  useEffect(() => {
    if (!editor || !editable) {
      setSelectedImageAlt(null)
      return
    }
    const handler = () => {
      if (editor.isActive("image")) {
        setSelectedImageAlt(editor.getAttributes("image").alt || "")
      } else {
        setSelectedImageAlt(null)
      }
    }
    editor.on("selectionUpdate", handler)
    return () => {
      editor.off("selectionUpdate", handler)
    }
  }, [editor, editable])

  const handleAltChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSelectedImageAlt(value)
      if (editor?.isActive("image")) {
        editor.chain().updateAttributes("image", { alt: value }).run()
      }
    },
    [editor],
  )

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length || !editor) return
      for (const file of Array.from(files)) {
        uploadAndInsertImage(file, editor)
      }
      e.target.value = ""
    },
    [editor, uploadAndInsertImage],
  )

  if (!editor) return null

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
    >
      {editable && (
        <Toolbar
          editor={editor}
          onImageClick={() => imageInputRef.current?.click()}
        />
      )}
      <div onClick={handleEditorClick}>
        <EditorContent editor={editor} />
      </div>
      {selectedImageAlt !== null && (
        <div className="flex items-center gap-2 border-t border-input px-3 py-1.5">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Alt text
          </span>
          <input
            type="text"
            className="flex-1 h-6 rounded-sm border border-input bg-transparent px-2 text-xs outline-none focus:ring-1 focus:ring-ring"
            placeholder="Describe this image..."
            value={selectedImageAlt}
            onChange={handleAltChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") {
                e.preventDefault()
                editor?.commands.focus()
              }
            }}
          />
        </div>
      )}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageSelect}
      />
      {lightboxSrc &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out animate-in fade-in-0 duration-150"
            onClick={() => setLightboxSrc(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation()
                setLightboxSrc(null)
              }
            }}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            ref={(el) => el?.focus()}
          >
            <img
              src={lightboxSrc}
              alt=""
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </div>
  )
}

type ToolbarItem = {
  label: string
  title: string
  action: () => void
  isActive?: boolean
}

function Toolbar({
  editor,
  onImageClick,
}: {
  editor: Editor
  onImageClick: () => void
}) {
  const addLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("URL", prev ?? "https://")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const groups: ToolbarItem[][] = [
    [
      {
        label: "B",
        title: "Bold (Ctrl+B)",
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: editor.isActive("bold"),
      },
      {
        label: "I",
        title: "Italic (Ctrl+I)",
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: editor.isActive("italic"),
      },
      {
        label: "U",
        title: "Underline (Ctrl+U)",
        action: () => editor.chain().focus().toggleUnderline().run(),
        isActive: editor.isActive("underline"),
      },
      {
        label: "S",
        title: "Strikethrough",
        action: () => editor.chain().focus().toggleStrike().run(),
        isActive: editor.isActive("strike"),
      },
    ],
    [
      {
        label: "H1",
        title: "Heading 1",
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: editor.isActive("heading", { level: 1 }),
      },
      {
        label: "H2",
        title: "Heading 2",
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: editor.isActive("heading", { level: 2 }),
      },
    ],
    [
      {
        label: "\u2022",
        title: "Bullet List",
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: editor.isActive("bulletList"),
      },
      {
        label: "1.",
        title: "Ordered List",
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: editor.isActive("orderedList"),
      },
      {
        label: "\u201C",
        title: "Blockquote",
        action: () => editor.chain().focus().toggleBlockquote().run(),
        isActive: editor.isActive("blockquote"),
      },
    ],
    [
      {
        label: "<>",
        title: "Code",
        action: () => editor.chain().focus().toggleCode().run(),
        isActive: editor.isActive("code"),
      },
      {
        label: "\u2014",
        title: "Horizontal Rule",
        action: () => editor.chain().focus().setHorizontalRule().run(),
      },
      {
        label: "\ud83d\udd17",
        title: "Link",
        action: addLink,
        isActive: editor.isActive("link"),
      },
      {
        label: "\ud83d\uddbc",
        title: "Insert Image",
        action: onImageClick,
      },
    ],
  ]

  return (
    <div className="flex items-center gap-0.5 border-b border-input px-2 py-1 flex-wrap">
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-0.5">
          {gi > 0 && (
            <div className="mx-1 h-4 w-px bg-border" />
          )}
          {group.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={item.action}
              title={item.title}
              className={cn(
                "inline-flex items-center justify-center rounded-sm px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground select-none",
                item.isActive && "bg-muted text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
