# React frontend inventory (as of 2026-08-27, `develop` @ 3f67c1c)

Reference appendix for `plans/frappe-ui-rewrite.md`. Paths relative to `frontend/src`. Agent items marked **DROP**.

## Serving
- `vite.config.ts`: React + Tailwind v4 + vite-plugin-pwa (manifest "BWH Hive", scope/start_url `/hive`, icons `images/pwa-192x192.png`/512). Port 8080, proxy `^/(app|api|assets|files|private)` → site port. `build.outDir ../bwh_hive/public/frontend`.
- `package.json build`: `vite build --base=/assets/bwh_hive/frontend/ && cp ../bwh_hive/public/frontend/index.html ../bwh_hive/www/hive.html`.
- `index.html`: `window.csrf_token`, `window.site_name` via Jinja. `bwh_hive/www/hive.py` boot: `frappe_version, site_name, read_only_mode, system_timezone, csrf_token`.
- `hooks.py`: `website_route_rules /hive/<path:app_path> → hive`; **DROP** ToDo doc_events → `orchestrator.hooks.on_todo_change`, cron `reconcile_agent_tasks`.
- `main.tsx`: FrappeProvider, ThemeProvider (`hive-ui-theme`), BrowserRouter basename `/hive`, sonner Toaster.
- `App.tsx` routes: `/` Dashboard, `/projects`, `/projects/:id`, `/tasks`, `/tasks/:id` (redirect), `/team`, `*` → `/`. Guest → `/login`. Providers: User → PinnedTasks → Celebration.

## Types (`types.ts`)
- HiveProject: title, slug, status Open|Completed|On Hold, project_type, client, description, is_private, is_archived, github_repo, links[{title,url}], members[{member,role Member|Champion|Stakeholder}]. **DROP** agent_enabled, github_pat, agent_template_slug, target_app_*, skills_repo_override, agent_*_prompt.
- HiveTask: title, project, status Someday|Backlog|To Do|In Progress|Done|Blocked, priority Low|Medium|High|Urgent, size Small|Medium|Large|"", milestone, depends_on, assigned_to (legacy), is_internal, is_archived, description, due_date, start_date, completed_on, pr_link, github_issue_url, uat_status Pending|Approved|Rejected, uat_approved_by, uat_date, recurrence_frequency Daily|Weekly|Monthly|Quarterly|Yearly, recurrence_end_date, recurring_parent. **DROP** agent_* fields, AGENT_STATUSES.
- HiveMilestone: title, project, status Upcoming|In Progress|Completed, target_date, description.
- HiveMember (name = email): user, member_name, user_image, type Team|Client, client, designation, is_active.
- HiveClient: company_name, is_active. HiveFeatureRequest: title, project, requested_by, status Open|Under Review|Approved|Rejected|Converted, priority Nice to Have|Important|Critical, description, converted_task.
- HiveProjectUpdate: project, posted_by, content, is_draft, is_archived, reactions[{user,emoji}], _seen. HiveTaskComment: task, posted_by, content, is_archived.
- HiveView: label, emoji, view_type list|kanban|calendar, filters_json, is_public, owner.
- Hive Settings (single): onboarding_completed, lock_due_date_on_or_after, github_app_id, github_app_client_id, github_app_public_link (+ agent fields **DROP**).
- Constants: TASK_STATUSES [Someday, Backlog, To Do, In Progress, Done] (+Blocked in selects), TASK_SIZE_WEIGHT {Small:1, Medium:2, Large:4}, PRIORITY_ORDER, status/priority color maps in `lib/variants.ts`.

