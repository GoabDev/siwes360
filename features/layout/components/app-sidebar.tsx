"use client";

import Link from "next/link";
import { PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavigationIcon } from "@/features/layout/components/navigation-icon";
import type { NavigationItem } from "@/features/layout/config/navigation";

type AppSidebarProps = {
  navigation: NavigationItem[];
};

export function AppSidebar({ navigation }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-3 left-3 z-20 hidden w-[19rem] overflow-y-auto rounded-[2rem] border border-border/80 bg-brand-strong p-5 text-white shadow-[0_30px_120px_rgba(17,75,55,0.16)] lg:block">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
          <PanelLeftOpen className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-white/70">SIWES 360</p>
          <p className="text-lg font-semibold">Frontend workspace</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-white text-brand-strong"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <NavigationIcon name={item.icon} className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
