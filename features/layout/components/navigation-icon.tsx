"use client";

import {
  ClipboardCheck,
  Building2,
  FileClock,
  Files,
  LayoutDashboard,
  Search,
  Settings2,
  UserRound,
  Users,
} from "lucide-react";
import type { NavigationIcon as NavigationIconName } from "@/features/layout/config/navigation";

type NavigationIconProps = {
  name: NavigationIconName;
  className?: string;
};

const iconMap = {
  dashboard: LayoutDashboard,
  profile: UserRound,
  upload: Files,
  "report-status": FileClock,
  scores: ClipboardCheck,
  search: Search,
  students: Users,
  supervisors: Users,
  administrators: Users,
  departments: Building2,
  settings: Settings2,
} as const;

export function NavigationIcon({ name, className }: NavigationIconProps) {
  const Icon = iconMap[name];
  return <Icon className={className} />;
}
