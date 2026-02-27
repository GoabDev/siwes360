# SIWES 360

SIWES 360 is a role-based frontend for managing the Student Industrial Work Experience Scheme workflow. It provides separate workspaces for students, supervisors, and departmental administrators, with the UI already structured for backend API handoff.

This repository is currently frontend-first. Most user flows work against mock data when `NEXT_PUBLIC_API_BASE_URL` is not configured, but the code is already organized around service, query, schema, and type layers so live backend integration only requires replacing service internals.

## What The Project Covers

- Public marketing landing page
- Authentication screens for login, registration, and password reset
- Student workspace for profile setup, report upload, report status, and score visibility
- Supervisor workspace for profile management, student lookup, scoring, and submission review
- Admin workspace for profile management, student monitoring, report oversight, and score entry
- Role-protected routing for `student`, `supervisor`, and `admin`

## Tech Stack

### Core framework

- Next.js 16 with the App Router
- React 19
- TypeScript with `strict` mode enabled

### UI and styling

- Tailwind CSS 4 via `@import "tailwindcss"`
- `tw-animate-css` for animation utilities
- Radix UI primitives for accessible low-level UI building blocks
- `lucide-react` for icons
- `class-variance-authority`, `clsx`, and `tailwind-merge` for composable component variants
- `shadcn/ui` conventions, configured in [components.json](/c:/Users/jr/Documents/siwes360/components.json)

### Data, forms, and validation

- TanStack Query for server-state management
- Axios for HTTP requests
- React Hook Form for forms
- Zod for schema validation
- `@hookform/resolvers` for React Hook Form and Zod integration
- Sonner for toast notifications

### Tooling

- ESLint 9 with Next.js Core Web Vitals and TypeScript rules
- PostCSS with `@tailwindcss/postcss`

## Quick Start

### Prerequisites

- Node.js 20 or newer is the safe baseline for the current Next.js toolchain
- npm is used in this repository because `package-lock.json` is committed

### Install

```bash
npm install
```

### Environment

Create a local environment file from [.env.example](/c:/Users/jr/Documents/siwes360/.env.example):

```bash
cp .env.example .env.local
```

Available variable:

```env
NEXT_PUBLIC_API_BASE_URL=
```

Behavior:

- Leave it empty to run the UI against built-in mock services
- Set it to your backend base URL to enable live Axios requests

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production commands

```bash
npm run build
npm run start
npm run lint
```

## Current Auth And Local Development Behavior

The app uses a temporary mock-session approach until real authentication is connected.

- A role cookie, `siwes360-role`, is used for route protection
- An access token is stored in local storage under `siwes360-access-token`
- Protected sections are:
  - `/student/*`
  - `/supervisor/*`
  - `/admin/*`

In local mock mode:

- login infers the role from the identifier
- identifiers containing `admin` enter the admin workspace
- identifiers containing `supervisor` enter the supervisor workspace
- all other identifiers default to the student workspace

Relevant files:

- [lib/auth/session-config.ts](/c:/Users/jr/Documents/siwes360/lib/auth/session-config.ts)
- [lib/auth/server-session.ts](/c:/Users/jr/Documents/siwes360/lib/auth/server-session.ts)
- [features/auth/utils/mock-session.ts](/c:/Users/jr/Documents/siwes360/features/auth/utils/mock-session.ts)
- [features/auth/actions/auth-session-actions.ts](/c:/Users/jr/Documents/siwes360/features/auth/actions/auth-session-actions.ts)
- [proxy.ts](/c:/Users/jr/Documents/siwes360/proxy.ts)

## Architecture

### High-level approach

The codebase uses a feature-based frontend architecture on top of the Next.js App Router.

Each domain is organized so that pages remain thin and most behavior lives inside feature modules:

- `components`: presentational and container UI for a feature
- `services`: API or mock data access
- `queries`: TanStack Query hooks for reads and writes
- `schemas`: Zod validation schemas
- `types`: TypeScript contracts for the feature
- `utils` or `constants`: feature-specific helpers and static data

This structure is a good fit here because the product is role-driven and domain-heavy. Student, supervisor, admin, auth, layout, and marketing concerns are easier to scale when each domain owns its own UI, data access, and validation logic.

### Why this architecture works for this project

- It keeps App Router files small and easy to scan
- It reduces coupling between UI screens and transport logic
- It supports mock-first development while preserving clean backend handoff
- It makes role-specific modules easier to extend independently
- It aligns form validation, API types, and query hooks around the same feature boundary

### Request and state flow

Typical form flow in this project:

1. A page in `app/` renders a feature component.
2. The feature component uses a React Hook Form form with a Zod schema.
3. The feature component calls a query or mutation hook from `queries/`.
4. The hook calls a service function from `services/`.
5. The service either:
   - calls the backend through the shared Axios client if `NEXT_PUBLIC_API_BASE_URL` exists, or
   - returns mock data after a small simulated delay
6. Mutations update or invalidate TanStack Query cache.

You can see that pattern clearly in:

