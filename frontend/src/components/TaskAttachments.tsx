import { useState, useRef, useCallback } from "react"
import { useFrappeFileUpload, useFrappeGetDocList, useFrappeDeleteDoc } from "frappe-react-sdk"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Upload04Icon, Cancel02Icon, File02Icon, Download04Icon } from "@hugeicons/core-free-icons"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface FrappeFile {
  name: string
  file_name: string
  file_url: string
  file_size: number
  is_private: 0 | 1
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function TaskAttachments({
  taskName,
  readOnly = false,
}: {
  taskName: string
  readOnly?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { upload } = useFrappeFileUpload()
  const { deleteDoc } = useFrappeDeleteDoc()

  const { data: files, mutate } = useFrappeGetDocList<FrappeFile>("File", {
    fields: ["name", "file_name", "file_url", "file_size", "is_private"],
    filters: [
      ["attached_to_doctype", "=", "Hive Task"],
      ["attached_to_name", "=", taskName],
    ],
    orderBy: { field: "creation", order: "desc" },
    limit: 50,
  })

  const handleUpload = useCallback(
    async (fileList: FileList | File[]) => {
      const MAX_FILE_SIZE_MB = 10
      const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
      const filesToUpload = Array.from(fileList)
      if (filesToUpload.length === 0) return

      const oversized = filesToUpload.filter((f) => f.size > MAX_FILE_SIZE_BYTES)
      if (oversized.length > 0) {
        toast.error(
          oversized.length === 1
            ? `"${oversized[0].name}" is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`
            : `${oversized.length} files exceed the ${MAX_FILE_SIZE_MB}MB limit.`,
        )
        return
      }

      setUploading(true)
      try {
        for (const file of filesToUpload) {
          await upload(file, {
            isPrivate: false,
            doctype: "Hive Task",
            docname: taskName,
          })
        }
        await mutate()
        toast.success(
          filesToUpload.length === 1
            ? "File uploaded"
            : `${filesToUpload.length} files uploaded`,
        )
      } catch {
        toast.error("Failed to upload file")
      } finally {
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    },
    [taskName, upload, mutate],
  )

  const handleRemove = async (file: FrappeFile) => {
    try {
      await deleteDoc("File", file.name)
      await mutate()
      toast.success("File removed")
    } catch {
      toast.error("Failed to remove file")
    }
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (readOnly || uploading) return
      handleUpload(e.dataTransfer.files)
    },
    [readOnly, uploading, handleUpload],
  )

  return (
    <div className="grid gap-2">
      {/* File list */}
      {files && files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <HugeiconsIcon
                icon={File02Icon}
                strokeWidth={2}
                className="size-4 shrink-0 text-muted-foreground"
              />
              <a
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate text-foreground hover:underline"
              >
                {file.file_name}
              </a>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatFileSize(file.file_size)}
              </span>
              <a
                href={file.file_url}
                download={file.file_name}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <HugeiconsIcon icon={Download04Icon} strokeWidth={2} className="size-3.5" />
              </a>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemove(file)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <HugeiconsIcon icon={Cancel02Icon} strokeWidth={2} className="size-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {!readOnly && (
        <>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed px-4 py-5 transition-colors",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            {uploading ? (
              <>
                <Spinner className="size-5" />
                <span className="text-xs text-muted-foreground">Uploading...</span>
              </>
            ) : (
              <>
                <HugeiconsIcon
                  icon={Upload04Icon}
                  strokeWidth={2}
                  className="size-5 text-muted-foreground"
                />
                <span className="text-xs text-muted-foreground">
                  Drop files here or click to browse
                </span>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />
        </>
      )}
    </div>
  )
}
