import { Suspense } from "react";

import { getCurrentProfile } from "@/lib/supabase/auth";
import { getPermissions } from "@/lib/permissions";
import { getEmployees } from "@/lib/supabase/employees";
import { getTipWeeks } from "@/lib/supabase/tips";
import { TeamManagementClient } from "./client";

export default async function TeamManagementPage() {
  const [employees, tipWeeks, profile] = await Promise.all([
    getEmployees(),
    getTipWeeks(),
    getCurrentProfile(),
  ]);
  const { canEditHorario, canEditPropinas, canEditEquipo } = getPermissions(profile?.role);
  return (
    <Suspense fallback={null}>
      <TeamManagementClient
        initialEmployees={employees}
        initialWeeks={tipWeeks}
        canEditHorario={canEditHorario}
        canEditPropinas={canEditPropinas}
        canEditEquipo={canEditEquipo}
      />
    </Suspense>
  );
}
