# Hive frontend — adopt `@framework/ui` (phase 3)

Status: NOT STARTED. Runs after [W11 and W12](frappe-ui-rewrite.md) of the frappe-ui
rewrite. This phase replaces four hand-built Hive components with shared components from
the `ui` package in the frappe framework repo.

Sources for this plan: `apps/frappe/ui` at commit `c824bfcc0b` (pulled 2026-08-28),
`apps/crm` at `98ea2a0c`, and the current Hive frontend at `0ff65e9`.

---

## 1. What the package is

`@framework/ui` lives at `apps/frappe/ui`. It is an extension of `frappe-ui` for
components that need the Frappe backend. It is never published to npm. A consuming app
links it by relative path and compiles its raw `.vue` and `.ts` source with its own
bundler.

The package declares `vue`, `vue-router`, `frappe-ui` and `@vueuse/core` as peer
dependencies. The host app supplies all four.

The framework repo is the release train for this package. The package has no version
number, so the framework commit is the pin. Hive tracks the framework `develop` branch,
which the team already decided to stay current with.

## 2. Goals and non-goals

Goals

- Delete Hive code that duplicates a shared component.
- Gain the behavior our versions lack: realtime notifications, pagination, and a
  richer activity feed.
- Keep every current feature, route, and permission rule.

Non-goals

- No change to the Hive backend data model. `Hive Task Comment` and
  `get_project_activity` stay as they are.
- No adoption of `ListView`, `Filter`, `SortBy`, `QuickFilter` or `ColumnSettings` in
  this phase. See §7.
- No move of Hive comments to Frappe's standard `Comment` doctype.

## 3. Compatibility, already checked

| Item | Result |
|---|---|
| Peer range | The package needs `frappe-ui >= 1.0.0-beta.16`. Hive pins `1.0.0-beta.55`. |
| Imported symbols | The package imports 43 names from `frappe-ui`. All 43 exist in beta.55, including the legacy `createListResource`, `getCachedResource` and `DateRangePicker`. |
| `@vueuse/core` | Four files in the package import it. Hive gets version 14.4.0 through `frappe-ui`. Declare it in `frontend/package.json` so the dependency is explicit. |
| Icons | The package imports `~icons/lucide/*`. The `frappe-ui/vite` plugin already resolves these, because Hive sets `lucideIcons: true`. |
| Notification Log | This framework version has `title`, `description`, `app`, `link`, `source_doctype` and `source_name`. The `app` field is set at insert from the reference doctype, so Hive rows resolve to `bwh_hive`. |
| Data layer | `useNotifications` uses the v0 resources (`createListResource`). Hive uses the v1 composables (`useList`, `useCall`). Both ship in beta.55 and can run side by side. |

## 4. Streams

| Stream | Work | Blocks |
|---|---|---|
| **F0 Wiring** | Link the package, add the Vite plugin, tsconfig paths, Tailwind content globs, socket client. | Everything |
| **F1 Notifications** | Replace `NotificationsSheet.vue` with `NotificationPanel` + `useNotifications`. | — |
| **F2 Project activity** | Render the project Activity tab with `ActivityTimeline`. | — |
| **F3 Task comments** | Render task comments with `ActivityTimeline` and `CommentComposer`. | F2 |
| **F4 Attachments** | Replace `TaskAttachments.vue` with the package `FileUpload` parts. Optional, decide after F3. | F3 |

F1, F2 and F3 are one PR each against `develop`.

## 5. F0 — Wiring

The package documents three edits. Hive needs two more.

1. Add the dependency in `frontend/package.json`.

```jsonc
"dependencies": {
  "@framework/ui": "link:../../frappe/ui",
  "@vueuse/core": "^14.4.0"
}
```

2. Add the paths in `frontend/tsconfig.json`, next to the existing `@/*` entry.
   `moduleResolution: node` does not read the package `exports` map.

```jsonc
"@framework/ui": ["../../frappe/ui/src/index.ts"],
"@framework/ui/*": ["../../frappe/ui/src/*"]
```

