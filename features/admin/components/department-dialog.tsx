"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
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
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "@/features/admin/queries/admin-department-queries";
import {
  departmentSchema,
  type DepartmentSchema,
} from "@/features/admin/schemas/admin-department-schema";
import type { AdminDepartmentRecord } from "@/features/admin/types/admin-departments";
import { useAdminAdministratorsQuery } from "@/features/admin/queries/admin-administrator-queries";
import { getApiErrorMessage } from "@/lib/api/error";

type DepartmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: AdminDepartmentRecord | null;
};

export function DepartmentDialog({
  open,
  onOpenChange,
  department,
}: DepartmentDialogProps) {
  const createMutation = useCreateDepartmentMutation();
  const updateMutation = useUpdateDepartmentMutation();
  const administratorsQuery = useAdminAdministratorsQuery({
    pageNumber: 1,
    pageSize: 100,
    searchTerm: "",
  });

  const form = useForm<DepartmentSchema>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      adminUserId: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: department?.name ?? "",
      adminUserId: department?.adminUserId ?? "",
    });
  }, [department, form, open]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const actionPromise = department
        ? updateMutation.mutateAsync({ id: department.id, payload: values })
        : createMutation.mutateAsync(values);

      await toast.promise(actionPromise, {
        loading: department ? "Updating department..." : "Creating department...",
        success: (data) => data.message,
        error: (error) =>
          getApiErrorMessage(
            error,
            department ? "Unable to update department." : "Unable to create department.",
          ),
      });

      onOpenChange(false);
      form.reset();
    } catch {
      return;
    }
  });

  if (!open) {
    return null;
  }

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-4 py-8 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => onOpenChange(false)} aria-hidden="true" />
      <section className="relative w-full max-w-lg rounded-[2rem] border border-border/80 bg-surface p-6 shadow-[0_30px_120px_rgba(17,75,55,0.12)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">
              {department ? "Edit Department" : "Create Department"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {department ? "Update department details" : "Add a new department"}
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close department dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department name</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Administrator</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            administratorsQuery.isLoading
                              ? "Loading administrators..."
                              : "Select administrator"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(administratorsQuery.data?.items ?? []).map((administrator) => (
                        <SelectItem key={administrator.id} value={administrator.id}>
                          {administrator.email} · {administrator.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button type="submit" disabled={isBusy || administratorsQuery.isLoading}>
                {isBusy
                  ? department
                    ? "Updating..."
                    : "Creating..."
                  : department
                    ? "Save changes"
                    : "Create department"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
