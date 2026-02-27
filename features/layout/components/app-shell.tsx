import type { ReactNode } from "react";
import { AppHeader } from "@/features/layout/components/app-header";
import { AppMobileNav } from "@/features/layout/components/app-mobile-nav";
import { AppSidebar } from "@/features/layout/components/app-sidebar";
import type { NavigationItem } from "@/features/layout/config/navigation";

type AppShellProps = {
  children: ReactNode;
  roleLabel: string;
  title: string;
  description: string;
  navigation: NavigationItem[];
};

export function AppShell({
  children,
  roleLabel,
  title,
  description,
  navigation,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(31,107,79,0.08),_transparent_24%),radial-gradient(circle_at_top_left,_rgba(215,155,44,0.12),_transparent_28%),linear-gradient(180deg,_rgba(215,155,44,0.08),_transparent_25%),linear-gradient(90deg,_rgba(31,107,79,0.06),_transparent_35%)]">
      <AppSidebar navigation={navigation} />
      <div className="min-h-screen px-3 py-3 lg:pl-[21.5rem] lg:pr-4">
        <div className="flex min-h-[calc(100vh-1.5rem)] min-w-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-surface/90 shadow-[0_30px_120px_rgba(17,75,55,0.08)] backdrop-blur">
          <AppHeader roleLabel={roleLabel} title={title} description={description} />
          <AppMobileNav navigation={navigation} />
          <main className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,_rgba(239,230,210,0.38),_transparent_22%)] px-4 pb-4 pt-3 sm:px-5 lg:px-6">
            <div className="min-h-full rounded-[1.75rem] border border-border/50 bg-[linear-gradient(180deg,_rgba(255,253,247,0.9),_rgba(255,253,247,0.68))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] sm:p-5 lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
