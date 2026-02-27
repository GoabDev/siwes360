import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-border/75 bg-[linear-gradient(180deg,_rgba(255,253,247,0.96),_rgba(255,253,247,0.8))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
