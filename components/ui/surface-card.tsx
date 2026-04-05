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
        "rounded-[1.65rem] border border-border/75 bg-[linear-gradient(180deg,_rgba(255,253,247,0.98),_rgba(255,253,247,0.82))] p-5 shadow-[0_18px_40px_rgba(31,107,79,0.06),inset_0_1px_0_rgba(255,255,255,0.62)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
