type StatCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-border/70 bg-[linear-gradient(180deg,_rgba(255,253,247,0.98),_rgba(255,253,247,0.8))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-4 text-[2.1rem] font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </article>
  );
}
