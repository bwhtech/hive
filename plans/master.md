# Hive v1 — Master Implementation Plan

> Tracer Bullet Approach: Each phase delivers a thin, working vertical slice through all layers (DocType → API → React UI) so we get feedback fast and validate architecture early.

## Key Architectural Decisions

- **No Frappe Desk.** The React frontend is the sole interface for both team members and clients.
- **Lean API layer.** Standard CRUD via `frappe-react-sdk` hooks (`useFrappeGetDocList`, `useFrappeCreateDoc`, `useFrappeUpdateDoc`, etc.). DocType methods for domain logic (approve UAT, convert feature request). Custom whitelisted APIs **only** for multi-step operations or aggregated queries spanning multiple DocTypes.
- **Role-based access.** Two Frappe roles: `Hive Team` (internal) and `Hive Client` (external). Permissions enforced server-side; React UI hides/shows based on role.
- **DocTypes are data-only.** Created via `bench execute` (new_doc), never accessed through Desk.

## Data Model Overview

```
Hive Settings (Single)            — global config, project types
Hive Project Type (DocType)   — configurable: Build, Hiring, Support, etc. name set by user

Hive Member                       — unified member profile, linked to User
  └── type: Team / Client
  └── client (Link to Hive Client) — required when type=Client
Hive Client                       — client organization

Hive Project                      — the core project
  └── links to: Client, Project Type
  └── Hive Project Member (child) — team members assigned to this project (+ role: champion, stakeholder, member)

Hive Task                         — task within a project
  └── Hive Task Assignment (child)— multi-assign (team + client members)
  └── link field for PR

Hive Milestone                    — milestone on a project (NOT linked to tasks)

Hive Feature Request              — raised by client, can be transformed to task

Hive Project Update               — unified post/update feed for a project
  └── anyone (team or client) can post
  └── rich text (Tiptap editor)
  └── uses Frappe's _seen for read tracking
  └── Hive Update Reaction (child) — emoji reactions from members
```

## Roles & Permissions Matrix

| DocType              | Hive Team (internal)       | Hive Client (external)               |
|----------------------|----------------------------|---------------------------------------|
| Hive Project         | CRUD (own assigned)        | Read (only their projects)            |
| Hive Task            | CRUD                       | Read + update status (own tasks only) |
| Hive Feature Request | Read + approve/amend       | Create + read (own project)           |
| Hive Project Update  | CRUD                       | CRUD (own project)                    |
| Hive Milestone       | CRUD                       | Read (own project)                    |
| Hive Client          | CRUD                       | Read (own org only)                   |
| Hive Member          | CRUD (team type)           | Read (project members only)           |
| Hive Settings        | Full (System Manager only) | None                                  |

---

## Phase 0 — Tracer Bullet (Foundation Slice)

**Goal:** One project, one task, visible on the React frontend. Proves the full stack works end-to-end.

### Backend
1. Create `BWH Hive` module (if not registered)
2. **Hive Settings** (Single DocType) — just app name + a child table for project types
3. **Hive Member** DocType — `user` (Link to User), `type` (Team/Client), `client` (Link to Hive Client, mandatory when type=Client), `designation`, `is_active`
4. **Hive Project** DocType — `title`, `status` (Open/Completed/On Hold), `project_type`, `description`
5. **Hive Task** DocType — `title`, `project` (Link), `status` (Backlog/To Do/In Progress/Done/Blocked), `priority`, `assigned_to` (Link to User), `description`
6. **No custom APIs needed** — all CRUD via frappe-react-sdk hooks (`useFrappeGetDocList`, `useFrappeGetDoc`, `useFrappeCreateDoc`, `useFrappeUpdateDoc`)
7. Roles: `Hive Team`, `Hive Client` — basic DocType permissions
8. Run `bench migrate` and seed 2-3 sample projects + tasks

### Frontend
1. **Projects Page** — fetch and display project list as cards (using `useFrappeGetDocList`)
2. **Project Detail Page** (`/projects/:id`) — show project info + task list
3. **Task Kanban** — drag-and-drop kanban board (Backlog → To Do → In Progress → Done) on the project detail page
4. **Create Task** — simple modal/sheet form to add a task

