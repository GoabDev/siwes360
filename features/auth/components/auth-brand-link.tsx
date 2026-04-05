import Link from "next/link";

type AuthBrandLinkProps = {
  compact?: boolean;
};

export function AuthBrandLink({ compact = false }: AuthBrandLinkProps) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-white/55 px-3 py-2 text-left transition hover:border-brand/40 hover:bg-white/80"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
        S360
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-brand">SIWES 360</p>
        {compact ? null : (
          <p className="truncate text-xs text-muted">SIWES operations platform</p>
        )}
      </div>
    </Link>
  );
}
