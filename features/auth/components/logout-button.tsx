"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/providers/auth-session-provider";

export function LogoutButton() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthSession();

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <Button asChild variant="outline" className="gap-2">
      <Link href="/auth/logout" onNavigate={() => router.prefetch("/auth/logout")}>
        <LogOut className="h-4 w-4" />
        Log out
      </Link>
    </Button>
  );
}
