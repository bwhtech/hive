# Hive frontend rewrite — React → Vue 3 + frappe-ui

Status: IN PROGRESS. W0 landed (2026-08-27); phase 1 streams unblocked. Replaces `frontend/` (React 19 + shadcn, ~16.7k LOC) with a Vue 3 app built on `frappe-ui@1.0.0-beta.55`. Agent features are dropped. Backend stays as is except for the small items in §9.

Sources for this plan: full inventory of `frontend/src`, clone of `frappe/frappe-ui` at `c2fce39` (beta.55), the bundled frappe-ui skill (`SETUP.md`, `COMPONENTS.md`, `DESIGN.md`, `TOKENS.md`).

Appendices: [react-inventory.md](frappe-ui-rewrite/react-inventory.md) (every page, API call, param, key) · [frappe-ui-inventory.md](frappe-ui-rewrite/frappe-ui-inventory.md) (components, subpaths, data layer).

---

## 1. Goals and non-goals

Goals
- Same product surface as today, minus agent features. Same URLs (`/hive/...`), same query params, same backend API.
- frappe-ui components and design language everywhere. No custom primitives when frappe-ui has one.
- Small dependency list. Few concepts. Easy to hand off in parallel.

Non-goals
- No new features. No redesign of information architecture. Only the visual language changes (Frappe gray-first).
- No backend refactor beyond removing agent hooks (§9, separate PR).
- No agent panel, agent tabs, agent settings, orchestrator socket events, prompt tokens.

---

## 2. Decisions (locked)

| Topic | Decision |
|---|---|
| Location | New app replaces `frontend/` in place. Same build output `bwh_hive/public/frontend/`, same `bwh_hive/www/hive.html`, same `website_route_rules`. React code deleted in the last PR. |
| Stack | Vue 3.5 + TypeScript, `vue-router@4`, `frappe-ui@beta` (1.0.0-beta.55), Tailwind **v3** (preset is v3-only), Vite 7 + `@vitejs/plugin-vue@6` (what frappe-ui itself uses; fall back to Vite 5 only if `frappe-ui/vite` misbehaves), `vite-plugin-pwa` (keep PWA manifest), `frappe-ui/vite` plugin with `buildConfig` + `jinjaBootData`. |
| Data layer | `useCall` for whitelisted methods, `useList` for doc lists, `useDoc` for single docs (+ `methods` for `run_doc_method`), `useNewDoc` for inserts, `useDoctype().runDocMethod` when no doc loaded. No `createResource`, no raw `fetch`. |
| Theme | `useColorScheme()` from frappe-ui (writes `data-theme`, `localStorage.theme`). Drop `hive-ui-theme` key and the oklch/lime palette. Gray-first per DESIGN.md. |
| Shell | `DesktopShell` + `Sidebar` family desktop; `MobileShell` + `MobileNav` + `BottomSheet` mobile. |
| Lists / tables | `frappe-ui/list` (`List`, `ListRow`, `ListCell`, `ListHeaderCellSort`). Sort/paginate in app code. No TanStack. |
| Kanban | frappe-ui has **no** kanban. Build one small `TaskBoard.vue` per DESIGN.md "Board" archetype (`ScrollArea orientation="horizontal"`, columns on `bg-surface-gray-1`, cards on `bg-surface-elevation-1`). Drag and drop via `vuedraggable` (sortablejs). Only extra UI dep in the project. |
| Calendar | `Calendar` from `frappe-ui/experimental` (Day/Week/Month, events, click/create/update). Parked upstream, but working. Wrap once in `TaskCalendar.vue` so it can be swapped later. |
| Command palette | `CommandPalette*` family from `frappe-ui/experimental` inside `Dialog bare`. Register `Mod+K` via `useKeyboardShortcut`. |
| Charts | `frappe-ui/charts`: `AreaChart` (team trend), `NumberCard` (stat tiles). No recharts. |
| Rich text | `frappe-ui/editor`. `CommentKit` (mentions, images, links, lists) for comments, updates, feature requests. `RichTextKit` (+tables, code) for task description. Upload via `uploadFunction` → `upload()` from frappe-ui. Toolbar presets `commentToolbar` / `articleToolbar`. |
| Link pickers | `Combobox` (single) / `MultiSelect` (many) fed by `useCall('frappe.desk.search.search_link')` through one wrapper `LinkPicker.vue`. |
| Dialogs, confirms, toasts | `<Dialog v-model:open>` for forms. `dialog.confirm` / `dialog.danger` / `dialog.prompt` for one-shot. `toast.*` (vue-sonner) with `action: { label: 'Undo' }` for soft-delete undo. |
| Shortcuts | `useKeyboardShortcut` + `KeyboardShortcutsDialog` (replaces custom `useShortcut` registry + ShortcutHelpDialog). Verified: combo grammar is `Mod+Ctrl+Alt+Shift+Key` only, no sequences. So `g d / g p / g t / g m` chords are **dropped**; navigation lives in the command palette and sidebar `accessKey`s. Single-key page shortcuts (`t o m u r a`, `a p`, `?`, `Shift+T`, `Mod+K`, `Mod+Enter`) stay. |
| Icons | `lucide-*` CSS classes. Drop hugeicons. |
| Settings | `SettingsDialog` family (`SettingsSidebar`, `SettingsNavItem`, `SettingsPanel`, `SettingsRow`). Registers `Mod+,`. |
| Slugs / routes | Unchanged: `/`, `/projects`, `/projects/:id`, `/tasks`, `/tasks/:id` (redirect), `/team`. `basename` `/hive` via `createWebHistory('/hive')`. |
| Auth guard | Router `beforeEach`: `useCall('frappe.auth.get_logged_user')` once; Guest → `window.location.href = '/login?redirect-to=' + path`. |
| Tests | Keep `e2e/` Playwright suite. Update selectors only. This is the acceptance bar for every workstream. |