## Shell
- `AppLayout.tsx`: sidebar + header + outlet; mounts SettingsDialog, CommandPalette, NotificationSheet, CreateProjectDialog, global CreateTaskDialog, ShortcutHelpDialog, OnboardingDialog (when `Hive Settings.onboarding_completed=0`), PinnedTasksDock, OverdueTasksDialog. Shortcuts: `Mod+K`, `?`, `Shift+T` celebrate, chords `g d/p/t/m`. Create project → `createDoc Hive Project {title,status:"Open",project_type?,client?,is_private?}` → `/projects/{name}`.
- `Header.tsx`: search button, bell with unread count `getDocCount("Notification Log", read=0, for_user=me)` refresh 30s.
- `Sidebar.tsx`: nav + Views section (Hive View: public + mine; edit dialog emoji/name/public; delete) + footer user menu (theme toggle, raise issue, logout). Settings hidden for clients.
- `UserContext`: `getDoc User`, `getDoc Hive Member` → `isClient`. `PinnedTasksContext`: `hive-pinned-tasks` max 5.
- `useShortcut.ts`: capture-phase registry, chords, `condition`, `allowInInput`; `ShortcutHelpDialog` groups them.
- `useTaskCelebration` + `useCelebrationSettings`: confetti + lottie + audio; keys `hive:celebration-animation/sound/sound-variant`.
- `use-auto-save.ts`: 3s debounced draft autosave. `LinkField.tsx`: Popover+Command over `frappe.desk.search.search_link {doctype, txt, filters, page_length}`.
- **DROP** `hooks/useAgentEvents.ts` (only socket usage: `hive_agent_update`, `hive_agent_log`), `lib/agent.ts`.

## Editor
`TiptapEditor.tsx` (+ Lazy, ResizableImage, MentionList, mentionSuggestion): StarterKit, Underline, Link, Placeholder, Table, resizable image, Mention `@`. Toolbar B/I/U/S, H1/H2, lists, quote, code, hr, link, image, table ops. `Mod+Enter` submit. Paste/drop image upload (10MB, public). Read-only lightbox. `LazyEmojiPicker` (emoji-picker-react).

## Pages
### Dashboard `/` (`?tab=my|projects|team`)
- MyWorkTab: `get_my_dashboard` → `{tasks_by_project[], my_projects[], unread_count, recent_updates[]}`. 3 stat cards, tasks grouped by project → `/projects/{p}?tab=tasks&task=`, recent updates → `?tab=updates`, projects grid.
- ProjectsTab: `getDocList Hive Project` (is_archived=0, limit 100) + `Hive Task` (limit 500) → counts.
- TeamTab: `get_team_stats {period week|month}` → `{time_series[{date,completed}], members[{user, member_name, user_image, designation, completed_tasks[], overdue_tasks[]}]}`; recharts AreaChart; member cards.

### Projects `/projects`
Search, status Select, scope Select (All/Internal/External), "My projects" toggle; localStorage `hive_projects_status_filter`, `hive_projects_scope_filter`, `hive_projects_my_only`. `get_my_project_memberships`, `getDocList Hive Project` (limit 100). Card grid → `/projects/{slug||name}`.
- CreateProjectDialog: title, visibility, type LinkField (Hive Project Type is_archived=0), client LinkField (Hive Client is_active=1) + New Client sheet (`createDoc Hive Client {company_name}`).

### Project detail `/projects/:id`
- Slug (not `PROJ-`) → `resolve_project_slug {slug}`. Params: `?tab=overview|tasks|milestones|updates|requests|activity`, `?task=`, `?create_task=1`, `?create_feature_request=1`. Shortcuts `t o m u r a` (t blocked for clients).
- Data: `getDoc Hive Project`; `getDocList Hive Task` (project, is_archived=0, due_date asc, 200; fields name,title,project,status,priority,size,milestone,depends_on,assigned_to,is_internal,description,due_date,start_date,pr_link,completed_on,uat_status,uat_approved_by,uat_date,recurrence_frequency,recurrence_end_date,creation,modified); `Hive Milestone` (50); `Hive Project Type`; `Hive Client`; my draft updates count; `get_task_assignees {project}` → `{task: [{member, member_name, user_image}]}`; `github.status` → `{app_configured, connected}`; `github.get_repos` → `[{full_name, private}]`.
- Writes: `updateDoc Hive Task {status}` optimistic + celebrate; `createDoc Hive Task` then `frappe.desk.form.assign_to.add {doctype, name, assign_to[]}` (separate try/catch); `updateDoc Hive Project` {links|status|project_type|client|github_repo|title|is_archived:1}.
- Header: inline title edit, status/type/client pills, GitHub link-repo popover, links chips + ManageLinksDialog, delete (typed title → archive, Undo toast 6s), "Add Task" (T). Tabs w/ counts. Tasks tab: milestone filter + TaskKanban (Done column = completed_on within 7 days).
- OverviewTab: 4 stat cards, active milestones (weighted progress), Team card via `get_project_dashboard {project}` → `{members[{member,member_name,role}]}`; add/remove/role → `updateDoc Hive Project {members}`.
- ActivityTab: `get_project_activity {project, limit:100}` → `[{type, doctype, docname, label, field, old_value, new_value, user, user_name, user_image, datetime}]`, grouped by day.
- MilestoneSection: `getDocList Hive Milestone`; create/update `{title,target_date,description|status}`; cards with progress + task list; MilestoneDialog (`Mod+Enter`).
- FeatureRequestSection: `getDocList Hive Feature Request` (100); table; row actions via `run_doc_method {dt:"Hive Feature Request", dn, method:"review", args:{action: under_review|approve|reject}}` and `method:"convert_to_task"`; create dialog (title, priority, Tiptap).
- UpdatesSection: composer w/ 3s autosave (`createDoc … is_draft:1` then `updateDoc`), Save Draft, Post (`publish_update {update_name}` or `createDoc is_draft:0`); lists published (100) + my drafts (20); `mark_updates_seen {project}` once; reactions 👍❤️🎉🚀👀🙏 via `run_doc_method {dt:"Hive Project Update", method:"toggle_reaction", args:{emoji}}`; DraftCard edit/delete-undo/publish.
- **DROP** AgentSettingsTab, "agent" tab, `useAgentProjectEvents`.

