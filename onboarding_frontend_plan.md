# Onboarding Frontend Plan

## Purpose

This document lists the exact frontend onboarding changes needed for `student`, `supervisor`, and `admin` flows based on the project documentation.

This plan is intentionally frontend-only.

It does not assume backend readiness yet.

It is phased so implementation can happen incrementally without blocking the rest of the app.

---

## Current Reality

The current frontend has:

- a shared login page
- a shared register page
- role selection in registration
- generic auth forms

What the PDF makes clear is that onboarding should not stay fully generic.

The onboarding flow needs to reflect role-specific rules.

---

## Core Requirement From The PDF

### Student

Students register using:

- matric number
- department
- password

### Supervisor

Supervisors log in and submit supervision scores.

The PDF does not define a detailed public registration process for supervisors the same way it does for students, so supervisor onboarding should be handled carefully on the frontend until backend rules are confirmed.

### Admin

Administrators are pre-created by the system developer for each department.

This means admin should not behave like a normal public self-registration flow.

---

## Frontend Goal

The frontend onboarding should:

- match the documented product rules
- avoid misleading users with the wrong registration options
- stay easy to connect to backend later
- keep forms role-aware and validation-ready

---

## Phase 1: Fix The Registration Logic At The UI Level

This phase is the minimum correction needed so the frontend stops conflicting with the PDF.

### Student Registration Changes

- `[ ]` Require student-specific role selection before showing the form
- `[ ]` Require `matric number`
- `[ ]` Require `department`
- `[ ]` Require `password`
- `[ ]` Require `confirm password`
- `[ ]` Keep `full name` if the team wants it collected early on the frontend
- `[ ]` Keep `email` only if the team wants it as part of student identity from day one

### Supervisor Registration Changes

- `[ ]` Do not assume supervisor registration should look exactly like student registration
- `[ ]` Decide whether supervisor should have:
  - a public registration path
  - an invite/setup path
  - login only
- `[ ]` Until backend rules are confirmed, present supervisor onboarding as a limited setup flow rather than a fully assumed public registration flow

### Admin Registration Changes

- `[ ]` Remove normal public admin self-registration from the UI
- `[ ]` Replace admin registration option with one of these frontend approaches:
  - hidden from public registration entirely
  - shown as “Admin accounts are created by the system administrator”
  - shown as a first-time profile completion flow only

### Shared Registration Changes

- `[ ]` Replace the current fully generic register form with role-aware conditional rendering
- `[ ]` Make the register page clearly explain that requirements differ by role
- `[ ]` Improve form copy so users understand why their fields differ

---

## Phase 2: Align The Department Experience

This phase ensures student onboarding uses the correct department rules from the PDF.

### Department List Changes

- `[ ]` Update the frontend department constants to match the PDF exactly:
  - Biomedical Engineering
  - Computer Engineering
  - Civil Engineering
  - Electrical Engineering
  - Mechanical Engineering
  - Mechatronics Engineering
  - Telecommunications Engineering
  - Computer Science
  - Information Technology

### Student Department UI

- `[ ]` Use a controlled select/dropdown for department
- `[ ]` Prevent free-text department entry for students
- `[ ]` Add helper copy explaining that department determines admin linkage

### Admin Department Messaging

- `[ ]` Make it clear in admin-facing onboarding/profile UI that admins are department-bound
- `[ ]` Prepare the profile page to display department as assigned rather than freely chosen if backend later enforces it

---

## Phase 3: Improve Role-Specific Frontend Flows

This phase moves onboarding from “correct fields” to “correct role experience”.

### Student Onboarding UX

- `[ ]` Student registration should feel like student onboarding, not generic auth
- `[ ]` Add copy explaining:
  - use your matric number
  - select your department correctly
  - your account will be linked to your department
- `[ ]` After registration, prepare the frontend flow to route students into:
  - login
  - profile completion

### Supervisor Onboarding UX

- `[ ]` Clarify supervisor access path in the UI
- `[ ]` If supervisor registration remains public for now, label it as temporary/frontend-only until backend confirms the final rule
- `[ ]` If supervisor setup becomes restricted later, keep that change isolated to the auth feature

### Admin Onboarding UX

- `[ ]` Replace admin registration with:
  - first login
  - admin setup
  - or “contact system administrator”
- `[ ]` Avoid making admins think they are supposed to sign up publicly

---

## Phase 4: Prepare For Backend Integration

This phase does not require the backend to be ready yet, but it makes the frontend easy to swap later.

### Form Structure

- `[ ]` Split registration schemas by role instead of one combined generic schema
- `[ ]` Create separate role-specific form components:
  - student registration form
  - supervisor onboarding form
  - admin setup/access form

### Service Layer Preparation

- `[ ]` Keep one auth feature, but separate the payload builders by role
- `[ ]` Keep request handling in services so backend integration only changes service logic
- `[ ]` Keep route pages thin and feature components role-specific

### Validation Preparation

- `[ ]` Add student-specific Zod schema for required onboarding fields
- `[ ]` Add supervisor-specific schema once rules are confirmed
- `[ ]` Add admin access/setup schema instead of public admin registration schema

---

## Phase 5: Frontend Messaging And UX Clarity

This phase is small but important because wrong onboarding copy causes product confusion fast.

### Login Page

- `[ ]` Keep login role-neutral if backend supports one login endpoint for all roles
- `[ ]` Clarify accepted identifiers:
  - matric number
  - email
  - staff ID

### Register Page

- `[ ]` Make role differences obvious before the form is shown
- `[ ]` Explain that students must choose the correct department
- `[ ]` Explain that admin accounts are not public self-sign-up accounts
- `[ ]` Avoid showing fields that suggest the wrong workflow

---

## Recommended Frontend Decision Per Role

These are the best current frontend-only decisions based on the PDF.

### Student

Implement as:

- public registration flow
- required matric number
- required department
- required password
- optional additional identity fields if desired by the product team

### Supervisor

Implement as:

- either public registration with limited assumptions
- or login/setup flow until backend confirms final rule

Recommended frontend approach for now:

- keep supervisor accessible
- but make the UI wording less absolute than student onboarding

### Admin

Implement as:

- no normal public self-registration
- admin access or setup flow only

Recommended frontend approach for now:

- remove admin from normal public registration
- provide admin login
- optionally provide an “admin setup” or “first-time access” route later if needed

---

## Best Incremental Implementation Order

This is the best phased build order if we want minimum disruption.

### Step 1

- `[ ]` Update department constants to match the PDF
- `[ ]` Remove normal admin registration from public onboarding

### Step 2

- `[ ]` Refactor register page into role-aware conditional UI
- `[ ]` Build student registration form correctly

### Step 3

- `[ ]` Rework supervisor onboarding UI based on the current agreed product assumption

### Step 4

- `[ ]` Improve copy, helper text, and validation messages across auth pages

### Step 5

- `[ ]` Split auth schemas/services cleanly so backend integration is easy later

---

## Important Frontend Constraint

Because backend is not ready yet, we should avoid overcommitting to business rules that only the backend can truly enforce.

That means:

- we should confidently fix student registration now
- we should confidently remove public admin self-registration now
- we should be careful not to overdesign supervisor onboarding until the team confirms the intended access model

---

## Final Summary

The biggest onboarding corrections needed on the frontend are:

1. student registration must require `matric number` and `department`
2. department options must match the PDF exactly
3. admin should not use normal public self-registration
4. registration UI should stop being fully generic and become role-aware

Once these are done, the onboarding experience will match the documented product direction much more closely while still remaining easy to connect to the backend later.
