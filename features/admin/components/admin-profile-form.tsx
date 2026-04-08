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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";
import {
  adminProfileSchema,
  type AdminProfileSchema,
} from "@/features/admin/schemas/admin-profile-schema";
import {
  useAdminProfileQuery,
  useUpdateAdminProfileMutation,
} from "@/features/admin/queries/admin-profile-queries";
import { getApiErrorMessage } from "@/lib/api/error";
import type { UpdateAdminProfilePayload } from "@/features/admin/types/admin-profile";
import type { AdminWorkspaceScope } from "@/features/admin/types/admin-scope";

const defaultValues: AdminProfileSchema = {
  fullName: "",
  email: "",
  department: "",
};

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "AD";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

type AdminProfileFormProps = {
  scope?: AdminWorkspaceScope;
};

export function AdminProfileForm({
  scope = "department",
}: AdminProfileFormProps) {
  const profileQuery = useAdminProfileQuery();
  const updateProfileMutation = useUpdateAdminProfileMutation();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const showDepartment = scope !== "global";

  const form = useForm<AdminProfileSchema>({
    resolver: zodResolver(adminProfileSchema),
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
      const payload: UpdateAdminProfilePayload = {
        ...values,
        id: profileQuery.data?.id ?? "",
        email: profileQuery.data?.email ?? values.email,
        imageUrl: profileQuery.data?.imageUrl ?? "",
        imageFile: selectedImageFile,
      };

      await toast.promise(updateProfileMutation.mutateAsync(payload), {
        loading: "Saving admin profile...",
        success: (data) => data.message,
        error: (error) => getApiErrorMessage(error, "Unable to save admin profile."),
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
                    alt={profileQuery.data?.fullName || form.getValues("fullName") || "Admin profile"}
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
                Admin profile
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Keep your administrator profile up to date
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                {showDepartment
                  ? "Make sure your name, image, and department details are correct across the admin workspace."
                  : "Make sure your name and image are correct across the super admin workspace."}
              </p>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/50 bg-white/55 px-4 py-3 text-sm text-foreground/90 backdrop-blur">
            <p className="font-medium">{profileQuery.data?.fullName || "Admin profile"}</p>
            <p className="mt-1 text-muted">{profileQuery.data?.email || "Email not available"}</p>
            {showDepartment ? (
              <p className="mt-1 text-muted">{profileQuery.data?.department || "Department not set"}</p>
            ) : null}
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
            <p>Loading admin profile...</p>
            <p>Please wait while we load your details.</p>
          </div>
        ) : null}

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <SectionHeading
              eyebrow="Identity"
              title="Your personal information"
              description={
                showDepartment
                  ? "Update the details attached to your administrator account."
                  : "Update the details attached to your super administrator account."
              }
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showDepartment ? (
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-2.5 rounded-[1.25rem] border border-border/70 bg-background/60 p-4 text-sm text-muted">
              <p>
                {showDepartment
                  ? "Your details are shown across the administrator workspace."
                  : "Your details are shown across the super admin workspace."}
              </p>
              <p>You can also add or change your profile photo here.</p>
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