### Cut list (keep it simple)

Dropped, not ported. Each one is a decision; revisit only if someone asks.

| Feature | Reason |
|---|---|
| Everything agent-related (AgentPanel, AgentSettingsTab, AgentSection, agent-fields, useAgentEvents, lib/agent.ts, "agent" tab, `agent_enabled`, socket events `hive_agent_update`/`hive_agent_log`) | Explicit requirement. After this, no socket usage remains in the frontend. |
| Lottie animation + celebration sounds + their 3 settings | Keep only a one-line `canvas-confetti` burst on task Done. Drop `hive:celebration-*` keys and the "Task Completion" settings block. |
| PinnedTasksDock (floating stack of editable task cards) | Heavy, duplicates TaskDetail. Pin state stays (`hive-pinned-tasks`) and pinned tasks float to the top of kanban columns as today; the dock is replaced by a "Pinned" `SidebarSection` listing pinned tasks that open the task panel. |
| `motion` animations, `tw-animate-css` | frappe-ui transitions only. |
| Chunk-retry reload (`lazyWithRetry`) | Router lazy routes + `onError` reload once. Trivial in Vue. |
| Separate `SettingsPage.tsx` stub | Was unused. |
| Table-in-editor toolbar for comments | Only task description gets `RichTextKit`. |

Kept as is: GitHub App section + "Convert to GitHub Issue" (integration, not agent), UAT approve/reject, recurrence, saved Hive Views, onboarding, overdue dialog, notification sheet, keyboard shortcuts, PWA.

---

## 3. Target project layout

```
frontend/
  index.html                       # <div id="app">, boot via frappeui jinjaBootData
  vite.config.ts                   # frappeui({ buildConfig, jinjaBootData, frappeProxy, lucideIcons }), vue(), VitePWA
  tailwind.config.js               # presets: [frappeUIPreset], content: [...frappeUiContent, './src/**/*.{vue,ts}']
  postcss.config.js
  tsconfig.json
  src/
    main.ts                        # createApp, router, app.use(FrappeUI), style.css
    App.vue                        # <FrappeUIProvider><router-view/></FrappeUIProvider>
    router.ts                      # routes + auth guard
    style.css                      # @import 'frappe-ui/style.css'; tailwind directives; .prose tweaks for editor content
    types.ts                       # doctype interfaces (no agent fields) + status constants
    lib/
      status.ts                    # status/priority/size → Badge theme lookups, PRIORITY_ORDER, TASK_SIZE_WEIGHT
      dates.ts                     # dayjs helpers (fromNow, isOverdue, groupByDay)
      text.ts                      # stripHtml, initials
      storage.ts                   # typed localStorage helpers (keys below)
    composables/
      useSession.ts                # current user, Hive Member, isClient  (singleton)
      usePinnedTasks.ts            # hive-pinned-tasks
      useArchiveWithUndo.ts        # setValue is_archived=1 + toast Undo
      useCelebrate.ts              # confetti
      useLinkSearch.ts             # search_link wrapper for LinkPicker
      useTaskMutations.ts          # updateStatus (optimistic), assign/unassign, create task + assign_to
    components/
      shell/   AppShell.vue AppSidebar.vue AppHeader.vue MobileShellNav.vue
      common/  LinkPicker.vue MemberAvatar.vue AvatarStack.vue StatusBadge.vue PriorityBadge.vue
               RichEditor.vue (Editor wrapper: kit, mentions, upload) EmptyState.vue PageSkeleton.vue
               EmojiPicker.vue (Popover + small grid; no emoji-picker-react)
      dashboard/  MyWorkTab.vue ProjectsTab.vue TeamTab.vue
      projects/   ProjectCard.vue CreateProjectDialog.vue NewClientDialog.vue ProjectHeader.vue
                  OverviewTab.vue ActivityTab.vue MilestonesTab.vue MilestoneDialog.vue
                  UpdatesTab.vue UpdateComposer.vue UpdateCard.vue DraftCard.vue
                  RequestsTab.vue FeatureRequestDialog.vue ManageLinksDialog.vue
      tasks/      TaskFilters.vue TaskTable.vue TaskBoard.vue TaskBoardCard.vue TaskCalendar.vue
                  CreateTaskDialog.vue TaskPanel.vue (detail) TaskComments.vue TaskAttachments.vue
                  SaveViewDialog.vue ViewEditDialog.vue
      team/       MemberCard.vue
      settings/   SettingsDialog.vue ProfileSection.vue GeneralSection.vue MembersSection.vue
                  ClientsSection.vue GitHubSection.vue
      global/     CommandPalette.vue NotificationsSheet.vue OnboardingDialog.vue OverdueTasksDialog.vue
    pages/
      DashboardPage.vue ProjectsPage.vue ProjectDetailPage.vue TasksPage.vue TaskRedirectPage.vue TeamPage.vue
```

