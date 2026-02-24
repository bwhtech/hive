import { useState } from "react"
import { useFrappeGetDocList, useFrappeCreateDoc, useFrappeDeleteDoc } from "frappe-react-sdk"
import { formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
import { toast } from "sonner"
import { TiptapEditor } from "@/components/TiptapEditor"
import { MemberAvatar } from "@/components/MemberAvatar"
import { useUser } from "@/context/UserContext"
import type { HiveTaskComment, HiveMember } from "@/types"

interface TaskCommentsSectionProps {
  taskName: string
  members: HiveMember[] | undefined
}

export function TaskCommentsSection({ taskName, members }: TaskCommentsSectionProps) {
  const { user } = useUser()
  const [newComment, setNewComment] = useState("")
  const [posting, setPosting] = useState(false)
  const [editorKey, setEditorKey] = useState(0)

  const { createDoc } = useFrappeCreateDoc()
  const { deleteDoc } = useFrappeDeleteDoc()

  const { data: comments, mutate } = useFrappeGetDocList<HiveTaskComment>(
    "Hive Task Comment",
    {
      fields: ["name", "task", "posted_by", "content", "creation", "modified"],
      filters: [["task", "=", taskName]],
      orderBy: { field: "creation", order: "asc" },
      limit: 100,
    },
    taskName ? undefined : null,
  )

  const getMemberInfo = (email: string) => {
    const member = members?.find((m) => m.user === email)
    return {
      name: member?.member_name || email,
      image: member?.user_image || null,
    }
  }

  const handlePost = async () => {
    if (!newComment.trim()) return
    setPosting(true)
    try {
      await createDoc("Hive Task Comment", {
        task: taskName,
        content: newComment,
      })
      setNewComment("")
      setEditorKey((k) => k + 1)
      mutate()
      toast.success("Comment added")
    } catch {
      toast.error("Failed to add comment")
    } finally {
      setPosting(false)
    }
  }

  const handleDelete = async (commentName: string) => {
    try {
      await deleteDoc("Hive Task Comment", commentName)
      mutate()
      toast.success("Comment deleted")
    } catch {
      toast.error("Failed to delete comment")
    }
  }

  return (
    <div className="space-y-4">
      <Separator />
      <h4 className="text-sm font-medium px-6">Comments ({comments?.length ?? 0})</h4>

      {/* Comment list */}
      <div className="space-y-3 px-6">
        {comments?.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment.</p>
        )}
        {comments?.map((comment) => {
          const author = getMemberInfo(comment.posted_by)
          const isOwn = comment.posted_by === user?.email
          return (
            <div key={comment.name} className="group flex gap-3">
              <MemberAvatar size="sm" name={author.name} image={author.image} className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{author.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(comment.creation), { addSuffix: true })}
                  </span>
                  {isOwn && (
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <button
                            type="button"
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity ml-auto"
                          />
                        }
                      >
                        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3.5" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This comment will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(comment.name)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                <div
                  className="prose prose-sm max-w-none text-sm [&>p]:my-0.5"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* New comment input */}
      <div className="px-6 space-y-2">
        <TiptapEditor
          key={`comment-${taskName}-${editorKey}`}
          content=""
          onChange={setNewComment}
          placeholder="Write a comment..."
          onSubmit={handlePost}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handlePost}
            disabled={posting || !newComment.trim()}
          >
            {posting ? "Posting..." : "Comment"}
          </Button>
        </div>
      </div>
    </div>
  )
}
