import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenText, ShieldCheck, Upload } from "lucide-react";

const highlights = [
  {
    title: "Student report workflow",
    description:
      "Upload SIWES reports, track review stages, and monitor grading progress from one dashboard.",
    icon: Upload,
  },
  {
    title: "Supervisor scoring",
    description:
      "Search students quickly and submit supervision scores after workplace evaluation.",
    icon: ShieldCheck,
  },
  {
    title: "Department admin control",
    description:
      "Manage departmental grading, capture logbook and presentation scores, and close grading loops.",
    icon: BookOpenText,
  },
];

const roles = [
  {
    name: "Students",
    description:
      "Create profiles, submit SIWES reports, view review status, and track score breakdowns.",
  },
  {
    name: "Supervisors",
    description:
      "Search by matric number, review placement details, and submit supervision scores.",
  },
  {
    name: "Admins",
    description:
      "Manage department-based grading and monitor student progress across the SIWES cycle.",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(215,155,44,0.16),_transparent_30%),linear-gradient(180deg,_var(--background),_#ece4cf)] text-foreground">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-border/80 bg-surface/80 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
              S360
            </div>
            <div>
              <p className="text-sm font-medium text-brand">SIWES 360</p>
              <p className="text-xs text-muted">Management and grading platform</p>
            </div>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/auth/login"
              className="rounded-full border border-border px-4 py-2 text-muted transition hover:border-brand hover:text-brand"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full bg-brand px-4 py-2 font-medium text-white transition hover:bg-brand-strong"
            >
              Create account
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-sm text-brand">
              <BadgeCheck className="h-4 w-4" />
              Structured for students, supervisors, and admins
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                SIWES coordination, report review, and grading in one frontend.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                SIWES 360 centralizes student submissions, supervisor evaluations, and
                department grading into a role-based platform built for clean handoff to
                backend APIs.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-strong"
              >
                Start as a user
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3 font-medium text-foreground transition hover:border-brand"
              >
                Access portal
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {roles.map((role) => (
                <article
                  key={role.name}
                  className="rounded-3xl border border-border/80 bg-surface/85 p-5 shadow-[0_20px_60px_rgba(17,75,55,0.08)]"
                >
                  <h2 className="text-lg font-semibold">{role.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{role.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/80 bg-surface/90 p-6 shadow-[0_30px_120px_rgba(17,75,55,0.12)] backdrop-blur">
            <div className="rounded-[1.5rem] bg-brand-strong p-6 text-white">
              <p className="text-sm uppercase tracking-[0.25em] text-white/70">Workflow</p>
              <h2 className="mt-3 text-3xl font-semibold">
                Operational visibility from upload to final score
              </h2>
              <div className="mt-6 grid gap-4">
                {highlights.map(({ title, description, icon: Icon }) => (
                  <article key={title} className="rounded-3xl bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-white/12 p-3">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium">{title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/75">{description}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border/80 bg-background/70 p-5">
                <p className="text-sm text-muted">Report pipeline</p>
                <ul className="mt-3 space-y-3 text-sm">
                  <li>Upload report</li>
                  <li>Formatting checks</li>
                  <li>Plagiarism and AI review</li>
                  <li>Supervisor and admin grading</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-border/80 bg-background/70 p-5">
                <p className="text-sm text-muted">Score model</p>
                <ul className="mt-3 space-y-3 text-sm">
                  <li>Report: 30</li>
                  <li>Supervisor: 10</li>
                  <li>Logbook: 30</li>
                  <li>Presentation: 30</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
