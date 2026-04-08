# SIWES 360

SIWES 360 is a role-based Next.js frontend for managing the Student Industrial Work Experience Scheme workflow across students, supervisors, administrators, and super administrators.

The application supports a live backend integration mode and a mock-first local mode. In live mode, browser requests go through a same-origin API proxy and session cookies. In mock mode, feature services fall back to simulated data so UI work can continue without a backend.

## What The Project Covers

- Public landing and authentication flows
- Student workspace for profile setup, report upload, report status, workflow progress, and student-safe assessment visibility
- Supervisor workspace for student search, submission review, and score entry
- Admin workspace for departmental monitoring, report oversight, and grading
- Super admin workspace for global oversight, department management, administrator visibility, and department-scoped reporting
- Role-protected routing for `student`, `supervisor`, `admin`, and `superadmin`

## Tech Stack

### Core

- Next.js 16 with the App Router
- React 19
- TypeScript with `strict` mode

### UI

- Tailwind CSS 4
- `tw-animate-css`
- Radix UI primitives
- `lucide-react`
- `class-variance-authority`, `clsx`, `tailwind-merge`
- Shared design primitives in `components/ui/`

### Data, forms, and validation

- TanStack Query
- Axios
- React Hook Form
- Zod
- `@hookform/resolvers`
- Sonner

### Tooling