### Validation
- Can create a project (via API/seed), see it in the React UI
- Can create tasks, move them across kanban columns
- Permissions work: unauthenticated users redirected to login

---

## Phase 1 — Settings Dialog

**Goal:** Settings dialog with vertical tabs (replicated from apps/vms pattern). Manage profile, workspace config, members, and clients.

### Backend
1. **Hive Client** DocType — `name`, `company_name`, `is_active`
2. **Hive Settings** additions — workspace-level configuration fields as needed
3. **User invitation via Frappe's built-in User Invitation system:**
   - Frontend calls `frappe.core.api.user_invitation.invite_by_email` with `emails`, `roles` (`Hive Team` or `Hive Client`), `redirect_to_path: "/frontend"`, `app_name: "bwh_hive"`
   - Frontend calls `frappe.core.api.user_invitation.get_pending_invitations` to list pending invites
   - Frontend calls `frappe.core.api.user_invitation.cancel_invitation` to revoke
   - **Hook in `hooks.py`:** on `User Invitation` `on_update` (status=Accepted) → auto-create `Hive Member` doc for the new user (set type based on invited role)
   - No custom invitation API needed

### Frontend

**Component:** `SettingsDialog.tsx` — shadcn `Dialog` + `Tabs` with vertical orientation (horizontal on mobile). Replicate structure from `apps/vms/frontend/src/components/SettingsDialog.tsx`.

- Triggered from sidebar (gear icon), not a route — no `/settings` page
- Remove `SettingsPage.tsx` from routes
- `Dialog` with `sm:max-w-4xl`, height `h-[min(85vh,750px)]`
- Responsive: `orientation={isMobile ? "horizontal" : "vertical"}`
- Left sidebar: `md:w-48`, `border-r`, `bg-muted/30` with tab triggers

**Tabs:**

| Tab | Icon | Section Component | Content |
|-----|------|-------------------|---------|
| **Profile** | UserCircleIcon | `ProfileSection.tsx` | Edit name, avatar/photo upload, email (read-only) |
| **General** | Settings01Icon | `GeneralSection.tsx` | Manage project types (Hive Project Type CRUD), workspace-level settings from Hive Settings |
| **Members** | UserGroupIcon | `MembersSection.tsx` | List of Hive Members with type filter (Team/Client). Invite form: email + role picker → `invite_by_email`. Pending invitations list with cancel. Active members list with avatars. |
| **Clients** | Building06Icon | `ClientsSection.tsx` | List of Hive Client orgs. Add client form. Click client → shows client members (Hive Members where type=Client and client=X). |

**Each section follows VMS pattern:**
- Scrollable content area (`flex-1 overflow-y-auto`)
- Sticky footer with save button where applicable
- Loading skeleton states
- Toast notifications via sonner

**State management:**
- `settingsOpen` + `settingsTab` state in `AppLayout.tsx`
- `openSettings(tab?)` function passed to Sidebar
- `onOpenChange` / `onTabChange` props on dialog

### Validation
- Dialog opens from sidebar, vertical tabs work on desktop, horizontal on mobile
- Profile: can update name and avatar
- General: can add/edit/delete project types
- Members: can invite team/client members, see pending invitations, cancel invites
- Clients: can create client orgs, view client members

---

## Phase 2 — Team & Client + Global Dashboard

**Goal:** Full team/client data on projects. Global dashboard with Team/Project tabs from whiteboard.

### Backend
1. **Hive Member** additions (from Phase 0):
   - Already has `type` (Team/Client) and `client` link
   - Add `role` field for client members if needed
2. **Hive Project** additions:
   - `client` (Link to Hive Client)
   - **Hive Project Member** (child table) — `member` (Link to Hive Member), `role` (Champion / Stakeholder / Member)
