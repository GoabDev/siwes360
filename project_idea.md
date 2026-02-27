# SIWES 360 Project Idea

## Current Project Baseline

This repository is currently a fresh frontend foundation built with:

- Next.js 16 using the App Router
- React 19
- TypeScript
- Tailwind CSS v4
- ESLint

The current codebase is still close to the default starter, which is good for us because we can define the structure correctly before feature work begins.

## Project Summary

This project is a SIWES Management and Grading System with multiple user roles. The frontend will be built in Next.js while the backend will be handled separately and will later expose the APIs needed for authentication, profile management, report upload, report analysis, and score entry.

The system should support three major roles:

1. Student
2. Supervisor
3. Admin

Each role has different permissions, views, and workflows, so the frontend must be structured around role-based access from the beginning.

## Main Product Goal

The goal of the system is to manage the SIWES process from student profile creation to final grading. Students should be able to create their profile, upload their SIWES report, track report review progress, and view their final scores. Supervisors should be able to search for students and submit supervision scores after evaluating them at their place of work. Admins should be able to manage students within their assigned department and submit the remaining score components such as logbook and presentation.

## Core Roles And Responsibilities

### Student

Students should be able to:

- Register and log in
- Create and update their profile
- Add SIWES placement details
- Upload a SIWES report
- Track the report review lifecycle
- View score breakdown and final result

Important student profile fields include:

- Full name
- Matric number
- Department
- SIWES placement/company
- Placement address
- Phone number
- SIWES start and end dates
- Any other approved academic details

### Supervisor

Supervisors should be able to:

- Log in
- Create or update profile
- Search for a student using matric number
- View student summary details
- Enter and submit supervision score

Expected score range:

- Supervision score: `0-10`

### Admin

Admins should be able to:

- Log in
- Create or update profile if needed
- View students in their assigned department only
- Access student records relevant to their department
- Enter logbook and presentation scores

Expected score ranges:

- Logbook score: `0-30`
- Presentation score: `0-30`

## Scoring Model

The frontend should be designed around a score breakdown that eventually totals `100`.

Proposed grading breakdown:

- Report score: `30`
- Supervisor score: `10`
- Logbook score: `30`
- Presentation score: `30`

Total:

- Final score: `100`

The backend should be responsible for final score computation and enforcement, but the frontend should still reflect limits, validation, and incomplete states properly.

## Report Workflow

The student report flow should support the following status pipeline:

1. Report uploaded
2. Formatting check
3. Plagiarism / AI check
4. Report graded
5. Score reflected in student dashboard

The frontend should support these states even before the backend integration is complete so the UI can be built around realistic workflow placeholders.

## Frontend Architecture Direction

Since this is a multi-role application, the frontend should be organized by role while still keeping shared UI and business logic reusable.

Recommended app structure:

```text
app/
  (public)/
    page.tsx
    auth/
      login/page.tsx
      register/page.tsx
      forgot-password/page.tsx
  (student)/
    student/
      layout.tsx
      page.tsx
      profile/page.tsx
      upload/page.tsx
      report-status/page.tsx
      scores/page.tsx
  (supervisor)/
    supervisor/
      layout.tsx
      page.tsx
      profile/page.tsx
      search/page.tsx
      score-entry/[matricNo]/page.tsx
  (admin)/
    admin/
      layout.tsx
      page.tsx
      profile/page.tsx
      students/page.tsx
      score-entry/[matricNo]/page.tsx
      reports/page.tsx
```

Recommended supporting source structure:

```text
src/
  components/
    ui/
    shared/
    student/
    supervisor/
    admin/
  features/
    auth/
    student/
    supervisor/
    admin/
  lib/
    api/
    auth/
    validators/
    constants/
    utils/
  types/
  store/
```

If we want to keep things simple in the short term, we can start with the current `app/` directory and introduce `components/`, `lib/`, and `types/` at the root before moving to a `src/` layout later. What matters most is keeping role-specific code separated from shared code.

## Route And Access Strategy

The app must be designed as a role-protected application.

Expected auth flow:

- User logs in through a unified login page
- Backend returns authenticated user data, including role
- Frontend redirects users based on role:
  - Student -> `/student`
  - Supervisor -> `/supervisor`
  - Admin -> `/admin`

Important access rules:

- Students must not access supervisor or admin pages
- Supervisors must not access admin pages
- Admins should only see students in their assigned department
- Unauthorized users should be redirected cleanly

