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
  student: {
    profile: "/students/profile",
    reportUpload: "/students/report",
  },
  supervisor: {
    profile: "/supervisors/profile",
  },
  admin: {
    profile: "/admins/profile",
  },
} as const;
