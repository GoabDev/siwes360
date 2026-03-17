import Link from "next/link";
import { Compass, Home, LogIn, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(31,107,79,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(215,155,44,0.16),_transparent_28%),linear-gradient(180deg,_#f5f0e4,_#e8dcc1)] px-6 py-12">
      <div className="absolute left-[-8rem] top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
      <div className="absolute bottom-[-5rem] right-[-4rem] h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

      <section className="relative w-full max-w-3xl rounded-[2.25rem] border border-border/80 bg-surface/95 p-8 shadow-[0_30px_120px_rgba(17,75,55,0.08)] sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium uppercase tracking-[0.18em] text-brand-strong">
              <TriangleAlert className="h-4 w-4" />
              404 Page Not Found
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              This route is outside the SIWES map
            </h1>
            <p className="mt-5 text-base leading-8 text-muted">
              The page you requested does not exist, may have moved, or the address may be incomplete.
              Use one of the routes below to return to the main flow.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(145deg,_rgba(31,107,79,0.08),_rgba(255,255,255,0.7))] p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-brand text-white shadow-sm">
              <Compass className="h-9 w-9" />
            </div>
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-brand">
              Navigation Recovery
            </p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
              Return to the landing page, sign back in, or jump to registration if you are new here.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/login">
              <LogIn className="h-4 w-4" />
              Go to login
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/auth/register">Create account</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