Rules for all workstreams
- One component per file. Composition API, `<script setup lang="ts">`.
- Only frappe-ui semantic tokens (`bg-surface-*`, `text-ink-*`, `border-outline-*`). No `text-gray-*`.
- Badge colors only through `lib/status.ts` lookups.
- All lists use `frappe-ui/list`. All scroll regions use `ScrollArea`.
- Every input carries `label` / `error` / `required` through the component props. No placeholder-as-label.
- Writes: `immediate: false` + `submit()`. Loading bound to `<Button :loading>`.
- Client role (`isClient`) hides create/edit/delete, same as today.
- Mobile: same component, responsive; dialogs become `BottomSheet` under `sm:` only where the React app used a Drawer.

---

## 4. Component mapping (React/shadcn → frappe-ui)

| Today (React) | Vue + frappe-ui |
|---|---|
| shadcn `Button` | `Button` (`variant` + `theme`) |
| `Dialog` / `AlertDialog` | `Dialog v-model:open` / `dialog.confirm`, `dialog.danger` (typed-title delete → `dialog.prompt` with `validate`) |
| `Sheet` (task detail, notifications, new client) | Desktop: right panel `w-[28rem] border-l` inside a two-pane layout (DESIGN "Detail + meta panel"); mobile: `BottomSheet`. Notifications: `Popover` (desktop) / `BottomSheet` (mobile). |
| `Drawer` (vaul) | `BottomSheet` |
| `Tabs` / `TabsList` | `Tabs` + `TabList` + `TabTrigger` (`variant="underline"`, `route` prop syncs `?tab=`) |
| toggle groups (view mode, week/month) | `TabButtons` |
| `DropdownMenu` | `Dropdown :options` (groups, submenus) |
| `Popover` + `Command` (assignee picker, link repo) | `MultiSelect` / `Combobox` |
| `Select` | `Select` / `FormControl type="select"` |
| `Input`, `Textarea`, `Checkbox`, `Switch`, `Label` | `FormControl` (`type` switch) or direct `TextInput`, `Textarea`, `Checkbox`, `Switch` |
| `Calendar` + Popover date picker (react-day-picker) | `DatePicker` |
| `Badge` | `Badge :theme :variant="subtle"` |
| `Avatar` / AvatarGroup | `Avatar` / `AvatarStack.vue` (manual stack of `Avatar`, `+N`) |
| `Tooltip` | `Tooltip` or `Button :tooltip` |
| `Skeleton`, `Spinner`, `Progress` | same names |
| `Empty` | `EmptyState.vue` (text + optional action, no card) |
| `Breadcrumb` | `Breadcrumbs :items` |
| `Kbd` | `KeyboardShortcut` |
| `ScrollArea`, `Resizable` | `ScrollArea`; resizable panels dropped (fixed width panel) |
| `Sidebar` (shadcn) | `Sidebar`, `SidebarHeader`, `SidebarSection`, `SidebarItem` |
| `Table` + TanStack | `List` table mode + `ListHeaderCellSort`; page size 20 in app code |
| `Card` (stats, project cards) | plain `rounded border border-outline-gray-1 bg-surface-base p-4`; KPI strip `divide-x divide-outline-gray-2`; `NumberCard` for dashboard stats |
| cmdk | `CommandPalette` family (experimental) |
| sonner | `toast` (vue-sonner) |
| Tiptap custom editor | `Editor` + `EditorFixedMenu` + `CommentKit` / `RichTextKit` |
| `LinkField` | `LinkPicker.vue` (Combobox + search_link) |
| `emoji-picker-react` | `EmojiPicker.vue`: `Popover` + fixed grid of ~60 emoji (views + reactions only need a few) |
| `useShortcut` + `ShortcutHelpDialog` | `useKeyboardShortcut` + `KeyboardShortcutsDialog` |
| `theme-provider` | `useColorScheme` |
| recharts | `AreaChart`, `NumberCard` |
| dnd-kit | `vuedraggable` |
| `useFrappeGetDocList` / `GetDoc` / `PostCall` / `GetCall` / `CreateDoc` / `UpdateDoc` / `DeleteDoc` / `FileUpload` | `useList` / `useDoc` / `useCall` (POST) / `useCall` (GET) / `useNewDoc` / `useDoc().setValue` or `useList().setValue` / `useDoc().delete` / `upload()` or `FileUploader` |
| SWR `mutate` after write | `list.reload()` / `doc.reload()`; optimistic via `list.updateRow` |

---

## 5. Shared contracts (Phase 0 deliverables, frozen before parallel work)

