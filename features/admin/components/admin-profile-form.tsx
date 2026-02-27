"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  adminProfileSchema,
  type AdminProfileSchema,
} from "@/features/admin/schemas/admin-profile-schema";
import {
  useAdminProfileQuery,
  useUpdateAdminProfileMutation,
} from "@/features/admin/queries/admin-profile-queries";

const defaultValues: AdminProfileSchema = {
  fullName: "",
  email: "",
  staffId: "",
  department: "",
  officePhone: "",
  roleTitle: "",
  bio: "",
};

export function AdminProfileForm() {
  const profileQuery = useAdminProfileQuery();
  const updateProfileMutation = useUpdateAdminProfileMutation();

  const form = useForm<AdminProfileSchema>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues,
  });

  useEffect(() => {
    if (profileQuery.data) {
      form.reset(profileQuery.data);
    }
  }, [form, profileQuery.data]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await toast.promise(updateProfileMutation.mutateAsync(values), {
        loading: "Saving admin profile...",
        success: (data) => data.message,
        error: "Unable to save admin profile.",
      });
    } catch {
      return;
    }
  });

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border/80 bg-[linear-gradient(135deg,_rgba(31,107,79,0.12),_rgba(215,155,44,0.12))] p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">Admin profile</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Maintain the department profile used across grading workflows
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          This form anchors department identity, admin traceability, and later score-entry attribution.
        </p>
      </div>

      <div className="rounded-[2rem] border border-border/80 bg-surface p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl><Input placeholder="Enter your full name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl><Input type="email" placeholder="admin@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="staffId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff ID</FormLabel>
                  <FormControl><Input placeholder="ADM-3301" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="department" render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl><Input placeholder="Computer Science" {...field} /></FormControl>
                  <FormDescription>This will later be enforced from backend role assignment.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="officePhone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Office phone</FormLabel>
                  <FormControl><Input placeholder="08123456789" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="roleTitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role title</FormLabel>
                  <FormControl><Input placeholder="Department SIWES Admin" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="bio" render={({ field }) => (
              <FormItem>
                <FormLabel>Admin summary</FormLabel>
                <FormControl><Textarea placeholder="Short summary of the admin role and context." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full md:w-auto" disabled={updateProfileMutation.isPending || profileQuery.isLoading}>
              {updateProfileMutation.isPending ? "Saving profile..." : "Save profile"}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
