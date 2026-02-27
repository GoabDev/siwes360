import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/register-form";

export function RegisterPageView() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(31,107,79,0.14),_transparent_35%),linear-gradient(180deg,_var(--background),_#ebe4d0)] px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
      <section className="mx-auto w-full max-w-[90rem] rounded-[2.25rem] border border-border/80 bg-surface/92 p-5 shadow-[0_30px_120px_rgba(17,75,55,0.08)] sm:p-6 lg:p-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">Onboarding</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Start the right SIWES 360 onboarding flow
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Student registration, supervisor onboarding, and admin access do not follow the
            same rules. This page now reflects those differences directly on the frontend.
          </p>
        </div>

        <RegisterForm />

        <div className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="transition hover:text-brand">
            Back to home
          </Link>
          <p>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-brand transition hover:text-brand-strong">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
