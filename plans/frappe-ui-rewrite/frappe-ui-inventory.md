# frappe-ui inventory (repo @ `c2fce39`, 1.0.0-beta.55, 2026-08-27)

Reference appendix for `plans/frappe-ui-rewrite.md`. Paths relative to the frappe-ui repo.

## Versions
- npm dist-tags: `latest: 0.1.278`, `beta: 1.0.0-beta.55`.
- Node >=20.19, peer `vue >=3.5`, `vue-router ^4.1.6`. Built on reka-ui 2, tiptap 3.26, echarts 6, vue-sonner 2, @vueuse/core 14, dayjs, floating-ui, tippy.

## `exports` subpaths
| Subpath | Entry |
|---|---|
| `frappe-ui` | `src/index.ts` |
| `frappe-ui/experimental` | `experimental.ts` (unstable, parked + incubating) |
| `frappe-ui/editor` | `src/molecules/editor/index.ts` |
| `frappe-ui/list` | `src/molecules/list/index.ts` |
| `frappe-ui/charts` | `src/charts/index.ts` |
| `frappe-ui/icons` | `icons/index.ts` |
| `frappe-ui/tailwind` | preset + `content` globs |
| `frappe-ui/vite`, `frappe-ui/vite/lucideIconsPlugin` | vite plugins |
| `frappe-ui/style.css` | |

No `frappe-ui/kanban`, no Kanban component. No CLI scaffold (`bin` = two codemods: `tokens-v2`, `shortcuts-v1`). Ships unbuilt source.

## Root components
Alert, Avatar (no AvatarGroup), Badge (theme gray|blue|green|amber|red|violet; variant solid|subtle|outline|ghost), BottomSheet, Breadcrumbs, Button (theme gray|blue|green|red; variant solid|subtle|outline|ghost; icon/iconLeft/iconRight, tooltip, loading, route, link), Checkbox, Radio/RadioGroup, Switch, Slider, Rating, Password, Textarea, TextInput, Duration, TimePicker, Combobox (single searchable; groups; custom rows; `v-model` + `v-model:query`), MultiSelect, Select, ContextMenu, DatePicker/DateRangePicker/DateTimePicker/CalendarPanel, DesktopShell, MobileShell, MobileNav/MobileNavItem, Rail/RailItem/RailItemBadge, Sidebar family (SidebarHeader, SidebarSection, SidebarItem{label,accessKey,icon,suffix,to,active,onClick}, SidebarLabel, SidebarCard, SidebarCollapseToggle), PageHeader/PageHeaderMobile/PageHeaderBackButton/PageHeaderTitle/PageHeaderTarget, Dialog (`v-model:open`, title, message, icon, size, position, actions[], dismissible, bare), Divider, Dropdown (`options: MenuOptions` groups/submenus/switch items), ErrorMessage, FormLabel, FileUploader (uploads to `upload_file`; props fileTypes, private, folder, doctype, docname, fieldname, validateFile; scoped slot progress), FormControl (`type` switch; label/description/error/required), FrappeUIProvider, HoverCard, Icon, ItemListRow (legacy), KeyboardShortcut, KeyboardShortcutsDialog, LoadingIndicator, LoadingText, Spinner, Skeleton, Progress, Popover, ScrollArea, SettingsDialog family (SettingsSidebar, SettingsNavGroup, SettingsNavItem, SettingsPanel, SettingsHeader, SettingsBody, SettingsRow, SettingsContent; `shortcut` registers Mod+,), TabButtons, Tabs/TabList/TabTrigger/TabPanel (variant underline|subtle|ghost|browser-tab; `route` on triggers), ThemeSwitcher (deprecated), Toast (`toast.*`, vue-sonner), Tooltip/TooltipProvider, Tree.

Removed (not in beta): Autocomplete, Input, MonthPicker, CircularProgressBar, FeatherIcon, NestedPopover, Card, ListItem, `<Toast>`, ListFilter, GridLayout, root CommandPalette.

## `frappe-ui/experimental`
Accordion, Calendar (Day|Week|Month, `events[]`, `config`, click/dblClick/create/update — parked), Charts v1 (AxisChart, DonutChart, FunnelChart, NumberChart — parked), CodeEditor, CommandPalette family (CommandPalette, CommandPaletteInput, CommandPaletteList, CommandPaletteGroup, CommandPaletteItem, CommandPaletteEmpty, CommandPaletteFooter; no auto Mod+K), FloatingWindow, ListView family (parked), MultiEmailInput, SpriteIcons, TextEditor v0 (parked), InputLabel/InputDescription/InputError.

