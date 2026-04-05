import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleDashed,
  FileSpreadsheet,
  Sparkles,
  UsersRound,
} from "lucide-react";

const proofItems = [
  "Easy report submission",
  "Simple supervision scoring",
  "Department-wide grading control",
  "Clear score and progress updates",
];

const featureNarratives = [
  {
    eyebrow: "For students",
    title: "Submit once. Track every stage after.",
    description:
      "Students should not have to keep asking what is happening to their report. SIWES 360 helps them upload once and follow each stage more clearly.",
    bullets: [
      "Profile and report tools stay in one place",
      "Feedback is easier to follow",
      "Scores become easier to understand over time",
    ],
    tone: "light",
  },
  {
    eyebrow: "For supervisors",
    title: "Score the right student with the right context.",
    description:
      "Supervisors should be able to review the right student quickly and score with confidence. The platform keeps the necessary details close at hand so less time is spent chasing information.",
    bullets: [
      "Student details are visible before scoring",
      "Existing scores are easy to review",
      "Completed assessments are clearly marked",
    ],
    tone: "dark",
  },
  {
    eyebrow: "For administrators",
    title: "Manage the department from readiness to final export.",
    description:
      "Department administrators need a clear picture of who is ready, who still needs attention, and when results can be closed out. SIWES 360 brings that into one place.",
    bullets: [
      "Browse students by department",
      "Check each student&apos;s progress and scores",
      "Finalize results and export summaries",
    ],
    tone: "light",
  },
];

const workflow = [
  {
    step: "01",
    title: "Students get started",
    text: "Students complete their profile and upload their SIWES report.",
  },
  {
    step: "02",
    title: "Review progress becomes visible",
    text: "Students can follow their report as it moves through checking and review.",
  },
  {
    step: "03",
    title: "Supervisors and admins score",
    text: "Supervisors and department admins add their scores in their own work areas.",
  },
  {
    step: "04",
    title: "Departments wrap up results",
    text: "Admins can review progress, finalize results, and export summaries when ready.",
  },
];

const faqs = [
  {
    question: "What is SIWES 360 actually replacing?",
    answer:
      "It replaces a scattered process where uploads, follow-up, scoring, and final result checks often happen in different places.",
  },
  {
    question: "Why not just keep a very simple portal?",
    answer:
      "A simple portal lets people sign in, but it does not explain progress well. SIWES 360 is meant to help users understand what is pending, what is complete, and what needs attention.",
  },
  {
    question: "Who gets the most value from it?",
    answer:
      "Students, supervisors, and department teams all benefit, especially where SIWES activities need to be tracked more clearly from start to finish.",
  },
];

function ProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[38rem]">
      <div className="absolute inset-0 -rotate-3 rounded-[2.2rem] bg-[linear-gradient(135deg,_rgba(31,107,79,0.22),_rgba(215,155,44,0.18))] blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-[#f7f2e7]/95 shadow-[0_35px_120px_rgba(17,75,55,0.16)]">
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#cb7d67]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#d7aa57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#5a9a7a]" />
          </div>
          <div className="rounded-full border border-border/80 bg-white/70 px-3 py-1 text-xs text-muted">
            Live assessment flow
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-[1.6rem] bg-brand-strong p-5 text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/65">Student progress</p>
            <h3 className="mt-3 text-2xl font-semibold">From upload to final result</h3>
            <div className="mt-5 space-y-3">
              {["Uploaded", "In review", "Checking", "Scored", "Completed"].map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center justify-between rounded-[1rem] px-3 py-3 text-sm ${
                    index === 4 ? "bg-white text-brand-strong" : "bg-white/10 text-white"
                  }`}
                >
                  <span>{item}</span>
                  <span className="text-xs">{index < 3 ? "in progress" : index === 3 ? "ready" : "complete"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[1.08fr_0.92fr]">
              <div className="rounded-[1.45rem] border border-border/70 bg-white/72 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Score summary</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted">Validation</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">84 / 100</p>
                  </div>
                  <div>
                    <p className="text-muted">Report</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">26 / 30</p>
                  </div>
                  <div>
                    <p className="text-muted">Supervisor</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">8 / 10</p>
                  </div>
                  <div>
                    <p className="text-muted">Admin</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">54 / 60</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.45rem] border border-border/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.86),_rgba(215,155,44,0.12))] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Final result</p>
                <p className="mt-3 text-4xl font-semibold text-brand-strong">88</p>
                <p className="mt-1 text-sm text-muted">Example of a completed overall score.</p>
              </div>
            </div>

            <div className="rounded-[1.45rem] border border-border/70 bg-white/78 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Department progress</p>
                  <h4 className="mt-1 text-lg font-semibold">Who is ready for the next step</h4>
                </div>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                  18 ready
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Ready students</span>
                  <span className="font-medium text-foreground">18</span>
                </div>
                <div className="h-2 rounded-full bg-[#e6decb]">
                  <div className="h-2 w-[72%] rounded-full bg-brand" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Students needing attention</span>
                  <span className="font-medium text-foreground">7</span>
                </div>
                <div className="h-2 rounded-full bg-[#e6decb]">
                  <div className="h-2 w-[28%] rounded-full bg-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleRibbon() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
      <span className="rounded-full border border-border/80 bg-white/60 px-4 py-2">Students</span>
      <span className="rounded-full border border-border/80 bg-white/60 px-4 py-2">Supervisors</span>
      <span className="rounded-full border border-border/80 bg-white/60 px-4 py-2">Department admins</span>
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,_rgba(215,155,44,0.18),_transparent_25%),radial-gradient(circle_at_100%_10%,_rgba(31,107,79,0.14),_transparent_24%),linear-gradient(180deg,_#f4f1e8_0%,_#eee6d2_100%)] text-foreground">
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-border/80 bg-surface/80 px-4 py-3 backdrop-blur sm:rounded-full">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
              S360
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-brand">SIWES 360</p>
              <p className="hidden text-xs text-muted sm:block">SIWES operations platform</p>
            </div>
          </div>

          <nav className="ml-auto flex items-center justify-end text-sm">
            <Link
              href="/auth/login"
              className="rounded-full border border-border px-4 py-2 text-muted transition hover:border-brand hover:text-brand"
            >
              Log in
            </Link>
          </nav>
        </header>

        <section className="grid gap-12 pb-16 pt-12 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:pt-18">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-sm text-brand">
              <Sparkles className="h-4 w-4" />
              A clearer way to manage SIWES from start to finish
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                Make SIWES easier to follow, manage, and complete.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                SIWES 360 brings student uploads, supervision, department grading, and final results into one simple experience.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-strong"
                >
                  Create your account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3 font-medium text-foreground transition hover:border-brand"
              >
                Sign in
              </Link>
            </div>

            <RoleRibbon />

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
              {proofItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <ProductMockup />
        </section>

        <section className="border-y border-border/70 py-5">
          <div className="grid gap-4 text-sm text-muted md:grid-cols-3">
            <div>
              <p className="text-2xl font-semibold text-brand-strong">1 shared system</p>
              <p className="mt-1">Students, supervisors, and admins use one connected platform.</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-brand-strong">4 score components</p>
              <p className="mt-1">Report, supervisor, logbook, and presentation scores stay together.</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-brand-strong">One clear journey</p>
              <p className="mt-1">Progress, scores, and final results are easier to follow.</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand">Why teams adopt it</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                People need clarity, not just another login page.
              </h2>
            </div>
            <div className="space-y-8">
              <div className="border-b border-border/60 pb-7">
                <h3 className="text-2xl font-semibold">Students see progress instead of waiting blindly.</h3>
                <p className="mt-3 max-w-3xl text-base leading-8 text-muted">
                  Students can follow their report more easily and understand when scores or feedback are ready.
                </p>
              </div>
              <div className="border-b border-border/60 pb-7">
                <h3 className="text-2xl font-semibold">Supervisors spend less time chasing information.</h3>
                <p className="mt-3 max-w-3xl text-base leading-8 text-muted">
                  The right student information is easier to find, so supervisors can focus on scoring and review.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Departments can see what still needs attention.</h3>
                <p className="mt-3 max-w-3xl text-base leading-8 text-muted">
                  Admins can quickly understand who is ready, who is pending, and when results can be wrapped up.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-16 py-6">
          {featureNarratives.map((item, index) => (
            <div
              key={item.title}
              className={`grid gap-8 lg:grid-cols-2 lg:items-center ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="space-y-5">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand">{item.eyebrow}</p>
                <h2 className="text-4xl font-semibold tracking-tight">{item.title}</h2>
                <p className="max-w-2xl text-base leading-8 text-muted">{item.description}</p>
                <ul className="space-y-3 text-sm">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`overflow-hidden rounded-[2rem] border border-border/80 p-8 shadow-[0_24px_90px_rgba(17,75,55,0.1)] ${
                  item.tone === "dark"
                    ? "bg-[linear-gradient(160deg,_#17372c,_#0f251d)] text-white"
                    : "bg-[linear-gradient(180deg,_rgba(255,255,255,0.75),_rgba(255,248,234,0.9))]"
                }`}
              >
                {index === 0 ? (
                  <div className="space-y-4">
                    <div className="rounded-[1.4rem] bg-white/85 p-4 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">Current report</p>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold">siwes-report.docx</p>
                          <p className="text-sm text-muted">Validation in progress</p>
                        </div>
                        <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
                          Queued
                        </span>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {["Uploaded", "Queued", "Validating"].map((stage, stageIndex) => (
                        <div key={stage} className="rounded-[1.2rem] bg-white/12 p-4 text-white">
                          <p className="text-xs uppercase tracking-[0.16em] text-white/60">Step {stageIndex + 1}</p>
                          <p className="mt-2 text-lg font-semibold">{stage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {index === 1 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-white/10 p-3">
                        <UsersRound className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.16em] text-white/60">Supervisor surface</p>
                        <h3 className="mt-1 text-2xl font-semibold">Assessment-aware scoring</h3>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-[1.3rem] bg-white/8 p-4">
                        <p className="text-sm text-white/70">Student</p>
                        <p className="mt-1 text-lg font-semibold">Joseph Ajogu</p>
                      </div>
                      <div className="rounded-[1.3rem] bg-white/8 p-4">
                        <p className="text-sm text-white/70">Supervisor score</p>
                        <p className="mt-1 text-lg font-semibold">8 / 10</p>
                      </div>
                      <div className="rounded-[1.3rem] bg-white/8 p-4">
                        <p className="text-sm text-white/70">Assessment state</p>
                        <p className="mt-1 text-lg font-semibold">Ready for scoring</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {index === 2 ? (
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-brand/10 p-3 text-brand">
                        <FileSpreadsheet className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.16em] text-muted">Department overview</p>
                        <h3 className="mt-1 text-2xl font-semibold">See who is ready</h3>
                      </div>
                    </div>
                    <div className="rounded-[1.4rem] bg-white/70 p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted">Ready students</p>
                        <p className="text-xl font-semibold text-foreground">18</p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-[#e5ddcb]">
                        <div className="h-2 w-[72%] rounded-full bg-brand" />
                      </div>
                    </div>
                    <div className="rounded-[1.4rem] bg-white/70 p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted">Still waiting on scores</p>
                        <p className="text-xl font-semibold text-foreground">7</p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-[#e5ddcb]">
                        <div className="h-2 w-[28%] rounded-full bg-accent" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,_#17372c,_#10271f)] px-6 py-16 text-white shadow-[0_28px_120px_rgba(17,75,55,0.18)] lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-white/60">Workflow</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                A simple flow from upload to final result.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-white/72">
                Everyone involved can follow the same journey more easily, from submission through scoring and completion.
              </p>
            </div>

            <div className="space-y-5">
              {workflow.map((item) => (
                <div
                  key={item.step}
                  className="grid gap-4 border-b border-white/10 pb-5 last:border-b-0 last:pb-0 md:grid-cols-[5rem_1fr]"
                >
                  <div className="text-3xl font-semibold text-white/30">{item.step}</div>
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/70">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-10 py-20 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand">FAQ</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              Questions people usually ask first.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted">
              Here are a few quick answers about what SIWES 360 is for and why it matters.
            </p>
          </div>

          <div className="space-y-5">
            {faqs.map((item) => (
              <div key={item.question} className="border-b border-border/60 pb-5 last:border-b-0 last:pb-0">
                <h3 className="text-xl font-semibold">{item.question}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-12">
          <div className="relative overflow-hidden rounded-[2.3rem] border border-border/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.78),_rgba(215,155,44,0.15))] px-7 py-10 shadow-[0_24px_90px_rgba(17,75,55,0.1)] lg:px-10">
            <CircleDashed className="absolute right-6 top-6 h-24 w-24 text-brand/10" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand">Start here</p>
                <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">
                  Give students, supervisors, and admins a smoother SIWES experience.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
                  Help everyone see what is happening, what is pending, and what comes next.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-strong"
                >
                  Create your account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3 font-medium text-foreground transition hover:border-brand"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
