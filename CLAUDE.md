# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hive (Project Management Solution) is a Frappe application with a Vue 3 frontend. It follows a monorepo structure: Python backend in `bwh_hive/` and Vue 3 + TypeScript frontend in `frontend/`, built on the `frappe-ui` component library.

## Testing

After building a frontend feature, test using the agent-browser, the site name is pms.localhost:8000/hive. For backend testing etc. using bench CLI (execute, etc.)

## Common Commands

### Frontend Development
```bash
yarn dev                        # Vite dev server on localhost:8080, proxies API/assets to bench on 8000
yarn build                      # Build to bwh_hive/public/frontend/ and write bwh_hive/www/hive.html
cd frontend && yarn lint        # ESLint + prettier --check on src
cd frontend && yarn format      # Rewrite src with prettier
cd frontend && yarn typecheck   # vue-tsc --noEmit
```

IMPORTANT: ALWAYS use `frappe-ui` components when one exists. Do not hand-roll a primitive that frappe-ui already ships. Read the bundled `frappe-ui` skill (`COMPONENTS.md`, `DESIGN.md`, `TOKENS.md`) before building UI.

Use frappe-ui design tokens for color — `ink-gray-*`, `surface-gray-*`, `outline-gray-*`. Raw Tailwind gray utilities (`text-gray-*`, `bg-gray-*`, `border-gray-*`) must not appear in `frontend/src`.

### Backend / Frappe

IMPORTANT: to create new DocTypes, USE new_doc with bench execute. Then other updates could be done directly in JSON. (Remember DocType is also a DocType). PLUS you will get the boilerplate files are folder structure.

```bash
bench start                                    # Start the Frappe development server
bench --site <site> run-tests --app bwh_hive        # Run all backend tests
bench --site <site> run-tests --app bwh_hive --module "BWH Hive"  # Run module tests
bench --site <site> migrate                    # Run database migrations, doctype changes
```

### Code Quality
```bash
pre-commit run --all-files    # Run all pre-commit hooks (ruff, prettier, eslint)
```

Prettier is pinned to `3.3.3` in both `frontend/package.json` and the pre-commit hook's `additional_dependencies`. Both must agree or every commit reformats the last one.

## Important: frappe-ui data layer

The frontend talks to Frappe through the `frappe-ui` data layer, not a REST client:

- `useList` — list queries (doctype, fields, filters, orderBy, pageLength)
- `useDoc` — a single document, with `setValue` for updates
- `useCall` — whitelisted method calls

Read the `frappe-ui` skill's docs for the correct signatures. Do not guess parameters, and do not add `frappe-react-sdk` or any other data-fetching dependency.

## E2E tests

```bash
yarn test:e2e         # Playwright suite against pms.localhost:8000
yarn test:e2e:ui      # Playwright UI mode
```

Specs live in `e2e/tests/` and go through `e2e/helpers/app.ts` (storage seeding, overdue-dialog suppression) and `e2e/helpers/ui.ts` (frappe-ui locators).
