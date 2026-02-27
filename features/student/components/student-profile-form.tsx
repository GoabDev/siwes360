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
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Textarea } from "@/components/ui/textarea";
import { departments } from "@/features/student/constants/departments";
import {
  studentProfileSchema,
  type StudentProfileSchema,
} from "@/features/student/schemas/student-profile-schema";
import {
  useStudentProfileQuery,
  useUpdateStudentProfileMutation,
} from "@/features/student/queries/student-profile-queries";

const defaultValues: StudentProfileSchema = {
  fullName: "",
  matricNumber: "",
  department: "",
  phoneNumber: "",
  placementCompany: "",
  placementAddress: "",
  workplaceSupervisorName: "",
  startDate: "",
  endDate: "",
  bio: "",
};

export function StudentProfileForm() {
  const profileQuery = useStudentProfileQuery();
  const updateProfileMutation = useUpdateStudentProfileMutation();

  const form = useForm<StudentProfileSchema>({
    resolver: zodResolver(studentProfileSchema),
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
        loading: "Saving student profile...",
        success: (data) => data.message,
        error: "Unable to save student profile.",
      });
    } catch {
      return;
    }
  });

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border/80 bg-[linear-gradient(135deg,_rgba(31,107,79,0.12),_rgba(215,155,44,0.12))] p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
          Student profile
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Complete your SIWES identity and placement details
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          This form is built against the data shape the rest of the student flow depends on,
          so upload, report status, and scoring screens can rely on it later.
        </p>
      </div>

      <SurfaceCard className="space-y-5">
        {profileQuery.isLoading ? (
          <div className="space-y-3 text-sm text-muted">
            <p>Loading student profile...</p>
            <p>Using a mock response until the backend profile endpoint is ready.</p>
          </div>
        ) : null}

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <SectionHeading
              eyebrow="Identity"
              title="Core student information"
              description="This section anchors the student record used across all SIWES workflows."
            />
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="matricNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matric number</FormLabel>
                    <FormControl>
                      <Input placeholder="CSC/2021/014" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="08012345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SectionHeading
              eyebrow="Placement"
              title="Workplace details"
              description="Capture the placement information that supervisors and admins will rely on later."
            />
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="placementCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIWES placement company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company or organisation name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workplaceSupervisorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workplace supervisor name</FormLabel>
                    <FormControl>
                      <Input placeholder="Who supervises you on-site?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="placementAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placement address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Full placement address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIWES start date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIWES end date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      This helps the system align reporting and evaluation periods.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short profile summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe your discipline, placement context, and what you are working on."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Keep this short and practical. It can later be reused in student summary cards.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5 rounded-[1.25rem] border border-border/70 bg-background/60 p-4 text-sm text-muted">
              <p>This form currently reads and writes mock data through the same query and service layers that will handle the live backend integration.</p>
              <p>When your backend is ready, only the service implementation needs to change.</p>
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={updateProfileMutation.isPending || profileQuery.isLoading}
            >
              {updateProfileMutation.isPending ? "Saving profile..." : "Save profile"}
            </Button>
          </form>
        </Form>
      </SurfaceCard>
    </section>
  );
}
