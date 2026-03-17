export const apiEndpoints = {
  auth: {
    login: "/api/Authentication/login",
    register: "/api/Authentication/register",
    refresh: "/api/Authentication/refresh",
    revoke: "/api/Authentication/revoke",
    forgotPassword: "/auth/forgot-password",
  },
  department: {
    all: "/api/Department/all",
  },
  userProfile: {
    me: "/api/UserProfile/me",
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
