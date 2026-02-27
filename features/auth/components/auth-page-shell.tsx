import Link from "next/link";
import type { ReactNode } from "react";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerAction: {
    href: string;
    label: string;
  };
};

export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
  footerText,
  footerAction,
}: AuthPageShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(31,107,79,0.14),_transparent_35%),linear-gradient(180deg,_var(--background),_#ebe4d0)] px-6 py-12">
      <section className="w-full max-w-xl rounded-[2rem] border border-border/80 bg-surface/90 p-8 shadow-[0_30px_120px_rgba(17,75,55,0.08)]">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 text-base leading-7 text-muted">{description}</p>

        <div className="mt-8">{children}</div>

        <div className="mt-8 flex items-center justify-between gap-3 text-sm">
          <Link href="/" className="text-muted transition hover:text-brand">
            Back to home
          </Link>
          <p className="text-muted">
            {footerText}{" "}
            <Link
              href={footerAction.href}
              className="font-medium text-brand transition hover:text-brand-strong"
            >
              {footerAction.label}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
