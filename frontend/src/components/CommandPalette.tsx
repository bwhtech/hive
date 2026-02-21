import { useCallback, useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router"
import { useFrappeGetCall } from "frappe-react-sdk"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare02Icon,
  Folder01Icon,
  TaskDaily01Icon,
  UserGroup03Icon,
  Settings01Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons"
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenSettings: (tab?: string) => void
}

interface TaskResult {
  name: string
  title: string
  project: string
  project_title?: string
  status: string
  priority: string
}

interface ProjectResult {
  name: string
  title: string
  status: string
}

export function CommandPalette({
  open,
  onOpenChange,
  onOpenSettings,
}: CommandPaletteProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState("")

  // Detect current project context from URL
  const projectMatch = location.pathname.match(/\/projects\/([^/]+)/)
  const currentProjectId = projectMatch ? decodeURIComponent(projectMatch[1]) : null

  // Search when query has 2+ chars
  const shouldSearch = query.trim().length >= 2
  const { data: searchData } = useFrappeGetCall<{
    message: { projects: ProjectResult[]; tasks: TaskResult[] }
  }>(
    shouldSearch ? "bwh_hive.bwh_hive.api.search" : null,
    shouldSearch
      ? {
          query: query.trim(),
          project: currentProjectId || undefined,
          limit: 8,
        }
      : undefined,
    undefined,
    { revalidateOnFocus: false },
  )

  const projects = searchData?.message?.projects || []
  const tasks = searchData?.message?.tasks || []

  const runCommand = useCallback(
    (command: () => void) => {
      onOpenChange(false)
      command()
    },
    [onOpenChange],
  )

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput
          placeholder={
            currentProjectId
              ? "Search tasks in project or type a command..."
              : "Search projects, tasks, or type a command..."
          }
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!(shouldSearch && (tasks.length > 0 || projects.length > 0)) && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {/* Task Search Results */}
          {shouldSearch && tasks.length > 0 && (
            <>
              <CommandGroup
                heading={currentProjectId ? "Tasks in project" : "Tasks"}
                forceMount
              >
                {tasks.map((task) => (
                  <CommandItem
                    key={task.name}
                    value={`task-${task.name}-${task.title}`}
                    forceMount
                    onSelect={() =>
                      runCommand(() =>
                        navigate(`/projects/${task.project}`),
                      )
                    }
                  >
                    <HugeiconsIcon
                      icon={TaskDaily01Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                    <span className="flex-1 truncate">{task.title}</span>
                    {!currentProjectId && task.project_title && (
                      <span className="text-xs text-muted-foreground">
                        {task.project_title}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Project Search Results */}
          {shouldSearch && !currentProjectId && projects.length > 0 && (
            <>
              <CommandGroup heading="Projects" forceMount>
                {projects.map((project) => (
                  <CommandItem
                    key={project.name}
                    value={`project-${project.name}-${project.title}`}
                    forceMount
                    onSelect={() =>
                      runCommand(() =>
                        navigate(`/projects/${project.name}`),
                      )
                    }
                  >
                    <HugeiconsIcon
                      icon={Folder01Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                    <span className="flex-1 truncate">{project.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {project.status}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Contextual: Create task in current project */}
          {currentProjectId && (
            <>
              <CommandGroup heading="Actions">
                <CommandItem
                  value="create task in project"
                  keywords={["new", "add", "task"]}
                  onSelect={() =>
                    runCommand(() =>
                      navigate(`/projects/${currentProjectId}?create_task=1`),
                    )
                  }
                >
                  <HugeiconsIcon
                    icon={Add01Icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                  <span>Create Task in This Project</span>
                  <CommandShortcut>N</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Navigation Commands */}
          <CommandGroup heading="Navigation">
            <CommandItem
              value="dashboard"
              keywords={["home", "overview"]}
              onSelect={() => runCommand(() => navigate("/"))}
            >
              <HugeiconsIcon
                icon={DashboardSquare02Icon}
                strokeWidth={2}
                className="size-4"
              />
              <span>Go to Dashboard</span>
            </CommandItem>
            <CommandItem
              value="projects"
              keywords={["folders"]}
              onSelect={() => runCommand(() => navigate("/projects"))}
            >
              <HugeiconsIcon
                icon={Folder01Icon}
                strokeWidth={2}
                className="size-4"
              />
              <span>Go to Projects</span>
            </CommandItem>
            <CommandItem
              value="tasks"
              keywords={["todos", "kanban"]}
              onSelect={() => runCommand(() => navigate("/tasks"))}
            >
              <HugeiconsIcon
                icon={TaskDaily01Icon}
                strokeWidth={2}
                className="size-4"
              />
              <span>Go to Tasks</span>
            </CommandItem>
            <CommandItem
              value="team"
              keywords={["members", "people"]}
              onSelect={() => runCommand(() => navigate("/team"))}
            >
              <HugeiconsIcon
                icon={UserGroup03Icon}
                strokeWidth={2}
                className="size-4"
              />
              <span>Go to Team</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Actions */}
          <CommandGroup heading="Actions">
            <CommandItem
              value="settings"
              keywords={["preferences", "config"]}
              onSelect={() => runCommand(() => onOpenSettings("profile"))}
            >
              <HugeiconsIcon
                icon={Settings01Icon}
                strokeWidth={2}
                className="size-4"
              />
              <span>Open Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

/**
 * Hook to register Cmd+K keyboard shortcut
 */
export function useCommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return { open, setOpen }
}
