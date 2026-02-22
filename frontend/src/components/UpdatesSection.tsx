import { useState, useEffect, useRef, useCallback } from "react"
import {
  useFrappeGetDocList,
  useFrappeGetDoc,
  useFrappeCreateDoc,
  useFrappePostCall,
  useFrappeAuth,
  useFrappeUpdateDoc,
  useFrappeDeleteDoc,
  useSWRConfig,
} from "frappe-react-sdk"
import { formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SentIcon,
  News01Icon,
  FileEditIcon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { TiptapEditor } from "@/components/TiptapEditor"
import type { HiveProjectUpdate } from "@/types"

const REACTION_EMOJIS = ["\ud83d\udc4d", "\u2764\ufe0f", "\ud83c\udf89", "\ud83d\ude80", "\ud83d\udc40", "\ud83d\ude4f"]

interface UpdatesSectionProps {
  projectId: string
  onDraftChange?: () => void
}

export function UpdatesSection({ projectId, onDraftChange }: UpdatesSectionProps) {
  const [content, setContent] = useState("")
  const [posting, setPosting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  const [autoSaveDraftId, setAutoSaveDraftId] = useState<string | null>(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSavingRef = useRef(false)
  const { currentUser } = useFrappeAuth()

  // Published updates
  const { data: updates, mutate } = useFrappeGetDocList<HiveProjectUpdate>(
    "Hive Project Update",
    {
      fields: [
        "name",
        "project",
        "posted_by",
        "content",
        "is_draft",
        "_seen",
        "creation",
        "modified",
      ],
      filters: [
        ["project", "=", projectId],
        ["is_draft", "=", 0],
      ],
      orderBy: { field: "creation", order: "desc" },
      limit: 100,
    },
  )

  // My drafts for this project
  const { data: drafts, mutate: mutateDrafts } =
    useFrappeGetDocList<HiveProjectUpdate>("Hive Project Update", {
      fields: [
        "name",
        "project",
        "posted_by",
        "content",
        "is_draft",
        "_seen",
        "creation",
        "modified",
      ],
      filters: [
        ["project", "=", projectId],
        ["is_draft", "=", 1],
        ["posted_by", "=", currentUser ?? ""],
      ],
      orderBy: { field: "modified", order: "desc" },
      limit: 20,
    })

  const { createDoc } = useFrappeCreateDoc()
  const { updateDoc } = useFrappeUpdateDoc()
  const { deleteDoc } = useFrappeDeleteDoc()
  const { call: callMethod } = useFrappePostCall("run_doc_method")
  const { call: publishCall } = useFrappePostCall(
    "bwh_hive.bwh_hive.api.publish_update",
  )
  const { call: markSeenCall } = useFrappePostCall(
    "bwh_hive.bwh_hive.api.mark_updates_seen",
  )
  const { mutate: globalMutate } = useSWRConfig()

  // Mark updates as seen when component mounts with updates
  const hasMarkedSeen = useRef(false)
  useEffect(() => {
    if (updates && updates.length > 0 && !hasMarkedSeen.current) {
      const hasUnread = updates.some((u) => {
        try {
          const seen = u._seen ? JSON.parse(u._seen) : []
          return currentUser ? !seen.includes(currentUser) : false
        } catch {
          return false
        }
      })
      if (hasUnread) {
        hasMarkedSeen.current = true
        markSeenCall({ project: projectId }).then(() => {
          mutate()
          // Refresh dashboard unread count
          globalMutate(
            (key) => typeof key === "string" && key.includes("get_my_dashboard"),
          )
        })
      }
    }
  }, [updates, currentUser, projectId, markSeenCall, mutate, globalMutate])

  // Auto-save: debounce 3s after typing stops
  const doAutoSave = useCallback(
    async (text: string) => {
      if (!text.trim() || isSavingRef.current) return
      isSavingRef.current = true
      setAutoSaveStatus("saving")
      try {
        if (autoSaveDraftId) {
          await updateDoc("Hive Project Update", autoSaveDraftId, {
            content: text.trim(),
          })
          mutateDrafts()
        } else {
          const doc = await createDoc("Hive Project Update", {
            project: projectId,
            content: text.trim(),
            is_draft: 1,
          })
          setAutoSaveDraftId(doc.name)
          mutateDrafts()
          onDraftChange?.()
        }
        setAutoSaveStatus("saved")
      } catch {
        setAutoSaveStatus("idle")
      } finally {
        isSavingRef.current = false
      }
    },
    [autoSaveDraftId, projectId, createDoc, updateDoc, mutateDrafts, onDraftChange],
  )

  useEffect(() => {
    if (!content.trim()) {
      setAutoSaveStatus("idle")
      return
    }
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => doAutoSave(content), 3000)
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    }
  }, [content, doAutoSave])

  // Helper to clear compose area and reset auto-save state
  const clearCompose = () => {
    setContent("")
    setEditorKey((k) => k + 1)
    setAutoSaveDraftId(null)
    setAutoSaveStatus("idle")
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
  }

  const handlePost = async () => {
    if (!content.trim()) return
    setPosting(true)
    try {
      if (autoSaveDraftId) {
        // Update content then publish the auto-saved draft
        await updateDoc("Hive Project Update", autoSaveDraftId, {
          content: content.trim(),
        })
        await publishCall({ update_name: autoSaveDraftId })
      } else {
        await createDoc("Hive Project Update", {
          project: projectId,
          content: content.trim(),
          is_draft: 0,
        })
      }
      clearCompose()
      mutate()
      mutateDrafts()
      onDraftChange?.()
      toast.success("Update posted")
    } catch {
      toast.error("Failed to post update")
    } finally {
      setPosting(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!content.trim()) return
    setSavingDraft(true)
    try {
      if (autoSaveDraftId) {
        // Update the existing auto-saved draft with latest content
        await updateDoc("Hive Project Update", autoSaveDraftId, {
          content: content.trim(),
        })
      } else {
        await createDoc("Hive Project Update", {
          project: projectId,
          content: content.trim(),
          is_draft: 1,
        })
      }
      clearCompose()
      mutateDrafts()
      onDraftChange?.()
      toast.success("Draft saved")
    } catch {
      toast.error("Failed to save draft")
    } finally {
      setSavingDraft(false)
    }
  }

  const handlePublish = async (draftName: string) => {
    try {
      await publishCall({ update_name: draftName })
      mutateDrafts()
      mutate()
      onDraftChange?.()
      toast.success("Update published")
    } catch {
      toast.error("Failed to publish update")
    }
  }

  const handleDeleteDraft = async (draftName: string) => {
    try {
      await deleteDoc("Hive Project Update", draftName)
      mutateDrafts()
      onDraftChange?.()
      toast.success("Draft deleted")
    } catch {
      toast.error("Failed to delete draft")
    }
  }

  const handleReaction = async (updateName: string, emoji: string) => {
    try {
      await callMethod({
        dt: "Hive Project Update",
        dn: updateName,
        method: "toggle_reaction",
        args: JSON.stringify({ emoji }),
      })
      mutate()
    } catch {
      toast.error("Failed to toggle reaction")
    }
  }

  return (
    <div className="space-y-6">
      {/* Compose */}
      <Card>
        <CardContent className="pt-4">
          <TiptapEditor
            key={editorKey}
            onChange={setContent}
            placeholder="Share an update with the team..."
            onSubmit={handlePost}
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-[10px] text-muted-foreground">
              {autoSaveStatus === "saving"
                ? "Saving..."
                : autoSaveStatus === "saved"
                  ? "Auto-saved"
                  : `${navigator.platform.includes("Mac") ? "\u2318" : "Ctrl"}+Enter to post`}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveDraft}
                disabled={!content.trim() || savingDraft}
              >
                <HugeiconsIcon
                  icon={FileEditIcon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                Save Draft
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePost}
                disabled={!content.trim() || posting}
              >
                <HugeiconsIcon
                  icon={SentIcon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                Post Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drafts */}
      {drafts && drafts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Your Drafts
          </h3>
          {drafts.map((draft) => (
            <DraftCard
              key={draft.name}
              draft={draft}
              onPublish={handlePublish}
              onDelete={handleDeleteDraft}
              onUpdate={(name, newContent) => {
                updateDoc("Hive Project Update", name, {
                  content: newContent,
                }).then(() => {
                  mutateDrafts()
                  toast.success("Draft updated")
                })
              }}
            />
          ))}
        </div>
      )}

      {/* Feed */}
      {!updates?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <HugeiconsIcon
            icon={News01Icon}
            strokeWidth={1.5}
            className="size-10 text-muted-foreground/50 mb-3"
          />
          <p className="text-sm text-muted-foreground">No updates yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Be the first to share a project update
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((update) => {
            let seen: string[] = []
            try {
              seen = update._seen ? JSON.parse(update._seen) : []
            } catch {
              // ignore parse errors
            }
            const isUnread = currentUser ? !seen.includes(currentUser) : false

            return (
              <UpdateCard
                key={update.name}
                update={update}
                isUnread={isUnread}
                currentUser={currentUser ?? ""}
                onReaction={handleReaction}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function DraftCard({
  draft,
  onPublish,
  onDelete,
  onUpdate,
}: {
  draft: HiveProjectUpdate
  onPublish: (name: string) => void
  onDelete: (name: string) => void
  onUpdate: (name: string, content: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [editorKey, setEditorKey] = useState(0)

  return (
    <Card className="border-dashed border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/10">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className="text-amber-600 border-amber-300 text-[10px]"
          >
            Draft
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(draft.modified), {
              addSuffix: true,
            })}
          </span>
        </div>

        {editing ? (
          <div>
            <TiptapEditor
              key={editorKey}
              onChange={setEditContent}
              placeholder="Edit your draft..."
              content={draft.content}
            />
            <div className="flex items-center gap-2 mt-3 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (editContent.trim()) {
                    onUpdate(draft.name, editContent.trim())
                    setEditing(false)
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: draft.content }}
          />
        )}

        {!editing && (
          <div className="flex items-center gap-2 mt-3 justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete draft?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This draft will be permanently deleted. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(draft.name)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditContent(draft.content)
                setEditorKey((k) => k + 1)
                setEditing(true)
              }}
            >
              <HugeiconsIcon
                icon={FileEditIcon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Edit
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPublish(draft.name)}
            >
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Publish
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function UpdateCard({
  update,
  isUnread,
  currentUser,
  onReaction,
}: {
  update: HiveProjectUpdate
  isUnread: boolean
  currentUser: string
  onReaction: (updateName: string, emoji: string) => void
}) {
  const [showReactions, setShowReactions] = useState(false)

  // Fetch full doc to get the reactions child table
  const { data: fullDoc, mutate: mutateDoc } = useFrappeGetDoc<
    HiveProjectUpdate & { reactions: { user: string; emoji: string }[] }
  >("Hive Project Update", update.name)

  // Group reactions by emoji
  const reactionGroups: Record<string, string[]> = {}
  if (fullDoc?.reactions) {
    for (const r of fullDoc.reactions) {
      if (!reactionGroups[r.emoji]) reactionGroups[r.emoji] = []
      reactionGroups[r.emoji].push(r.user)
    }
  }

  const handleReactionClick = async (emoji: string) => {
    await onReaction(update.name, emoji)
    mutateDoc()
  }

  const initials = (update.posted_by || "?")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase()

  return (
    <Card className={isUnread ? "border-primary/30 bg-primary/[0.02]" : ""}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <Avatar size="sm">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">
                {update.posted_by.split("@")[0]}
              </span>
              <span className="text-[10px] text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(update.creation), {
                  addSuffix: true,
                })}
              </span>
              {isUnread && (
                <span className="size-1.5 rounded-full bg-primary shrink-0" />
              )}
            </div>
            <div
              className="mt-1.5 text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: update.content }}
            />

            {/* Reactions */}
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              {Object.entries(reactionGroups).map(([emoji, users]) => {
                const hasReacted = users.includes(currentUser)
                return (
                  <button
                    key={emoji}
                    onClick={() => handleReactionClick(emoji)}
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors hover:bg-muted ${
                      hasReacted
                        ? "border-primary/40 bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span className="text-muted-foreground">{users.length}</span>
                  </button>
                )
              })}

              <button
                onClick={() => setShowReactions(!showReactions)}
                className="inline-flex items-center rounded-full border border-dashed px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
              >
                +
              </button>

              {showReactions && (
                <div className="flex items-center gap-1">
                  {REACTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        handleReactionClick(emoji)
                        setShowReactions(false)
                      }}
                      className="text-base hover:scale-125 transition-transform p-0.5"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
