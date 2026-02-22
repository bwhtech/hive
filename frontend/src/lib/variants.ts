// Project status → Badge variant
export const PROJECT_STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  Open: "default",
  Completed: "secondary",
  "On Hold": "outline",
}

// Feature request status → Badge variant
export const FEATURE_REQUEST_STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Open: "outline",
  "Under Review": "secondary",
  Approved: "secondary",
  Rejected: "destructive",
  Converted: "secondary",
}

// Task priority → Badge variant
export const TASK_PRIORITY_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Low: "outline",
  Medium: "secondary",
  High: "default",
  Urgent: "destructive",
}

// Feature request priority → Badge variant
export const FEATURE_REQUEST_PRIORITY_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  "Nice to Have": "outline",
  Important: "secondary",
  Critical: "destructive",
}

// Task status → dot color class
export const TASK_STATUS_COLOR: Record<string, string> = {
  Backlog: "bg-muted-foreground/40",
  "To Do": "bg-yellow-500",
  "In Progress": "bg-blue-500",
  Done: "bg-green-500",
  Blocked: "bg-red-500",
}

// Task priority → text color class
export const TASK_PRIORITY_COLOR: Record<string, string> = {
  Urgent: "text-red-500",
  High: "text-orange-500",
  Medium: "text-yellow-500",
  Low: "text-muted-foreground",
}

// Priority sort order (lower = higher priority)
export const PRIORITY_ORDER: Record<string, number> = {
  Urgent: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}