- ESLint 9 with Next.js rules
- PostCSS with `@tailwindcss/postcss`

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Current environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_API_TIMEOUT_MS=15000
```

Behavior:

- Leave `NEXT_PUBLIC_API_BASE_URL` empty to run in mock mode
- Set `NEXT_PUBLIC_API_BASE_URL` to the backend base URL to enable live API mode

Example:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com/
NEXT_PUBLIC_API_TIMEOUT_MS=60000
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

### Other Commands

```bash
npm run lint
npm run build
npm run start
```

## Current Auth Model

The README was previously outdated here. The app no longer uses `localStorage` for access or refresh tokens.

### Live backend mode

- Login and authenticated requests go through the same-origin API proxy at `app/api/[...path]/route.ts`
- Access and refresh tokens are stored in cookies, not browser local storage
- Protected layouts validate the session on the server through `lib/auth/server-session.ts`
- `proxy.ts` handles route gating and auth-page redirects
- The client Axios instance sends cookie-backed requests with `withCredentials`

### Mock mode

- Mock services still work when `NEXT_PUBLIC_API_BASE_URL` is not configured
- Mock auth keeps only lightweight role state for local development
- Login infers role from the identifier:
  - identifiers containing `superadmin` enter the super admin workspace
  - identifiers containing `admin` enter the admin workspace
  - identifiers containing `supervisor` enter the supervisor workspace
  - all other identifiers default to the student workspace

### Protected Sections

- `/student/*`
- `/supervisor/*`
- `/admin/*`
- `/superadmin/*`

Relevant files:

- [app/api/[...path]/route.ts](app/api/[...path]/route.ts)
- [lib/api/client.ts](lib/api/client.ts)
- [lib/auth/server-session.ts](lib/auth/server-session.ts)
- [lib/auth/session-config.ts](lib/auth/session-config.ts)
- [features/auth/actions/auth-session-actions.ts](features/auth/actions/auth-session-actions.ts)
- [features/auth/utils/mock-session.ts](features/auth/utils/mock-session.ts)
- [proxy.ts](proxy.ts)

## Feature Snapshot

### Public and auth

- Landing page
- Login
- Registration
- Forgot password
- Reset password
- Invited-user password setup

### Student

- Dashboard and workflow checklist
- Profile management
- Report upload
- Report status and validation feedback
- Student assessment progress page
- Student score outputs are intentionally hidden; the UI now shows progress and workflow state instead of final marks

### Supervisor

- Dashboard
- Profile management
- Student search
- Submission review
- Score entry

### Admin

- Dashboard
- Profile management
- Student and supervisor management views
- Department-scoped report oversight
- Score entry
- PDF and CSV exports
- Operational settings shortcuts

### Super admin

- Dedicated route group and navigation
- Global dashboard-style access
- Administrators and departments views
- Department-gated report workflow
- Department switcher for report actions

## Routing Model

The app uses App Router route groups to separate public and role-specific layouts without affecting public URLs.

### Route groups

- `app/(public)`
- `app/(student)`
- `app/(supervisor)`
- `app/(admin)`
- `app/(superadmin)`

### Core URLs

- `/`
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/reset-password`
- `/student`
- `/student/profile`
- `/student/upload`
- `/student/report-status`
- `/student/scores`
- `/supervisor`
- `/supervisor/profile`
- `/supervisor/search`
- `/supervisor/submissions`
- `/supervisor/score-entry/[matricNo]`
- `/admin`
- `/admin/profile`
- `/admin/students`
- `/admin/reports`
- `/admin/settings`
- `/admin/score-entry/[matricNo]`
- `/superadmin`
- `/superadmin/profile`
- `/superadmin/students`
- `/superadmin/students/[matricNo]`
- `/superadmin/supervisors`
- `/superadmin/administrators`
- `/superadmin/departments`
- `/superadmin/reports`
- `/superadmin/settings`
- `/superadmin/score-entry/[matricNo]`

## Architecture

The codebase uses a feature-based architecture on top of the App Router.

Each domain generally owns:

- `components`
- `services`
- `queries`
- `schemas`
- `types`
- `utils` or constants where needed

This structure keeps route files thin and keeps transport logic, UI, and validation grouped by domain.

### Current request flow

Typical flow:

1. A route in `app/` renders a feature component.
2. The component uses a query or mutation hook from `features/*/queries`.
3. The hook calls a service from `features/*/services`.
4. In live mode, the service uses the shared client in `lib/api/client.ts`.
5. Requests are proxied through `app/api/[...path]/route.ts`.
6. In mock mode, the service falls back to simulated local behavior.
7. TanStack Query manages caching and invalidation.

## Project Structure

```text
siwes360/
|-- app/                  # App Router entrypoints, route groups, layouts, API proxy
|-- components/
|   `-- ui/               # shared reusable UI primitives
|-- features/
|   |-- admin/
|   |-- auth/
|   |-- layout/
|   |-- marketing/
|   |-- student/
|   `-- supervisor/
|-- lib/
|   |-- api/              # API config, client, endpoints
|   `-- auth/             # session config and server-side guards
|-- providers/            # app-wide providers
|-- public/
|-- proxy.ts              # route protection and redirect rules
|-- backend_handoff.md
`-- frontend_feature_checklist.md
```

## Directory Guide

### `app/`

- `app/layout.tsx` sets global providers and root layout concerns
- route files are intentionally thin
- `app/api/[...path]/route.ts` is the live-mode proxy boundary between browser requests and the backend

### `features/`

- `features/auth`: auth screens, session behavior, reset-password flow
- `features/student`: dashboard, upload, report status, workflow, student-safe assessment views
- `features/supervisor`: search, review, scoring, profile
- `features/admin`: dashboard, reporting, grading, departments, administrators
- `features/layout`: shell, header, navigation, role-aware layout behavior
- `features/marketing`: public landing page

### `lib/api/`

- [lib/api/config.ts](lib/api/config.ts) reads environment-backed API settings
- [lib/api/client.ts](lib/api/client.ts) creates the shared cookie-based Axios client
- [lib/api/endpoints.ts](lib/api/endpoints.ts) centralizes endpoint paths

### `providers/`

- [providers/app-providers.tsx](providers/app-providers.tsx)
- [providers/auth-session-provider.tsx](providers/auth-session-provider.tsx)
- [providers/query-provider.tsx](providers/query-provider.tsx)
- [providers/toast-provider.tsx](providers/toast-provider.tsx)

## Data And API Design

### Shared client

All live feature services should use the shared client:

- requests are sent to the app-origin API proxy
- cookies carry the authenticated session
- the browser client does not read auth tokens directly
- timeout is environment-configurable

### Mock-first service strategy

Many feature services still support:

- live backend behavior when the API base URL is configured
- mock behavior when it is not

That allows UI development without blocking on backend availability while keeping the call sites stable.

### Endpoint coverage

The app now includes endpoint handling for more than the original auth/profile surface, including:

- authentication
- password recovery and reset
- profile reads and updates
- report upload and status
- student workflow progress
- supervisor scoring
- admin scoring and reports
- finalize preview
- PDF and CSV exports
- department and administrator management

See [lib/api/endpoints.ts](lib/api/endpoints.ts) for the current registry.

## State Management

### Server state

Handled with TanStack Query.

Default behavior is configured in [providers/query-provider.tsx](providers/query-provider.tsx).

### Session state

Handled through:

- cookie-backed session state in live mode
- server-validated role lookup for protected layouts
- a lightweight client session provider for role-aware UI
- mock-only role state when running without a backend

## Forms And Validation

Forms consistently use:

- React Hook Form
- Zod
- `zodResolver`
- Sonner toasts

This keeps validation close to each feature and aligns typed payloads with UI behavior.

## UI System

The app uses a custom visual system built on Tailwind and shared primitives.

### Styling characteristics

- tokens live in `app/globals.css`
- surfaces, borders, and colors are driven by CSS variables
- the authenticated shell uses a shared sidebar and top header
- role workspaces reuse common shell patterns while keeping feature-specific screens separate

### Fonts

The root layout uses:

- Geist Sans
- Geist Mono

## Development Conventions

### Import aliases

The repository uses the `@/*` alias from `tsconfig.json`.

### Where new code should go

- routes in `app/`
- domain logic in `features/<domain>/`
- shared low-level UI in `components/ui/`
- cross-cutting infrastructure in `lib/` and `providers/`

### Recommended feature pattern

1. Add or update the route in `app/`
2. Add the feature component in `features/<domain>/components/`
3. Add or update types in `types/`
4. Add validation in `schemas/` where needed
5. Add service logic in `services/`
6. Wrap reads and writes in TanStack Query hooks in `queries/`
7. Reuse shared UI primitives instead of rebuilding low-level components

## Backend Integration Notes

This repository is no longer purely mock-session driven, but it still supports mock mode.

Current realities:

- live backend mode is supported through the app proxy and cookie-backed auth
- some features still keep mock fallbacks for local development
- route protection expects role semantics for `student`, `supervisor`, `admin`, and `superadmin`
- report and grading flows are increasingly aligned with the backend contract

The cleanest backend integration path remains:

1. keep feature services as the integration seam
2. preserve response shapes where possible
3. let `lib/api/endpoints.ts` remain the central path registry
4. keep role naming aligned with the frontend route model

## Known Gaps

- No automated test suite is present yet
- Mock mode still exists for parts of the product and should not be treated as production auth
- Some documentation outside this README may still lag behind recent changes
- Build behavior can still depend on external font fetching in restricted environments

## Important Files To Read First

If you are onboarding to the current codebase, start with:

1. [package.json](package.json)
2. [app/layout.tsx](app/layout.tsx)
3. [app/api/[...path]/route.ts](app/api/[...path]/route.ts)
4. [proxy.ts](proxy.ts)
5. [lib/auth/server-session.ts](lib/auth/server-session.ts)
6. [features/layout/config/navigation.ts](features/layout/config/navigation.ts)
7. [providers/app-providers.tsx](providers/app-providers.tsx)
8. [lib/api/endpoints.ts](lib/api/endpoints.ts)
9. [backend_handoff.md](backend_handoff.md)

## Summary

SIWES 360 is now a four-role Next.js frontend with a feature-based structure, cookie-backed live auth flow, super admin support, department-gated reporting, and mock fallbacks for local development. The codebase is organized so that backend integration, role-specific expansion, and UI iteration can continue without rewriting the overall architecture.
