import { useFrappeGetDoc, useFrappePostCall } from "frappe-react-sdk"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface HiveSettings {
  github_app_id: string | null
  github_app_client_id: string | null
  github_app_public_link: string | null
}

export function GitHubSection() {
  const { data: settings, isLoading } = useFrappeGetDoc<HiveSettings>(
    "Hive Settings",
    "Hive Settings",
  )
  const { call } = useFrappePostCall(
    "frappe.client.run_doc_method",
  )
  const [submitting, setSubmitting] = useState(false)

  const isConfigured = Boolean(settings?.github_app_id)

  const handleCreateApp = async () => {
    setSubmitting(true)
    try {
      const res = await call({
        dt: "Hive Settings",
        dn: "Hive Settings",
        method: "get_github_app_manifest",
      })

      const manifest = res?.message

      if (!manifest) {
        toast.error("Failed to generate GitHub App manifest")
        setSubmitting(false)
        return
      }

      // Submit a hidden form to GitHub to create the app
      const form = document.createElement("form")
      form.method = "POST"
      form.action = "https://github.com/settings/apps/new"

      const input = document.createElement("input")
      input.type = "hidden"
      input.name = "manifest"
      input.value = JSON.stringify(manifest)
      form.appendChild(input)

      document.body.appendChild(form)
      form.submit()
    } catch {
      toast.error("Failed to create GitHub App")
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-10 w-40" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">GitHub Integration</h3>
          <p className="text-xs text-muted-foreground">
            Connect Hive to GitHub to convert tasks into GitHub issues.
          </p>
        </div>

        {isConfigured ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Connected
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              GitHub App is configured. Users can now connect their GitHub accounts
              to convert tasks to issues.
            </p>
            {settings?.github_app_public_link && (
              <a
                href={settings.github_app_public_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline underline-offset-4 hover:no-underline"
              >
                View GitHub App settings
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Create a GitHub App to enable the integration. This will allow
              team members to convert Hive tasks into GitHub issues directly.
            </p>
            <Button
              onClick={handleCreateApp}
              disabled={submitting}
            >
              {submitting ? "Redirecting to GitHub..." : "Create GitHub App"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
