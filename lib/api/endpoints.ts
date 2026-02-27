export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
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
