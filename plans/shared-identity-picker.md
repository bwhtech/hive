# Hive frontend — one identity picker for projects and views

Status: SPEC. Runs after the DiceBear work on `feat/project-dicebear` merges.

A project already has a visual identity: a lucide icon on a tinted square,
picked with `ProjectIconPicker`, and — once the DiceBear branch lands — a
generated avatar as a second option. A saved view still has an **emoji**,
picked with a separate `EmojiPicker`. Two mechanisms for the same job.

This phase deletes the emoji path and gives a view the same identity as a
project, from the same component.

---

## 1. Why emoji goes

- It is a second, unrelated picker for a thing the app already solved.
- An emoji renders at the inherited font size and overflows its row —
  `SidebarViews.vue` already carries a comment working around exactly that.
- Emoji render differently per platform, so a view a team agrees on does not
  look the same to all of them. An icon name plus a token colour does.

## 2. What a view gets

The same three-way identity a project has after the DiceBear branch:

- a lucide **icon** plus a palette **colour**, or
- a generated **DiceBear avatar**, or
- nothing set, falling back to the same stable default a project uses.

Same component, same storage shape, same defaults. A reader should not be able
to tell from the mark whether they are looking at a project or a view.

## 3. Backend

`Hive View` currently has `label`, `emoji`, `view_type`, `filters_json`,
`is_public`.

- Add the identity fields, named and typed **exactly** as they are on
  `Hive Project` after the DiceBear branch — read that doctype and copy, do not
  invent a parallel naming scheme.
- Keep `emoji` as a column for now but stop reading and writing it. Dropping it
  is a follow-up patch once no deployment carries data anyone wants back.
  Say so in the patch docstring.
- Bump the doctype's `modified` timestamp, or Frappe skips re-syncing on
  migrate.
- `useHiveViews.ts` selects an explicit field list including `'emoji'`. Swap it
  for the new fields.

## 4. Frontend

The picker must be **one component used by both**, not a copy. Today it is
`ProjectIconPicker.vue` — project-specific in name only; its props are already
flat (`icon`, `color`, and whatever DiceBear adds), not a project object.

- Rename it to something that does not say "project" — it is about to serve two
  doctypes — and update every call site. `ProjectAvatar.vue` renders the result
  and should follow the same treatment.
- `SaveViewDialog.vue` and `ViewEditDialog.vue` swap `EmojiPicker` for it.
- `SidebarViews.vue` renders the mark where the emoji was, and the workaround
  comment about font-size overflow goes with it.
- Delete `components/common/EmojiPicker.vue` once nothing imports it. Check
  first — `grep -rn EmojiPicker frontend/src` — the command palette or the
  celebration path may use it.
- `types.ts`: `emoji` appears on two interfaces (lines ~162 and ~191). Both
  change.

## 5. Acceptance

- `yarn typecheck`, `yarn lint`, `yarn build` clean; `ruff check` on any Python.
- `grep -rn "emoji" frontend/src` returns nothing.
- Colour only through tokens; `grep -E 'text-gray-|bg-gray-|border-gray-' src`
  stays empty.
- A view created before this change still renders — its identity fields are
  empty and must fall back, not break.
- The picker file exists once. No second copy for views.
