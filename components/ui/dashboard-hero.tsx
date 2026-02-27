type DashboardHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function DashboardHero({ eyebrow, title, description }: DashboardHeroProps) {
  return (
    <section className="rounded-[1.75rem] border border-border/80 bg-[linear-gradient(135deg,_rgba(31,107,79,0.12),_rgba(215,155,44,0.12))] p-5 sm:p-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      <h2 className="mt-2.5 max-w-3xl text-[2rem] font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{description}</p>
    </section>
  );
}
