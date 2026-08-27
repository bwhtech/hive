import { useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { useFrappeGetDoc } from "frappe-react-sdk"
import { Spinner } from "@/components/ui/spinner"

/**
 * Redirect route for /tasks/:id — fetches the task's project
 * and navigates to /projects/{project}?tab=tasks&task={id}.
 */
export function TaskRedirectPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, error } = useFrappeGetDoc<{ project: string }>("Hive Task", id ?? "", {
    fields: ["project"],
  } as never)

  useEffect(() => {
    if (data?.project) {
      navigate(`/projects/${data.project}?tab=tasks&task=${id}`, { replace: true })
    }
  }, [data, id, navigate])

  useEffect(() => {
    if (error) {
      navigate("/tasks", { replace: true })
    }
  }, [error, navigate])

  return (
    <div className="flex h-full items-center justify-center">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )
}
