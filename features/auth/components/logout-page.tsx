"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ArrowRight, LoaderCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearSessionAction } from "@/features/auth/actions/auth-session-actions";
import { revokeSession } from "@/features/auth/services/auth-service";
import { useAuthSession } from "@/providers/auth-session-provider";

export function LogoutPageView() {
  const router = useRouter();
  const { signOut } = useAuthSession();
  const [statusMessage, setStatusMessage] = useState(
    "Hate to see you go. We are logging you out gracefully.",
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        await revokeSession();
        setStatusMessage("Your session has been revoked. Redirecting you to login.");
      } catch {
        setStatusMessage("We could not confirm revoke with the server, but your local session is being cleared.");
      } finally {
        await clearSessionAction();
        signOut();
        router.replace("/auth/login");
      }
    });
  }, [router, signOut]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(31,107,79,0.14),_transparent_34%),linear-gradient(180deg,_#f7f3e9,_#ece1cb)] px-6 py-12">
      <section className="w-full max-w-2xl rounded-[2.25rem] border border-border/80 bg-surface/95 p-8 shadow-[0_30px_120px_rgba(17,75,55,0.08)] sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-4 py-2 text-sm font-medium uppercase tracking-[0.18em] text-brand">
          <LogOut className="h-4 w-4" />
          Signing Out
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground">
          We are wrapping up your SIWES 360 session
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted">
          {statusMessage}
        </p>

        <div className="mt-8 rounded-[1.75rem] border border-border/70 bg-[linear-gradient(135deg,_rgba(31,107,79,0.08),_rgba(215,155,44,0.12))] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-sm">
              <LoaderCircle className={`h-6 w-6 ${isPending ? "animate-spin" : ""}`} />
            </div>
            <div>
              <p className="text-base font-medium text-foreground">
                Clearing tokens, session state, and access markers
              </p>
              <p className="mt-1 text-sm text-muted">
                You will be sent back to the login page as soon as the cleanup finishes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/auth/login">
              Go to login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
