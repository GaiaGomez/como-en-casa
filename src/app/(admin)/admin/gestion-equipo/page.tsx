import { Suspense } from "react";

import { getCurrentProfile } from "@/lib/supabase/auth";
import { getPermissions } from "@/lib/permissions";
import { getEmployees } from "@/lib/supabase/employees";
import { getTipWeeks } from "@/lib/supabase/tips";
import { getFridayWeekStart, getThursdayWeekEnd, type TipWeekData } from "@/lib/mock-data";
import { TeamManagementClient } from "./client";

function emptyCurrentWeek(): TipWeekData {
  const today = new Date().toISOString().slice(0, 10);
  const startDate = getFridayWeekStart(today);
  return {
    id: "",
    startDate,
    endDate: getThursdayWeekEnd(startDate),
    status: "abierta",
    dailyTips: {},
    payments: {},
    schedule: {},
  };
}

export default async function TeamManagementPage() {
  const [employees, rawWeeks, profile] = await Promise.all([
    getEmployees(),
    getTipWeeks(),
    getCurrentProfile(),
  ]);
  const { canEditHorario, canEditPropinas, canEditEquipo } = getPermissions(profile?.role);
  const weeks = rawWeeks.length > 0 ? rawWeeks : [emptyCurrentWeek()];
  return (
    <Suspense fallback={null}>
      <TeamManagementClient
        initialEmployees={employees}
        initialWeeks={weeks}
        canEditHorario={canEditHorario}
        canEditPropinas={canEditPropinas}
        canEditEquipo={canEditEquipo}
      />
    </Suspense>
  );
}
