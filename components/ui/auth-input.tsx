import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "@/components/ui/field-error";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <label className="block">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <input
          ref={ref}
          {...props}
          className={cn(
            "mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted focus:border-brand",
            className,
          )}
        />
        <FieldError message={error} />
      </label>
    );
  },
);

AuthInput.displayName = "AuthInput";