Recommended implementation:

- `middleware.ts` for route protection
- A session store or auth context for frontend session state
- Role helpers to enforce layout and page-level guards

## Pages We Need To Build

### Public Pages

- Landing page
- Login page
- Register page
- Forgot password page if needed

### Student Pages

- Student dashboard
- Student profile
- Report upload
- Report status
- Scores page

### Supervisor Pages

- Supervisor dashboard
- Supervisor profile
- Student search
- Score entry page

### Admin Pages

- Admin dashboard
- Admin profile
- Department student list
- Admin score entry page
- Reports overview if needed

## Reusable Components We Should Create Early

These components will reduce repeated work:

- App shell
- Sidebar
- Top navigation
- Role-aware navigation menu
- Status badge
- Score badge
- Upload dropzone
- Empty state
- Error state
- Loading skeleton
- Profile form sections
- Score input form
- Data table for student lists
- Report status timeline

## Important Edge Cases

These are important to keep in mind while designing the UI:

### Authentication And Access

- Wrong role attempting to access another role's area
- Expired session
- Missing department information for admin
- Duplicate registration attempts

### Student Report Upload

- Invalid file type
- File too large
- Upload failure
- Network interruption
- Duplicate upload
- Re-upload policy after review has started
- Report processing taking too long

### Scoring

- Score values outside allowed range
- Supervisor attempting to score the wrong student
- Scores partially available
- Total score incomplete because one or more sections are missing
- Score edits after submission

### Search And Listing

- Student matric number not found
- Empty department list for admin
- Slow data loading
- Filter and search states not matching results

## Data And API Assumptions

Even though backend endpoints are not ready yet, the frontend should be built around expected contracts. At minimum, we should expect APIs for:

- Authentication
- User profile retrieval and update
- Student report upload
- Report status retrieval
- Student search by matric number
- Supervisor score submission
- Admin score submission
- Student score breakdown retrieval

We should keep API logic centralized in one layer so swapping mock data for live endpoints is straightforward.

## Suggested Frontend Development Order

### Phase 1: Foundation

- Clean the default starter UI
- Set global styles, theme variables, and design tokens
- Create the shared layout shell
- Define route groups and base navigation
- Create reusable UI primitives

### Phase 2: Authentication And Role Structure

- Build login and registration pages
- Add auth context or store
- Add route protection strategy
- Implement role redirects

### Phase 3: Student Flow

- Build student dashboard
- Build student profile page
- Build report upload page
- Build report status page
- Build score breakdown page

### Phase 4: Supervisor Flow

- Build supervisor dashboard
- Build student search page
- Build score entry page
- Add submission confirmation states

### Phase 5: Admin Flow

- Build admin dashboard
- Build department student list
- Build admin score entry page
- Add department-specific filtering states

### Phase 6: Integration And Hardening

- Replace mock data with backend APIs
- Handle loading, empty, and error states everywhere
- Add validation and edge-case handling
- Refine responsive behavior

## Recommended Libraries To Add Later

These are sensible additions once we begin implementation:

- `react-hook-form` for forms
- `zod` for validation
- `zustand` or context for auth/session state
- `axios` or a small fetch wrapper for API calls
- `react-dropzone` for upload UX
- `lucide-react` for icons

We do not need to add them all immediately, but form validation and API abstraction should be introduced early.

## UX And Product Notes

A few practical decisions should guide development:

- Build for incomplete data states from day one
- Use clear role-specific layouts so users never feel lost
- Keep scoring forms strict and explicit with min/max helper text
- Show report processing as a timeline, not just a text label
- Make status and score visibility very clear for students
- Keep admin tables simple, searchable, and department-aware

## Collaboration Notes For Development

Since frontend and backend are being developed in parallel, our workflow should be:

1. Design UI around stable data shapes
2. Use mock data first
3. Keep all API calls in a central client layer
4. Avoid tightly coupling UI to unfinished backend assumptions
5. Agree early on request and response structures for auth, profiles, report status, and scores

This will let the frontend move fast now without needing major rewrites when the backend is connected.

## Immediate Next Step

The next practical step is to convert this idea into the actual app skeleton:

1. Replace the starter landing page
2. Create route groups for public, student, supervisor, and admin sections
3. Add shared layout components
4. Build the first UI screens with mock data

That will give us a frontend foundation that is structurally correct for the full SIWES management system.