### Tasks `/tasks`
- Params: `?q= ?status= ?priority= ?project= ?assignee= ?view=kanban|calendar ?view_id=`.
- Data: `getDocList Hive Task` (is_archived=0, due asc, 500), `Hive Project [name,title]`, `Hive Milestone [name,title]`, `get_task_assignees {}`, `getDoc Hive View`.
- Writes: create task + assign_to; status optimistic + celebrate; `createDoc Hive View {label,emoji,view_type,filters_json,is_public}`; `updateDoc Hive View {filters_json,view_type}`.
- UI: breadcrumb (view emoji+label), list/kanban/calendar toggle, ⋯ Save View / Save Changes / Save as New, Add Task, search, status/priority selects, project/assignee LinkFields, filter-count badge. List: TanStack, sortable Task/Project/Status/Priority/Size/Milestone/Start/Due/Assignees, 20/page; row → `/projects/{p}?tab=tasks&task=`. Kanban/calendar open TaskDetailSheet in place. SaveViewDialog: emoji, name, public, filter summary.
- TaskKanban: dnd-kit, 5 columns, pinned first, card: title, pin, priority/size badges, PR badge, UAT badge (project has client & not Pending), recurrence, depends-on (amber if dep not Done), due (overdue red), assignee avatars.
- TaskCalendar: Month/Week/Day, by due_date, month max 3 chips + "+N", undated tray.
- CreateTaskDialog: desktop 2-col (project select when global [`Hive Project` status=Open], priority, status, milestone LinkField {project}, assignees popover of `Hive Member` is_active=1, start/due, recurrence + until, internal checkbox | title + Tiptap). Draft `hive-create-task-draft`. Emits `{title, description, priority, status, due_date, start_date, is_internal, milestone, _assign_users[], project, recurrence_frequency, recurrence_end_date}`.
- TaskDetailSheet: `getDoc Hive Task`, `getDoc Hive Project`, `github.status`, `getDoc Hive Settings` (lock_due_date_on_or_after), `getDocList Hive Member`. Fields: title, status/priority/size, milestone + depends_on LinkFields, assignees (`assign_to.add/remove`), start/due/completed_on, recurrence, PR link, GitHub issue (`github.create_issue {task_name}` → `issue_url`), description Tiptap, attachments, UAT (`run_doc_method approve_uat|reject_uat`), comments. Autosave 1.5s → `updateDoc` of {title,description,status,priority,size,milestone,depends_on,pr_link,due_date,start_date,completed_on,recurrence_*}. Done → completed_on today + celebrate. Delete → archive + Undo. Shortcuts `Mod+Enter`, `a`, `p`. **DROP** AgentPanel, `useAgentTaskEvents`, `agent_enabled`.
- TaskCommentsSection: `getDocList Hive Task Comment` (task, is_archived=0, asc, 100); `createDoc {task,content}`; delete own → `is_archived:1` + Undo. **DROP** `useAgentTaskEvents`.
- TaskAttachments: `getDocList File` (attached_to Hive Task, 50); drag-drop/input (10MB) → confirm w/ private checkbox → `upload(file,{isPrivate,doctype:"Hive Task",docname})`; delete → `deleteDoc File`.
- TaskRedirectPage `/tasks/:id`: `getDoc Hive Task` → `/projects/{project}?tab=tasks&task=` (replace); error → `/tasks`.

