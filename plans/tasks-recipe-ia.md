# Hive frontend — adopt the frappe-ui Tasks recipe IA

Status: IN PROGRESS. Runs on top of the [frappe-ui rewrite](frappe-ui-rewrite.md).
Reshapes the information hierarchy of the Vue app to match the frappe-ui **Tasks
recipe**, which is the reference for a task app built on frappe-ui.

Reference: `TasksDesktop.vue` and `TasksMobile.vue` in
`docs/components/recipes/` of the `frappe/frappe-ui` clone at
`/Users/mdhussain/Frappe/frappe-ui`, live at <https://ui.frappe.io/recipes>.
Read the recipe before changing anything. When the recipe and this plan
disagree, the recipe wins for visuals and this plan wins for scope.

This phase changes layout and navigation only. No new backend calls, no new
doctypes, no change to routes or query params.

---

## 1. What the recipe does

- The **sidebar carries the navigation**. Its nav block is three items — Inbox
  (with an unread count), My tasks, Search — followed by a `SidebarLabel`
  "Projects" section that lists every project as a `SidebarItem` with a leading
  icon and a trailing `Badge` of the open count.
- **Workspace actions live in the `SidebarHeader` dropdown**, via its
  `menu-items` prop. There is no separate settings row in the nav.
- The **page header is thin**: `Breadcrumbs` on the left, one primary action on
  the right. Nothing else.
- The **filter bar sits below the header**, in the page body: scope
  `TabButtons`, then stackable `Select`s with `variant="ghost"`, a Clear button,
  and — pushed right — the row count, a Group dropdown, and a Sort dropdown.
- The **list is grouped and collapsible**. Each group is a full-width button
  header (`bg-surface-sidebar`, name + count, hover reveals Collapse/Expand),
  with a `List` of rows underneath.
- **Attributes read as icons, not badges.** Status is a lucide circle glyph that
  opens a `Dropdown` to change it. Priority is a `lucide-signal-{high,medium,low}`
  bar glyph, tinted red / amber / gray. Labels are gray outline badges with a
  small colored dot.
- The **detail screen** keeps the same thin header and moves every attribute to
  a right-hand meta panel: a `grid-cols-[5rem_minmax(0,1fr)]` of label / control
  pairs.

## 2. Mapping onto Hive

| Recipe | Hive |
|---|---|
| Inbox | **Dashboard** (`/`) — same first slot, same unread count in the suffix |
| My tasks | **Tasks** (`/tasks`) |
| Search | opens the existing command palette (`Mod+K`) |
| Projects section | every non-archived project the user can see, linking to `/projects/:id` |
| `SidebarHeader` menu | Settings, Raise an issue |
| Workspace name | "Hive" + the existing logo |

The Team page (`/team`) has no recipe equivalent. It stays in the nav block,
after Tasks.

## 3. Streams

Three streams, disjoint file sets, all branched off `feat/frappe-ui-w0-scaffold`.

| Stream | Owns |
|---|---|
| **R1 Shell IA** | `components/shell/*` (`AppSidebar`, `AppHeader`, `MobileShellNav`, new `SidebarProjects.vue`) |
| **R2 Grouped list** | `components/tasks/TaskTable.vue`, `components/tasks/TaskFilters.vue`, `pages/TasksPage.vue`, `lib/status.ts`, `components/common/PriorityBadge.vue` |
| **R3 Project top bar** | `components/projects/ProjectHeader.vue`, `pages/ProjectDetailPage.vue` |

Nobody else touches `lib/status.ts`, `AppHeader.vue`, or `AppSidebar.vue`.
Nobody touches `e2e/` — the suite gets one pass after the three streams merge.

### R1 — Shell IA

- Sidebar nav block: Dashboard (unread-count suffix, same source as the header
  bell), Tasks, Team, Search. Search opens the command palette; it keeps its
  `Mod+K` binding and drops out of the page header.
- New `SidebarProjects.vue`: a `SidebarLabel` "Projects" row with a ghost
  `lucide-plus` "New project" button (team only, opens `CreateProjectDialog`
  through `useOverlays`), then a `SidebarItem` per project with a trailing
  open-task-count `Badge`. Active state follows `/projects/:id`. It sits above
  the existing `SidebarViews` and `SidebarPinned` sections.
- Settings moves out of the nav and into the `SidebarHeader` `menu-items`
  dropdown, alongside "Raise an issue". Settings stays hidden for clients. The
  footer avatar dropdown keeps Log out.
- `AppHeader` loses both Search buttons. The bell stays.
- Mobile keeps `MobileShellNav`; add Search there only if it already had it.

### R2 — Grouped list

- `TaskTable.vue` becomes the recipe's grouped list: collapsible group headers
  over a `List` per group, replacing the single sorted table and its
  Prev/Next footer. Group headers are collapsed by default for
  `Done` and any terminal status, expanded otherwise.
- Group by: Status (default), Priority, Assignee, Project, Milestone. Sort
  within a group keeps the existing sort keys.
- Columns follow the recipe's track list — status glyph, title, tags, due,
  priority, assignees — not the current nine-column table. Project becomes a
  gray outline badge in the tags cell and is hidden when the list is already
  scoped to one project.
- Status glyph is a `Dropdown` that sets the status inline; the click must not
  open the task (`@click.stop`).
- Priority renders as the recipe's signal glyph. Put the glyph and color maps in
  `lib/status.ts` next to the existing helpers.
- The toolbar in `TasksPage.vue` / `TaskFilters.vue` moves to the recipe shape:
  ghost `Select`s with `#item-prefix` glyphs, a Clear button when any filter is
  set, then right-aligned count + Group + Sort dropdowns.
- Keep every existing query param, saved-view field and `data-testid`.

### R3 — Project top bar

- `ProjectHeader` header row becomes `Breadcrumbs` (`Projects` → project title)
  plus the primary "Add Task" and the `…` dropdown. The back button goes: the
  Projects crumb replaces it. Inline rename stays.
- The meta row shrinks to one quiet line: status, type and client as ghost
  dropdowns with `Badge` triggers, as today. GitHub repo and links move into the
  `…` dropdown or a small "Details" popover — they are not first-class chrome.
- Drop one of the two stacked bottom borders so the header reads as one block.
- Clients still see a read-only header.

## 4. Acceptance

- `yarn build` clean, `yarn typecheck` clean, `yarn lint` clean.
- No raw gray utilities: `grep -E 'text-gray-|bg-gray-|border-gray-' src` empty.
- Works for team and client roles.
- Desktop and mobile checked at `pms.localhost:8000/hive`.
- `data-testid` attributes preserved unless the element is gone.