3. Add the bundled plugin in `frontend/vite.config.ts`, after `frappeui()`.

```ts
import frameworkUI from '@framework/ui/vite'
// plugins: [frappeui({...}), frameworkUI(), vue(), VitePWA({...})]
```

The plugin dedupes `vue`, `vue-router`, `frappe-ui`, `reka-ui` and `dompurify`, and
resolves the package's own dependencies against the Hive `node_modules`.

4. Add the linked source to the Tailwind `content` globs in
   `frontend/tailwind.config.js`. Without this the package renders unstyled.

5. Add a socket client. The package reads the `notification` realtime event that the
   framework publishes per user. Hive has no socket today. Use the `socketio` helper
   from `frappe-ui`, and export a single `socket` from `src/socket.ts`.

Run `yarn install`, then restart the dev server so the new symlink enters the Vite
module graph.

Acceptance for F0: `yarn build` passes, `vue-tsc --noEmit` passes, and a throwaway
import of `Link` from `@framework/ui` renders with correct styles.

## 6. Per-stream detail

### F1 — Notifications

Today `components/global/NotificationsSheet.vue` (192 lines) does the work by hand. It
reads 8 columns of `Notification Log` with `useList`, fetches sender names and photos
with a second `useList`, and has no pagination. `AppHeader.vue` polls
`frappe.client.get_count` every 30 seconds for the bell badge.

Target: the panel renders the body, the host owns the container and the routing.

```vue
<script setup lang="ts">
import { NotificationPanel, useNotifications } from '@framework/ui'
import { socket } from '@/socket'

const controller = useNotifications({ appName: 'bwh_hive', socket })
</script>

<template>
  <Dialog v-model:open="open" size="md" position="top" bare>
    <NotificationPanel
      v-bind="controller"
      @mark-as-read="onRead"
      @mark-all-as-read="controller.markAllAsRead"
      @load-more="controller.loadMore"
      @close="open = false"
    />
  </Dialog>
</template>
```

Notes for the implementer.

- The panel emits `mark-as-read` on a row click. Keep the current routing rules from
  `openNotification`, which send `Hive Task` rows to `/tasks/:name` and `Hive Project`
  rows to the project Updates tab.
- Read the bell badge from `controller.unreadCount` and delete the 30 second poll in
  `AppHeader.vue`. The socket keeps the count fresh.
- Rows written before this framework version have an empty `app` column. Either drop
  `appName` from the options, or add a patch that backfills `app = 'bwh_hive'` for rows
  whose `document_type` starts with `Hive `. Decide with one query on the live site.
- The panel takes an optional `tabs` array. Start without tabs.

Deletes `NotificationsSheet.vue`. Keeps `useOverlays().notificationsOpen`.

### F2 — Project activity

`ActivityTimeline` is presentational. The `activities` prop takes rows in display order.
Each row is a discriminated union on `type`, one of `email`, `comment`,
`attachment_log`, `log` and `version`. Any other `type` renders through the
`#item-{type}` slot.

The matching `useActivityTimeline` composable is **not usable here**. It reads Frappe's
docinfo for one document. Hive activity comes from
`bwh_hive.bwh_hive.api.get_project_activity`, which aggregates a project, its tasks and
its milestones. So Hive keeps its own call and maps the rows.

Map each `ActivityEntry` from `get_project_activity` as follows.

| Source row | Target |
|---|---|
| `type` ends with `_created` | `log` activity, `data.subtype = 'created'`, `data.text` from the current `describe()` wording |
| `old_value` and `new_value` both set | `version` activity, `data.type = 'diff'`, `prefix` from `FIELD_LABELS`, `from` and `to` from the values |
| a field change with no old value | `version` activity, `data.type = 'diff'`, `from` omitted |
| anything else | `version` activity, `data.type = 'phrase'`, `text` from `describe()` |

Every row carries `key`, `timestamp` from `entry.datetime`, and `author` built from
`user`, `user_name` and `user_image`.