### Team `/team`
`get_team_dashboard` → `[{user, member_name, user_image, designation, wip_count, backlog_count, blocked_count, trend, completed_7d, created_7d}]`; `get_stale_members` → user[]; search; expand → `get_member_tasks {user}` → `{wip[], backlog[], blocked[]}`; by-status/by-project toggle.

## Global overlays
- CommandPalette (cmdk): `search {query, project?, limit:8}` → `{projects[], tasks[]}`; groups Tasks/Projects/Create/Navigation/Actions/Fun; project context from URL.
- NotificationSheet: `getDocList Notification Log` (for_user=me, 50) + `User` names; `notification_log.mark_all_as_read`, `mark_as_read {docname}`; click → `/tasks/{name}` or `/projects/{name}?tab=updates`.
- OnboardingDialog: steps invite (`invite_member {email, role:"Hive Team"}`, pending via `frappe.core.api.user_invitation.get_pending_invitations {app_name:"bwh_hive"}`), clients (Hive Client CRUD), project types (Hive Project Type CRUD, archive+Undo) → `updateDoc Hive Settings {onboarding_completed:1}`.
- OverdueTasksDialog: `get_my_overdue_tasks` → `[{name,title,project,project_title,project_slug,status,priority,due_date}]`; once/day `hive-overdue-dialog-last-shown`.
- PinnedTasksDock: fixed bottom-right cards w/ description edit + comments (**dropped in rewrite**).
- SettingsDialog: Profile (`getDoc User/Hive Member`; photo `upload(file,{doctype:"User",docname,fieldname:"user_image"})` + `frappe.client.set_value`; names, designation), General (project types CRUD, celebration settings, due-date lock → `updateDoc Hive Settings`), Members (`Hive Member` list; `invite_member`/`invite_client_member {email, client}`; pending + `cancel_invitation {name, app_name}`; type filter), Clients (list/add; drill-in: members of client, invite, assign `updateDoc Hive Member {type:"Client", client}`, remove `{client:""}`), GitHub (`getDoc Hive Settings`; `github.status` → `{app_configured, connected, installed_account}`; manifest via `POST /api/v2/document/Hive Settings/Hive Settings/method/get_github_app_manifest/` → form post to github; install link). **DROP** AgentSection, agent-fields.

## API surface (non-agent)
`bwh_hive.bwh_hive.api.*`: get_my_dashboard, get_team_stats, get_team_dashboard, get_stale_members, get_member_tasks, get_my_project_memberships, get_my_overdue_tasks, get_task_assignees, get_project_dashboard, get_project_activity, resolve_project_slug, search, publish_update, mark_updates_seen, invite_member, invite_client_member.
`bwh_hive.bwh_hive.github.*`: status, get_repos, create_issue; `Hive Settings.get_github_app_manifest`.
Frappe core: search_link, assign_to.add/remove, frappe.client.set_value, run_doc_method (approve_uat, reject_uat, review, convert_to_task, toggle_reaction), notification_log.mark_as_read/mark_all_as_read, user_invitation.get_pending_invitations/cancel_invitation, upload_file.
**DROP**: `api.agent_*`, `api.resolved_prompts`, `agent_api.py`, `orchestrator/`.

## localStorage
`hive-ui-theme`, `hive-pinned-tasks`, `hive-create-task-draft`, `hive-overdue-dialog-last-shown`, `hive_projects_status_filter`, `hive_projects_scope_filter`, `hive_projects_my_only`, `hive:celebration-*` (3); sessionStorage `chunk_retry_reloaded`.

## Shortcuts
Global `Mod+K`, `?`, `Shift+T`, chords `g d/p/t/m`. Project `t o m u r a`. Task sheet `Mod+Enter`, `a`, `p`. Editors `Mod+Enter`.

## Conventions
Soft-delete via `is_archived=1` + Undo toast (6s) everywhere. `isClient` → read-only. Optimistic status on kanban. Mobile: Dialog→Drawer, Tabs→Select. Skeletons + empty states on every list. Project URLs prefer slug.
