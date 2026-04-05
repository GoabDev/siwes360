export const apiEndpoints = {
  auth: {
    login: "/api/Authentication/login",
    register: "/api/Authentication/register",
    confirmEmail: "/api/Authentication/confirm-email",
    resendEmailVerification: "/api/Authentication/resend-email-verification",
    refresh: "/api/Authentication/refresh",
    revoke: "/api/Authentication/revoke",
    inviteSupervisor: "/api/Authentication/invite-supervisor",
    forgotPassword: "/auth/forgot-password",
    setPassword: "/api/Authentication/set-password",
  },
  department: {
    root: "/api/Department",
    all: "/api/Department/all",
  },
  userProfile: {
    me: "/api/UserProfile/me",
    students: "/api/UserProfile/students",
    supervisors: "/api/UserProfile/supervisors",
    administrators: "/api/UserProfile/administrators",
  },
  photo: {
    upload: "/api/Photo/upload",
  },
  document: {
    upload: "/api/Document/upload",
    status: (submissionId: string) => `/api/Document/${submissionId}/status`,
    validationReport: (submissionId: string) =>
      `/api/Document/${submissionId}/validation-report`,
  },
  assessment: {
    byId: (assessmentId: string) => `/api/Assessment/${assessmentId}`,
    byStudent: (studentId: string) => `/api/Assessment/student/${studentId}`,
    studentWorkflow: (studentId: string) =>
      `/api/Assessment/student/${studentId}/workflow-progress`,
    supervisor: "/api/Assessment/supervisor",
    admin: "/api/Assessment/admin",
    supervisorScore: "/api/Assessment/supervisor-score",
    adminScores: "/api/Assessment/admin-scores",
    finalize: "/api/Assessment/finalize",
    unfinalize: "/api/Assessment/unfinalize",
    finalizeAll: "/api/Assessment/finalize-all",
    finalizePreview: "/api/Assessment/finalize-preview",
    auditLog: (assessmentId: string) => `/api/Assessment/${assessmentId}/audit-log`,
    exportPdf: "/api/Assessment/admin/export-pdf",
  },
  student: {
    profile: "/students/profile",
  },
  supervisor: {
    profile: "/supervisors/profile",
  },
  admin: {
    profile: "/admins/profile",
  },
} as const;
