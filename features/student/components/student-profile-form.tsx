"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getApiErrorMessage } from "@/lib/api/error";
import type { UpdateStudentProfilePayload } from "@/features/student/types/student-profile";

const defaultValues: StudentProfileSchema = {
  fullName: "",
  matricNumber: "",
  department: "",
  phoneNumber: "",
};

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "ST";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function StudentProfileForm() {
  const profileQuery = useStudentProfileQuery();
  const updateProfileMutation = useUpdateStudentProfileMutation();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<StudentProfileSchema>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues,
  });

  useEffect(() => {
    if (profileQuery.data) {
      form.reset(profileQuery.data);
    }
  }, [form, profileQuery.data]);

  const previewImageUrl = useMemo(() => {
    if (!selectedImageFile) {
      return profileQuery.data?.imageUrl || "";
    }

    return URL.createObjectURL(selectedImageFile);
  }, [profileQuery.data?.imageUrl, selectedImageFile]);

  useEffect(() => {
    if (!selectedImageFile || !previewImageUrl.startsWith("blob:")) {
      return;
    }

    return () => {
      URL.revokeObjectURL(previewImageUrl);
    };
  }, [previewImageUrl, selectedImageFile]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload: UpdateStudentProfilePayload = {
        ...values,
        id: profileQuery.data?.id,
        email: profileQuery.data?.email,
        imageUrl: profileQuery.data?.imageUrl,
        imageFile: selectedImageFile,
      };

      await toast.promise(updateProfileMutation.mutateAsync(payload), {
        loading: "Saving student profile...",
        success: (data) => data.message,
        error: (error) => getApiErrorMessage(error, "Unable to save student profile."),
      });

      setSelectedImageFile(null);
    } catch {
      return;
    }
  });

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border/80 bg-[linear-gradient(135deg,_rgba(31,107,79,0.12),_rgba(215,155,44,0.12))] p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border border-white/50 shadow-sm">
                {previewImageUrl ? (
                  <AvatarImage
                    src={previewImageUrl}
                    alt={profileQuery.data?.fullName || form.getValues("fullName") || "Student profile"}
                  />
                ) : (
                  <AvatarFallback className="bg-brand/15 text-xl text-brand">
                    {getInitials(profileQuery.data?.fullName ?? form.getValues("fullName"))}
                  </AvatarFallback>
                )}
              </Avatar>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setSelectedImageFile(file);
                }}
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-brand text-white shadow-sm transition hover:bg-brand-strong"
                aria-label="Change profile image"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
                Student profile
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Complete your SIWES identity details
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                This form focuses on the core student identity data used across the student workflow.
              </p>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/50 bg-white/55 px-4 py-3 text-sm text-foreground/90 backdrop-blur">
            <p className="font-medium">{profileQuery.data?.fullName || "Student profile"}</p>
            <p className="mt-1 text-muted">{profileQuery.data?.email || "Email not available"}</p>
            <p className="mt-1 text-muted">{profileQuery.data?.department || "Department not set"}</p>
            <p className="mt-1 text-muted">
              {selectedImageFile
                ? `Ready to upload: ${selectedImageFile.name}`
                : profileQuery.data?.imageUrl
                  ? "Profile image already attached to this account."
                  : "Tap the plus icon to add a profile image."}
            </p>
          </div>
        </div>
      </div>

      <SurfaceCard className="space-y-5">
        {profileQuery.isLoading ? (
          <div className="space-y-3 text-sm text-muted">
            <p>Loading student profile...</p>
            <p>Fetching your identity record from the live backend profile endpoint.</p>
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

            <div className="flex flex-col gap-2.5 rounded-[1.25rem] border border-border/70 bg-background/60 p-4 text-sm text-muted">
              <p>Identity details now load from the live user profile endpoint.</p>
              <p>Name and profile image now update through the live backend endpoint.</p>
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