These are the interfaces every workstream imports. Phase 0 must ship them with stub-level tests so streams don't drift.

```ts
// composables/useSession.ts
export function useSession(): {
  user: Ref<{ name: string; full_name: string; user_image?: string } | null>
  member: Ref<HiveMember | null>
  isClient: ComputedRef<boolean>
  ready: Ref<boolean>
  logout(): Promise<void>
}

// composables/useTaskMutations.ts
export function useTaskMutations(list?: ReturnType<typeof useList<HiveTask>>): {
  setStatus(task: HiveTask, status: TaskStatus): Promise<void>   // optimistic via list.updateRow, celebrate on Done, sets completed_on
  createTask(values: CreateTaskValues): Promise<HiveTask>          // useNewDoc + separate try/catch for assign_to.add
  assign(name: string, users: string[]): Promise<void>
  unassign(name: string, user: string): Promise<void>
}

// composables/useArchiveWithUndo.ts
export function useArchiveWithUndo(doctype: string): (name: string, label: string, onDone?: () => void) => Promise<void>
// sets is_archived=1, toast with Undo action (6s) that sets it back to 0

// composables/usePinnedTasks.ts
export function usePinnedTasks(): { pinned: Ref<string[]>; isPinned(n: string): boolean; toggle(n: string): void; max: 5 }

// components/common/LinkPicker.vue
props: { doctype: string; modelValue: string | null; filters?: Record<string, unknown>; label?: string; placeholder?: string; multiple?: false }
emits: ['update:modelValue']

// components/common/RichEditor.vue
props: { modelValue: string; kit: 'comment' | 'rich'; placeholder?: string; editable?: boolean; mentions?: { id: string; label: string; image?: string }[]; submitOnModEnter?: boolean }
emits: ['update:modelValue', 'submit']

// components/tasks/TaskPanel.vue   (opened by ?task=<name> on ProjectDetail, or in place on TasksPage)
props: { name: string | null }   emits: ['close', 'changed']

// components/tasks/CreateTaskDialog.vue
props: { open: boolean; projectId?: string; defaults?: Partial<CreateTaskValues> }  emits: ['update:open', 'created']

// lib/status.ts
export const TASK_STATUSES = ['Someday','Backlog','To Do','In Progress','Done'] as const  // 'Blocked' selectable in selects
export function statusTheme(s: TaskStatus): BadgeTheme
export function priorityTheme(p: TaskPriority): BadgeTheme
export const PRIORITY_ORDER, TASK_SIZE_WEIGHT
```

localStorage keys (unchanged where kept): `hive-pinned-tasks`, `hive-create-task-draft`, `hive-overdue-dialog-last-shown`, `hive_projects_status_filter`, `hive_projects_scope_filter`, `hive_projects_my_only`. New: `theme` (frappe-ui). Removed: `hive-ui-theme`, `hive:celebration-*`.

---

## 6. Workstreams

Phase 0 is serial (one person / one agent, ~1 day). Phases 1–2 run in parallel. Phase 3 is integration.

### Phase 0 — Foundation (serial, blocks everything)

**W0 · Scaffold + shell + contracts**
1. Move React app to `frontend-react/` (temporary, deleted in W11). Scaffold `frontend/` per `SETUP.md` (Tailwind v3, `frappe-ui@beta`, `vue-router`, `unplugin-icons` stack, `optimizeDeps.exclude: ['frappe-ui']`). Vite 7 first; drop to 5 if `frappe-ui/vite` breaks.
2. `vite.config.ts`: `frappeui({ frappeProxy: true, jinjaBootData: true, lucideIcons: true, buildConfig: { indexHtmlPath: '../bwh_hive/www/hive.html', outDir: '../bwh_hive/public/frontend' } })` + `VitePWA` (copy manifest from React config). Verify `bwh_hive/www/hive.py` boot still works or move boot into `jinjaBootData`.
3. Router with lazy routes, `/hive` base, auth guard, `usePageMeta` titles.
4. `AppShell.vue`: `DesktopShell` + `Sidebar` (Dashboard/Projects/Tasks/Team, "Views" section, "Pinned" section, footer user `Dropdown`: theme toggle, Raise an issue, Log out) and `AppHeader.vue` (`PageHeader`: search button `Mod+K`, bell with unread count from `useList('Notification Log', …)` polled every 30s). Mobile: `MobileShell` + `MobileNav` (Dashboard, Projects, Tasks, You).
5. All §5 contracts, `types.ts`, `lib/*`, `style.css` (editor content prose).
6. Placeholder pages (heading only) for all six routes so every stream can boot the app.
7. Register global shortcuts (`Mod+K`, `?`, `Shift+T`, `Mod+,`) with `useKeyboardShortcut`; mount `KeyboardShortcutsDialog`.
8. Verify `e2e/` runs against the placeholder shell (login + nav only).

Exit: `yarn build` produces `www/hive.html`, `/hive` loads, login guard works, sidebar nav works, dark mode works, `LinkPicker` and `RichEditor` demo on a hidden `/dev` route.

