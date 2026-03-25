"use client";

import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";
import { AccountRegisterForm } from "@/features/auth/components/account-register-form";

type RegistrationRole = "student" | "supervisor" | "admin";

const roleCards: Array<{
  role: RegistrationRole;
  title: string;
  description: string;
  icon: typeof GraduationCap;
}> = [
  {
    role: "student",
    title: "Student",
    description:
      "Register with your matric number and department so your record can be linked correctly.",
    icon: GraduationCap,
  },
  // {
  //   role: "supervisor",
  //   title: "Supervisor",
  //   description:
  //     "Register a supervisor account and attach it to the correct department.",
  //   icon: ShieldCheck,
  // },
  // {
  //   role: "admin",
  //   title: "Admin",
  //   description:
  //     "Register an administrator account for a specific department.",
  //   icon: UserCog,
  // },
];

export function RegisterForm() {
  const [selectedRole, setSelectedRole] = useState<RegistrationRole>("student");

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-5 lg:sticky lg:top-8 lg:self-start">
        <SurfaceCard className="space-y-5">
          <SectionHeading
            eyebrow="Role-aware onboarding"
            title="Choose the type of account you need to access"
            description="Student self-service registration is currently the only frontend signup flow exposed here."
          />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {roleCards.map(({ role, title, description, icon: Icon }) => {
              const isActive = selectedRole === role;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-[1.35rem] border px-4 py-4 text-left transition ${
                    isActive
                      ? "border-brand/40 bg-brand/8 shadow-[0_12px_32px_rgba(17,75,55,0.08)]"
                      : "border-border/70 bg-background/60 hover:border-brand/25 hover:bg-background/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-brand/10 p-3 text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-semibold">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-[1.25rem] border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted">
            Students must register with their correct department. Supervisors are onboarded by
            invite, and admin accounts are created from the backend.
          </div>
        </SurfaceCard>
      </div>

      <div className="space-y-5">
        <AccountRegisterForm role={selectedRole} />
      </div>
    </div>
  );
}