3. **Hive Task** additions:
   - Replace single `assigned_to` with multi-assignment support (use Frappe's ToDo/Assignment or a child table `Hive Task Assignment`)
   - `is_client_task` (bool) — distinguishes "our task" vs "client task"
4. **Standard CRUD via frappe-react-sdk** for all DocTypes with filters
5. Permission rules:
   - Hive Client role: can only read projects where they are a project member
   - Server-side filtering via `get_list` permission queries

### Frontend
1. **Global Dashboard — Team Tab** (from whiteboard)
   - Grid of team member cards
   - Each card: avatar, name, designation
   - Expandable/inline: list of assigned projects + current tasks (simple task list)
   - Visual indicator if member hasn't posted an update in 7+ days (red dot/badge)
2. **Global Dashboard — Project Tab** (from whiteboard)
   - Grid of project cards
   - Each card: project name, type badge, status, client name
   - Summary: count of open tasks (ours vs client), current milestone

### Validation
- Team tab shows real member data with their projects/tasks
- Project tab shows projects with correct client association
- Client members can only see their own projects

---

## Phase 3 — Project Detail & Task Management

**Goal:** Rich project detail page. Full task CRUD with kanban + UAT approval.

### Backend
1. **Hive Task** additions:
   - `uat_status` (Pending / Approved / Rejected)
   - `uat_approved_by`, `uat_date`
   - `pr_link` (Data/URL field)
   - `due_date`, `start_date`
   - `description` (Text Editor)
2. **Hive Milestone** DocType — `title`, `project` (Link), `status` (Upcoming/In Progress/Completed), `target_date`, `description`
3. **Standard CRUD via frappe-react-sdk** for Hive Task (status updates = `useFrappeUpdateDoc`), Hive Milestone
4. **DocType methods** (whitelisted on the class, called via `run_doc_method`):
   - `Hive Task.approve_uat()` / `Hive Task.reject_uat()` — sets uat_status, uat_approved_by, uat_date
5. **Custom whitelisted APIs** (only for aggregated queries):
   - `get_project_dashboard(project)` — aggregated stats (task counts by status, milestone progress, team)
6. Permission: clients can call `approve_uat` / `reject_uat` on tasks in their projects

### Frontend
1. **Project Detail Page** — tabbed layout:
   - **Overview tab** — project dashboard: task summary cards (by status), milestone timeline, team roster, client info
   - **Tasks tab** — kanban board (drag-drop status changes) + list view toggle
   - **Milestones tab** — milestone cards with progress
2. **Task Detail Sheet/Modal**:
   - Full task form: title, description (rich text), status, priority, assignees, PR link, due date
   - UAT section: approve/reject buttons (visible to client role)
   - Activity log (future)
3. **Task Create/Edit Form** — reusable form component
4. Install additional shadcn components as needed: `tabs`, `badge`, `card`, `dialog`, `select`, `textarea`, `calendar/date-picker`

### Validation
- Full task lifecycle: create → assign → move through kanban → link PR → client UAT approve
- Milestones visible on project but independent of tasks
- Client can see project, view tasks, approve UAT

---

## Phase 4 — Feature Requests & Project Updates

**Goal:** Client collaboration (feature requests) + unified project update feed.

### Backend
1. **Hive Feature Request** DocType:
   - `title`, `description`, `project` (Link), `requested_by` (Link to User)
   - `status` (Open / Under Review / Approved / Rejected / Converted)
   - `converted_task` (Link to Hive Task, set when transformed)
   - `priority` (Nice to Have / Important / Critical)
2. **Hive Project Update** DocType:
   - `project` (Link), `posted_by` (Link to User), `date`
   - `content` (Text Editor — Tiptap-based rich text)
   - Uses Frappe's built-in `_seen` field for read tracking (no custom backend needed)
   - **Hive Update Reaction** (child table) — `user`, `emoji` (e.g. thumbs up, heart, etc.)
3. **Standard CRUD via frappe-react-sdk** for Hive Feature Request, Hive Project Update
4. **DocType methods** (whitelisted on the class):
   - `Hive Feature Request.review(action, notes)` — team approves/rejects/amends status
   - `Hive Feature Request.convert_to_task()` — creates Hive Task from request, sets status=Converted, links back (multi-step)
   - `Hive Project Update.toggle_reaction(emoji)` — add/remove current user's reaction
5. Permissions: both team and clients can create updates + feature requests (clients scoped to their projects)

### Frontend
1. **Project Detail — Updates tab**
   - Chronological feed of updates (newest first)
   - Unread count badge on the "Updates" tab label (from `_seen`)
   - Compose box: Tiptap rich text editor to post a new update
   - Each update: author avatar, timestamp, rich text content, reaction bar
   - Reactions: click to add/remove emoji reactions (small predefined set)
   - No comments — just posts and reactions
2. **Project Detail — Feature Requests tab**
   - List of feature requests with status badges
   - Client: "New Request" button → form (title, description, priority)
   - Team: review actions (Approve / Reject / Convert to Task)
   - Status workflow visualization
3. Install shadcn components as needed: `textarea`, `alert-dialog`, Tiptap editor

### Validation
- Anyone posts an update → appears in feed → other members see unread badge
- Reactions work (add/remove)
- Client creates a feature request → team reviews → converts to task → task appears on kanban

---

## Phase 5 — Notifications & My Dashboard

**Goal:** Personal dashboard + staleness alerts.

### Backend
1. **Notification system:**
   - Track `last_update_date` on Hive Member per project
   - Frappe email notifications on: task assignment, UAT request, feature request status change, new project update
2. **Custom whitelisted APIs** (aggregated queries that span multiple DocTypes):
   - `get_stale_members(threshold_days=7)` — members who haven't posted an update
   - `get_my_dashboard()` — aggregated: my tasks, my projects, unread updates count

### Frontend
1. **Global Dashboard enhancements**
   - Red dot/alert on team member cards who haven't posted an update in 7+ days (from whiteboard: "overdue is important")
   - Notification bell in header with unread count
2. **My Dashboard Page** (the `/` route)
   - My assigned tasks (grouped by project)
   - My projects summary
   - My backlog / prioritized list
   - Recent updates feed scoped to my projects (with unread indicators)

### Validation
- Member goes 7+ days without posting → red indicator on Team tab
- My Dashboard shows only my tasks and projects
- Unread update counts are accurate

---

## Phase 6 — Polish & Hardening

**Goal:** Production-readiness. Edge cases, UX refinements, mobile responsiveness.

### Backend
1. Permission hardening — audit all APIs for role-based access, add tests
2. Data validation — required fields, unique constraints, status transitions
3. Search + filters — APIs support filtering/sorting/pagination
4. Bulk operations — bulk status update, bulk assign

### Frontend
1. **Error handling** — error boundaries, toast notifications for API failures
2. **Loading states** — skeleton screens (already have shadcn Skeleton)
3. **Empty states** — friendly illustrations/messages when no data
4. **Mobile responsiveness** — sidebar already responsive, ensure all pages work on mobile
5. **Search & filter** — project/task search bar, filter by status/assignee/type
6. **Keyboard shortcuts** — quick actions (new task, search)
7. **Optimistic updates** — kanban drag-drop feels instant

### Validation
- Manual QA pass through all workflows (team + client perspectives)
- Permission tests: client cannot see other clients' projects
- Mobile testing on common viewport sizes

---

## Summary: Phase → Deliverable

| Phase | Deliverable | Layers Touched |
|-------|-------------|----------------|
| **0 — Tracer Bullet** | Project + Task + Kanban working end-to-end | DocType → React |
| **1 — Settings Dialog** | Vertical-tab dialog (profile, general, members, clients) replicated from VMS | DocType → React |
| **2 — Team & Client + Dashboard** | Global dashboard with Team/Project tabs, project-client linking | DocType → React |
| **3 — Project Detail** | Rich project page, task CRUD, UAT, milestones, PR link | DocType → React |
| **4 — Feature Requests & Updates** | Update feed (Tiptap, reactions, read tracking), feature requests | DocType → React |
| **5 — Notifications & My Dashboard** | Staleness alerts, personal dashboard | DocType → React |
| **6 — Polish** | Error handling, mobile, search, performance | React |

Each phase is a complete vertical slice. After Phase 0, we have a working app we can demo. Each subsequent phase adds a new capability that works end-to-end immediately.
