# SIWES 360 Backend Handoff

## Purpose

This document explains the current frontend structure and the API contracts that will allow the backend to replace the current dummy logic with minimal frontend rewrites.

The frontend is already structured around:

- feature-based folders
- service layer for API calls
- TanStack Query query/mutation layer
- Zod form validation
- role-based routing for `student`, `supervisor`, and `admin`

The easiest integration path is:

1. Keep response shapes close to the types below
2. Implement the listed endpoints
3. Return role and token/session information consistently from auth
4. Let the frontend swap service internals from mock logic to real Axios calls

## Frontend Status

The following flows already exist on the frontend:

- Auth
  - login
  - register
  - forgot password
- Student
  - dashboard
  - profile form
  - report upload
  - report status
  - score breakdown
- Supervisor
  - dashboard
  - profile form
  - student search by matric number
  - score entry
  - submissions history
- Admin
  - dashboard
  - profile form
  - student list
  - reports overview
  - score entry

The UI is already wired through services and queries, so backend work should mostly replace service internals rather than changing page code.

## Auth And Session Expectations

### Current frontend assumptions

- protected areas:
  - `/student/*`
  - `/supervisor/*`
  - `/admin/*`
- role values:
  - `student`
  - `supervisor`
  - `admin`

Current frontend auth config lives around:

- [lib/auth/session-config.ts](/c:/Users/jr/Documents/siwes360/lib/auth/session-config.ts)
- [proxy.ts](/c:/Users/jr/Documents/siwes360/proxy.ts)

### Recommended backend auth behavior

The frontend will work best if backend auth returns:

- authenticated user role
- access token or cookie-based session
- redirect target can be inferred from role, so this is optional

Recommended login response:

```json
{
  "message": "Login successful",
  "role": "student",
  "token": "jwt-or-access-token"
}
```

Recommended session rule:

- backend should own the real auth/session story
- frontend can still keep lightweight role state for UI rendering
- if backend uses cookies, that is fine
- if backend uses JWT bearer tokens, frontend is already prepared for Axios auth headers

### Frontend auth types

```ts
type AuthRole = "student" | "supervisor" | "admin";

type LoginPayload = {
  identifier: string;
  password: string;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: AuthRole;
};

type ForgotPasswordPayload = {
  email: string;
};

type AuthResponse = {
  message: string;
  redirectTo?: string;
  role?: AuthRole;
  token?: string;
};
```

## Current Endpoint Map

The frontend currently points at these endpoint paths:

```ts
auth.login = "/auth/login"
auth.register = "/auth/register"
auth.forgotPassword = "/auth/forgot-password"

student.profile = "/students/profile"
student.reportUpload = "/students/report"

supervisor.profile = "/supervisors/profile"

admin.profile = "/admins/profile"
```

Some flows currently build nested URLs from those bases. If you prefer a different naming structure, we can update the endpoint map in one place.

## Recommended API Contracts

Below is the most important part for backend alignment.

## 1. Auth

### `POST /auth/login`

Request:

```json
{
  "identifier": "student@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Login successful",
  "role": "student",
  "token": "access-token"
}
```

Notes:

- `identifier` may be email, matric number, or staff ID
- frontend redirects by role:
  - student -> `/student`
  - supervisor -> `/supervisor`
  - admin -> `/admin`

### `POST /auth/register`

Request:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "student"
}
```

Response:

```json
{
  "message": "Registration successful"
}
```

### `POST /auth/forgot-password`

Request:

```json
{
  "email": "john@example.com"
}
```

Response:

```json
{
  "message": "Reset instructions sent"
}
```

## 2. Student Profile

### Frontend type

```ts
type StudentProfile = {
  fullName: string;
  matricNumber: string;
  department: string;
  phoneNumber: string;
  placementCompany: string;
  placementAddress: string;
  workplaceSupervisorName: string;
  startDate: string;
  endDate: string;
  bio: string;
};
```

### `GET /students/profile`

Response:

```json
{
  "fullName": "Johnson Adebayo",
  "matricNumber": "CSC/2021/014",
  "department": "Computer Science",
  "phoneNumber": "08012345678",
  "placementCompany": "Interswitch",
  "placementAddress": "12 Marina Road, Lagos",
  "workplaceSupervisorName": "Mrs. Grace Okon",
  "startDate": "2026-01-12",
  "endDate": "2026-06-12",
  "bio": "400-level student currently attached to a fintech product team for SIWES placement."
}
```

### `PUT /students/profile`

Request body should match the same shape.

Recommended response:

```json
{
  "message": "Profile updated successfully",
  "profile": {
    "...": "same shape as StudentProfile"
  }
}
```

## 3. Student Report Upload And Status

### Frontend type

```ts
type StudentReportStatus =
  | "not_uploaded"
  | "uploaded"
  | "format_check"
  | "ai_review"
  | "graded";

