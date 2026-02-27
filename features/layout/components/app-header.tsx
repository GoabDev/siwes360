import Link from "next/link";
import { LogoutButton } from "@/features/auth/components/logout-button";

type AppHeaderProps = {
  roleLabel: string;
  title: string;
  description: string;
};

export function AppHeader({ roleLabel, title, description }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border/80 bg-surface/95 px-4 py-4 backdrop-blur sm:px-5 lg:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">{roleLabel}</p>
          <div>
            <h1 className="text-[2rem] font-semibold tracking-tight">{title}</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-border px-4 py-2 text-sm text-muted transition hover:border-brand hover:text-brand"
          >
            Landing page
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