**Done.** Notes for the streams that follow:
- Vite 7 + `@vitejs/plugin-vue` 6 work; no fallback to Vite 5 was needed. `optimizeDeps.include` drops `feather-icons` and `showdown` — beta.55 no longer pulls them.
- Pages render their header through `components/shell/AppHeader.vue`, not `PageHeader` directly: it teleports the global search + notification bell into every page header. Use `#left` for breadcrumbs / a back button / an inline title editor and `#actions` for page actions.
- Overlay state (command palette, notifications, settings, create dialogs, onboarding) lives in `composables/useOverlays.ts`. W7 and W8 mount their component and read the flag; nothing needs an edit to `AppShell.vue`.
- `useKeyboardShortcut`'s combo grammar has no `?` or `,` key: register `Shift+Slash` and `Mod+Comma`.
- The bare `rounded` utility no longer exists in the beta preset — use `rounded-1` … `rounded-9` or `rounded-full`. Solid badges use `text-white`; there is no `ink-white` token.
- `yarn typecheck` runs `vue-tsc --noEmit`, clean today. `#components/*` … `#utils/*` are mapped in `tsconfig.json` because TS does not resolve frappe-ui's own `imports` field; `~icons/*` is declared in `src/shims.d.ts`.
- Rendered (read-only) rich text gets `class="hive-prose"` from `style.css`.
- `e2e/` auth setup passes unchanged. The page specs fail on React-era selectors, as expected. One to fix in W9: `PageHeaderTitle` renders a `<span>`, so `getByRole('heading', { name: 'Dashboard' })` no longer matches.

### Phase 1 — Pages (parallel, 8 streams, no shared files)

Each stream owns only the directories listed. Shared changes go through a tiny PR to W0's files, never edited in place.