Keep `FIELD_LABELS` and `DOC_LABELS`. They hold the Hive vocabulary the timeline cannot
know. Drop the hand-built day grouping, the collapse state and the badge layout.
`ActivityTimeline` owns that layout.

Deletes most of `components/projects/ActivityTab.vue` (167 lines). The file stays as the
mapper plus the component.

### F3 — Task comments

`components/tasks/TaskComments.vue` (149 lines) lists `Hive Task Comment` rows with
`useList`, and posts through `comments.insert`.

Two parts.

1. Render the list with `ActivityTimeline` and `comment` activities. Map
   `posted_by` to `author`, `content` to `data.content`, and `name` to `data.name`.
   Keep the delete rule: only the author deletes, and only when the panel is editable.
2. Replace the composer with `CommentComposer`. It takes a `mentions` array of
   `MentionOption`, and emits `submit` with the payload. The host performs the write, so
   `comments.insert.submit` stays. Keep `useArchiveWithUndo` for delete.

Keep the backend as it is. `Hive Task Comment` stays the store, and the `@mention`
notification path in `hive_task_comment.py` stays untouched.

### F4 — Attachments, optional

`components/tasks/TaskAttachments.vue` is 283 lines over the standard `File` doctype.
The package `FileUpload` module has `AttachmentsList`, `UploadTray`, `FileUploadDialog`
and `ImageCropper`, and gained an attachment grid, type icons and a `maxAttachments`
limit in this pull. Decide after F3, once the team has read the package in practice.

## 7. Deferred, with reasons

- `ListView`, `Filter`, `SortBy`, `QuickFilter`, `ColumnSettings`. These are
  meta-driven controls over a doctype. Hive tasks are a filtered join across projects,
  milestones and assignees, with saved views persisted in `Hive View`. The port is a
  rewrite of `TaskTable.vue`, `TaskFilters.vue` and the saved-view flow. Take it as its
  own phase, not as a rider on this one.
- `FormLayout` and `Fields`. Hive builds forms by hand from typed props. There is no
  meta-driven form in the app.
- `Grid`, `DataImport`, `Onboarding`, `SignupBanner`, `TrialBanner`, `Phone`. No Hive
  screen needs them.
- `InviteUser`, `Link`, `TableMultiSelect`. These overlap components Hive already has.
  Revisit only if the Hive version breaks.

## 8. Risks

| Risk | Response |
|---|---|
| No app in this bench imports the package yet. CRM links it but imports it in zero files. Hive is the first real consumer. | Start with F1, which is small and reversible. Report bugs upstream against `apps/frappe`. |
| A framework pull can change the package under us with no version bump. | Note the framework commit in each PR description. Run the e2e suite after every framework pull. |
| `useNotifications` uses the v0 resources. | Accept it. The mixing is contained in one component. Do not spread v0 resources into Hive code. |
| The package cannot be type-checked on its own. | Type errors appear in the Hive build. Run `vue-tsc --noEmit` in every stream. |
| Notification rows written before this framework version have an empty `app`. | Query the site first. Backfill with a patch, or drop the `appName` scope. |

## 9. Acceptance per stream

- `yarn build` passes and `vue-tsc --noEmit` reports no errors.
- `yarn lint` passes, including the Prettier check.
- The stream works for both the team role and the client role.
- Desktop and mobile checked in the browser at `pms.localhost:8000/hive`.
- New e2e specs, because none of the three areas has coverage today:
  `notifications.spec.ts` for F1, `project-activity.spec.ts` for F2, and
  `task-comments.spec.ts` for F3. Use the helpers in `e2e/helpers/ui.ts`.
- The full e2e suite stays green.
- One PR per stream against `develop`, with a Why / What / How description.

## 10. Order

```
F0  wiring                       (serial, blocks the rest)
F1  notifications                (smallest, proves the setup)
F2  project activity
F3  task comments                (after F2, shares the activity mapping)
F4  attachments                  (optional, decide after F3)
```
