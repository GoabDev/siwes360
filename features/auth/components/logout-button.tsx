"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { clearMockSessionAction } from "@/features/auth/actions/auth-session-actions";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/providers/auth-session-provider";

export function LogoutButton() {
  const { isAuthenticated, isHydrated, signOut } = useAuthSession();
  const [isPending, startTransition] = useTransition();

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        startTransition(async () => {
          await clearMockSessionAction();
          signOut();
          window.location.assign("/auth/login");
        });
      }}
      className="gap-2"
      disabled={isPending}
    >
      <LogOut className="h-4 w-4" />
      {isPending ? "Logging out..." : "Log out"}
    </Button>
  );
}
