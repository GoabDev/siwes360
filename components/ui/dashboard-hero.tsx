type DashboardHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function DashboardHero({ eyebrow, title, description }: DashboardHeroProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(135deg,_rgba(31,107,79,0.12),_rgba(215,155,44,0.16)_52%,_rgba(255,253,247,0.92))] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:px-6 sm:py-7">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand sm:text-sm">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-foreground sm:text-[2.35rem]">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-[0.95rem]">
          {description}
        </p>
      </div>
    </section>
  );
}