- [features/student/components/student-profile-form.tsx](/c:/Users/jr/Documents/siwes360/features/student/components/student-profile-form.tsx)
- [features/student/queries/student-profile-queries.ts](/c:/Users/jr/Documents/siwes360/features/student/queries/student-profile-queries.ts)
- [features/student/services/student-profile-service.ts](/c:/Users/jr/Documents/siwes360/features/student/services/student-profile-service.ts)
- [features/student/schemas/student-profile-schema.ts](/c:/Users/jr/Documents/siwes360/features/student/schemas/student-profile-schema.ts)

## Routing Model

The app uses App Router route groups to separate public and role-specific sections without affecting final URLs.

### Route groups

- `app/(public)` for marketing and auth pages
- `app/(student)` for student routes
- `app/(supervisor)` for supervisor routes
- `app/(admin)` for admin routes

### Actual URL structure

- `/`
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
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

### Layout strategy

Each role layout:

- validates the required role on the server
- injects a shared role-aware shell
- provides role-specific navigation metadata

Relevant files:

- [app/(student)/student/layout.tsx](/c:/Users/jr/Documents/siwes360/app/(student)/student/layout.tsx)
- [app/(supervisor)/supervisor/layout.tsx](/c:/Users/jr/Documents/siwes360/app/(supervisor)/supervisor/layout.tsx)
- [app/(admin)/admin/layout.tsx](/c:/Users/jr/Documents/siwes360/app/(admin)/admin/layout.tsx)
- [features/layout/components/app-shell.tsx](/c:/Users/jr/Documents/siwes360/features/layout/components/app-shell.tsx)
- [features/layout/config/navigation.ts](/c:/Users/jr/Documents/siwes360/features/layout/config/navigation.ts)

## Project Structure

```text
siwes360/
|-- app/                  # Next.js App Router entrypoints, layouts, route groups
|-- components/
|   `-- ui/               # shared reusable UI primitives
|-- features/
|   |-- admin/            # admin-facing modules
|   |-- auth/             # auth flows and session helpers
|   |-- layout/           # shared shell, header, sidebar, navigation
|   |-- marketing/        # landing page
|   |-- student/          # student-facing modules
|   `-- supervisor/       # supervisor-facing modules
|-- lib/
|   |-- api/              # Axios client, config, endpoint registry
|   `-- auth/             # auth config and server-side guards
|-- providers/            # app-wide React providers
|-- public/               # static assets
|-- proxy.ts              # route protection and auth redirects
|-- backend_handoff.md    # API-oriented handoff notes for backend implementation
`-- frontend_feature_checklist.md
```

## Directory Guide

### `app/`

Contains route files, route-group layouts, and the global app shell entrypoint.

- [app/layout.tsx](/c:/Users/jr/Documents/siwes360/app/layout.tsx) sets metadata, fonts, and root providers
- route files are intentionally thin and usually only render feature entry components

### `features/`

This is the real application core.

- `features/auth`: login, registration, forgot password, session helpers
- `features/student`: student dashboard, profile, report upload, report status, scores
- `features/supervisor`: supervisor dashboard, search, scoring, submissions, profile
- `features/admin`: admin dashboard, reports, students, scoring, profile, settings
- `features/layout`: reusable authenticated shell and navigation
- `features/marketing`: public landing page

### `components/ui/`

Shared low-level UI building blocks used across features. This is where buttons, inputs, form wrappers, cards, badges, and similar reusable pieces live.

### `lib/api/`

Shared API infrastructure:

- [lib/api/config.ts](/c:/Users/jr/Documents/siwes360/lib/api/config.ts) reads the base URL and timeout
- [lib/api/client.ts](/c:/Users/jr/Documents/siwes360/lib/api/client.ts) creates the Axios instance and attaches the bearer token from local storage
- [lib/api/endpoints.ts](/c:/Users/jr/Documents/siwes360/lib/api/endpoints.ts) centralizes endpoint paths

### `providers/`

Global client-side wrappers:

- [providers/auth-session-provider.tsx](/c:/Users/jr/Documents/siwes360/providers/auth-session-provider.tsx)
- [providers/query-provider.tsx](/c:/Users/jr/Documents/siwes360/providers/query-provider.tsx)
- [providers/toast-provider.tsx](/c:/Users/jr/Documents/siwes360/providers/toast-provider.tsx)
- [providers/app-providers.tsx](/c:/Users/jr/Documents/siwes360/providers/app-providers.tsx)

## Data And API Design

### Shared API client

All live requests should go through the shared Axios instance:

- JSON content type is set by default
- request timeout is `15000ms`
- bearer token is read from local storage and attached automatically

### Mock-first service strategy

Most services follow this pattern:

- if a base URL exists, call the backend
- otherwise, return static or simulated mock data

This allows UI development to continue without blocking on backend readiness, while preserving the same call sites and type contracts.

### Endpoint coverage currently defined

The shared endpoint map currently includes:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `GET/PUT /students/profile`
- `GET/PUT /supervisors/profile`
- `GET/PUT /admins/profile`

Other feature flows already exist in the UI and may use feature-local service logic pending full backend wiring. See [backend_handoff.md](/c:/Users/jr/Documents/siwes360/backend_handoff.md) for the intended integration direction.

## State Management

