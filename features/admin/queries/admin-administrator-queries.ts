"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminAdministrators } from "@/features/admin/services/admin-administrator-service";
import type { AdminAdministratorsQueryParams } from "@/features/admin/types/admin-administrators";

export const adminAdministratorsKey = (params?: AdminAdministratorsQueryParams) => [
  "admin-administrators",
  params,
];

export function useAdminAdministratorsQuery(params?: AdminAdministratorsQueryParams) {
  return useQuery({
    queryKey: adminAdministratorsKey(params),
    queryFn: () => getAdminAdministrators(params),
  });
}
