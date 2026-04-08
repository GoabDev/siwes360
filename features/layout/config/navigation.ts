export type NavigationIcon =
  | "dashboard"
  | "profile"
  | "upload"
  | "report-status"
  | "scores"
  | "search"
  | "students"
  | "supervisors"
  | "administrators"
  | "departments"
  | "settings";

export type NavigationItem = {
  href: string;
  label: string;
  icon: NavigationIcon;
};

export const roleNavigation: Record<"student" | "supervisor" | "admin" | "superadmin", NavigationItem[]> = {
  student: [
    { href: "/student", label: "Dashboard", icon: "dashboard" },
    { href: "/student/profile", label: "Profile", icon: "profile" },
    { href: "/student/upload", label: "Upload report", icon: "upload" },
    { href: "/student/report-status", label: "Report status", icon: "report-status" },
    { href: "/student/scores", label: "Scores", icon: "scores" },
  ],
  supervisor: [
    { href: "/supervisor", label: "Dashboard", icon: "dashboard" },
    { href: "/supervisor/profile", label: "Profile", icon: "profile" },
    { href: "/supervisor/search", label: "Students", icon: "students" },
    { href: "/supervisor/submissions", label: "Submissions", icon: "scores" },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/profile", label: "Profile", icon: "profile" },
    { href: "/admin/students", label: "Students", icon: "students" },
    { href: "/admin/supervisors", label: "Supervisors", icon: "supervisors" },
    { href: "/admin/reports", label: "Reports", icon: "upload" },
    { href: "/admin/settings", label: "Settings", icon: "settings" },
  ],
  superadmin: [
    { href: "/superadmin", label: "Dashboard", icon: "dashboard" },
    { href: "/superadmin/profile", label: "Profile", icon: "profile" },
    { href: "/superadmin/students", label: "Students", icon: "students" },
    { href: "/superadmin/supervisors", label: "Supervisors", icon: "supervisors" },
    { href: "/superadmin/administrators", label: "Administrators", icon: "administrators" },
    { href: "/superadmin/departments", label: "Departments", icon: "departments" },
    { href: "/superadmin/reports", label: "Reports", icon: "upload" },
    { href: "/superadmin/settings", label: "Settings", icon: "settings" },
  ],
};
