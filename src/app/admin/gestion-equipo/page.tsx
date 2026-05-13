import { Suspense } from "react";

import { getCurrentProfile } from "@/lib/supabase/auth";
import { getPermissions } from "@/lib/permissions";
import { getEmployees } from "@/lib/supabase/employees";
import { TeamManagementClient } from "./client";

export default async function TeamManagementPage() {
  const [employees, profile] = await Promise.all([getEmployees(), getCurrentProfile()]);
  const { canEditHorario, canEditPropinas, canEditEquipo } = getPermissions(profile?.role);
  return (
    <Suspense fallback={null}>
      <TeamManagementClient
        initialEmployees={employees}
        canEditHorario={canEditHorario}
        canEditPropinas={canEditPropinas}
        canEditEquipo={canEditEquipo}
      />
    </Suspense>
  );
}
