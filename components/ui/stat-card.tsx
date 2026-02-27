type StatCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <article className="rounded-[1.35rem] border border-border/70 bg-[linear-gradient(180deg,_rgba(255,253,247,0.94),_rgba(255,253,247,0.78))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 text-[2rem] font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </article>
  );
}
