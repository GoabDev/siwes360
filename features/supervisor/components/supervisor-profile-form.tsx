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
  supervisorProfileSchema,
  type SupervisorProfileSchema,
} from "@/features/supervisor/schemas/supervisor-profile-schema";
import {
  useSupervisorProfileQuery,
  useUpdateSupervisorProfileMutation,
} from "@/features/supervisor/queries/supervisor-profile-queries";

const defaultValues: SupervisorProfileSchema = {
  fullName: "",
  staffId: "",
  email: "",
  phoneNumber: "",
  department: "",
  organization: "",
  bio: "",
};

export function SupervisorProfileForm() {
  const profileQuery = useSupervisorProfileQuery();
  const updateProfileMutation = useUpdateSupervisorProfileMutation();

  const form = useForm<SupervisorProfileSchema>({
    resolver: zodResolver(supervisorProfileSchema),
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
        loading: "Saving supervisor profile...",
        success: (data) => data.message,
        error: "Unable to save supervisor profile.",
      });
    } catch {
      return;
    }
  });

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border/80 bg-[linear-gradient(135deg,_rgba(31,107,79,0.12),_rgba(215,155,44,0.12))] p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
          Supervisor profile
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Maintain the profile used during student assessment and search
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          This profile will later support supervisor assignment, score traceability, and search results context.
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
              <FormField control={form.control} name="staffId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff ID</FormLabel>
                  <FormControl><Input placeholder="SUP-1042" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl><Input type="email" placeholder="supervisor@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl><Input placeholder="08098765432" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="department" render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl><Input placeholder="Computer Science" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="organization" render={({ field }) => (
                <FormItem>
                  <FormLabel>School or faculty</FormLabel>
                  <FormControl><Input placeholder="School of Computing" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="bio" render={({ field }) => (
              <FormItem>
                <FormLabel>Professional summary</FormLabel>
                <FormControl><Textarea placeholder="Short profile used in review contexts." {...field} /></FormControl>
                <FormDescription>
                  Keep this concise. It can later appear in supervisor activity and review pages.
                </FormDescription>
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