There are two main state categories in this app:

### Server state

Handled with TanStack Query.

Default query behavior from [providers/query-provider.tsx](/c:/Users/jr/Documents/siwes360/providers/query-provider.tsx):

- `staleTime: 60000`
- `retry: 1` for queries
- `refetchOnWindowFocus: false`
- `retry: 0` for mutations

### Session state

Handled through a lightweight custom auth session provider backed by:

- cookie storage for role-based protection
- local storage for the access token
- `useSyncExternalStore` for consistent client-side subscription

This is intentionally simple and temporary. A real backend auth implementation can replace the storage and session semantics later without changing most feature code.

## Forms And Validation

Forms consistently follow this stack:

- React Hook Form for state and submission
- Zod schemas for validation
- `zodResolver` for integration
- Sonner toasts for user feedback

This gives the project:

- schema-driven validation
- typed form payloads
- predictable mutation handling
- localized form rules within each feature

## UI System

The project uses a custom visual language on top of Tailwind CSS and shared UI components.

### Styling characteristics

- design tokens are defined in [app/globals.css](/c:/Users/jr/Documents/siwes360/app/globals.css)
- CSS variables drive color, surfaces, borders, radius, and typography
- the palette centers on green, warm neutrals, and gold accents
- the authenticated shell uses a shared sidebar and top header layout

### Fonts

The root layout loads:

- Geist Sans
- Geist Mono

## Package Reference

### Runtime dependencies

- `next`, `react`, `react-dom`: application runtime
- `axios`: HTTP client for backend integration
- `@tanstack/react-query`: query and mutation state management
- `react-hook-form`: form state management
- `zod`: validation and runtime schema definitions
- `@hookform/resolvers`: Zod and form integration
- `@radix-ui/react-label`, `@radix-ui/react-select`, `@radix-ui/react-slot`: accessible UI primitives
- `lucide-react`: icon set
- `sonner`: toast notifications
- `class-variance-authority`: component variant definitions
- `clsx`, `tailwind-merge`: class composition helpers
- `tw-animate-css`: animation utilities for Tailwind-based UI

### Development dependencies

- `typescript`: typed development
- `eslint`, `eslint-config-next`: linting
- `tailwindcss`, `@tailwindcss/postcss`: styling pipeline
- `@types/node`, `@types/react`, `@types/react-dom`: TypeScript types

## Development Conventions

### Import aliases

The project uses the `@/*` alias from [tsconfig.json](/c:/Users/jr/Documents/siwes360/tsconfig.json), so imports are usually rooted from the repository root instead of relying on deep relative paths.

### Where to add new code

- add routes in `app/`
- add domain logic in the matching `features/<domain>/` folder
- add reusable low-level UI in `components/ui/`
- add shared infrastructure in `lib/` or `providers/`

### Recommended pattern for a new feature

1. Add or update the route in `app/`
2. Create the feature page component in `features/<domain>/components/`
3. Define payload and response types in `types/`
4. Define validation in `schemas/` if there is user input
5. Add service functions in `services/`
6. Wrap those services with TanStack Query hooks in `queries/`
7. Reuse shared UI primitives from `components/ui/`

## Backend Integration Notes

This frontend is already prepared for backend integration, but there are important current realities:

- some flows still depend on mock data or mock session behavior
- the backend base URL is optional, not required
- live authentication is not fully implemented yet
- the backend contract should preserve role values: `student`, `supervisor`, `admin`

The most direct integration approach is:

1. keep the existing feature services as the integration seam
2. replace mock responses inside `services/` with real API calls
3. keep response shapes aligned with current TypeScript types where possible
4. preserve auth role semantics so route protection and redirects continue to work

Use [backend_handoff.md](/c:/Users/jr/Documents/siwes360/backend_handoff.md) as the backend-facing companion document.

## Known Gaps

- No automated test suite is present yet
- Auth is currently mock-first rather than production-grade
- Some API endpoints are implied by the UI but not yet centralized in `lib/api/endpoints.ts`
- Linting exists, but there are no dedicated CI, test, or storybook docs in this repository

## Important Files To Read First

If you are onboarding to this project, start here:

1. [package.json](/c:/Users/jr/Documents/siwes360/package.json)
2. [app/layout.tsx](/c:/Users/jr/Documents/siwes360/app/layout.tsx)
3. [proxy.ts](/c:/Users/jr/Documents/siwes360/proxy.ts)
4. [features/layout/config/navigation.ts](/c:/Users/jr/Documents/siwes360/features/layout/config/navigation.ts)
5. [providers/app-providers.tsx](/c:/Users/jr/Documents/siwes360/providers/app-providers.tsx)
6. [lib/api/client.ts](/c:/Users/jr/Documents/siwes360/lib/api/client.ts)
7. [backend_handoff.md](/c:/Users/jr/Documents/siwes360/backend_handoff.md)

## Summary

SIWES 360 is a structured Next.js frontend for a three-role SIWES workflow. The repository is already organized in a way that supports scale: route groups for role separation, feature-based modules for domain ownership, shared providers for cross-cutting concerns, and a mock-first service layer that can be replaced with live backend integration with limited UI churn.
