# Frontend Feature Checklist

## Purpose

This checklist captures the remaining frontend work in a flexible way so features can be implemented in any order, depending on priority, backend readiness, or design focus.

This is not a strict sequence. Any section can be picked up independently as long as dependencies are respected.

## How To Use This File

- Pick any category based on current priority
- Mark items as done as implementation progresses
- Use this as the shared frontend roadmap while backend work continues
- If a feature changes shape later, update this file instead of treating it as fixed

## Status Legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done
- `Blocked` waiting on backend or product decision

---

## Student Features

### Profile

- `[x]` Student profile form
- `[ ]` Profile photo upload
- `[ ]` Read-only fields based on backend permissions
- `[ ]` Better profile completion indicator

### Report Upload

- `[x]` Upload form and validation
- `[x]` Basic report status summary card
- `[ ]` Re-upload / replace report workflow
- `[ ]` Version history if multiple uploads are allowed
- `[ ]` Upload progress indicator
- `[ ]` Retry flow for failed uploads

### Report Status

- `[x]` Workflow timeline
- `[x]` Mock formatting / AI / plagiarism summary panels
- `[ ]` Detailed formatting issue list from backend
- `[ ]` Plagiarism percentage and flagged sections
- `[ ]` AI-detection explanation block
- `[ ]` Report grader comments
- `[ ]` Result timestamps per stage

### Scores

- `[x]` Aggregated score breakdown page
- `[ ]` Grade label or remark display
- `[ ]` Printable / export-friendly score view
- `[ ]` Better incomplete-state messaging

### Dashboard

- `[x]` Dashboard connected to profile/report/score state
- `[ ]` Recent activity feed
- `[ ]` Deadline / reminder block
- `[ ]` Better visual progress tracker

---

## Supervisor Features

### Profile

- `[x]` Supervisor profile form
- `[ ]` Better supervisor identity summary

### Student Search

- `[x]` Search by matric number
- `[x]` Student result card
- `[ ]` Search history or recent lookups
- `[ ]` Better not-found and invalid-search states

### Score Entry

- `[x]` Supervision score entry page
- `[x]` Validation for score range
- `[ ]` Edit-submission policy handling
- `[ ]` Confirmation modal before submit
- `[ ]` Lock submitted score if backend disallows edits
- `[ ]` Timestamp / audit details on the score-entry page

### Submissions

- `[x]` Submitted score history list
- `[ ]` Filter by date or status
- `[ ]` View details per submission

### Dashboard

- `[ ]` Replace current basic dashboard with real summary data
- `[ ]` Assigned students count
- `[ ]` Pending scoring count
- `[ ]` Recent scoring activity

---

## Admin Features

### Profile

- `[x]` Admin profile form
- `[ ]` Department-bound read-only handling from backend

### Students List

- `[x]` Admin students table
- `[x]` Status badges and grading visibility
- `[ ]` Search by name or matric number
- `[ ]` Filter by completion status
- `[ ]` Sort by score/status/department
- `[ ]` Pagination if backend list becomes large

### Score Entry

- `[x]` Admin score entry page
- `[x]` Logbook and presentation inputs
- `[x]` Edit-state cue in UI
- `[ ]` Explicit lock state if record is finalized
- `[ ]` Better “already graded” / “partially graded” workflow
- `[ ]` Grade note history if backend supports it

### Reports Overview

- `[x]` Basic reports overview page
- `[ ]` Better report monitoring table
- `[ ]` Filters for report readiness
- `[ ]` Students with missing report scores
- `[ ]` Students awaiting upstream supervisor grading

### Dashboard

- `[x]` Dashboard connected to real aggregate mock data
- `[ ]` Better distribution visuals
- `[ ]` Completion summary blocks
- `[ ]` Recent admin grading activity
- `[ ]` Alerts for incomplete records

### Settings

- `[ ]` Admin settings page
- `[ ]` Password/account management section
- `[ ]` Department info summary