## `frappe-ui/list`
`List, ListRow, ListCell, ListHeader, ListHeaderCell, ListHeaderCellSort, ListRows (virtual), ListGroup, useVirtualRows`. `ListProps{columns:string[], divider inset|full|none, selectable, rowHeight}`, `ListRowProps{to, value, onClick}`. Sort state/comparators are app code.

## `frappe-ui/charts`
`AreaChart, BarChart, LineChart, DonutChart, FunnelChart, HeatmapChart, SankeyChart, ScatterChart, NumberCard`, chrome `ChartCard, ChartContainer, ChartLegend, ChartTooltip`, `useChart, registerChartModules, useChartTokens, paletteColors`.
- Axis charts: `data, x, y (string|string[]), series, seriesConfig, xAxis{title,type,timeGrain,format}, yAxis{min,max,format}, palette, stacked, referenceLines, echartOptions`.
- `NumberCard{title, value, prefix, suffix, delta, deltaSuffix, negativeIsBetter, precision, compact, sparkline, card}`.

## `frappe-ui/editor`
Renderless `<Editor v-model :extensions format="html|json|markdown" placeholder editable autofocus uploadFunction>` slot `{editor,isEmpty}`; blocks `EditorContent, EditorFixedMenu, EditorBubbleMenu, EditorFloatingMenu, EditorTableMenu, EditorDropZone`; `useEditor`. Kits: `InlineKit`, `CommentKit` (marks, lists, link, image, imageGroup, imageViewer, video, attachment, emoji, mention `{items, component}`, tag `#`), `RichTextKit` (+ table, taskList, iframe, toc, slashCommands, color, highlight, code blocks lowlight). Toolbar presets `minimalToolbar, commentToolbar, articleToolbar, tableToolbar`. No Comment/Activity/Attachment-list components.

## Data layer (`src/data-fetching/`)
- `useCall<TResponse,TParams>({url, method, params|()=>params, cacheKey, immediate, refetch, transform, onSuccess, onError, initialData})` → `{data, error, loading, isFinished, execute/reload(), submit(params?), reset(), abort()}`.
- `useList<T>({doctype, fields, filters (reactive), orderBy, start, limit, groupBy, cacheKey, immediate, transform})` → `{data, error, loading, hasNextPage, next(), previous(), updateRow, removeRow, insert.submit(), setValue.submit({name,...}), delete.submit({name}), reload()}`.
- `useDoc<TDoc,TMethods>({doctype, name, methods:{key:'method_name'}, immediate})` → `{doc, error, loading, reload(), setValue.submit({...}), delete.submit(), <method>.submit()}` (uses `/api/v2/document/...`).
- `useNewDoc(doctype, initialValues)` → `{doc, submit()}`. `useDoctype(doctype)` → `{insert, delete, runDocMethod}`.
- Legacy `createResource*` still exported; don't use.

## Misc
- `useColorScheme()` → `{colorScheme, setColorScheme, toggleColorScheme}`; writes `<html data-theme="dark">` + `localStorage.theme`; preset `darkMode: ['selector','[data-theme="dark"]']`.
- `useKeyboardShortcut({combo, description, handler, ...})`; combo grammar `Mod+Ctrl+Alt+Shift+Key` — **no sequences/chords**.
- `dialog.confirm / danger / prompt({fields, validate, onConfirm(ctx{values,close,setError})})`, `toast.success/error/warning/info(msg, {action, duration})`.
- `usePageMeta`, `usePortalTarget`, `vFocus`, `vOnOutsideClick`, `dayjs`, `debounce`, `upload()` / `useFileUpload`.
- Vite plugin `frappeui({frontendRoute, frappeProxy, lucideIcons, jinjaBootData, buildConfig:{indexHtmlPath,outDir,sourcemap}, siteBanner, barrelImports, frappeTypes})`. `jinjaBootData` injects `window[key] = boot[key]` for every key in `boot`. Repo itself uses vite ^7.3 + plugin-vue ^6.
- Recipes = docs demo screens at `docs/components/recipes/*.vue` (Discussions, Compose, Deals, Tickets, Mail, Files, Tasks, Accounting). Copy-paste SFCs. No kanban recipe.
- Scaffold: `npx degit netchampfaris/frappe-ui-starter frontend` (external starter).
