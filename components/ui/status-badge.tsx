import { cn } from "@/lib/utils";

type StatusBadgeVariant = "success" | "warning" | "pending" | "neutral";

type StatusBadgeProps = {
  label: string;
  variant?: StatusBadgeVariant;
  className?: string;
};

const variantStyles: Record<StatusBadgeVariant, string> = {
  success: "bg-brand/12 text-brand-strong",
  warning: "bg-accent/18 text-brand-strong",
  pending: "bg-surface-strong text-muted",
  neutral: "bg-background/80 text-foreground",
};

export function StatusBadge({
  label,
  variant = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.14em]",
        variantStyles[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
