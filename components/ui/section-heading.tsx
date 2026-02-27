type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-1.5">
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
      ) : null}
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      {description ? <p className="text-sm leading-6 text-muted">{description}</p> : null}
    </div>
  );
}
