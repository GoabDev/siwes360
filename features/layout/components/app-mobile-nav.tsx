"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/features/layout/config/navigation";

type AppMobileNavProps = {
  navigation: NavigationItem[];
};

export function AppMobileNav({ navigation }: AppMobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-[101px] z-10 border-b border-border/80 bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex gap-3 overflow-x-auto pb-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                isActive
                  ? "bg-brand text-white"
                  : "border border-border bg-surface text-muted"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