| Stream | Owns | Builds | Backend calls | Reference recipe |
|---|---|---|---|---|
| **W1 Dashboard** | `pages/DashboardPage.vue`, `components/dashboard/*` | Tabs `my/projects/team` synced to `?tab=`. MyWork: `NumberCard` ×3, tasks grouped by project (`List` feed + `ListGroup`), recent updates with unread dot, my projects grid. ProjectsTab: card grid with counts. TeamTab: `AreaChart` completed-per-day + `TabButtons` week/month, member cards with top-5 overdue/completed. | `get_my_dashboard`, `get_team_stats`, `useList` Hive Project/Task | Accounting (chart + list), Dashboard archetype |
| **W2 Projects list + create** | `pages/ProjectsPage.vue`, `components/projects/ProjectCard.vue`, `CreateProjectDialog.vue`, `NewClientDialog.vue` | Filters (search, status `Select`, scope `Select`, "My projects" `Switch`) persisted to localStorage; card grid; empty state. Create dialog: title, visibility, `LinkPicker` type + client, "+ new client". | `get_my_project_memberships`, `useList` Hive Project, `useNewDoc` Hive Project / Hive Client | Deals (card grid) |
| **W3 Project detail: header + Overview + Activity + Milestones** | `pages/ProjectDetailPage.vue`, `components/projects/ProjectHeader.vue`, `OverviewTab.vue`, `ActivityTab.vue`, `MilestonesTab.vue`, `MilestoneDialog.vue`, `ManageLinksDialog.vue` | Slug resolve, `?tab=` via `Tabs :route`, `?task=` → `TaskPanel` (stub until W6 merges), `?create_task=1`, `?create_feature_request=1`. Header: inline title edit, status/type/client pills (`Dropdown`), GitHub repo link (`Combobox` of repos), links chips, archive with typed-title `dialog.prompt`, "Add Task". Overview: KPI strip, active milestones with weighted progress, team members (`MultiSelect` + role `Select`). Activity: grouped by day, old→new badges. Milestones: cards with progress, status `Select`, create/edit dialog. Shortcuts `t o m u r a`. Tasks tab mounts `TaskBoard` from W5 with milestone filter. | `resolve_project_slug`, `useDoc` Hive Project (+ setValue), `useList` Hive Task/Milestone/Project Type/Client, `get_task_assignees`, `get_project_dashboard`, `get_project_activity`, `github.status`, `github.get_repos` | Tickets (header + tabs), Detail archetype |
| **W4 Updates + Feature Requests** | `components/projects/UpdatesTab.vue`, `UpdateComposer.vue`, `UpdateCard.vue`, `DraftCard.vue`, `RequestsTab.vue`, `FeatureRequestDialog.vue` | Composer with `RichEditor kit="comment"`, 3s draft autosave (`useNewDoc` then `setValue`), Save Draft / Post (`publish_update`). Feed of updates (`List` feed mode, unread highlight, `mark_updates_seen` once), reactions (6 emoji, `useDoc(...).toggle_reaction`), drafts with edit/publish/delete-undo. Requests: `List` table (title, status, priority, requested by, date) with row `Dropdown` actions → `review` / `convert_to_task`; create dialog. | `useList` Hive Project Update / Feature Request, `publish_update`, `mark_updates_seen`, doc methods `toggle_reaction`, `review`, `convert_to_task` | Discussions (feed), Compose |
| **W5 Tasks page + board + calendar + views** | `pages/TasksPage.vue`, `components/tasks/TaskFilters.vue`, `TaskTable.vue`, `TaskBoard.vue`, `TaskBoardCard.vue`, `TaskCalendar.vue`, `SaveViewDialog.vue`, `ViewEditDialog.vue`, sidebar "Views" section content (via a small `components/shell/SidebarViews.vue` owned here) | URL-driven filters (`q status priority project assignee view view_id`), `TabButtons` list/kanban/calendar, save/update view `Dropdown`, `TaskTable` (`List` table, sortable columns, 20/page), `TaskBoard` (5 columns, `vuedraggable`, optimistic `setStatus`, pinned first, Done = last 7 days, card badges: priority/size/PR/UAT/recurrence/depends-on/due/assignees), `TaskCalendar` (experimental `Calendar`, events from `due_date`, undated tray), views CRUD. Opens `TaskPanel` in place. | `useList` Hive Task/Project/Milestone/View, `get_task_assignees`, `useTaskMutations` | Tasks recipe, Board archetype |
| **W6 Task panel + create dialog + comments + attachments** | `components/tasks/TaskPanel.vue`, `CreateTaskDialog.vue`, `TaskComments.vue`, `TaskAttachments.vue`, `pages/TaskRedirectPage.vue` | Panel: title, status/priority/size `Select`, milestone + depends-on `LinkPicker`, assignees `MultiSelect` (`assign_to.add/remove`), start/due/completed `DatePicker` (lock rule from Hive Settings), recurrence, PR link, GitHub issue button, description `RichEditor kit="rich"`, attachments (`FileUploader`, private toggle, delete), UAT box (approve/reject doc methods), comments (`RichEditor kit="comment"`, delete-undo), 1.5s autosave with Saving…/Saved, archive-undo, shortcuts `Mod+Enter`, `a`, `p`. Create dialog: two-column desktop / stacked mobile, draft in localStorage, project `Select` when global. | `useDoc` Hive Task (+ methods approve_uat/reject_uat, setValue), `useDoc` Hive Project, `useDoc` Hive Settings, `useList` Hive Member/File/Task Comment, `github.create_issue`, `assign_to.*`, `upload()` | Detail + meta panel archetype, Compose |
| **W7 Settings + Onboarding** | `components/settings/*`, `components/global/OnboardingDialog.vue` | `SettingsDialog` with nav: Profile (photo upload → `set_value`, names, designation), General (project types CRUD with archive-undo, due-date lock switch), Members (list, invite team/client, pending invitations, cancel), Clients (list, add, drill-in members: invite/assign/remove), GitHub (app manifest form post, install link). Onboarding: 3-step `Dialog` (invite, clients, project types) → `onboarding_completed=1`. | `useDoc` User/Hive Member/Hive Settings, `useList` Hive Member/Client/Project Type, `invite_member`, `invite_client_member`, `user_invitation.*`, `set_value`, `upload()`, `get_github_app_manifest` | Discussions recipe (SettingsDialog) |
| **W8 Global overlays + Team page** | `components/global/CommandPalette.vue`, `NotificationsSheet.vue`, `OverdueTasksDialog.vue`, `pages/TeamPage.vue`, `components/team/MemberCard.vue` | Command palette (`search` ≥2 chars, groups Tasks/Projects/Create/Navigation/Actions, project context from route), notifications (`Notification Log` list, mark read / mark all, navigate), overdue dialog once/day, `KeyboardShortcutsDialog` wiring + `?`. Team page: search, member cards with counts + trend, expand → `get_member_tasks`, by-status/by-project `TabButtons`, stale dot. | `search`, `Notification Log` list + `mark_as_read`/`mark_all_as_read`, `get_my_overdue_tasks`, `get_team_dashboard`, `get_stale_members`, `get_member_tasks` | Mail (feed), Discussions (palette) |

Cross-stream dependencies: W3 mounts W5's `TaskBoard` and W6's `TaskPanel`; W5 mounts W6's `TaskPanel` and `CreateTaskDialog`. Until merge, each stream uses a stub component with the frozen props from §5. Merge order: W6 → W5 → W3.

**W1, W2, W4, W5 and W6 are done** (one commit each on `feat/frappe-ui-w0-scaffold`). They were built in parallel in one working tree with disjoint file ownership, so no stubs were needed: W5 mounts W6's real `TaskPanel` and `CreateTaskDialog`. `yarn typecheck`, `yarn lint` and `yarn build` are green, and the dashboard, projects, task table, board, calendar and task panel were checked in the browser on desktop and mobile.

Notes for W3, W7 and W8:
- `src/shims.d.ts` no longer declares `*.vue`. Volar types single-file components itself, and the wildcard shadowed them, which made `frappe-ui/experimental`'s own `@ts-expect-error` directives unused and failed typecheck for anything importing that entry point — the command palette in W8 included.
- W4's tabs mount as `<UpdatesTab :project="project.name" @draft-count="…" />` and `<RequestsTab :project="project.name" v-model:create-open="…" @count="…" />`. `project` is the docname, not the slug, and neither renders a header or a tab bar.
- W5's board takes `tasks`, `assigneesByTask`, `list` (the `useList` result, for optimistic drops), `readonly` and `showUat`, and emits `select(task)` and `changed`. Pass it a milestone-filtered `tasks`.
- Saving a view dispatches a `hive:views-changed` window event because frappe-ui's list store does not propagate inserts across instances.
- Card corners are `rounded-4` in W2 and `rounded-5` in W1; W10 picks one.

