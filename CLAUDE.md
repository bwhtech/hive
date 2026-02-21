# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hive (Project Management Solution) is a Frappe application with a React frontend. It follows a monorepo structure: Python backend in `bwh_hive/` and React+TypeScript frontend in `frontend/`.

## Testing

After building a frontend feature, test using the agent-browser, the site name is pms.localhost:8000/frontend. For backend testing etc. using bench CLI (execute, etc.)

## Common Commands

### Frontend Development
```bash
yarn dev              # Start Vite dev server on localhost:8080
yarn build            # Build React app to bwh_hive/public/frontend/ and copy HTML entry
cd frontend && yarn lint   # Run ESLint on frontend code
```

IMPORTANT: ALWAYS INSTALL USE shadcn components if available, don't make your own custom components if shadcn components are available.

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

## Important: Frappe React SDK

Before using any frappe-react-sdk hook (`useFrappeGetDocList`, `useFrappeGetDoc`, `useFrappePostCall`, `useFrappeAuth`, etc.), you **must** read the Frappe React SDK README first:
https://github.com/nikkothari22/frappe-react-sdk

Do not guess hook signatures or parameters — refer to the README for the correct API.
