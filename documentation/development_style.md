# Development Style Reference

## Purpose

This document captures the preferred frontend development style for this project so future implementation stays consistent.

## Core Development Approach

The project should follow a feature-based folder structure instead of grouping everything only by technical type. Each feature should own its components, services, queries, schemas, and related logic where appropriate.

The codebase should prioritize:

- Small, single-purpose components
- Reusable code patterns
- Clean separation of concerns
- Good validation
- Good error handling
- Low component bloat

## Component Philosophy

Components should do one clear job whenever possible.

Guidelines:

- Avoid large components that handle too many responsibilities
- Break complex UI into smaller reusable parts
- Keep presentation concerns separate from data and business logic when possible
- Reuse shared components instead of duplicating UI logic

## `page.tsx` Philosophy

Page files should stay thin.

`page.tsx` should mainly be used for:

- Rendering feature-level page components
- SEO metadata
- Data fetching when the page is dynamic and that responsibility belongs at the route level

Page files should not become dumping grounds for large UI trees or mixed concerns.

## Preferred Libraries And Tools

These libraries are part of the preferred working stack for this project:

- TanStack Query
- Axios
- Zod
- React Hook Form
- Lucide React
- shadcn/ui

Additional libraries can be introduced when needed, but these form the core expected tooling.

## Data Layer Pattern

The preferred data flow is:

1. Service functions handle the actual API requests
2. Query definitions wrap service functions using TanStack Query
3. Components consume the exported queries and mutations

This keeps data fetching logic structured and reusable.

## Queries Folder Convention

A `queries` folder should be created and used consistently.

The purpose of the `queries` folder is to:

- Define and export TanStack Query hooks or query option builders
- Call service-layer functions instead of making raw requests directly in components
- Centralize query keys and query behavior
- Make fetching logic reusable across pages and components

Preferred separation:

- `services` handle API requests
- `queries` handle TanStack Query integration
- components consume the query layer

## Validation And Forms

Form handling should follow a structured pattern:

- React Hook Form for form state management
- Zod for schema validation
- Clear validation messages
- Proper default values
- Safe submission handling

Forms should be easy to maintain and should not mix too much business logic into UI markup.

## Error Handling Expectations

Error handling should be deliberate, not an afterthought.

Expectations:

- Handle API errors clearly
- Surface useful feedback to the user
- Avoid vague failure states
- Validate inputs before submission
- Plan for loading, empty, error, and success states

## Reusability Expectations

The codebase should favor shared patterns where it makes sense.

Examples:

- Reusable form fields
- Reusable status components
- Shared table patterns
- Shared dialog and feedback components
- Shared validation helpers
- Shared query key patterns

Reusability should improve clarity, not force abstraction too early.

## Recommended Project Direction

As the app grows, the structure should align with the feature-based approach. A likely direction is:

```text
app/
  ...

features/
  auth/
    components/
    services/
    queries/
    schemas/
    types/
  student/
    components/
    services/
    queries/
    schemas/
    types/
  supervisor/
    components/
    services/
    queries/
    schemas/
    types/
  admin/
    components/
    services/
    queries/
    schemas/
    types/

components/
  ui/
  shared/

lib/
  api/
  utils/
  constants/
```

This keeps feature logic close together while still allowing shared UI and utilities to live outside the feature folders.

## Working Rule For This Project

For future development in this repository, we should follow these conventions unless we explicitly decide to change them:

- Use feature-based organization
- Keep components focused and small
- Keep `page.tsx` minimal
- Use service and query separation
- Prefer reusable patterns
- Use strong form validation
- Handle edge cases and errors properly

## Notes

If more conventions come up later, this file should be updated so it remains the reference for how the project is built.