type StudentReportRecord = {
  title: string;
  fileName: string;
  fileSize: number;
  summary: string;
  submittedAt: string;
  status: StudentReportStatus;
  reportScore?: number | null;
};
```

### `GET /students/report`

Response:

```json
{
  "title": "SIWES Final Report",
  "fileName": "siwes-report.pdf",
  "fileSize": 325000,
  "summary": "A summary of my placement work.",
  "submittedAt": "2026-02-27T10:30:00.000Z",
  "status": "ai_review",
  "reportScore": null
}
```

If no report exists:

```json
null
```

### `POST /students/report`

Request:

- `multipart/form-data`
- fields:
  - `title`
  - `summary`
  - `file`

Response:

```json
{
  "message": "Report uploaded successfully",
  "report": {
    "title": "SIWES Final Report",
    "fileName": "siwes-report.pdf",
    "fileSize": 325000,
    "summary": "A summary of my placement work.",
    "submittedAt": "2026-02-27T10:30:00.000Z",
    "status": "uploaded",
    "reportScore": null
  }
}
```

Important note:

- the frontend already supports the workflow stages
- backend should eventually return real formatting/plagiarism/AI/report-score status rather than only raw upload state

## 4. Student Score Breakdown

### Frontend type

```ts
type StudentScoreBreakdown = {
  report: number | null;
  supervisor: number | null;
  logbook: number | null;
  presentation: number | null;
  total: number | null;
  status: "incomplete" | "complete";
};
```

Recommended endpoint:

### `GET /students/scores`

Response:

```json
{
  "report": 24,
  "supervisor": 8,
  "logbook": 25,
  "presentation": 26,
  "total": 83,
  "status": "complete"
}
```

## 5. Supervisor Profile

### Frontend type

```ts
type SupervisorProfile = {
  fullName: string;
  staffId: string;
  email: string;
  phoneNumber: string;
  department: string;
  organization: string;
  bio: string;
};
```

### `GET /supervisors/profile`

### `PUT /supervisors/profile`

Recommended response for update:

```json
{
  "message": "Supervisor profile updated successfully",
  "profile": {
    "...": "same shape as SupervisorProfile"
  }
}
```

## 6. Supervisor Student Search And Scoring

### Frontend type for student lookup

```ts
type SupervisorStudentRecord = {
  matricNumber: string;
  fullName: string;
  department: string;
  placementCompany: string;
  placementAddress: string;
  status: "pending" | "scored";
};
```

### Frontend type for submissions

```ts
type SupervisorScoreSubmission = {
  matricNumber: string;
  fullName: string;
  score: number;
  submittedAt: string;
};
```

### Recommended endpoints

#### `GET /supervisors/students/:matricNumber`

Response:

```json
{
  "matricNumber": "CSC/2021/014",
  "fullName": "Johnson Adebayo",
  "department": "Computer Science",
  "placementCompany": "Interswitch",
  "placementAddress": "12 Marina Road, Lagos",
  "status": "pending"
}
```

#### `GET /supervisors/submissions`

Response:

```json
[
  {
    "matricNumber": "CSC/2021/014",
    "fullName": "Johnson Adebayo",
    "score": 8,
    "submittedAt": "2026-02-27T12:30:00.000Z"
  }
]
```

#### `POST /supervisors/scores`

Request:

```json
{
  "matricNumber": "CSC/2021/014",
  "score": 8,
  "note": "Workplace evaluation completed."
}
```

Response:

```json
{
  "message": "Supervisor score submitted successfully",
  "submission": {
    "matricNumber": "CSC/2021/014",
    "fullName": "Johnson Adebayo",
    "score": 8,
    "submittedAt": "2026-02-27T12:30:00.000Z"
  }
}
```

## 7. Admin Profile

### Frontend type

```ts
type AdminProfile = {
  fullName: string;
  email: string;
  staffId: string;
  department: string;
  officePhone: string;
  roleTitle: string;
  bio: string;
};
```

### `GET /admins/profile`

### `PUT /admins/profile`

Recommended response for update:

```json
{
  "message": "Admin profile updated successfully",
  "profile": {
    "...": "same shape as AdminProfile"
  }
}
```

## 8. Admin Student List And Score Entry

### Frontend type

```ts
type AdminStudentRecord = {
  matricNumber: string;
  fullName: string;
  department: string;
  reportScore: number | null;
  supervisorScore: number | null;
  logbookScore: number | null;
  presentationScore: number | null;
  totalScore: number | null;
  status: "incomplete" | "ready" | "complete";
};
```

### Recommended endpoints

#### `GET /admins/students`

Response:

```json
[
  {
    "matricNumber": "CSC/2021/014",
    "fullName": "Johnson Adebayo",
    "department": "Computer Science",
    "reportScore": 24,
    "supervisorScore": 8,
    "logbookScore": null,
    "presentationScore": null,
    "totalScore": null,
    "status": "ready"
  }
]
```

#### `GET /admins/students/:matricNumber`

Response:

```json
{
  "matricNumber": "CSC/2021/014",
  "fullName": "Johnson Adebayo",
  "department": "Computer Science",
  "reportScore": 24,
  "supervisorScore": 8,
  "logbookScore": null,
  "presentationScore": null,
  "totalScore": null,
  "status": "ready"
}
```

#### `POST /admins/scores`

Request:

```json
{
  "matricNumber": "CSC/2021/014",
  "logbookScore": 25,
  "presentationScore": 26,
  "note": "Department grading completed."
}
```

Response:

```json
{
  "message": "Admin score submitted successfully",
  "record": {
    "matricNumber": "CSC/2021/014",
    "logbookScore": 25,
    "presentationScore": 26,
    "updatedAt": "2026-02-27T13:10:00.000Z"
  }
}
```

## Validation Rules Already Enforced On Frontend

These limits already exist in frontend validation and should also be enforced by backend:

- Supervisor score: `0 - 10`
- Logbook score: `0 - 30`
- Presentation score: `0 - 30`
- Report file types: `PDF` or `DOCX`
- Report file size: `<= 10MB`

## Important Integration Notes

## 1. Role-based access

Frontend assumes the authenticated user role determines portal access:

- student users belong in `/student`
- supervisors belong in `/supervisor`
- admins belong in `/admin`

If backend returns role cleanly on login or session fetch, frontend route protection becomes straightforward.

## 2. Department-bound admin behavior

Admins are expected to be department-bound.

That means:

- backend should ideally ensure admins only receive students from their own department
- frontend already assumes student lists returned to admins are already filtered correctly

## 3. Replace mock logic in services first

When backend is ready, the main swap points are these files:

- [features/auth/services/auth-service.ts](/c:/Users/jr/Documents/siwes360/features/auth/services/auth-service.ts)
- [features/student/services/student-profile-service.ts](/c:/Users/jr/Documents/siwes360/features/student/services/student-profile-service.ts)
- [features/student/services/student-report-service.ts](/c:/Users/jr/Documents/siwes360/features/student/services/student-report-service.ts)
- [features/student/services/student-scores-service.ts](/c:/Users/jr/Documents/siwes360/features/student/services/student-scores-service.ts)
- [features/supervisor/services/supervisor-profile-service.ts](/c:/Users/jr/Documents/siwes360/features/supervisor/services/supervisor-profile-service.ts)
- [features/supervisor/services/supervisor-student-service.ts](/c:/Users/jr/Documents/siwes360/features/supervisor/services/supervisor-student-service.ts)
- [features/admin/services/admin-profile-service.ts](/c:/Users/jr/Documents/siwes360/features/admin/services/admin-profile-service.ts)
- [features/admin/services/admin-student-service.ts](/c:/Users/jr/Documents/siwes360/features/admin/services/admin-student-service.ts)

If those are updated to call real endpoints with the expected shapes, the UI should continue working with minimal changes.

## 4. Current mock-specific assumptions to remove during backend integration

These are temporary frontend development assumptions:

- one main demo student is hardcoded in some mock score aggregation
- localStorage is currently used to simulate:
  - student report state
  - supervisor submissions
  - admin score submissions
- dummy auth role selection is inferred from login identifier text

These should disappear once backend integration is in place.

## Suggested Backend Delivery Order

If backend wants to ship in phases, this order will help frontend integration move cleanly:

1. Auth login + role/session response
2. Student profile endpoints
3. Student report upload + report fetch/status
4. Supervisor student search + score submission
5. Admin student list + score submission
6. Student score breakdown aggregation endpoint

## Final Note

The frontend is already prepared for backend integration. The easiest path is to keep response bodies close to the types in this document and update the service layer first. If backend wants a different naming or nesting structure, that is still manageable, but the closer the contract is to this document, the less frontend rewrite will be needed.
