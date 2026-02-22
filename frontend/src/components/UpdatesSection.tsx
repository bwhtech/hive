import { useState } from "react"
import {
  useFrappeGetDocList,
  useFrappeGetDoc,
  useFrappeCreateDoc,
  useFrappePostCall,
  useFrappeAuth,
} from "frappe-react-sdk"
import { formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { SentIcon, News01Icon } from "@hugeicons/core-free-icons"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { TiptapEditor } from "@/components/TiptapEditor"
import type { HiveProjectUpdate } from "@/types"

const REACTION_EMOJIS = ["\ud83d\udc4d", "\u2764\ufe0f", "\ud83c\udf89", "\ud83d\ude80", "\ud83d\udc40", "\ud83d\ude4f"]

interface UpdatesSectionProps {
  projectId: string
}

export function UpdatesSection({ projectId }: UpdatesSectionProps) {
  const [content, setContent] = useState("")
  const [posting, setPosting] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  const { currentUser } = useFrappeAuth()

  const { data: updates, mutate } = useFrappeGetDocList<HiveProjectUpdate>(
    "Hive Project Update",
    {
      fields: [
        "name",
        "project",
        "posted_by",
        "content",
        "_seen",
        "creation",
        "modified",
      ],
      filters: [["project", "=", projectId]],
      orderBy: { field: "creation", order: "desc" },
      limit: 100,
    },
  )

  const { createDoc } = useFrappeCreateDoc()
  const { call: callMethod } = useFrappePostCall("run_doc_method")

  const handlePost = async () => {
    if (!content.trim()) return
    setPosting(true)
    try {
      await createDoc("Hive Project Update", {
        project: projectId,
        content: content.trim(),
      })
      setContent("")
      setEditorKey((k) => k + 1)
      mutate()
      toast.success("Update posted")
    } catch {
      toast.error("Failed to post update")
    } finally {
      setPosting(false)
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
              {navigator.platform.includes("Mac") ? "\u2318" : "Ctrl"}+Enter to
              post
            </p>
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
        </CardContent>
      </Card>

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
