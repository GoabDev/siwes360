import { AdminProfileForm } from "@/features/admin/components/admin-profile-form";
import type { AdminWorkspaceScope } from "@/features/admin/types/admin-scope";

type AdminProfilePageViewProps = {
  scope?: AdminWorkspaceScope;
};

export function AdminProfilePageView({
  scope = "department",
}: AdminProfilePageViewProps) {
  return <AdminProfileForm scope={scope} />;
}