---

## Auth And Access

### Auth Flow

- `[x]` Login form
- `[x]` Register form
- `[x]` Forgot password form
- `[x]` Dummy dev auth flow
- `[ ]` Replace dummy auth with real backend auth
- `[ ]` Session refresh / expiration flow
- `[ ]` Global unauthorized redirect handling
- `[ ]` Backend logout integration

### Route Protection

- `[x]` Proxy-level role protection
- `[x]` Layout-level role checks
- `[ ]` Finer page-level permission checks if backend requires them
- `[ ]` Department-specific admin enforcement from backend data

---

## Shared UX / Platform

This section can absolutely be worked on before role-specific features if that is the preferred flow.

### UI System

- `[x]` Base dashboard shell
- `[x]` Shared form primitives
- `[x]` Shared surface/card components
- `[ ]` Reusable table component
- `[ ]` Reusable filter bar component
- `[ ]` Reusable empty state component
- `[ ]` Reusable error state component
- `[ ]` Reusable loading skeleton components

### Feedback And States

- `[x]` Toast notifications
- `[ ]` Standardized API error mapping
- `[ ]` Better empty states across all pages
- `[ ]` Better loading states across all pages
- `[ ]` Better offline / network failure messaging

### Data Handling

- `[x]` Axios client
- `[x]` Query/mutation structure
- `[ ]` Shared query keys module if needed
- `[ ]` Better response/error normalization
- `[ ]` Stronger type alignment with backend contracts

### Responsiveness

- `[x]` Core shell works on desktop/mobile
- `[ ]` Mobile polish across forms
- `[ ]` Mobile polish across tables
- `[ ]` Better tablet layouts

### Accessibility

- `[ ]` Form accessibility audit
- `[ ]` Keyboard navigation pass
- `[ ]` Color contrast pass
- `[ ]` Screen reader labels / aria review

### Design Polish

- `[x]` Improved shell density and fixed sidebar
- `[ ]` Consistent density across all pages
- `[ ]` Consistent table density and typography
- `[ ]` Better spacing for large forms
- `[ ]` More informative empty-state visuals

---

## Backend-Dependent Work

These items are easiest to finish once backend contracts are available.

- `[ ]` Real auth/session integration
- `[ ]` Real report-processing results
- `[ ]` Real score aggregation endpoint
- `[ ]` Department-filtered admin data from backend
- `[ ]` Real permission-based edit/lock rules
- `[ ]` Real activity/audit history

---

## Nice-To-Have Features

- `[ ]` Notification center
- `[ ]` Export / print views
- `[ ]` Audit trail pages
- `[ ]` Role-specific activity feeds
- `[ ]` Comments or feedback from supervisors/admins
- `[ ]` Grade approval/finalization workflow

---

## Suggested Pick-Any Work Tracks

Use these if you want to choose by working style instead of by role.

### Track A: Shared UX / Platform

- build reusable empty/error/loading states
- build reusable table/filter primitives
- normalize API error handling
- improve mobile polish

### Track B: Student Experience

- deepen report upload and report-status behavior
- improve score visibility
- enhance dashboard progress and activity

### Track C: Supervisor Experience

- improve dashboard
- tighten scoring workflow and edit rules
- improve search and submissions UX

### Track D: Admin Experience

- add list filters/search/sort
- improve reports oversight
- refine grading completion workflow
- build settings page

### Track E: Backend Readiness

- replace dummy auth
- align real endpoint contracts
- remove hardcoded mock assumptions
- normalize server errors and permissions

---

## Current Reality Check

The frontend is already in a strong place:

- architecture is in place
- role flows are mostly built
- backend handoff document already exists
- service/query structure is ready for integration

What remains is mostly:

- deeper workflow detail
- UX/platform polish
- replacing mocks with backend logic

That means this checklist is now mostly about refinement, completeness, and integration readiness rather than starting from scratch.
