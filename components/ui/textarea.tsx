import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-28 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm transition outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