Carried into Phase 2:
- W10: mount `CreateProjectDialog` once in `AppShell.vue` on `useOverlays().createProjectOpen` and drop the `ProjectsPage` mount, so the command palette can open it from any route. Replace the `hive:views-changed` event with a `composables/useHiveViews.ts` singleton. Fold W1's `DashboardProjectCard.vue` into W2's `ProjectCard.vue`.
- W12: `get_team_stats` is whitelisted with no role check, so a client on the dashboard's `?tab=team` sees team members' overdue and internal task titles. This is pre-existing React behaviour and needs a backend fix.

### Phase 2 — Integration and cleanup (after Phase 1 merges)

| Stream | Work |
|---|---|
| **W9 e2e** | Run full `e2e/` suite; update selectors/flows; add smoke for kanban DnD, calendar, command palette, settings. Gate on green. |
| **W10 Polish pass** | One agent walks every screen against DESIGN.md: gray-first, ink ladder, one primary action per header, row heights, gutters, mobile translation. Fix token misuse. `pre-commit run --all-files`. |
| **W11 Remove React** | Delete `frontend-react/`, prune root `package.json`, update `CLAUDE.md` (frappe-ui, `yarn dev` on 8080 proxying 8000, `frappe-ui` skill), README. |
| **W12 Backend agent cleanup (separate PR, optional but recommended)** | Remove `agent_api.py`, `orchestrator/`, agent fields from Hive Task / Hive Project / Hive Settings JSON (+ patch to drop columns), `agent_*` whitelisted methods and `resolved_prompts` in `api.py`, `ToDo` doc_events and `reconcile_agent_tasks` cron in `hooks.py`, agent notification channels, `tasks.py` bits. Types in the new frontend never referenced these, so this can land any time. |

---

## 7. Screen specs (per-stream detail)

Query params and shortcuts are preserved exactly; UI compositions follow the archetypes.

**Sidebar (W0)** — `Sidebar width="14rem"`; `SidebarHeader` with logo + title "Hive"; `SidebarSection` nav (`SidebarItem` icon + label + `accessKey`); `SidebarSection label="Views" collapsible` (from W5); `SidebarSection label="Pinned"` (from `usePinnedTasks`); footer `Dropdown` on avatar row: Theme (`useColorScheme` toggle), Raise an issue, Log out. Settings item hidden for clients.

**Dashboard (W1)** — `max-w-4xl` centered, `space-y-6`. `Tabs variant="underline"` desktop, `Select` mobile. KPI strip: three `NumberCard` (Open tasks, In progress, Unread updates). "My tasks": `List` feed with `ListGroup` per project; row = status dot + title + due meta; click → `/projects/:p?tab=tasks&task=`. "Recent updates": rows with unread dot, 120-char stripped text. "My projects": card grid. Team tab: `AreaChart :data x="date" y="completed"` + `TabButtons` Week/Month; member cards sorted overdue desc.

**Projects (W2)** — `PageHeader` title + "New Project" (`solid gray`, hidden for clients). Toolbar row: `TextInput` search with `#prefix` search icon, status `Select`, scope `Select`, `Switch` "My projects". Grid of cards `rounded border border-outline-gray-1 p-4`: title, status `Badge`, lock icon if private, type · client meta, 2-line description.

**Project detail (W3)** — `PageHeader`: `PageHeaderBackButton`, inline-editable title (click → `TextInput`, Enter/blur save, Esc cancel), status/type/client as `Dropdown` with `Badge` triggers, links chips, GitHub repo `Combobox`, `…` `Dropdown` (Manage links, Archive), primary "Add Task" with `KeyboardShortcut T`. `Tabs variant="underline"` with count badges (Tasks count, Updates drafts). Tasks tab: milestone `Select` + "x of y" + `TaskBoard`. Overview: KPI strip (`divide-x`), "Active milestones" section with `Progress`, "Team" section with `MultiSelect` add + role `Select` + remove. Activity: day groups (`SidebarLabel`-style headings), rows with avatar, label, `old → new` badges. Milestones: list of cards with `Progress` + status `Select`, edit → `MilestoneDialog` (`FormControl` title, `DatePicker`, textarea; `Mod+Enter`).

**Updates / Requests (W4)** — Composer at top: `RichEditor kit="comment"` with `commentToolbar`, footer "Draft saved · 12:03" + Save Draft (`subtle`) + Post (`solid`). Drafts: amber `Badge Draft`, edit inline, Publish, Delete (undo). Feed: `List` feed mode rows `h-auto` with avatar, name, relative time, prose content, reaction chips (`Badge variant="outline"` with count, `Tooltip` names) + "+" `Popover` with 6 emoji. Requests: `List` table columns Title / Status / Priority / Requested by / Date / `…`, row `Dropdown` with state-dependent actions; create `Dialog` (title, priority `Select`, `RichEditor`).

