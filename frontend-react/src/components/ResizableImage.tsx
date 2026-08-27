import Image from "@tiptap/extension-image"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import { useCallback, useRef, useState } from "react"
import type { NodeViewProps } from "@tiptap/react"

const HANDLES = [
  { className: "-top-1.5 -left-1.5 cursor-nwse-resize", dir: -1 },
  { className: "-top-1.5 -right-1.5 cursor-nesw-resize", dir: 1 },
  { className: "-bottom-1.5 -left-1.5 cursor-nesw-resize", dir: -1 },
  { className: "-bottom-1.5 -right-1.5 cursor-nwse-resize", dir: 1 },
]

function ResizableImageView({
  node,
  updateAttributes,
  selected,
  editor,
}: NodeViewProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [resizing, setResizing] = useState(false)
  const { src, alt, title, width } = node.attrs
  const isEditable = editor.isEditable
  const showHandles = isEditable && (selected || resizing)

  const onResizeStart = useCallback(
    (e: React.MouseEvent, dir: number) => {
      e.preventDefault()
      e.stopPropagation()
      const img = imgRef.current
      if (!img) return
      const startX = e.clientX
      const startW = img.offsetWidth
      setResizing(true)

      const onMove = (ev: MouseEvent) => {
        const newW = Math.max(100, startW + (ev.clientX - startX) * dir)
        updateAttributes({ width: Math.round(newW) })
      }

      const onUp = () => {
        setResizing(false)
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
      }

      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    },
    [updateAttributes],
  )

  return (
    <NodeViewWrapper className="image-resizable">
      <div
        className="relative inline-block"
        style={{ width: width ? `${width}px` : undefined, maxWidth: "100%" }}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt || ""}
          title={title || ""}
          className="block w-full h-auto rounded-md"
          style={{ cursor: !isEditable ? "zoom-in" : undefined }}
          draggable={false}
        />
        {showHandles && (
          <>
            <div className="absolute inset-0 ring-2 ring-primary/50 rounded-md pointer-events-none" />
            {HANDLES.map((h) => (
              <div
                key={h.className}
                className={`absolute w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm ${h.className}`}
                onMouseDown={(e) => onResizeStart(e, h.dir)}
              />
            ))}
          </>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el: HTMLElement) => {
          const w = el.getAttribute("width")
          if (w) return parseInt(w, 10) || null
          const sw = (el as HTMLElement).style.width
          if (sw) return parseInt(sw, 10) || null
          return null
        },
        renderHTML: (attributes: Record<string, unknown>) => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView)
  },
})
