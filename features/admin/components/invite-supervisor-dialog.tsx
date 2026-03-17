"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInviteSupervisorMutation } from "@/features/admin/queries/admin-supervisor-queries";
import {
  inviteSupervisorSchema,
  type InviteSupervisorSchema,
} from "@/features/admin/schemas/admin-supervisor-schema";
import { useDepartmentsQuery } from "@/features/auth/queries/use-department-query";
import { getApiErrorMessage } from "@/lib/api/error";

type InviteSupervisorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InviteSupervisorDialog({
  open,
  onOpenChange,
}: InviteSupervisorDialogProps) {
  const inviteMutation = useInviteSupervisorMutation();
  const departmentsQuery = useDepartmentsQuery();
  const form = useForm<InviteSupervisorSchema>({
    resolver: zodResolver(inviteSupervisorSchema),
    defaultValues: {
      fullName: "",
      email: "",
      departmentId: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await toast.promise(inviteMutation.mutateAsync(values), {
        loading: "Sending supervisor invitation...",
        success: (data) => data.message,
        error: (error) => getApiErrorMessage(error, "Unable to send supervisor invitation."),
      });

      form.reset();
      onOpenChange(false);
    } catch {
      return;
    }
  });

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-4 py-8 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <section className="relative w-full max-w-lg rounded-[2rem] border border-border/80 bg-surface p-6 shadow-[0_30px_120px_rgba(17,75,55,0.12)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">
              Invite Supervisor
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Send department access
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              The backend will attach the invited supervisor to the selected department.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close invite supervisor dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter supervisor full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="supervisor@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            departmentsQuery.isLoading
                              ? "Loading departments..."
                              : "Select department"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(departmentsQuery.data ?? []).map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                type="submit"
                disabled={
                  inviteMutation.isPending ||
                  departmentsQuery.isLoading ||
                  departmentsQuery.isError
                }
              >
                {inviteMutation.isPending ? "Sending invite..." : "Invite supervisor"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