**Tasks (W5)** — `PageHeader`: `Breadcrumbs` (Tasks › view emoji+label), `TabButtons` list/kanban/calendar, `…` `Dropdown` (Save view / Save changes / Save as new), "Add Task". Toolbar: search, status/priority `Select`, project/assignee `LinkPicker`, filter-count `Badge`. `TaskTable`: `List :columns` + `ListHeaderCellSort`, `:row-height="44"`, columns Task (status dot, recur icon) / Project / Status / Priority / Size / Milestone / Start / Due (overdue `text-ink-red-6`) / Assignees (`AvatarStack`); Prev/Next footer. `TaskBoard`: `ScrollArea orientation="horizontal"`, 5 columns `w-72 bg-surface-gray-1 rounded p-2`, header label + count `Badge`, `vuedraggable group="tasks"` per column, drop → `setStatus`, card `bg-surface-elevation-1 rounded border border-outline-gray-1 p-3`. `TaskCalendar`: experimental `Calendar` with `TabButtons` Day/Week/Month, Today/prev/next, undated tray below. Save view `Dialog`: `EmojiPicker`, name, public `Checkbox`, view type, filter summary.

**Task panel (W6)** — Desktop: right pane `w-[28rem] shrink-0 border-l` with `ScrollArea`; header title + pin + close; body `space-y-4` of label/control rows (`text-ink-gray-6` labels); mobile `BottomSheet`. Footer: saving state text, archive icon. Description `RichEditor kit="rich"` with `articleToolbar`. Attachments: `FileUploader` drop zone + `List` of files (icon by ext, thumb for images, size, private lock, download, delete). Comments: `List` feed + composer. UAT box: bordered section with `Badge` + Approve (`solid green`) / Reject (`outline red`).

**Create task (W6)** — `Dialog size="4xl"`; desktop grid `grid-cols-[35%_1fr]`: left meta controls, right title `TextInput` + `RichEditor`. Draft in `hive-create-task-draft`.

**Settings (W7)** — `SettingsDialog` nav: Profile · General · Members · Clients · GitHub (team only). Each panel `SettingsHeader` + `SettingsBody` of `SettingsRow` (`divide-y`). Profile save is a sticky footer only when dirty.

**Command palette (W8)** — `Dialog bare` + `CommandPalette` family; input debounced 250ms; groups: Tasks, Projects, Create (New Task / New Project / New Feature Request), Navigation (Dashboard, Projects, Tasks, Team), Actions (Settings), Fun (Celebrate). `CommandPaletteFooter` shows `KeyboardShortcut` hints. Navigation items replace the old `g x` chords.

---

## 8. Dependencies

```
dependencies:    vue@^3.5  vue-router@^4  frappe-ui@1.0.0-beta.55  vuedraggable@^4  canvas-confetti  dayjs (transitive, re-exported)
devDependencies: vite@^7  @vitejs/plugin-vue@^6  typescript  vue-tsc  tailwindcss@^3.4  postcss  autoprefixer
                 unplugin-icons unplugin-vue-components unplugin-auto-import lucide-static @iconify/json
                 vite-plugin-pwa  eslint + eslint-plugin-vue  prettier
```

Everything else from the React `package.json` goes away (tiptap packages come via frappe-ui, echarts via `frappe-ui/charts`).

---

## 9. Backend touch points (small)

- `bwh_hive/www/hive.html` is generated by `frappe-ui/vite` `buildConfig({ indexHtmlPath, outDir })`. `jinjaBootData` injects `window[key] = boot[key]` for every key in `boot`, so `www/hive.py` keeps returning `csrf_token`, `site_name`, `system_timezone` and the manual inline script in `index.html` goes away.
- No new whitelisted methods needed. Every screen maps to an existing method or doc CRUD (see §6 tables).
- `search_link` needs no change (`LinkPicker` passes `doctype`, `txt`, `filters`, `page_length`).
- W12 removes agent backend. Until then, agent fields exist in doctypes but the frontend ignores them.

---

## 10. Acceptance per stream

- Builds with `yarn build`; no TypeScript errors (`vue-tsc --noEmit`); ESLint clean.
- Zero raw color utilities (`grep -E 'text-gray-|bg-gray-|border-gray-' src` → empty; gray tokens come only via `ink-gray-*` / `surface-gray-*` / `outline-gray-*`).
- Works for team and client roles (client sees read-only).
- Desktop + mobile checked in browser (agent-browser at `pms.localhost:8000/hive`).
- Relevant `e2e/` specs green or updated in the same PR.
- PR against `develop`, one stream per PR, description: Why / What / How.

---

## 11. Suggested execution order

```
Day 1        W0 (serial)
Day 2–4      W1 W2 W3 W4 W5 W6 W7 W8 in parallel (8 agents/people, worktrees)
             merge order: W6 → W5 → W3 → rest
Day 5        W9 e2e, W10 polish, W11 delete React
Any time     W12 backend agent cleanup (independent PR)
```
